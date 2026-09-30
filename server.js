const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3000;
const BOOKINGS_FILE = path.join(__dirname, 'bookings.json');

// Your website files must be inside this folder.
const PUBLIC_DIR = path.join(__dirname, 'public');

const app = express();

/* ---------------- Admin basic auth (env override recommended) ---------------- */
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-this-password';

function adminAuth(req, res, next) {
  const auth = req.headers.authorization || '';

  if (!auth.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="Mugumo Admin"');
    return res.status(401).send('Admin login required');
  }

  const decoded = Buffer.from(auth.slice(6), 'base64').toString();
  const separator = decoded.indexOf(':');

  const username = separator >= 0 ? decoded.slice(0, separator) : '';
  const password = separator >= 0 ? decoded.slice(separator + 1) : '';

  if (username !== ADMIN_USER || password !== ADMIN_PASSWORD) {
    res.set('WWW-Authenticate', 'Basic realm="Mugumo Admin"');
    return res.status(401).send('Invalid admin login');
  }

  next();
}

/* ---------------- Middleware & utils ---------------- */
app.use(helmet());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json({ limit: '10kb' }));

const bookingLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    success: false,
    error: 'Too many requests. Please try again later.'
  }
});

app.use(express.static(PUBLIC_DIR, { extensions: ['html'] }));

async function ensureBookingsFile() {
  try {
    await fs.access(BOOKINGS_FILE);
  } catch {
    await fs.writeFile(BOOKINGS_FILE, '[]', 'utf8');
  }
}

async function readBookings() {
  await ensureBookingsFile();

  const raw = await fs.readFile(BOOKINGS_FILE, 'utf8');

  try {
    return JSON.parse(raw || '[]');
  } catch {
    throw new Error('bookings.json contains invalid JSON');
  }
}

async function saveBookings(bookings) {
  await fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), 'utf8');
}

/* ---------------- Small helper for date overlap ---------------- */
function safeDate(value) {
  if (!value) return null;
  const d = (value instanceof Date) ? value : new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

function hasOverlap(aFrom, aTo, bFrom, bTo) {
  const Afrom = safeDate(aFrom);
  const Ato = safeDate(aTo);
  const Bfrom = safeDate(bFrom);
  const Bto = safeDate(bTo);

  // If either booking lacks a date range we can't detect overlap reliably -> treat as no-overlap
  if (!Afrom || !Ato || !Bfrom || !Bto) return false;

  // Overlap if periods intersect
  return Afrom <= Bto && Bfrom <= Ato;
}

/* ---------------- Serve admin page (browser will prompt for credentials) ---------------- */
app.get('/admin.html', adminAuth, (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'admin.html'));
});

