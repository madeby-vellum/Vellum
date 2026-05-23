import "./Modal.css";

// modal for upgrading to Pro subscription
export default function ProUpgradeModal({ onClose, onUpgrade, userTier }) {
  const features = [
    { icon: "✦", label: "Unlimited journals",  desc: "Create as many journals as you need, forever." },
    { icon: "◈", label: "Premium templates",   desc: "Planners, recipe pages, reading logs, film reviews & more." },
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      {/* Modal Content */}
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <button onClick={onClose} className="modal-close modal-close--pro">✕</button>
          <div className="modal-tagline">Vellum Pro</div>
          <div className="modal-title">Unlock the full<br />journaling experience</div>
          <div className="modal-copy">Everything in Free, plus much more.</div>
        </div>

        {/* Features List */}
        <div className="modal-body">
          {features.map((f, i) => (
            <div key={i} className="modal-feature">
              <div className="modal-feature-icon">{f.icon}</div>
              <div>
                <div className="modal-feature-title">{f.label}</div>
                <div className="modal-feature-desc">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing and Upgrade Options */}
        <div className="modal-footer">
          <div className="modal-summary">
            <div className="modal-plan">10 AED<span>/mo</span></div>
            <div className="modal-trial">
              <div className="modal-trial-title">14-day free trial</div>
              No credit card required
            </div>
          </div>

          {/* Upgrade Button */}
          {userTier === "pro"
            ? <div className="modal-pro-badge">✓ You're already on Pro</div>
            : <button onClick={onUpgrade} className="modal-button modal-button--primary">Upgrade to Pro →</button>
          }
        </div>
      </div>
    </div>
  );
}