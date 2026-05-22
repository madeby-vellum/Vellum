// Import shared modal styles
import "./Modal.css";

// Pro subscription upgrade modal
export default function ProUpgradeModal({
  onClose,
  onUpgrade,
  userTier
}) {

  // Features included in the Pro plan
  const features = [
    {
      icon: "✦",
      label: "Unlimited journals",
      desc: "Create as many journals as you need, forever."
    },
    {
      icon: "◈",
      label: "Premium templates",
      desc: "Planners, recipe pages, reading logs, film reviews & more."
    },
  ];

  return (

    // Close modal when clicking backdrop
    <div
      className="modal-backdrop"
      onClick={onClose}
    >

      {/* Prevent modal from closing when clicking inside */}
      <div
        className="modal-card"
        onClick={e => e.stopPropagation()}
      >

        {/* ───────────── Header ───────────── */}
        <div className="modal-header">

          {/* Close button */}
          <button
            onClick={onClose}
            className="modal-close modal-close--pro"
          >
            ✕
          </button>

          {/* Small modal tagline */}
          <div className="modal-tagline">
            Vellum Pro
          </div>

          {/* Main title */}
          <div className="modal-title">
            Unlock the full<br />
            journaling experience
          </div>

          {/* Supporting text */}
          <div className="modal-copy">
            Everything in Free, plus much more.
          </div>
        </div>

        {/* ───────────── Feature List ───────────── */}
        <div className="modal-body">

          {features.map((f, i) => (
            <div
              key={i}
              className="modal-feature"
            >

              {/* Feature icon */}
              <div className="modal-feature-icon">
                {f.icon}
              </div>

              {/* Feature text */}
              <div>

                <div className="modal-feature-title">
                  {f.label}
                </div>

                <div className="modal-feature-desc">
                  {f.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ───────────── Footer ───────────── */}
        <div className="modal-footer">

          {/* Pricing section */}
          <div className="modal-summary">

            {/* Monthly plan price */}
            <div className="modal-plan">
              10 AED<span>/mo</span>
            </div>

            {/* Trial information */}
            <div className="modal-trial">

              <div className="modal-trial-title">
                14-day free trial
              </div>

              No credit card required
            </div>
          </div>

          {/* Show different UI if user is already Pro */}
          {userTier === "pro"

            // Already subscribed message
            ? (
              <div className="modal-pro-badge">
                ✓ You're already on Pro
              </div>
            )

            // Upgrade button
            : (
              <button
                onClick={onUpgrade}
                className="modal-button modal-button--primary"
              >
                Upgrade to Pro →
              </button>
            )
          }
        </div>
      </div>
    </div>
  );
}