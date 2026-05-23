import { ChevronDown, BookOpen, ArrowUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./HomePage.css";
// import { AuthContext } from "../context/AuthContext";

// features data for the features section
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

// faqs data for the FAQ section
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

// icon for navbar
const JournalIcon = ({ width = 18, height = 18, opacity = "0.4" }) => (
  <BookOpen size={18} strokeWidth={1.4} />
);

export default function HomePage() {
  const navigate = useNavigate();

  // set up state for mobile nav, modal, and FAQ toggling
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // close mobile nav on scroll for better UX
  useEffect(() => {
    const handleScroll = () => setMobileNavOpen(false);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // handle journal button click - show modal on small screens, navigate to auth on larger screens
  const handleJournalClick = (e) => {
    if (window.innerWidth < 768) {
      e.preventDefault();
      setModalOpen(true);
    } else {
      navigate("/auth");
    }
  };

  // toggle FAQ answers - if the same question is clicked, close it; otherwise, open the new one
  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar">
        <a href="/" className="navbar-logo">
          <img src="/logo/blue-logo.png" alt="Vellum" className="navbar-logo-img" />
        </a>
        {/* NAVIGATION LINKS */}
        <div className="navbar-links">
          <a href="#about">About</a>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
        </div>
        {/* JOURNAL BUTTON */}
        <a href="/auth" className="journal-btn" onClick={handleJournalClick}>
          Journal
        </a>
        {/* HAMBURGER MENU */}
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

      {/* HERO SECTION */}
      <section className="hero" id="home">
        <div className="hero-inner">
          <div className="hero-tagline">Welcome to</div>
          <h1 className="hero-title cg">Vellum</h1>
          <p className="hero-sub">
            A minimal digital journaling website. Design freely, plan mindfully, track what matters — all in one place.
          </p>
          {/* CTA BUTTON */}
          <a href="/auth" className="btn-primary" onClick={handleJournalClick}>
            Start Journaling
          </a>
        </div>
        <div className="hero-scroll">
          <ChevronDown size={14} strokeWidth={1.5} />
          scroll
        </div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <div className="section-inner">
          <div className="about-grid">
            <img className="about-img" src="/images/vehluhm.png" alt="Vellum" />
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
          <h2 className="section-title cg">
            Everything you need<br />to journal well
          </h2>
          <p className="section-body">
            Vellum brings together thoughtful tools for writing, planning, and tracking — all wrapped in a cohesive, quiet aesthetic.
          </p>
          {/* FEATURES GRID */}
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
          {/* PRICING GRID */}
          <div className="pricing-grid">
            {/* Free Version */}
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
              {/* Free Button */}
              <div className="pricing-footer">
                <button className="pricing-cta" onClick={handleJournalClick}>
                  Get started
                </button>
              </div>
            </div>
            {/* Pro Version */}
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
              {/* Pro Button */}
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
              <img src="/images/discount.png" alt="Student Discount" />
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

      {/* FAQs SECTION */}
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
              <img src="/logo/periwinkle-logo.png" alt="Vellum" />
            </div>

            <div className="footer-right">
              <p className="footer-contact-note">
                Questions or feedback?<br />
                Reach us at <a href="mailto:madeby.vellum@gmail.com">madeby.vellum@gmail.com</a>
              </p>
              {/* SOCIAL MEDIA LINKS */}
              <div className="footer-socials">
                <a href="https://www.instagram.com/madeby.vellum/" className="social-icon" aria-label="Instagram" target="_blank" rel="noreferrer">
                  <img src="/images/icon_ig.png" alt="Instagram" />
                </a>
                <a href="https://www.threads.com/@madeby.vellum" className="social-icon" aria-label="Threads" target="_blank" rel="noreferrer">
                  <img src="/images/icon_threads.png" alt="Threads" />
                </a>
                <a href="https://bsky.app/profile/madeby-vellum.bsky.social" className="social-icon" aria-label="Bluesky" target="_blank" rel="noreferrer">
                  <img src="/images/icon_bluesky.png" alt="Bluesky" />
                </a>
                <a href="https://www.youtube.com/@madeby.vellum" className="social-icon" aria-label="YouTube" target="_blank" rel="noreferrer">
                  <img src="/images/icon_yt.png" alt="YouTube" />
                </a>
                <a href="https://linktr.ee/madeby.vellum" className="social-icon" aria-label="Linktree" target="_blank" rel="noreferrer">
                  <img src="/images/icon_linktree.png" alt="Linktree" />
                </a>
              </div>
            </div>
          </div>
          {/* Terms and Conditions */}
          <div className="footer-bottom">
            <div className="footer-bottom-left">
              <span>© 2026 Vellum. All rights reserved.</span>
            </div>
            {/* Back to Top Link */}
            <a href="#home" className="back-to-top">
              <ArrowUp size={18} strokeWidth={1.5} />
              Back to top
            </a>
          </div>
        </div>
      </footer>

      {/* SMALL SCREEN LIMITING MODAL */}
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