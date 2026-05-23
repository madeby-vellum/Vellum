import { useState } from "react";
import "./Modal.css";

// Dictionary of help content for each tab and step in the help modal. Each tab has an id, label and a list of steps. 
const HELP_TABS = [
  {
    id: "getting-started", label: "Getting Started",
    steps: [
      { heading: "Create Your First Journal", body: "Tap '+ New Journal' on the shelf page to begin.", image: "/images/start-1.png" },
      { heading: "Choose a Title and a Cover", body: "Give your journal a title and choose a cover — a preset colour or your own photo.", image: "/images/start-2.png" },
      { heading: "Opening a Journal", body: "Click any journal card on the shelf to open it. You'll land on the cover page first.", image: "/images/start-3.png" },
    ],
  },
  {
    id: "journal", label: "The Journal",
    steps: [
      { heading: "Adding a Spread", body: "Press the + button in the bottom bar to add a new spread.", image: "/images/journal-1.png" },
      { heading: "Choosing a Template", body: "Select a template to be applied to the new spread.", image: "/images/journal-2.png" },
      { heading: "Navigating Spreads", body: "Use the ← → arrows at the bottom to flip between your cover and spreads.", image: "/images/journal-3.png" },
      { heading: "Deleting", body: "Use the trash icon in the bottom bar to delete the current spread.", image: "/images/journal-4.png" },
      { heading: "Editing a Spread", body: "Click the pencil icon or tap anywhere on the spread to open it in the editor.", image: "/images/journal-5.png" },
    ],
  },
  {
    id: "editor", label: "The Editor",
    steps: [
      { heading: "Drawing", body: "Select the pen tool. Choose your brush size and colour.", image: "/images/editor-1.png" },
      { heading: "Text", body: "Select the text tool and click anywhere to place a text box.", image: "/images/editor-2.png" },
      { heading: "Images", body: "Select the image tool to upload from Unsplash, your device or from the library.", image: "/images/editor-3.png" },
      { heading: "Layers", body: "Use the layer buttons to move objects forward or back.", image: "/images/editor-4.png" },
      { heading: "Undo & Redo", body: "Use the undo/redo buttons in the toolbar.", image: "/images/editor-5.png" },
      { heading: "Saving", body: "Press '✓ Save' in the top-right to save your spread and return to the journal view.", image: "/images/editor-6.png" },
    ],
  },
  {
    id: "tiers", label: "Free vs Pro",
    steps: [
      { heading: "Free Plan", body: "Create up to 3 journals. Access basic templates. Full use of editor tools.", image: "/images/tier-1.png" },
      { heading: "Free Pack Redemption", body: "Every new account can redeem one Pro template pack for free.", image: "/images/tier-2.png" },
      { heading: "Pro Plan", body: "Unlimited journals and access to all Premium template packs.", image: "/images/tier-3.png" },
      { heading: "Upgrading", body: "Tap '✦ Upgrade to Pro' in the nav bar to see pricing and unlock all features.", image: "/images/tier-4.png" },
    ],
  },
];

export function HelpButton({ onOpen }) {
  return (
    <button onClick={onOpen} title="Help & Guide" className="help-button">
      ?
    </button>
  );
}

export function HelpModal({ onClose, initialTab = 0 }) {
  const [activeTab,  setActiveTab]  = useState(initialTab);
  const [activeStep, setActiveStep] = useState(0);

  const tab   = HELP_TABS[activeTab];
  const step  = tab.steps[activeStep];
  const total = tab.steps.length;
  const goTab = (i) => { setActiveTab(i); setActiveStep(0); };

  return (
    <div onClick={onClose} className="help-backdrop">
      <div onClick={e => e.stopPropagation()} className="help-card fu">

        <div className="help-header">
          <div className="help-header-row">
            <div className="help-header-label">Help &amp; Guide</div>
            <button onClick={onClose} className="help-header-close">✕</button>
          </div>
          <div className="help-tabs">
            {HELP_TABS.map((t, i) => (
              <button
                key={t.id}
                onClick={() => goTab(i)}
                className={`help-tab${activeTab === i ? " active" : ""}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="help-image-wrap">
          <img src={step.image} alt={step.heading} />
        </div>

        <div className="help-body">
          <div className="help-step-counter">{activeStep + 1} / {total}</div>
          <div className="help-step-heading">{step.heading}</div>
          <div className="help-step-body">{step.body}</div>
        </div>

        <div className="help-footer">
          <div className="help-dots">
            {tab.steps.map((_, i) => (
              <div
                key={i}
                onClick={() => setActiveStep(i)}
                className={`help-dot${i === activeStep ? " active" : ""}`}
              />
            ))}
          </div>
          <div className="help-nav">
            <button
              onClick={() => setActiveStep(s => Math.max(0, s - 1))}
              disabled={activeStep === 0}
              className="help-btn-prev"
            >
              ← prev
            </button>
            {activeStep < total - 1
              ? <button onClick={() => setActiveStep(s => s + 1)} className="help-btn-next">next →</button>
              : <button onClick={onClose} className="help-btn-done">done ✓</button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}