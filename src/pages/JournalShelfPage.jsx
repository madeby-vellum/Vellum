import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { getJournals } from "../lib/journals";
import Modal from "../components/Modal.jsx";
import Field from "../components/Field.jsx";
import Pill from "../components/Pill.jsx";
import { PRESET_COVERS, getCoverStyle, uid, now } from "../constants.js";
import { HelpModal, HelpButton } from "../components/HelpModal.jsx";
import "./JournalShelfPage.css";

export default function JournalShelfPage({
  user,
  journals,
  setJournals,
  activeJournal,
  setActiveJournal,
  showNewJournal,
  setShowNewJournal,
  journalForm,
  setJournalForm,
  onOpenJournal,
  onSignOut,
  onDeleteAccount,
  menuOpen,
  setMenuOpen,
  renaming,
  setRenaming,
  confirmDelete,
  setConfirmDelete,
  onShowUpgrade,
  userTier,
  onShowRedeem,
  redeemUsed
}) {

  // Ref for file input (image upload for cover)
  const coverImgRef = useRef(null);

  // UI state for user dropdown menu
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Account deletion confirmation modal state
  const [confirmDeleteAcct, setConfirmDeleteAcct] = useState(false);

  // Help modal visibility state
  const [showHelp, setShowHelp] = useState(false);

  // Unsplash image picker modal state
  const [showUnsplash, setShowUnsplash] = useState(false);

  // Close user menu when clicking outside
  useEffect(() => {
    if (!userMenuOpen) return;
    const close = () => setUserMenuOpen(false);
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, [userMenuOpen]);

  // Create a new journal in Supabase + update local state
  const createJournal = async () => {
    if (!journalForm.title.trim()) return;
    if (userTier === "free" && journals.length >= 3) return;

    const { data, error } = await supabase
      .from("journals")
      .insert([{
        user_id: user.id,
        name: journalForm.title,
        cover_type: journalForm.coverType,
        cover_id: journalForm.coverId,
        cover_image: journalForm.coverImg || null,
      }])
      .select()
      .single();

    if (error) {
      console.error("CREATE JOURNAL ERROR:", error);
      return;
    }

    // Add new journal to local state
    setJournals(prev => [
      ...prev,
      {
        ...data,
        title: data.name,
        coverId: data.cover_id,
        coverType: data.cover_type,
        coverImg: data.cover_image,
        created: new Date(data.created_at).toLocaleDateString(),
        spreads: []
      }
    ]);

    setShowNewJournal(false);
  };

  // Rename a journal (DB + local state)
  const renameJournal = async (id, title) => {
    if (!title.trim()) return;

    const { error } = await supabase
      .from("journals")
      .update({ name: title })
      .eq("id", id);

    if (error) {
      console.error("RENAME JOURNAL ERROR:", error);
      return;
    }

    setJournals(prev => prev.map(j => j.id === id ? { ...j, title } : j));
  };

  // Delete a journal (DB + local state)
  const deleteJournal = async (id) => {
    const { error } = await supabase
      .from("journals")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("DELETE JOURNAL ERROR:", error);
      return;
    }

    setJournals(prev => prev.filter(j => j.id !== id));
  };

  // First letter avatar for user button
  const initial = (user?.name || user?.email || "?")[0].toUpperCase();

  // Unsplash image picker component (nested modal)
  function UnsplashCoverPopup({ onClose, onSelect }) {

    // Search query for images
    const [query, setQuery] = useState("nature");

    // List of fetched images
    const [images, setImages] = useState([]);

    // Loading state for API requests
    const [loading, setLoading] = useState(false);

    // Input ref for auto-focus
    const inputRef = useRef(null);

    // Unsplash API key from env
    const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

    // Search images from Unsplash API
    const search = async (q) => {
      if (!q.trim()) return;
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=16&orientation=portrait`,
          { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` } }
        );
        const data = await res.json();
        setImages(data.results || []);
      } catch {
        setImages([]);
      }
      setLoading(false);
    };

    // Initial load effect
    useEffect(() => {
      search("nature");
      inputRef.current?.focus();
    }, []);

    return (
      <div className="unsplash-overlay" onClick={onClose}>
        <div className="unsplash-box" onClick={e => e.stopPropagation()}>

          {/* Header section with search */}
          <div className="unsplash-header">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="unsplash-search-icon">
              <circle cx="6" cy="6" r="4.2" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M9.5 9.5l2.8 2.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>

            {/* Search input */}
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") search(query); }}
              placeholder="Search photos…"
              className="unsplash-input"
            />

            {/* Trigger search */}
            <button onClick={() => search(query)} className="unsplash-search-btn">
              Search
            </button>

            {/* Close modal */}
            <button onClick={onClose} className="unsplash-close-btn">✕</button>
          </div>

          {/* Image grid / loading state */}
          <div className="unsplash-body">
            {loading ? (
              <div className="unsplash-loading">Loading…</div>
            ) : (
              <div className="unsplash-grid">
                {images.map(img => (
                  <div key={img.id} className="unsplash-img-cell" onClick={() => onSelect(img)}>
                    <img src={img.urls.small} alt="" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer attribution */}
          <div className="unsplash-footer">Photos by Unsplash</div>
        </div>
      </div>
    );
  }

  return (
    <div className="shelf-page">

      {/* Top navigation bar */}
      <nav className="shelf-nav">
        <div className="shelf-nav-left">
          <a href="/" className="navbar-logo">
            <img src="/logo/blue-logo.png" alt="Vellum" className="shelf-nav-logo" />
          </a>
        </div>

        {/* Right side actions */}
        <div className="shelf-nav-right">

          {/* Upgrade / pro badge */}
          {userTier !== "pro"
            ? <button onClick={onShowUpgrade} className="shelf-upgrade-btn">
                ✦ upgrade to pro
              </button>
            : <div className="shelf-pro-badge">
                <span className="shelf-pro-badge-star">✦</span> pro
              </div>
          }

          {/* User avatar menu */}
          <div className="shelf-user-menu-wrapper" onMouseDown={e => e.stopPropagation()}>
            <button
              onClick={() => setUserMenuOpen(o => !o)}
              className="shelf-avatar-btn"
              title={user?.name}
            >
              {initial}
            </button>

            {/* Dropdown menu */}
            {userMenuOpen && (
              <div className="shelf-user-dropdown">

                {/* User info */}
                <div className="shelf-user-dropdown-header">
                  <div className="shelf-user-dropdown-name">{user?.name}</div>
                  <div className="shelf-user-dropdown-email">{user?.email}</div>
                </div>

                {/* Redeem option */}
                <button
                  onClick={() => { setUserMenuOpen(false); onShowRedeem(); }}
                  className={`shelf-menu-btn${redeemUsed ? " shelf-menu-btn--muted" : ""}`}
                >
                  <span>Redeem free pack</span>
                  {redeemUsed
                    ? <span className="shelf-redeem-badge shelf-redeem-badge--used">used</span>
                    : <span className="shelf-redeem-badge shelf-redeem-badge--available">1 left</span>
                  }
                </button>

                {/* Sign out */}
                <button
                  onClick={() => { setUserMenuOpen(false); onSignOut(); }}
                  className="shelf-menu-btn"
                >
                  Sign out
                </button>

                {/* Delete account */}
                <button
                  onClick={() => { setUserMenuOpen(false); setConfirmDeleteAcct(true); }}
                  className="shelf-menu-btn shelf-menu-btn--no-border shelf-menu-btn--danger"
                >
                  Delete account
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main content area */}
      <div className="shelf-content">

        {/* Header section */}
        <div className="fu shelf-header">
          <div>
            <div className="shelf-header-title">Your Journals</div>
            <div className="shelf-header-count">
              {journals.length} journal{journals.length !== 1 ? "s" : ""}

              {/* Free tier limit indicator */}
              {userTier === "free" && (
                <span className={`shelf-header-count-limit ${journals.length >= 3 ? "shelf-header-count-limit--warn" : "shelf-header-count-limit--ok"}`}>
                  · {journals.length}/3 free
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="shelf-header-actions">
            <HelpButton onOpen={() => setShowHelp(true)} />
            <Pill dark onClick={() => {
              if (userTier === "free" && journals.length >= 3) { onShowUpgrade(); }
              else { setShowNewJournal(true); }
            }}>+ new journal</Pill>
          </div>
        </div>

        {/* Empty state or journal grid */}
        {journals.length === 0
          ? <div className="fu shelf-empty">
              <div className="shelf-empty-text">No journals yet — create your first one</div>
            </div>
          : <div className="shelf-grid">
              {journals.map((j, i) => (
                <div key={j.id} className="fu" style={{ animationDelay: `${i * 0.06}s` }}>

                  {/* Journal cover */}
                  <div
                    className="shelf-journal-cover"
                    style={getCoverStyle(j)}
                    onClick={() => onOpenJournal(j)}
                  />

                  {/* Journal metadata */}
                  <div className="shelf-journal-meta">
                    <div className="shelf-journal-title-btn" onClick={() => onOpenJournal(j)}>
                      <div className="shelf-journal-title">{j.title}</div>
                    </div>

                    {/* Context menu */}
                    <div className="shelf-context-menu-wrapper">
                      <button
                        onClick={e => { e.stopPropagation(); setMenuOpen(menuOpen === j.id ? null : j.id); }}
                        className="shelf-context-menu-trigger"
                      >···</button>

                      {menuOpen === j.id && (
                        <div onClick={e => e.stopPropagation()} className="fu shelf-context-menu">
                          <button
                            onClick={() => { setRenaming({ id: j.id, title: j.title }); setMenuOpen(null); }}
                            className="shelf-context-menu-btn"
                          >rename</button>
                          <button
                            onClick={() => { setConfirmDelete(j); setMenuOpen(null); }}
                            className="shelf-context-menu-btn shelf-context-menu-btn--no-border shelf-context-menu-btn--danger"
                          >delete</button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer info */}
                  <div className="shelf-journal-footer">
                    <div className="shelf-journal-spreads">{j.spreads.length} spreads</div>
                    <div className="shelf-journal-date">{j.created}</div>
                  </div>
                </div>
              ))}
            </div>
        }
      </div>

      {/* Rename modal */}
      {renaming && (
        <Modal title="Rename Journal" onClose={() => setRenaming(null)}>
          <Field
            label="Title"
            value={renaming.title}
            autoFocus
            onChange={e => setRenaming(r => ({ ...r, title: e.target.value }))}
            onKeyDown={e => {
              if (e.key === "Enter") {
                renameJournal(renaming.id, renaming.title);
                setRenaming(null);
              }
            }}
          />

          <div className="shelf-modal-actions">
            <button type="button" onClick={() => setRenaming(null)} className="shelf-modal-cancel">cancel</button>
            <button type="button" onClick={() => { renameJournal(renaming.id, renaming.title); setRenaming(null); }} className="shelf-modal-save">save</button>
          </div>
        </Modal>
      )}

      {/* Delete journal modal */}
      {confirmDelete && (
        <Modal title="Delete Journal" onClose={() => setConfirmDelete(null)}>
          <p className="shelf-modal-body">
            Are you sure you want to delete <strong>{confirmDelete.title}</strong>?
          </p>
          <p className="shelf-modal-warning">
            This will permanently remove all {confirmDelete.spreads.length} spread{confirmDelete.spreads.length !== 1 ? "s" : ""} inside it.
          </p>

          <div className="shelf-modal-actions">
            <button type="button" onClick={() => setConfirmDelete(null)} className="shelf-modal-cancel">cancel</button>
            <button type="button" onClick={() => { deleteJournal(confirmDelete.id); setConfirmDelete(null); }} className="shelf-modal-delete">delete</button>
          </div>
        </Modal>
      )}

      {/* New journal modal */}
      {showNewJournal && (
        <Modal title="New Journal" onClose={() => setShowNewJournal(false)} wide>
          <form onSubmit={e => { e.preventDefault(); createJournal(); }}>

            {/* Title input */}
            <Field
              label="Title"
              placeholder="My 2026 Journal"
              value={journalForm.title}
              onChange={e => setJournalForm(f => ({ ...f, title: e.target.value }))}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  createJournal();
                }
              }}
            />

            {/* Cover selection section */}
            <div className="shelf-modal-section">
              <label className="cover-label">Cover</label>

              {/* Cover type tabs */}
              <div className="cover-type-tabs">
                {["preset", "image", "unsplash"].map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setJournalForm(f => ({ ...f, coverType: t }))}
                    className={`cover-type-btn${journalForm.coverType === t ? " cover-type-btn--active" : ""}`}
                  >
                    {t === "preset" ? "Preset Covers" : t === "image" ? "Upload Image" : "Search Image"}
                  </button>
                ))}
              </div>

              {/* Preset covers grid */}
              {journalForm.coverType === "preset" && (
                <div className="cover-preset-grid">
                  {PRESET_COVERS.map(c => (
                    <div
                      key={c.id}
                      onClick={() => setJournalForm(f => ({ ...f, coverId: c.id }))}
                      className="cover-preset-swatch"
                      style={{
                        ...c.style,
                        outline: journalForm.coverId === c.id ? "2px solid var(--periwinkle)" : "2px solid transparent",
                        outlineOffset: 2
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Image upload */}
              {journalForm.coverType === "image" && (
                <div>

                  {/* Upload drop zone */}
                  <div className="cover-upload-zone" onClick={() => coverImgRef.current.click()}>
                    {journalForm.coverImg
                      ? <img src={journalForm.coverImg} alt="Cover preview" />
                      : <span className="cover-upload-hint">click to upload cover image</span>
                    }
                  </div>

                  {/* Hidden file input */}
                  <input
                    ref={coverImgRef}
                    type="file"
                    accept="image/*"
                    className="cover-file-input"
                    onChange={e => {
                      const f = e.target.files[0];
                      if (!f) return;

                      const r = new FileReader();
                      r.onload = ev => setJournalForm(f => ({ ...f, coverImg: ev.target.result }));
                      r.readAsDataURL(f);
                    }}
                  />
                </div>
              )}

              {/* Unsplash option */}
              {journalForm.coverType === "unsplash" && (
                <div className="cover-unsplash-zone" onClick={() => setShowUnsplash(true)}>
                  {journalForm.coverImg
                    ? <img src={journalForm.coverImg} alt="Cover preview" />
                    : <span className="cover-upload-hint">search for a cover image</span>
                  }
                </div>
              )}
            </div>

            {/* Modal actions */}
            <div className="shelf-modal-actions">
              <button type="button" onClick={() => setShowNewJournal(false)} className="shelf-modal-cancel">cancel</button>
              <button type="submit" className="shelf-modal-save">create journal</button>
            </div>

          </form>
        </Modal>
      )}

      {/* Delete account modal */}
      {confirmDeleteAcct && (
        <Modal title="Delete Account" onClose={() => setConfirmDeleteAcct(false)}>
          <p className="shelf-modal-body">Are you sure you want to delete your account?</p>
          <p className="shelf-modal-warning">
            This will permanently remove your account and all {journals.length} journal{journals.length !== 1 ? "s" : ""} inside it. This cannot be undone.
          </p>

          <div className="shelf-modal-actions">
            <button type="button" onClick={() => setConfirmDeleteAcct(false)} className="shelf-modal-cancel">cancel</button>
            <button type="button" onClick={() => { setConfirmDeleteAcct(false); onDeleteAccount(); }} className="shelf-modal-delete shelf-modal-delete--danger">delete account</button>
          </div>
        </Modal>
      )}

      {/* Help modal */}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} initialTab={0} />}

      {/* Unsplash modal */}
      {showUnsplash && (
        <UnsplashCoverPopup
          onClose={() => setShowUnsplash(false)}
          onSelect={(img) => {
            setJournalForm(f => ({
              ...f,
              coverType: "unsplash",
              coverId: img.id,
              coverImg: img.urls.small
            }));
            setShowUnsplash(false);
          }}
        />
      )}
    </div>
  );
}