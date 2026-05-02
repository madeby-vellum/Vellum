import { useState } from "react";
import { PRO_CATEGORIES, PACK_DETAILS } from "../constants.js";
import "./Modal.css";

export default function RedeemPackModal({ onClose, onRedeem, redeemUsed, unlockedCategory }) {
  const [selected, setSelected] = useState(null);
  const [confirming, setConfirming] = useState(false);

  if (redeemUsed) return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card modal-card--small" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="modal-close modal-close--light">✕</button>
        <div className="modal-header">
          <div className="modal-title">Pack Redeemed</div>
          <div className="modal-copy" style={{ marginTop: 10, marginBottom: 6, color:"var(--periwinkle)" }}>You've unlocked the</div>
          <div className="modal-feature-title" style={{ marginBottom: 24, color: "var(--cloud)", textTransform: "uppercase" }}>{unlockedCategory} Pack</div>
          <div className="modal-copy" style={{ color:"var(--periwinkle)" , marginTop: 0, lineHeight: 1.6 }}>Each new account gets one free pack. Upgrade to Pro to unlock all template categories.</div>
        </div>
      </div>
    </div>
  );

  if (confirming && selected) return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card modal-card--small" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Confirm Your Choice</div>
          <div className="modal-copy" style={{ marginTop: 10, marginBottom: 6, lineHeight: 1.6 }}>
            You are about to redeem your one free pack:
          </div>
          <div className="modal-feature-title" style={{ marginBottom: 28, color: "var(--cloud)", textTransform: "uppercase" }}>{selected} Pack</div>
        </div>
        <div className="modal-footer modal-action-row">
          <button onClick={() => setConfirming(false)} className="modal-button modal-button--secondary">go back</button>
          <button onClick={() => onRedeem(selected)} className="modal-button modal-button--danger">redeem this pack</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card modal-card--large" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <button onClick={onClose} className="modal-close modal-close--pro">✕</button>
          <div className="modal-tagline">new account perk</div>
          <div className="modal-title">Redeem a free<br />template pack</div>
          <div className="modal-copy">One pack per account. Choose wisely.</div>
        </div>

        <div className="modal-body">
          <div className="redeem-grid">
            {PRO_CATEGORIES.map(cat => {
              const pack = PACK_DETAILS[cat];
              const isSelected = selected === cat;
              return (
                <div key={cat}
                  className={isSelected ? "redeem-card selected" : "redeem-card"}
                  onClick={() => setSelected(cat)}>
                  <div className="redeem-card-bottom">
                    <div>
                      <div className="redeem-card-title">{cat}</div>
                      <div className="redeem-card-desc">{pack.desc}</div>
                    </div>
                    {isSelected && (
                      <div className="redeem-card-check">
                        <span style={{ color: "var(--cloud)", fontSize: 9, lineHeight: 1 }}>✓</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="modal-action-row">
            <button
              onClick={() => { if (selected) setConfirming(true); }}
              className={selected ? "modal-button modal-button--primary" : "modal-button modal-button--disabled"}
              disabled={!selected}
            >
              {selected ? `redeem ${selected} pack` : "select a pack above"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
