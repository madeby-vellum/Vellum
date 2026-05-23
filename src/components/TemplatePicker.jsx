import { useState } from "react";
import { TEMPLATES, PRO_CATEGORIES } from "../constants.js";
import "./TemplatePicker.css";

// Component for picking a template when creating a new project
export default function TemplatePicker({ userTier, onToggleTier, onSelect, onClose, onShowUpgrade, unlockedCategory }) {
  const freeTmpl = TEMPLATES.filter(t => t.tier === "free");
  const [activeTab,      setActiveTab]      = useState("free");
  const [activeCategory, setActiveCategory] = useState(PRO_CATEGORIES[0]);
  const categoryTmpl     = TEMPLATES.filter(t => t.tier === "pro" && t.category === activeCategory);
  const categoryUnlocked = userTier === "pro" || activeCategory === unlockedCategory;

  return (
    <div onClick={onClose} className="tmpl-backdrop">
      <div onClick={e => e.stopPropagation()} className="tmpl-card fu">

        {/* Template Picker Header */}
        <div className="tmpl-header">
          <h2 className="tmpl-title">Choose a Template</h2>
          <div className="tmpl-header-actions">
            {/* Demo Toggle Button */}
            <button onClick={onToggleTier} className="tmpl-demo-btn">
              demo: {userTier === "free" ? "switch to pro ↑" : "switch to free ↓"}
            </button>
            <button onClick={onClose} className="tmpl-close-btn">✕</button>
          </div>
        </div>

        {/* Template Tabs */}
        <div className="tmpl-tabs">
          <button onClick={() => setActiveTab("free")} className={`tmpl-tab${activeTab === "free" ? " active" : ""}`}>Free</button>
          <button onClick={() => setActiveTab("pro")}  className={`tmpl-tab${activeTab === "pro"  ? " active" : ""}`}>
            Pro {userTier === "free" && <span className="tmpl-tab-pro-arrow">↑</span>}
          </button>
        </div>

        {/* Template Grid */}
        {activeTab === "free" && (
          <div className="tmpl-grid">
            {freeTmpl.map(t => (
              <div key={t.id} onClick={() => onSelect(t)} className="template-card">
                <div
                  className="tmpl-thumb"
                  style={{
                    backgroundImage:    t.path ? `url(${t.path})` : undefined,
                    backgroundColor:    t.bg || "#f6f7fb",
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Pro Templates */}
        {activeTab === "pro" && <>
          {userTier === "free" && (
            <div className="tmpl-upgrade-row">
              <span onClick={onShowUpgrade} className="tmpl-upgrade-btn">upgrade to unlock ↑</span>
            </div>
          )}

          {/* Category Buttons */}
          <div className="tmpl-categories">
            {PRO_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`tmpl-cat-btn${activeCategory === cat ? " active" : ""}`}
              >
                {cat}
                {cat === unlockedCategory && userTier === "free" && (
                  <span className="tmpl-cat-check">✓</span>
                )}
              </button>
            ))}
          </div>

            {/* Template Grid */}
          <div className="tmpl-grid">
            {categoryTmpl.map(t => (
              <div
                key={t.id}
                onClick={() => { if (categoryUnlocked) onSelect(t); }}
                className={`template-card${categoryUnlocked ? "" : " locked"}`}
              >
                <div
                  className="tmpl-thumb"
                  style={{
                    backgroundImage: t.path ? `url(${t.path})` : undefined,
                    backgroundColor: t.bg || "#f6f7fb",
                  }}
                />
                <div
                  className="tmpl-label"
                  style={{ color: t.labelColor || "var(--periwinkle)" }}
                >
                  {t.label}
                </div>
                {!categoryUnlocked && <div className="tmpl-lock-icon">🔒</div>}
              </div>
            ))}
          </div>
        </>}

      </div>
    </div>
  );
}