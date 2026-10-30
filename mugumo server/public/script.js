/* ============================================================
   THE MUGUMO VALLEY RESORT — Premium responsive stylesheet
   ============================================================ */

:root {
  --gold: #c8a45d;
  --gold-light: #e7c36a;
  --gold-soft: rgba(200,164,93,.14);
  --dark: #143d2b;
  --dark2: #081a12;
  --white: #ffffff;
  --muted: #6b6b6b;
  --pad: clamp(20px, 6vw, 8%);
  --radius: 18px;
  --font-sans: 'Poppins', sans-serif;
  --font-serif: 'Playfair Display', serif;
  --nav-h: 84px;
  --shadow-soft: 0 20px 50px rgba(15,30,22,.08);
  --shadow-strong: 0 25px 60px rgba(0,0,0,.35);
}

*, *::before, *::after { box-sizing: border-box; }

html {
  scroll-behavior: smooth;
  scroll-padding-top: calc(var(--nav-h) + 12px);
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

body {
  font-family: var(--font-sans);
  color: #222;
  background: var(--white);
  -webkit-font-smoothing: antialiased;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  line-height: 1.6;
}

img { max-width: 100%; height: auto; display: block; }
a { color: inherit; }
ul { margin: 0; padding: 0; }
section { position: relative; }

body::before {
  content: "";
  position: fixed;
  width: 700px;
  height: 700px;
  top: -230px;
  right: -200px;
  background: radial-gradient(circle, var(--gold-soft), transparent 70%);
  pointer-events: none;
  z-index: -1;
  animation: ambientMove 18s infinite;
}
@keyframes ambientMove { 50% { transform: translate(-60px, 40%); } }

#loader {
  position: fixed;
  inset: 0;
  background: var(--dark2);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
  transition: opacity .8s ease, visibility .8s ease;
}
.loader-content { text-align: center; padding: 0 20px; }
.loader-content h1 {
  color: var(--gold);
  font-family: var(--font-serif);
  font-size: clamp(28px, 6vw, 48px);
  animation: glow 2s infinite alternate;
}
.loader-content p {
  color: white;
  margin-top: 16px;
  letter-spacing: 4px;
  font-size: clamp(11px, 2vw, 14px);
}
@keyframes glow { from { text-shadow: 0 0 10px var(--gold); } to { text-shadow: 0 0 35px var(--gold); } }

#particles { position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 1; }
.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  animation: fall linear infinite;
  background: var(--gold-light);
  box-shadow: 0 0 6px var(--gold-light), 0 0 14px rgba(255,150,60,.6);
}
@keyframes fall {
  from { transform: translateY(-20px) translateX(0); opacity: 0; }
  15% { opacity: 1; }
  85% { opacity: .8; }
  to { transform: translateY(110vh) translateX(var(--drift,0)); opacity: 0; }
}

#progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--gold), #f7e29c, var(--gold));
  z-index: 99999;
}

.cursor-glow {
  position: fixed;
  width: 360px;
  height: 260px;
  border-radius: 50%;
  pointer-events: none;
  background: radial-gradient(circle, var(--gold-soft), transparent 50%);
  transform: translate(-50%, -50%);
  z-index: 0;
  transition: left .4s linear, top .4s linear;
}
@media (hover: none) { .cursor-glow { display: none; } }

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px var(--pad);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  max-width: 100%;
  min-height: var(--nav-h);
  background: rgba(20,61,43,.92);
  backdrop-filter: blur(10px);
  gap: 16px;
  z-index: 1000;
  transition: top .35s ease;
  box-shadow: 0 5px 15px rgba(0,0,0,.15);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #fff;
  font-family: var(--font-serif);
  font-weight: 700;
  font-size: clamp(16px, 2.4vw, 24px);
  text-decoration: none;
  cursor: pointer;
  animation: logoFloat 5s ease-in-out infinite;
  white-space: nowrap;
}
@keyframes logoFloat { 50% { transform: translateY(-6px); } }
.logo img { height: 52px; width: 52px; border-radius: 12px; object-fit: cover; flex-shrink: 0; }
.logo:hover { color: var(--gold); }

