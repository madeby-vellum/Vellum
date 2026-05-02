import { ChevronDown, BookOpen, ArrowUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
// import { AuthContext } from "../context/AuthContext";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy:       #374375;
    --navy-dim:   #2a3260;
    --cloud:      #FFFCF5;
    --periwinkle: #BABDE2;
    --maroon:     #895159;
    --peach:      #DFAEA1;
    --sh:         0 4px 24px rgba(55,67,117,0.10);
    --sh-lg:      0 16px 64px rgba(55,67,117,0.16);
    --body-pad: 48px;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--cloud);
    font-family: 'Inter', sans-serif;
    color: var(--navy);
    min-height: 100vh;
    overflow-x: hidden;
  }

  .cg { font-family: 'Libre Baskerville', serif; letter-spacing: 0.1em; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: rgba(186,189,226,0.5); }

  /* ─── NAVBAR ─── */
  .navbar {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    background: var(--periwinkle);
    padding: 16px 40px;
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(55,67,117,0.08);
  }

  .navbar-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
  }

  .navbar-links {
    display: flex;
    align-items: center;
    gap: 32px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .navbar-links a {
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(55,67,117,0.7);
    text-decoration: none;
    transition: color 0.14s;
  }

  .navbar-links a:hover { color: var(--navy); }

  .journal-btn {
    padding: 8px 20px;
    background: var(--navy);
    color: var(--cloud);
    border: none;
    font-family: 'Inter', sans-serif;
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    transition: background 0.14s;
  }

  .journal-btn:hover { background: var(--navy-dim); }

  .hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
  }

  .hamburger span {
    display: block;
    width: 22px; height: 1.5px;
    background: var(--navy);
  }

  /* ─── HERO ─── */
  .hero {
    min-height: 100vh;
    background: var(--periwinkle);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100px var(--body-pad) 80px;
    position: relative;
    overflow: hidden;
  }

  .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, rgba(55,67,117,0.08) 1px, transparent 1px);
    background-size: 28px 28px;
  }

  .hero-inner {
    position: relative;
    z-index: 1;
    text-align: center;
    max-width: 700px;
  }

  .hero-tagline {
    font-size: 10px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(55,67,117,0.55);
    margin-bottom: 24px;
  }

  .hero-title {
    font-family: 'Libre Baskerville', serif;
    font-size: clamp(64px, 12vw, 104px);
    font-weight: 300;
    line-height: 1;
    color: var(--navy);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 20px;
  }

  .hero-sub {
    font-size: 13px;
    line-height: 1.7;
    color: rgba(55,67,117,0.7);
    max-width: 420px;
    margin: 0 auto 44px;
  }

  .btn-primary {
    padding: 14px 40px;
    background: var(--navy);
    color: var(--cloud);
    border: none;
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    transition: background 0.16s;
  }

  .btn-primary:hover { background: var(--navy-dim); }

  .hero-scroll {
    position: absolute;
    bottom: 36px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: rgba(55,67,117,0.4);
    font-size: 9px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    animation: bounce 2s ease-in-out infinite;
  }

  @keyframes bounce {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50%       { transform: translateX(-50%) translateY(6px); }
  }

  /* ─── SECTIONS ─── */
  section { padding: 100px var(--body-pad); }

  .section-inner {
    max-width: 960px;
    margin: 0 auto;
  }

  .section-label {
    font-size: 9px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(55,67,117,0.45);
    margin-bottom: 16px;
  }

  .section-title {
    font-family: 'Libre Baskerville', serif;
    font-size: clamp(28px, 4.5vw, 48px);
    font-weight: 400;
    line-height: 1.15;
    color: var(--navy);
    letter-spacing: 0.04em;
    margin-bottom: 20px;
  }

  .section-body {
    font-size: 14px;
    line-height: 1.8;
    color: rgba(55,67,117,0.65);
    max-width: 500px;
  }

  .divider-line {
    width: 40px;
    height: 1px;
    background: rgba(186,189,226,0.6);
    margin: 24px 0;
  }

  /* ─── ABOUT ─── */
  #about { background: var(--cloud); }

  .about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
  }

  .about-img {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 0 0 30px;
  }

  /* ─── FEATURES ─── */
  #features { background: var(--periwinkle); }

  .features-grid {
    margin-top: 64px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
  }

  .feature-card {
    background: var(--cloud);
    padding: 40px 32px;
    transition: background 0.14s;
  }

  .feature-card:hover { background: rgba(255,252,245,0.85); }

  .feature-icon {
    font-size: 20px;
    margin-bottom: 20px;
    color: var(--navy);
  }

  .feature-title {
    font-family: 'Libre Baskerville', serif;
    font-size: 17px;
    color: var(--navy);
    letter-spacing: 0.04em;
    margin-bottom: 12px;
  }

  .feature-desc {
    font-size: 13px;
    line-height: 1.75;
    color: rgba(55,67,117,0.65);
  }

  /* ─── PRICING ─── */
  #pricing { background: var(--cloud); }

  .pricing-grid {
    margin-top: 64px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px;
    width: 100%;
  }

  .pricing-card {
    padding: 48px 40px;
    border: 1px solid rgba(186,189,226,0.3);
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .pricing-card.pro {
    background: var(--navy);
    border-color: var(--navy);
  }

  .pricing-badge {
    display: inline-block;
    font-size: 9px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 5px 12px;
    background: rgba(186,189,226,0.2);
    color: rgba(55,67,117,0.7);
    margin-bottom: 28px;
    width: fit-content;
  }

  .pricing-card.pro .pricing-badge {
    background: rgba(186,189,226,0.15);
    color: var(--periwinkle);
  }

  .pricing-price {
    font-family: 'Libre Baskerville', serif;
    font-size: 48px;
    font-weight: 400;
    color: var(--navy);
    line-height: 1;
    margin-bottom: 4px;
  }

  .pricing-card.pro .pricing-price { color: var(--cloud); }

  .pricing-price span {
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: rgba(55,67,117,0.5);
  }

  .pricing-card.pro .pricing-price span { color: rgba(255,252,245,0.4); }

  .pricing-desc {
    font-size: 12px;
    color: rgba(55,67,117,0.5);
    margin-bottom: 36px;
    letter-spacing: 0.04em;
  }

  .pricing-card.pro .pricing-desc { color: rgba(255,252,245,0.5); }

  .pricing-divider {
    height: 1px;
    background: rgba(186,189,226,0.25);
    margin-bottom: 28px;
  }

  .pricing-card.pro .pricing-divider { background: rgba(255,252,245,0.1); }

  .pricing-features {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-bottom: 40px;
    flex: 1;
  }

  .pricing-features li {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-size: 13px;
    color: rgba(55,67,117,0.7);
    line-height: 1.5;
  }

  .pricing-card.pro .pricing-features li { color: rgba(255,252,245,0.7); }

  .pricing-check {
    color: var(--periwinkle);
    font-size: 12px;
    margin-top: 2px;
    flex-shrink: 0;
  }

  .pricing-footer { margin-top: auto; }

  .pricing-cta {
    width: 100%;
    padding: 14px;
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer;
    border: 1px solid rgba(186,189,226,0.4);
    background: transparent;
    color: var(--navy);
    transition: all 0.14s;
  }

  .pricing-cta:hover {
    background: rgba(186,189,226,0.15);
    border-color: var(--periwinkle);
  }

  .pricing-card.pro .pricing-cta {
    background: var(--periwinkle);
    border-color: var(--periwinkle);
    color: var(--navy);
  }

  .pricing-card.pro .pricing-cta:hover {
    background: #a8abce;
    border-color: #a8abce;
  }

  .pricing-trial {
    font-size: 10px;
    color: rgba(255,252,245,0.35);
    text-align: center;
    margin-top: 12px;
    letter-spacing: 0.06em;
  }

  /* ─── STUDENT DISCOUNT BOX ─── */
  .student-box {
    margin-top: 40px;
    border: 1px solid rgba(186,189,226,0.3);
    background: rgba(186,189,226,0.06);
    display: flex;
    align-items: stretch;
    overflow: hidden;
  }

  .student-img-col {
    flex: 0 0 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(186,189,226,0.13);
    border-right: 1px solid rgba(186,189,226,0.25);
    padding: 36px 20px;
  }

  .student-placeholder {
    width: 110px;
    height: 110px;
    background: rgba(186,189,226,0.18);
    border: 1.5px dashed rgba(186,189,226,0.5);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 8px;
    color: rgba(186,189,226,0.65);
    font-size: 9px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    text-align: center;
  }

  .student-text-col {
    flex: 1;
    padding: 32px 36px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .student-title {
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--navy);
    font-weight: 600;
    margin-bottom: 10px;
  }

  .student-body {
    font-size: 13px;
    line-height: 1.75;
    color: rgba(55,67,117,0.65);
  }

  .student-body a {
    color: var(--navy);
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .student-body a:hover { opacity: 0.75; }

  /* ─── FAQ ─── */
  #faq { background: var(--periwinkle); }

  .faq-list {
    margin-top: 64px;
    display: flex;
    flex-direction: column;
    border-top: 1px solid rgba(55,67,117,0.12);
  }

  .faq-item { border-bottom: 1px solid rgba(55,67,117,0.12); }

  .faq-q {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 0;
    background: none;
    border: none;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    font-weight: 500;
    color: var(--navy);
    text-align: left;
    gap: 20px;
  }

  .faq-chevron {
    font-size: 20px;
    color: rgba(55,67,117,0.4);
    flex-shrink: 0;
    transition: transform 0.2s;
    line-height: 1;
  }

  .faq-item.open .faq-chevron { transform: rotate(180deg); }

  .faq-a {
    font-size: 13px;
    line-height: 1.8;
    color: rgba(55,67,117,0.65);
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease, padding 0.3s ease;
  }

  .faq-item.open .faq-a {
    max-height: 220px;
    padding-bottom: 24px;
  }

  /* ─── FOOTER ─── */
  footer {
    background: var(--navy);
    padding: 40px 40px 28px;
    color: rgba(255,252,245,0.5);
  }

  .footer-inner {
    max-width: 960px;
    margin: 0 auto;
  }

  .footer-main {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 40px;
    flex-wrap: wrap;
    margin-bottom: 28px;
  }

  .footer-logo-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .footer-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 14px;
  }

  .footer-contact-note {
    font-size: 12px;
    color: rgba(255,252,245,0.4);
    text-align: right;
    line-height: 1.65;
  }

  .footer-contact-note a {
    color: var(--periwinkle);
    text-decoration: none;
    transition: color 0.14s;
  }

  .footer-contact-note a:hover { color: #d0d3ee; }

  .footer-socials {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .social-icon {
    width: 32px; height: 32px;
    display: flex; align-items: center; justify-content: center;
    color: rgba(255,252,245,0.4);
    text-decoration: none;
    transition: all 0.14s;
    cursor: pointer;
  }

  .social-icon:hover {
    border-color: rgba(255,252,245,0.3);
    color: rgba(255,252,245,0.8);
  }

  .footer-bottom {
    border-top: 1px solid rgba(255,252,245,0.06);
    padding-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
    gap: 12px;
    flex-wrap: wrap;
  }

  .footer-bottom-left {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
  }

  .back-to-top {
    display: flex;
    align-items: center;
    gap: 7px;
    color: rgba(255,252,245,0.4);
    text-decoration: none;
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    transition: color 0.14s;
  }

  .back-to-top:hover { color: rgba(255,252,245,0.75); }
  .back-to-top svg { transition: transform 0.14s; }
  .back-to-top:hover svg { transform: translateY(-2px); }

  /* ─── MODAL ─── */
  .modal-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(55,67,117,0.45);
    backdrop-filter: blur(4px);
    z-index: 999;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  .modal-overlay.active { display: flex; }

  .modal-box {
    background: var(--cloud);
    padding: 48px 40px;
    max-width: 340px;
    width: 100%;
    text-align: center;
    box-shadow: var(--sh-lg);
    animation: fadeUp 0.25s ease both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .modal-icon { font-size: 28px; margin-bottom: 20px; }

  .modal-box h3 {
    font-family: 'Libre Baskerville', serif;
    font-size: 22px;
    color: var(--navy);
    letter-spacing: 0.04em;
    margin-bottom: 12px;
  }

  .modal-box p {
    font-size: 13px;
    line-height: 1.75;
    color: rgba(55,67,117,0.6);
    margin-bottom: 32px;
  }

  .modal-close-btn {
    padding: 11px 32px;
    background: var(--periwinkle);
    color: var(--navy);
    border: none;
    font-family: 'Inter', sans-serif;
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.14s;
  }

  .modal-close-btn:hover { background: #a8abce; }

  /* Mobile nav */
  .mobile-nav {
    display: none;
    position: fixed;
    top: 58px; left: 0; right: 0;
    background: var(--periwinkle);
    border-top: 1px solid rgba(55,67,117,0.1);
    padding: 20px;
    flex-direction: column;
    gap: 4px;
    z-index: 99;
  }

  .mobile-nav.open { display: flex; }

  .mobile-nav a {
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(55,67,117,0.7);
    text-decoration: none;
    padding: 12px 0;
    border-bottom: 1px solid rgba(55,67,117,0.08);
  }

  .mobile-nav a:last-child { border-bottom: none; }

  /* ─── RESPONSIVE ─── */
  @media (max-width: 900px) {
    .student-img-col { flex: 0 0 140px; }
  }

  @media (max-width: 600px) {
    .about-grid { grid-template-columns: 1fr; gap: 48px; }
    .features-grid { grid-template-columns: 1fr; }
    .pricing-grid  { grid-template-columns: 1fr; }
  }

  @media (max-width: 767px) {
    .navbar { padding: 16px 20px; }
    .navbar-links { display: none; }
    .journal-btn { display: none; }
    .hamburger { display: flex; }

    section { padding: 72px 20px; }
    .hero { padding: 100px 20px 80px; }

    .student-box { flex-direction: column; }
    .student-img-col {
      display: none;
    }
    .student-text-col { padding: 24px 20px; }

    footer { padding: 36px 20px 24px; }
    .footer-main  { flex-direction: column; }
    .footer-right { align-items: flex-start; }
    .footer-contact-note { text-align: left; }
    .footer-socials { justify-content: flex-start; }
    .footer-bottom { flex-direction: column; align-items: flex-start; }
  }
`;

const features = [
  {
    icon: "✦",
    title: "Multiple Journals",
    desc: "Organise your thoughts across separate journals — one for daily writing, one for recipes, one for travel. Each one its own world.",
  },
  {
    icon: "◫",
    title: "Spread Editor",
    desc: "Every page opens in a full-screen spread editor. Draw, write, annotate. It's your canvas — do what feels right.",
  },
  {
    icon: "⊞",
    title: "Page Templates",
    desc: "Start with dotted, lined, or grid backgrounds. Pro members unlock planner spreads, recipe pages, habit trackers, and more.",
  },
  {
    icon: "◉",
    title: "Custom Covers",
    desc: "Give each journal its own personality. Choose from curated cover images or upload your own photographs.",
  },
  {
    icon: "✐",
    title: "Rich Drawing Tools",
    desc: "A full pen strip with adjustable sizes, colours, and opacity. Sketch ideas, annotate plans, or simply doodle freely.",
  },
  {
    icon: "☁",
    title: "Cloud Sync",
    desc: "Your journals are automatically saved and synced. Pick up right where you left off, from any browser, on any device.",
  },
];

const faqs = [
  {
    q: "Is my journal really private?",
    a: "Yes, absolutely. Your journal entries are stored securely under your account. We never sell your data, share it with third parties, or use it to train AI models. Your words are yours alone.",
  },
  {
    q: "Can I use Vellum on my phone?",
    a: "Vellum is a web app that works on any modern browser. For the best journaling and drawing experience, we recommend using a tablet or desktop — especially if you plan to use the spread editor and drawing tools.",
  },
  {
    q: "What happens to my journals if I cancel Pro?",
    a: "Your data is always safe. If you downgrade to Free, you retain access to all your existing journals and pages. You simply won't be able to create new journals beyond the free limit or access Pro templates on new pages.",
  },
  {
    q: "Are the templates one-time purchases or part of the subscription?",
    a: "Premium templates are included with your Pro subscription. While subscribed, all template packs — planners, trackers, reading logs, film reviews, and more — are fully unlocked and available on any page.",
  },
  {
    q: "Do I need to install anything?",
    a: "Not a thing. Vellum runs entirely in your browser — no app download, no plugins, no setup. Just sign up and you're ready to write.",
  },
  {
    q: "How does the student discount work?",
    a: "Email us at madeby.vellum@gmail.com from your student email. We'll verify your enrolment and apply 50% off your Pro subscription, plus unlock exclusive academic templates not available to regular Pro users.",
  },
];

const JournalIcon = ({ width = 18, height = 18, opacity = "0.4" }) => (
  <BookOpen size={18} strokeWidth={1.4} />
);

export function Logo({ size = 48 }) {
  return (
    <div style={{
      width: size, height: size, flexShrink: 0,
      background: "rgba(55,67,117,0.12)",
      border: "1.5px dashed rgba(55,67,117,0.25)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="1" stroke="rgba(55,67,117,0.35)" strokeWidth="1.2"/>
        <path d="M3 9h18M9 9v12" stroke="rgba(55,67,117,0.35)" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

export default function HomePage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const handleScroll = () => setMobileNavOpen(false);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleJournalClick = (e) => {
    if (window.innerWidth < 768) {
      e.preventDefault();
      setModalOpen(true);
    } else {
      navigate("/auth")
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <>
      <style>{styles}</style>

      {/* NAVBAR */}
      <nav className="navbar">
        <a href="/" className="navbar-logo">
          <img src="/logo/blue-logo.png" alt="Vellum" style={{ height:36, width:"auto", display:"block" }} />
        </a>

        <div className="navbar-links">
          <a href="#about">About</a>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
        </div>

        <a href="/auth" className="journal-btn" onClick={handleJournalClick}>
          Journal
        </a>

        <button
          className="hamburger"
          aria-label="Menu"
          onClick={() => setMobileNavOpen((v) => !v)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* MOBILE NAV */}
      <div className={`mobile-nav${mobileNavOpen ? " open" : ""}`}>
        <a href="#about" onClick={() => setMobileNavOpen(false)}>About</a>
        <a href="#features" onClick={() => setMobileNavOpen(false)}>Features</a>
        <a href="#pricing" onClick={() => setMobileNavOpen(false)}>Pricing</a>
      </div>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-inner">
          <div className="hero-tagline">Welcome to</div>
          <h1 className="hero-title cg">Vellum</h1>
          <p className="hero-sub">
            A minimal digital journaling website. Design freely, plan mindfully, track what matters — all in one place.
          </p>
          <a href="/auth" className="btn-primary" onClick={handleJournalClick}>
            Start Journaling
          </a>
        </div>
        <div className="hero-scroll">
          <ChevronDown size={14} strokeWidth={1.5} style={{ color: "rgba(55,67,117,0.4)" }} />
          scroll
        </div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <div className="section-inner">
          <div className="about-grid">
            <img className="about-img" src="/images/vehluhm.png" alt="Vellum" style={{ height:300, width:"auto", display:"block" }} />
            <div>
              <div className="section-label">About Vellum</div>
              <h2 className="section-title cg">
                A minimal digital<br />journaling app
              </h2>
              <div className="divider-line"></div>
              <p className="section-body">
                Clean, quiet, and distraction-free by design. Vellum was built on a simple belief — "your journal should feel like a beautiful, blank page, not a productivity app." Your creativity deserves the best digital space to visualize your ideas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features">
        <div className="section-inner">
          <div className="section-label">What's Inside</div>
          <h2 className="section-title cg" style={{ color: "var(--navy)" }}>
            Everything you need<br />to journal well
          </h2>
          <p className="section-body">
            Vellum brings together thoughtful tools for writing, planning, and tracking — all wrapped in a cohesive, quiet aesthetic.
          </p>

          <div className="features-grid">
            {features.map((f, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title cg">{f.title}</div>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing">
        <div className="section-inner">
          <div className="section-label">Plans</div>
          <h2 className="section-title cg">
            Free to start.<br /><em>Pro when you're ready.</em>
          </h2>
          <p className="section-body">
            Start journaling for free with no commitment. Upgrade to Pro when you want more templates and unlimited space.
          </p>

          <div className="pricing-grid">
            {/* Free */}
            <div className="pricing-card">
              <div className="pricing-badge">Free</div>
              <div className="pricing-price">0 AED <span>/ forever</span></div>
              <p className="pricing-desc">Everything you need to get started.</p>
              <div className="pricing-divider"></div>
              <ul className="pricing-features">
                {[
                  "Up to 3 journals",
                  "Unlimited pages per journal",
                  "6 free page templates (dotted, lined, grid)",
                  "Full drawing tools",
                  "Custom journal covers",
                  "Free sticker packs",
                ].map((item, i) => (
                  <li key={i}>
                    <span className="pricing-check">✓</span> {item}
                  </li>
                ))}
              </ul>
              <div className="pricing-footer">
                <button className="pricing-cta" onClick={handleJournalClick}>
                  Get started
                </button>
              </div>
            </div>

            {/* Pro */}
            <div className="pricing-card pro">
              <div className="pricing-badge">Pro</div>
              <div className="pricing-price">10 AED <span>/ mo</span></div>
              <p className="pricing-desc">14-day free trial. No card required.</p>
              <div className="pricing-divider"></div>
              <ul className="pricing-features">
                {[
                  "Everything in Free",
                  "Unlimited journals",
                  "Premium template packs — planners, trackers, recipe pages, reading logs, film reviews",
                  "Priority support",
                  "Cancel anytime. No strings attached.",
                ].map((item, i) => (
                  <li key={i}>
                    <span className="pricing-check">✓</span> {item}
                  </li>
                ))}
              </ul>
              <div className="pricing-footer">
                <button className="pricing-cta" onClick={handleJournalClick}>
                  Try Pro &nbsp;&rarr;
                </button>
              </div>
            </div>
          </div>

          {/* Student Discount */}
          <div className="student-box">
            <div className="student-img-col">
              <img src="/images/discount.png" alt="Student Discount" style={{ height:120, width:"auto", display:"block" }} />
              {/* <div className="student-placeholder">
              </div> */}
            </div>
            <div className="student-text-col">
              <div className="student-title">Are you a student?</div>
              <p className="student-body">
                For eligible students, access to Vellum Pro and its features is 50% off, plus additional templates tailored to your academic needs. If you're a high school or university student, head to{" "}
                <a href="mailto:madeby.vellum@gmail.com">madeby.vellum@gmail.com</a>{" "}
                to be verified for our student discount.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faq">
        <div className="section-inner">
          <div className="section-label">FAQs</div>
          <h2 className="section-title cg">Frequently Asked Questions</h2>

          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div className={`faq-item${openFaq === i ? " open" : ""}`} key={i}>
                <button className="faq-q" onClick={() => toggleFaq(i)}>
                  {faq.q}
                  <span className="faq-chevron">▾</span>
                </button>
                <div className="faq-a">{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="footer-main">
            <div className="footer-logo-row">
              <img src="/logo/periwinkle-logo.png" alt="Vellum" style={{ height:48, width:"auto", display:"block" }} />
            </div>

            <div className="footer-right">
              <p className="footer-contact-note">
                Questions or feedback?<br />
                Reach us at <a href="mailto:madeby.vellum@gmail.com">madeby.vellum@gmail.com</a>
              </p>
              <div className="footer-socials">
                <a href="https://www.instagram.com/madeby.vellum/" className="social-icon" aria-label="Instagram" target="_blank">
                  <img src="/images/icon_ig.png" alt="Instagram" style={{ height:24, width:"auto", display:"block" }} />
                </a>
                <a href="https://www.threads.com/@madeby.vellum" className="social-icon" aria-label="Threads" target="_blank">
                  <img src="/images/icon_threads.png" alt="Threads" style={{ height:24, width:"auto", display:"block" }} />
                </a>
                <a href="https://bsky.app/profile/madeby-vellum.bsky.social" className="social-icon" aria-label="Bluesky" target="_blank">
                  <img src="/images/icon_bluesky.png" alt="Bluesky" style={{ height:24, width:"auto", display:"block" }} />
                </a>
                <a href="https://www.youtube.com/@madeby.vellum" className="social-icon" aria-label="YouTube" target="_blank">
                  <img src="/images/icon_yt.png" alt="YouTube" style={{ height:24, width:"auto", display:"block" }} />
                </a>
                <a href="https://linktr.ee/madeby.vellum" className="social-icon" aria-label="Linktree" target="_blank">
                  <img src="/images/icon_linktree.png" alt="Linktree" style={{ height:24, width:"auto", display:"block" }} />
                </a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-bottom-left">
              <span>© 2026 Vellum. All rights reserved.</span>
            </div>
            <a href="#home" className="back-to-top">
              <ArrowUp size={18} strokeWidth={1.5} />
              Back to top
            </a>
          </div>
        </div>
      </footer>

      {/* SMALL SCREEN MODAL */}
      <div
        className={`modal-overlay${modalOpen ? " active" : ""}`}
        onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
      >
        <div className="modal-box">
          <div className="modal-icon">📖</div>
          <h3 className="cg">Better on a bigger screen</h3>
          <p>
            Vellum's journaling experience — with its spread editor, drawing tools, and templates — is designed for tablet screens and above. For the best experience, visit us on a tablet, laptop, or desktop.
          </p>
          <button className="modal-close-btn" onClick={() => setModalOpen(false)}>
            Got it
          </button>
        </div>
      </div>
    </>
  );
}
