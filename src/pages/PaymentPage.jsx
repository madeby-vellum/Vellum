import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { upgradeToPro } from "../lib/tier";
import { AuthContext } from "../context/AuthContext";
import "./PaymentPage.css";

export default function PaymentPage() {

  // Router navigation hook
  const navigate = useNavigate();

  // Auth context (current user + profile refresh function)
  const { user, refreshProfile } = useContext(AuthContext);

  // Loading state for payment submission
  const [loading, setLoading] = useState(false);

  // Error state for failed upgrade attempts
  const [error, setError] = useState(null);

  // Confirmation modal state after successful upgrade
  const [confirmed, setConfirmed] = useState(false);

  // Autofilled email from logged-in user profile
  const email = user?.email ?? "";

  // Payment form states (mock card data fields)
  const [cardName, setCardName] = useState("John Doe");
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("12/27");
  const [cvv, setCvv] = useState("123");

  // Handles upgrade submission (calls backend upgrade function)
  const handleConfirm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Attempt to upgrade user tier to Pro
    const { error: upgradeError } = await upgradeToPro();

    // If upgrade fails, show error and stop loading
    if (upgradeError) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    // Refresh user profile after upgrade
    await refreshProfile();

    setLoading(false);

    // Show success modal
    setConfirmed(true);
  };

  // Redirect user to journal shelf after success
  const handleProceed = () => {
    navigate("/shelf");
  };

  return (
    <div className="pay-root">

      {/* Background decorative blobs */}
      <div className="pay-bg-blob pay-bg-blob--1" />
      <div className="pay-bg-blob pay-bg-blob--2" />

      <div className="pay-container">

        {/* Left panel: plan summary */}
        <div className="pay-summary">

          {/* Logo (click navigates home) */}
          <div className="pay-logo" onClick={() => navigate("/")}>
            <img src="/logo/white-logo.png" alt="Vellum" className="pay-logo" />
          </div>

          {/* Plan badge */}
          <div className="pay-plan-badge">✦ Vellum Pro</div>

          {/* Price display */}
          <div className="pay-plan-price">
            10 AED<span>/month</span>
          </div>

          {/* Trial info */}
          <div className="pay-plan-trial">Includes 14-day free trial</div>

          {/* Feature list */}
          <ul className="pay-plan-features">
            <li><span className="pay-check">✓</span> Unlimited journals</li>
            <li><span className="pay-check">✓</span> All pro templates</li>
            <li><span className="pay-check">✓</span> Priority support</li>
            <li><span className="pay-check">✓</span> Cancel anytime</li>
          </ul>

          {/* Security note */}
          <div className="pay-secure">
            <span className="pay-lock">🔒</span>
            Secured by Stripe · 256-bit SSL
          </div>
        </div>

        {/* Right panel: payment form */}
        <div className="pay-form-card">

          {/* Form header */}
          <div className="pay-form-header">
            <div className="pay-form-title">Payment details</div>
            <div className="pay-form-subtitle">
              Your card will not be charged during the 14-day trial.
            </div>
          </div>

          <form className="pay-form" onSubmit={handleConfirm}>

            {/* Email (readonly from auth) */}
            <div className="pay-field">
              <label className="pay-label">Email</label>
              <input
                className="pay-input pay-input--readonly"
                value={email}
                readOnly
                tabIndex={-1}
              />
            </div>

            {/* Name on card */}
            <div className="pay-field">
              <label className="pay-label">Name on card</label>
              <input
                className="pay-input"
                value={cardName}
                onChange={e => setCardName(e.target.value)}
                required
              />
            </div>

            {/* Card number input */}
            <div className="pay-field">
              <label className="pay-label">Card number</label>
              <div className="pay-input-icon-wrap">
                <input
                  className="pay-input pay-input--card"
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value)}
                  maxLength={19}
                  required
                />

                {/* Card brand icon placeholder */}
                <span className="pay-card-icons">
                  <span className="pay-card-icon pay-card-icon--visa">VISA</span>
                </span>
              </div>
            </div>

            {/* Expiry + CVV row */}
            <div className="pay-row">

              {/* Expiry date */}
              <div className="pay-field">
                <label className="pay-label">Expiry</label>
                <input
                  className="pay-input"
                  value={expiry}
                  onChange={e => setExpiry(e.target.value)}
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                />
              </div>

              {/* CVV */}
              <div className="pay-field">
                <label className="pay-label">CVV</label>
                <input
                  className="pay-input"
                  value={cvv}
                  onChange={e => setCvv(e.target.value)}
                  maxLength={4}
                  required
                />
              </div>
            </div>

            {/* Error message */}
            {error && <div className="pay-error">{error}</div>}

            {/* Submit button */}
            <button
              type="submit"
              className="pay-submit"
              disabled={loading}
            >
              {loading ? "Processing…" : "Upgrade →"}
            </button>

            {/* Terms text */}
            <div className="pay-terms">
              By confirming, you agree to our <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>.
              <br />No charge until your trial ends. Cancel any time.
            </div>

          </form>
        </div>
      </div>

      {/* Success confirmation modal */}
      {confirmed && (
        <div className="pay-modal-backdrop">
          <div className="pay-modal">

            {/* Success icon */}
            <div className="pay-modal-star">✦</div>

            {/* Title */}
            <div className="pay-modal-title">You're now on Pro!</div>

            {/* Description */}
            <div className="pay-modal-body">
              Welcome to Vellum Pro. You now have unlimited journals and access
              to all premium templates. Your 14-day free trial has started.
            </div>

            {/* Redirect button */}
            <button className="pay-modal-btn" onClick={handleProceed}>
              Go to my shelf →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}