.nav-links {
  display: flex;
  gap: clamp(10px,2vw,28px);
  list-style: none;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}
.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  position: relative;
  padding: 6px 0;
  transition: .3s;
  white-space: nowrap;
}
.nav-links a::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -6px;
  width: 0;
  height: 2px;
  background: var(--gold);
  transition: .25s;
}
.nav-links a:hover::after, .nav-links a.active::after { width: 100%; }
.nav-links a.active { color: var(--gold); }

.book-btn, .btn.book-cta {
  margin-left: 8px;
  background: var(--gold);
  color: white;
  padding: 11px 24px;
  text-decoration: none;
  border-radius: 30px;
  font-weight: 600;
  font-size: 14px;
  transition: .3s;
  white-space: nowrap;
  border: 2px solid var(--gold);
}
.book-btn:hover, .btn.book-cta:hover { background: white; color: var(--dark); border-color: white; }

.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 1100;
  flex-shrink: 0;
}
.hamburger span {
  display: block;
  width: 26px;
  height: 2px;
  background: white;
  border-radius: 2px;
  transition: transform .3s ease, opacity .3s ease;
}
.hamburger[aria-expanded="true"] span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger[aria-expanded="true"] span:nth-child(2) { opacity: 0; }
.hamburger[aria-expanded="true"] span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 13px 30px;
  border-radius: 40px;
  background: linear-gradient(135deg, var(--gold), var(--gold-light));
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  border: none;
  cursor: pointer;
  transition: transform .25s, box-shadow .25s;
}
.btn:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(200,164,93,.3); }

.hero-btn, .hero-btn2 {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 13px 26px;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  margin-right: 12px;
  margin-top: 8px;
  max-width: 100%;
  position: relative;
  overflow: hidden;
}
.hero-btn { background: var(--gold); color: #fff; border: 2px solid var(--gold); box-shadow: 0 0 25px rgba(200,164,93,.35); }
.hero-btn:hover { box-shadow: 0 0 35px rgba(200,164,93,.55); transform: translateY(-3px); }
.hero-btn2 { background: transparent; border: 2px solid rgba(255,255,255,.6); color: #fff; }
.hero-btn2:hover { background: rgba(255,255,255,.12); transform: translateY(-3px); }
.hero-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: -120%;
  width: 60%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.45), transparent);
  transition: .7s;
}
.hero-btn:hover::before { left: 120%; }

.hero {
  display: flex;
  min-height: 100vh;
  width: 100%;
  max-width: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  align-items: center;
  text-align: center;
  justify-content: center;
  padding-top: var(--nav-h);
  background-image: linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.55)), url("/edited/unnamed.webp");
  animation: heroZoom 16s ease-in-out infinite alternate;
}
@keyframes heroZoom { from { background-size: 100%; } to { background-size: 115%; } }

.accommodation-hero, .dining-hero {
  display: flex;
  min-height: 100vh;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: #fff;
  align-items: center;
  padding: calc(var(--nav-h) + 40px) var(--pad) 60px;
  animation: heroZoom 16s ease-in-out infinite alternate;
}
.accommodation-hero { background-image: linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.55)), url("/edited/file_00000000f1cc8246b53b65d5c7db8e79 (1).png"); }
.dining-hero { background-image: linear-gradient(rgba(0,0,0,.6), rgba(0,0,0,.6)), url("/edited/1785222934347.jpg"); }

.hero-content {
  width: min(1200px, 100%);
  max-width: 100%;
  animation: heroFade 1.2s ease forwards;
}
@keyframes heroFade { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: none; } }