/* ---------------- Protected: list bookings ---------------- */
app.get('/api/bookings', adminAuth, async (req, res) => {
  try {
    const bookings = await readBookings();

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error('Failed to read bookings:', error);

    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

/* ---------------- Protected: update booking status ---------------- */
app.post('/api/bookings/:id/status', adminAuth, async (req, res) => {
  const { status } = req.body;

  if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
    return res.status(400).json({ success: false, error: 'Invalid status' });
  }

  try {
    const bookings = await readBookings();
    const index = bookings.findIndex((b) => b.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    bookings[index].status = status;

    await saveBookings(bookings);

    return res.json({ success: true, booking: bookings[index] });
  } catch (error) {
    console.error('Failed to update booking status:', error);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});

/* ---------------- Availability check + create booking ---------------- */
app.post(
  '/api/book',
  bookingLimiter,
  [
    body('fullName').trim().isLength({ min: 2 }).withMessage('Full name is required'),
    body('email').isEmail().withMessage('A valid email is required'),
    body('roomType').trim().isIn([
      'Deluxe Garden Room',
      'Executive Suite',
      'Family Suite',
      'Royal Valley Villa',
      'Cabana Retreat'
    ]).withMessage('Please select a valid room'),
    body('dateFrom').optional({ nullable: true, checkFalsy: true }).isISO8601().withMessage('dateFrom must be a valid date').toDate(),
    body('dateTo').optional({ nullable: true, checkFalsy: true }).isISO8601().withMessage('dateTo must be a valid date').toDate(),
    body('specialRequests').optional({ nullable: true, checkFalsy: true }).trim().isLength({ max: 1000 }).withMessage('Special requests are too long'),
    body('priority').optional({ nullable: true, checkFalsy: true }).isIn(['normal', 'high', 'vip']).withMessage('Priority must be normal, high, or vip')
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
      fullName,
      email,
      roomType,
      dateFrom,
      dateTo,
      specialRequests,
      priority
    } = req.body;

    // If both dates are provided, ensure dateFrom <= dateTo
    if (dateFrom && dateTo && new Date(dateFrom) > new Date(dateTo)) {
      return res.status(400).json({ success: false, error: 'dateFrom must be before or equal to dateTo' });
    }

    try {
      const bookings = await readBookings();

      // Availability check only if both dates provided
      if (dateFrom && dateTo) {
        const conflicts = bookings.filter((b) => {
          // ignore cancelled bookings
          if (b.status === 'cancelled') return false;
          if (!b.roomType || b.roomType !== roomType) return false;
          return hasOverlap(b.dateFrom, b.dateTo, dateFrom, dateTo);
        });

        if (conflicts.length) {
          return res.status(409).json({
            success: false,
            error: 'Room not available for the selected dates',
            conflicts: conflicts.map(c => ({ id: c.id, fullName: c.fullName, dateFrom: c.dateFrom, dateTo: c.dateTo }))
          });
        }
      }

      const booking = {
        id: uuidv4(),
        fullName,
        email,
        roomType: roomType || '',
        dateFrom: dateFrom || null,
        dateTo: dateTo || null,
        specialRequests: specialRequests || '',
        priority: priority || 'normal',
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      bookings.push(booking);
      await saveBookings(bookings);

      return res.status(201).json({ success: true, bookingId: booking.id, priority: booking.priority });
    } catch (error) {
      console.error('Failed to save booking:', error);
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  }
);

/* ---------------- Admin: find customers to remind ----------------
   GET /api/reminders?days=180
   Returns list of customers (email, fullName, lastBookingDate)
   Protected by adminAuth
*/
app.get('/api/reminders', adminAuth, async (req, res) => {
  const days = Number(req.query.days || 180);
  if (isNaN(days) || days < 0) {
    return res.status(400).json({ success: false, error: 'Invalid days parameter' });
  }

  try {
    const bookings = await readBookings();
    const now = Date.now();
    const cutoff = now - days * 24 * 60 * 60 * 1000;

    // group by email, find latest booking date (use dateTo if present else createdAt)
    const byEmail = bookings.reduce((acc, b) => {
      const email = (b.email || '').toLowerCase();
      if (!email) return acc;
      const candidate = safeDate(b.dateTo) || safeDate(b.createdAt);
      if (!candidate) return acc;
      if (!acc[email] || acc[email].latest < candidate) {
        acc[email] = {
          email,
          fullName: b.fullName || '',
          latest: candidate
        };
      }
      return acc;
    }, {});

    const result = Object.values(byEmail)
      .filter(u => u.latest.getTime() <= cutoff)
      .map(u => ({ email: u.email, fullName: u.fullName, lastBookingDate: u.latest.toISOString() }));

    res.json({ success: true, days, customers: result });
  } catch (error) {
    console.error('Failed to prepare reminders:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

/* ---------------- Admin: send reminders (simulated) ----------------
   POST /api/reminders/send
   body: { days?: number, message?: string }
   Protected by adminAuth
   This will log a simulated send for each customer and tag their bookings with lastReminderAt
*/
app.post('/api/reminders/send', adminAuth, async (req, res) => {
  const days = Number(req.body.days || 180);
  const message = String(req.body.message || 'We miss you at Mugumo Valley Resort — come back for a special offer!');

  if (isNaN(days) || days < 0) {
    return res.status(400).json({ success: false, error: 'Invalid days parameter' });
  }

  try {
    const bookings = await readBookings();
    const now = Date.now();
    const cutoff = now - days * 24 * 60 * 60 * 1000;

    // find last booking per email
    const byEmail = bookings.reduce((acc, b) => {
      const email = (b.email || '').toLowerCase();
      if (!email) return acc;
      const candidate = safeDate(b.dateTo) || safeDate(b.createdAt);
      if (!candidate) return acc;
      if (!acc[email] || acc[email].latest < candidate) {
        acc[email] = { email, fullName: b.fullName || '', latest: candidate };
      }
      return acc;
    }, {});

    const toRemind = Object.values(byEmail).filter(u => u.latest.getTime() <= cutoff);

    // simulate sends and mark bookings (set lastReminderAt on bookings for that email)
    const reminderTime = new Date().toISOString();
    const emailResults = [];

    for (const user of toRemind) {
      // Simulate sending (replace with real email provider integration)
      console.log(`Simulated reminder send to ${user.email} (${user.fullName}) — message: ${message}`);

      // Mark lastReminderAt on all bookings for that email
      bookings.forEach((b) => {
        if ((b.email || '').toLowerCase() === user.email) {
          b.lastReminderAt = reminderTime;
        }
      });

      emailResults.push({ email: user.email, fullName: user.fullName, remindedAt: reminderTime });
    }

    await saveBookings(bookings);

    res.json({ success: true, count: emailResults.length, results: emailResults });
  } catch (error) {
    console.error('Failed to send reminders:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

/* ---------------- Front page / fallback ---------------- */
app.get('/', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found'
  });
});

app.use((req, res) => {
  const notFoundPage = path.join(PUBLIC_DIR, '404.html');

  res.sendFile(notFoundPage, (error) => {
    if (error && !res.headersSent) {
      res.status(404).send('Not Found');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});