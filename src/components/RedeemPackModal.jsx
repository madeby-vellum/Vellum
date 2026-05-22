// Import React state hook
import { useState } from "react";

// Import Pro pack data/constants
import { PRO_CATEGORIES, PACK_DETAILS } from "../constants.js";

// Import modal styles
import "./Modal.css";

// Modal for redeeming one free template pack
export default function RedeemPackModal({
  onClose,
  onRedeem,
  redeemUsed,
  unlockedCategory
}) {

  // Currently selected category
  const [selected, setSelected] = useState(null);

  // Whether user is on confirmation screen
  const [confirming, setConfirming] = useState(false);


  /* ───────────── Already Redeemed State ───────────── */

  if (redeemUsed) return (

    <div
      className="modal-backdrop"
      onClick={onClose}
    >

      <div
        className="modal-card modal-card--small"
        onClick={e => e.stopPropagation()}
      >

        {/* Close button */}
        <button
          onClick={onClose}
          className="modal-close modal-close--light"
        >
          ✕
        </button>

        <div className="modal-header">

          {/* Modal title */}
          <div className="modal-title">
            Pack Redeemed
          </div>

          {/* Small helper text */}
          <div className="modal-copy redeem-unlocked-label">
            You've unlocked the
          </div>

          {/* Unlocked pack name */}
          <div className="modal-feature-title redeem-unlocked-pack">
            {unlockedCategory} Pack
          </div>

          {/* Additional explanation */}
          <div className="modal-copy redeem-unlocked-copy">
            Each new account gets one free pack.
            Upgrade to Pro to unlock all template categories.
          </div>
        </div>
      </div>
    </div>
  );


  /* ───────────── Confirmation State ───────────── */

  if (confirming && selected) return (

    <div
      className="modal-backdrop"
      onClick={onClose}
    >

      <div
        className="modal-card modal-card--small"
        onClick={e => e.stopPropagation()}
      >

        {/* Modal header */}
        <div className="modal-header">

          {/* Confirmation title */}
          <div className="modal-title">
            Confirm Your Choice
          </div>

          {/* Confirmation copy */}
          <div className="modal-copy redeem-confirm-copy">
            You are about to redeem your one free pack:
          </div>

          {/* Selected pack name */}
          <div className="modal-feature-title redeem-confirm-pack">
            {selected} Pack
          </div>
        </div>

        {/* Action buttons */}
        <div className="modal-footer modal-action-row">

          {/* Return to selection screen */}
          <button
            onClick={() => setConfirming(false)}
            className="modal-button--secondary"
          >
            go back
          </button>

          {/* Final redeem button */}
          <button
            onClick={() => onRedeem(selected)}
            className="modal-button--danger"
          >
            redeem this pack
          </button>
        </div>
      </div>
    </div>
  );


  /* ───────────── Main Selection Screen ───────────── */

  return (

    <div
      className="modal-backdrop"
      onClick={onClose}
    >

      <div
        className="modal-card modal-card--large"
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

          {/* Small tagline */}
          <div className="modal-tagline">
            new account perk
          </div>

          {/* Main title */}
          <div className="modal-title">
            Redeem a free<br />
            template pack
          </div>

          {/* Supporting copy */}
          <div className="modal-copy">
            One pack per account. Choose wisely.
          </div>
        </div>


        {/* ───────────── Pack Selection Grid ───────────── */}
        <div className="modal-body">

          <div className="redeem-grid">

            {PRO_CATEGORIES.map(cat => {

              // Get pack details for current category
              const pack = PACK_DETAILS[cat];

              // Check if current pack is selected
              const isSelected = selected === cat;

              return (

                <div
                  key={cat}

                  // Add selected styling
                  className={`redeem-card${isSelected ? " selected" : ""}`}

                  // Select current pack
                  onClick={() => setSelected(cat)}
                >

                  <div className="redeem-card-bottom">

                    {/* Pack info */}
                    <div>

                      <div className="redeem-card-title">
                        {cat}
                      </div>

                      <div className="redeem-card-desc">
                        {pack.desc}
                      </div>
                    </div>

                    {/* Selection checkmark */}
                    {isSelected && (
                      <div className="redeem-card-check">
                        <span>✓</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>


          {/* ───────────── Bottom Action Button ───────────── */}
          <div className="modal-action-row">

            <button

              // Open confirmation screen if selected
              onClick={() => {
                if (selected) setConfirming(true);
              }}

              // Disable button until a pack is selected
              className={`modal-button ${
                selected
                  ? "modal-button--primary"
                  : "modal-button--disabled"
              }`}

              disabled={!selected}
            >

              {/* Dynamic button text */}
              {selected
                ? `redeem ${selected} pack`
                : "select a pack above"
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}