.hero-subtitle {
  color: var(--gold-light);
  letter-spacing: 2px;
  font-size: clamp(12px, 2vw, 15px);
  margin-bottom: 14px;
  font-weight: 500;
}
.hero h1, #acc-hero-title, #dining-title {
  font-family: var(--font-serif);
  font-size: clamp(34px, 6vw, 58px);
  line-height: 1.15;
  margin-bottom: 20px;
  color: #fff;
  font-weight: 700;
  font-style: italic;
  text-shadow: 0 0 25px rgba(200,164,93,.4);
  overflow-wrap: break-word;
}
.hero h1 span, #acc-hero-title span, #dining-title span { color: var(--gold-light); }
.hero p, .hero-description {
  font-size: clamp(15px,2vw,19px);
  color: rgba(255,255,255,.9);
  line-height: 1.8;
  overflow-wrap: break-word;
  margin: 0 auto 30px;
  max-width: 640px;
}
.hero-buttons { display: flex; flex-wrap: wrap; gap: 14px; justify-content: center; }

.hero-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: clamp(16px, 3vw, 50px);
  max-width: 1000px;
  margin: 50px auto 0;
  color: #fff;
  text-align: center;
  padding: 0 12px;
}
.hero-stats h2, .hero-stats h3 {
  font-size: clamp(24px, 4vw, 34px);
  color: var(--gold-light);
  font-family: var(--font-serif);
  margin: 0;
}
.hero-stats p {
  margin-top: 6px;
  font-size: 13px;
  letter-spacing: .5px;
  color: rgba(255,255,255,.85);
}

.wave-divider {
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  overflow: hidden;
  line-height: 0;
  pointer-events: none;
}
.wave-divider svg { display: block; width: 100%; height: 70px; fill: #fff; }

.about {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 60px;
  background: #fff;
  padding: 100px var(--pad);
  flex-wrap: wrap;
}
.about-image { flex: 1 1 400px; min-width: 280px; }
.about-image img { width: 100%; max-width: 520px; border-radius: 15px; box-shadow: var(--shadow-strong); }
.about-text { flex: 1 1 400px; max-width: 600px; }
.about-text .section-subtitle { display: block; }
.about-text h2 { font-size: clamp(28px,4vw,42px); color: var(--dark); margin-bottom: 20px; }
.about-text .section-description { color: var(--muted); line-height: 1.8; margin-bottom: 20px; }
.features { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin: 24px 0; }
.features div { color: var(--dark); font-weight: 500; }
.about-btn {
  display: inline-flex;
  padding: 14px 34px;
  background: var(--gold);
  color: #fff;
  text-decoration: none;
  border-radius: 30px;
  font-weight: 600;
  transition: .3s;
}
.about-btn:hover { background: var(--dark); transform: translateY(-3px); }

.featured-accommodation {
  text-align: center;
  padding: 80px var(--pad);
  background: linear-gradient(135deg, var(--dark), #0e2e20);
  color: #fff;
}
.featured-accommodation h2 { color: #fff; font-size: clamp(26px,4vw,38px); }
.featured-accommodation p { color: rgba(255,255,255,.8); max-width: 600px; margin: 16px auto 28px; }

.section-header {
  text-align: center;
  max-width: 900px;
  margin: 0 auto 48px;
  padding: 0 12px;
}
.section-header h2 { position: relative; }
.section-header h2 span { color: var(--gold); font-style: italic; }
.section-header > p:last-child, .section-description {
  max-width: 700px;
  margin: 18px auto 0;
  color: rgba(0,0,0,.6);
  line-height: 1.8;
}
.dining-hero + * .section-description, .room-preview .section-description { color: var(--muted); }

.section-subtitle {
  font-size: 13px;
  color: var(--gold);
  letter-spacing: 1.8px;
  margin-bottom: 8px;
  font-style: italic;
  display: inline-flex;
  align-items: center;
  gap: 16px;
}
.section-subtitle::before, .section-subtitle::after {
  content: "";
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(200,164,93,.8), transparent);
}

h2 { font-family: var(--font-serif); font-size: clamp(26px,4vw,40px); color: var(--dark); margin-bottom: 8px; }
h2 span { color: var(--gold); font-style: italic; }

.services-grid, .preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 26px;
  width: min(1200px, 100%);
  margin: 0 auto;
  padding: 0 var(--pad);
}
.services { padding: 100px 0; background: #fbf9f5; }

.service-card {
  position: relative;
  padding: 42px 30px;
  min-height: 230px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: #fff;
  border: 1px solid rgba(200,164,93,.18);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow-soft);
  transition: transform .4s ease, box-shadow .4s ease, border-color .4s ease;
}
.service-icon { font-size: 38px; margin-bottom: 18px; }
.service-card h3 { font-family: var(--font-serif); color: var(--dark); margin-bottom: 10px; font-size: 22px; }
.service-card p { color: var(--muted); font-size: 14px; line-height: 1.8; max-width: 280px; margin: 0 0 18px; }
.service-card:hover { transform: translateY(-10px); box-shadow: var(--shadow-strong); border-color: var(--gold); }

.preview-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-soft);
  transition: transform .4s, box-shadow .4s;
}
.preview-card img { width: 100%; height: 220px; object-fit: cover; }
.preview-card:hover { transform: translateY(-10px); box-shadow: var(--shadow-strong); }
.preview-content { padding: 26px; }
.preview-content span { color: var(--gold); font-weight: 600; font-size: 13px; letter-spacing: .5px; }
.preview-content h3 { font-family: var(--font-serif); font-size: 22px; color: var(--dark); margin: 8px 0 10px; }
.preview-content p { color: var(--muted); margin-bottom: 16px; }

