// React hook for local component state
import { useState } from "react";

// Template data and available Pro categories
import { TEMPLATES, PRO_CATEGORIES } from "../constants.js";

// Component styling
import "./TemplatePicker.css";

/*
  TemplatePicker Modal

  Lets the user:
  - Browse free templates
  - Browse Pro template categories
  - Select a template
  - Open the upgrade modal
  - Switch between demo Free/Pro modes
*/
export default function TemplatePicker({
  userTier,
  onToggleTier,
  onSelect,
  onClose,
  onShowUpgrade,
  unlockedCategory
}) {

  // Get all free templates
  const freeTmpl = TEMPLATES.filter(t => t.tier === "free");

  // Current tab (free/pro)
  const [activeTab, setActiveTab] = useState("free");

  // Currently selected Pro category
  const [activeCategory, setActiveCategory] = useState(PRO_CATEGORIES[0]);

  // Templates inside the selected Pro category
  const categoryTmpl = TEMPLATES.filter(
    t => t.tier === "pro" && t.category === activeCategory
  );

  // Category is usable if:
  // - user is Pro
  // OR
  // - this category was unlocked through redeeming
  const categoryUnlocked =
    userTier === "pro" || activeCategory === unlockedCategory;

  return (

    // Backdrop closes modal when clicked
    <div onClick={onClose} className="tmpl-backdrop">

      {/* Stop clicks inside modal from closing it */}
      <div onClick={e => e.stopPropagation()} className="tmpl-card fu">

        {/* Header */}
        <div className="tmpl-header">

          <h2 className="tmpl-title">Choose a Template</h2>

          <div className="tmpl-header-actions">

            {/* Demo button for switching account tier */}
            <button onClick={onToggleTier} className="tmpl-demo-btn">
              demo: {userTier === "free"
                ? "switch to pro ↑"
                : "switch to free ↓"}
            </button>

            {/* Close modal */}
            <button onClick={onClose} className="tmpl-close-btn">
              ✕
            </button>

          </div>
        </div>

        {/* Free / Pro tabs */}
        <div className="tmpl-tabs">

          {/* Free tab */}
          <button
            onClick={() => setActiveTab("free")}
            className={`tmpl-tab${activeTab === "free" ? " active" : ""}`}
          >
            Free
          </button>

          {/* Pro tab */}
          <button
            onClick={() => setActiveTab("pro")}
            className={`tmpl-tab${activeTab === "pro" ? " active" : ""}`}
          >
            Pro

            {/* Show upgrade arrow for free users */}
            {userTier === "free" && (
              <span className="tmpl-tab-pro-arrow">↑</span>
            )}
          </button>

        </div>

        {/* ================= FREE TAB ================= */}
        {activeTab === "free" && (

          <div className="tmpl-grid">

            {/* Render free templates */}
            {freeTmpl.map(t => (

              <div
                key={t.id}
                onClick={() => onSelect(t)}
                className="template-card"
              >

                {/* Template preview */}
                <div
                  className="tmpl-thumb"
                  style={{
                    backgroundImage: t.path
                      ? `url(${t.path})`
                      : undefined,

                    backgroundColor: t.bg || "#f6f7fb",
                  }}
                />

              </div>

            ))}
          </div>
        )}

        {/* ================= PRO TAB ================= */}
        {activeTab === "pro" && <>

          {/* Upgrade banner for free users */}
          {userTier === "free" && (
            <div className="tmpl-upgrade-row">
              <span
                onClick={onShowUpgrade}
                className="tmpl-upgrade-btn"
              >
                upgrade to unlock ↑
              </span>
            </div>
          )}

          {/* Category selector */}
          <div className="tmpl-categories">

            {PRO_CATEGORIES.map(cat => (

              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`tmpl-cat-btn${activeCategory === cat ? " active" : ""}`}
              >

                {cat}

                {/* Checkmark for redeemed category */}
                {cat === unlockedCategory && userTier === "free" && (
                  <span className="tmpl-cat-check">✓</span>
                )}

              </button>

            ))}

          </div>

          {/* Templates inside selected category */}
          <div className="tmpl-grid">

            {categoryTmpl.map(t => (

              <div
                key={t.id}

                // Only allow selection if category is unlocked
                onClick={() => {
                  if (categoryUnlocked) onSelect(t);
                }}

                className={`template-card${categoryUnlocked ? "" : " locked"}`}
              >

                {/* Template preview */}
                <div
                  className="tmpl-thumb"
                  style={{
                    backgroundImage: t.path
                      ? `url(${t.path})`
                      : undefined,

                    backgroundColor: t.bg || "#f6f7fb",
                  }}
                />

                {/* Template label */}
                <div
                  className="tmpl-label"
                  style={{
                    color: t.labelColor || "var(--periwinkle)"
                  }}
                >
                  {t.label}
                </div>

                {/* Lock icon for locked packs */}
                {!categoryUnlocked && (
                  <div className="tmpl-lock-icon">🔒</div>
                )}

              </div>

            ))}

          </div>

        </>}

      </div>
    </div>
  );
}