.room-preview { padding: 100px 0; }

.rooms { padding: 100px var(--pad); }
.room {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  align-items: center;
  margin-bottom: 80px;
}
.room.reverse .room-images { order: 2; }
.room.reverse .room-content { order: 1; }
.room-images { border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow-strong); }
.room-main { width: 100%; height: 100%; min-height: 320px; object-fit: cover; display: block; transition: transform .6s ease; }
.room-images:hover .room-main { transform: scale(1.06); }
.room-content h3 { font-family: var(--font-serif); font-size: clamp(24px,3vw,32px); color: var(--dark); margin-bottom: 14px; }
.room-content p { color: var(--muted); line-height: 1.8; margin-bottom: 20px; }
.amenities { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 26px; }
.amenity {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 10px 24px rgba(0,0,0,.06);
  font-size: 14px;
}
.amenity i { color: var(--gold); }

.booking-banner {
  position: relative;
  padding: 100px var(--pad);
  border-radius: var(--radius);
  color: #fff;
  background-image: linear-gradient(rgba(6,12,8,.72), rgba(6,12,8,.55)), url("/edited/1785222959020.jpg");
  background-size: cover;
  background-position: center;
  margin: 40px var(--pad);
  text-align: center;
  overflow: hidden;
}
.booking-content { position: relative; z-index: 1; max-width: 700px; margin: 0 auto; }
.booking-content h2 { color: #fff; }
.booking-content h2 span { color: var(--gold-light); }
.booking-content p { color: rgba(255,255,255,.85); margin: 18px 0 30px; }
.booking-buttons { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }

.gallery { padding: 100px var(--pad); }
.gallery-container { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
.gallery-item { border-radius: 12px; overflow: hidden; box-shadow: var(--shadow-soft); cursor: pointer; }
.gallery-item img { width: 100%; height: 240px; object-fit: cover; transition: transform .5s; }
.gallery-item img:hover { transform: scale(1.08); }

#location { padding: 0 var(--pad) 100px; }
#location h2 { text-align: center; margin-bottom: 30px; }
#location iframe { border-radius: var(--radius); width: 100%; box-shadow: var(--shadow-soft); }

.contact {
  display: flex;
  gap: 40px;
  padding: 90px var(--pad);
  background: var(--dark);
  color: #fff;
  align-items: flex-start;
  flex-wrap: wrap;
}
.contact-info { flex: 1 1 280px; }
.contact-info h2 { color: #fff; }
.contact-info p { margin: 14px 0; color: rgba(255,255,255,.85); }
.whatsapp { display: inline-block; margin-top: 10px; }
.whatsapp img { width: 52px; height: 52px; border-radius: 50%; box-shadow: 0 10px 20px rgba(0,0,0,.25); transition: .3s; }
.whatsapp img:hover { transform: scale(1.12); }

.contact-form {
  flex: 1 1 320px;
  background: rgba(255,255,255,.06);
  padding: 30px;
  border-radius: var(--radius);
  position: relative;
  overflow: hidden;
  animation: bookingFormEntrance 0.9s ease-out both;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.22);
}
.contact-form h3 { color: #fff; font-family: var(--font-serif); margin-bottom: 18px; }
.contact-form input,
.contact-form textarea,
.contact-form select {
  width: 100%;
  padding: 13px;
  border-radius: 8px;
  border: none;
  margin-bottom: 12px;
  background: rgba(255,255,255,.92);
  color: #222;
  font-family: var(--font-sans);
  font-size: 14px;
  transition: transform .25s ease, box-shadow .25s ease, background .25s ease;
}
.contact-form select { cursor: pointer; }
.date-row { display: flex; gap: 10px; }
.date-row input { flex: 1; min-width: 0; }
.contact-form textarea { min-height: 90px; resize: vertical; }
.contact-form button {
  width: 100%;
  padding: 14px;
  border-radius: 10px;
  border: none;
  background: var(--gold);
  color: #000;
  font-weight: 700;
  cursor: pointer;
  transition: .3s;
  position: relative;
  overflow: hidden;
  z-index: 1;
  background: linear-gradient(135deg, #d2a75a, #8b672d);
  color: #fff;
  box-shadow: 0 12px 30px rgba(139, 103, 45, 0.35);
}
.contact-form button:hover {
  background: linear-gradient(135deg, #e7c36a, #a8792f);
  box-shadow: 0 16px 35px rgba(139, 103, 45, 0.45);
  transform: translateY(-3px);
}
.contact-form button:disabled { opacity: .6; cursor: not-allowed; }
.contact-form button::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, transparent 20%, rgba(255,255,255,.4) 50%, transparent 80%);
  transform: translateX(-120%);
  transition: transform .7s ease;
  pointer-events: none;
}
.contact-form button:hover::before { transform: translateX(120%); }
.contact-form input:focus,
.contact-form textarea:focus,
.contact-form select:focus {
  outline: none;
  transform: translateY(-3px);
  background: #fff;
  box-shadow: 0 0 0 4px rgba(200,164,93,.18), 0 8px 22px rgba(0,0,0,.16);
}
.contact-form::before {
  content: "";
  position: absolute;
  width: 180px;
  height: 180px;
  top: -90px;
  right: -70px;
  border-radius: 50%;
  background: rgba(200,164,93,.22);
  filter: blur(8px);
  pointer-events: none;
  animation: bookingGlow 5s ease-in-out infinite;
}
.contact-form h3, .contact-form form { position: relative; z-index: 1; }

@keyframes bookingFormEntrance {
  from { opacity: 0; transform: translateY(30px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes bookingGlow {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-15px, 15px) scale(1.08); }
}

@media (prefers-reduced-motion: reduce) {
  .contact-form, .contact-form::before { animation: none; }
  .contact-form input, .contact-form textarea, .contact-form button { transition: none; }
}

footer {
  background: linear-gradient(180deg, var(--dark), var(--dark2));
  color: #fff;
  text-align: center;
  padding: 50px var(--pad) 34px;
}
.footer-social h4 { font-weight: 500; letter-spacing: 1px; margin-bottom: 14px; color: rgba(255,255,255,.8); font-size: 13px; }
.social-icons { display: flex; gap: 16px; justify-content: center; margin-bottom: 30px; }
.social-icons a {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,.25);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  text-decoration: none;
  transition: .3s;
}
.social-icons a:hover { background: var(--gold); border-color: var(--gold); color: #000; transform: translateY(-3px); }
footer h3 { font-family: var(--font-serif); color: var(--gold); font-size: clamp(22px,3vw,28px); margin-bottom: 8px; }
footer p { color: rgba(255,255,255,.7); margin: 4px 0; }

.reveal { opacity: 0; transform: translateY(35px); transition: .8s cubic-bezier(.2,.8,.2,1); }
.reveal.show { opacity: 1; transform: none; }

.lightbox { position: fixed; inset: 0; display: none; justify-content: center; align-items: center; background: rgba(0,0,0,.92); z-index: 9999; padding: 20px; }
.lightbox img { max-width: 92%; max-height: 88%; border-radius: 12px; }
.lightbox.show { display: flex; }
.lightbox .close { position: absolute; top: 20px; right: 26px; font-size: 36px; color: #fff; background: none; border: none; cursor: pointer; line-height: 1; }

#topBtn {
  position: fixed;
  bottom: 22px;
  right: 22px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--gold);
  color: #000;
  border: none;
  display: none;
  z-index: 9999;
  cursor: pointer;
  font-size: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,.25);
  transition: .3s;
}
#topBtn:hover { transform: translateY(-4px); }

@media (max-width: 1024px) {
  .about { gap: 40px; padding: 80px var(--pad); }
  .room { gap: 36px; }
  .gallery-container { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 900px) {
  .hamburger { display: flex; }
  .nav-links {
    position: fixed;
    top: var(--nav-h);
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    background: rgba(20,61,43,.98);
    backdrop-filter: blur(10px);
    max-height: 0;
    overflow: hidden;
    transition: max-height .35s ease;
  }
  .nav-links.mobile-open { max-height: 420px; box-shadow: 0 20px 30px rgba(0,0,0,.25); }
  .nav-links li { width: 100%; text-align: center; }
  .nav-links a { display: block; padding: 16px; }
  .nav-links a::after { display: none; }
  .navbar .book-btn, .navbar .btn.book-cta { display: none; }

  .room, .room.reverse { grid-template-columns: 1fr; }
  .room.reverse .room-images, .room.reverse .room-content { order: 0; }
  .room-main, .room-images { min-height: 260px; }

  .about { flex-direction: column; text-align: center; }
  .features { justify-items: center; }
}

@media (max-width: 768px) {
  :root { --nav-h: 74px; }
  .navbar { padding: 12px var(--pad); }
  .logo img { height: 44px; width: 44px; }
  .hero-stats { grid-template-columns: repeat(2, 1fr); }
  .gallery-container { grid-template-columns: repeat(2, 1fr); }
  .contact { flex-direction: column; }
  .amenities { grid-template-columns: 1fr; }
  .booking-banner { margin: 30px var(--pad); padding: 70px var(--pad); }
  .date-row { flex-direction: column; }
}

@media (max-width: 560px) {
  .hero-buttons, .booking-buttons { flex-direction: column; align-items: stretch; }
  .hero-btn, .hero-btn2, .btn, .btn2 { width: 100%; margin-right: 0; }
  .gallery-container { grid-template-columns: 1fr; }
  .preview-grid, .services-grid { grid-template-columns: 1fr; }
  .service-card { min-height: 200px; padding: 34px 22px; }
  .about-image img { max-width: 100%; }
  .features { grid-template-columns: 1fr; }
  .section-subtitle::before, .section-subtitle::after { width: 32px; }
  .whatsapp img { position: fixed; bottom: 80px; right: 16px; width: 46px; height: 46px; z-index: 900; }
}

@media (max-width: 380px) {
  .nav-links a { font-size: 14px; }
  .logo { font-size: 15px; }
  .hero-stats { gap: 16px; }
}
