import { Pencil, Trash2, Plus } from "lucide-react"; // icons used for edit, delete, add actions

import { useState, useEffect } from "react"; // React hooks for state + lifecycle
import { Navigate, useParams } from "react-router-dom"; // routing + dynamic URL params
import SpreadCanvas from "../components/SpreadCanvas.jsx"; // canvas renderer for journal spreads
import TemplatePicker from "../components/TemplatePicker.jsx"; // UI for selecting templates
import Modal from "../components/Modal.jsx"; // generic confirmation modal
import { HelpModal, HelpButton } from "../components/HelpModal.jsx"; // help UI components
import { getCoverStyle, uid, now, TEMPLATES } from "../constants.js"; // utility functions + template list
import { supabase } from "../lib/supabase"; // backend client
import { deleteSpread as deleteSpreadDB } from "../lib/spreads"; // API call to delete spread
import "./JournalPage.css"; // page styles

export default function JournalPage({
  journals, setJournals, activeJournal, setActiveJournal, setActiveSpread, setJournalPage, navigate,
  journalPage,
  showTemplatePicker, setShowTemplatePicker,
  userTier, onToggleTier,
  confirmSpread, setConfirmSpread,
  renamingSpread, setRenamingSpread,
  onGoHome, onEditSpread, onShowUpgrade, unlockedCategory,
}) {
  const { journalId } = useParams(); // extract journal id from route
  const journal = journals.find(j => j.id === journalId); // locate active journal

  // redirect if journal doesn't exist
  if (!journal) return <Navigate to="/shelf" replace />;

  const pages = journal.spreads; // all spreads in journal
  const total = 1 + pages.length; // +1 for cover page
  const isCover = journalPage === 0; // whether current page is cover
  const spread = isCover ? null : pages[journalPage - 1]; // current spread if not cover

  const [showHelp, setShowHelp] = useState(false); // help modal toggle

  // navigation helpers (page flipping)
  const goLeft  = () => setJournalPage(p => Math.max(0, p - 1));
  const goRight = () => setJournalPage(p => Math.min(total - 1, p + 1));

  // keyboard navigation for spreads
  useEffect(() => {
    const handler = e => {
      if (e.key==="ArrowRight"||e.key==="ArrowDown") setJournalPage(p=>Math.min(total-1,p+1));
      if (e.key==="ArrowLeft" ||e.key==="ArrowUp")   setJournalPage(p=>Math.max(0,p-1));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [total]);

  // create a new spread using a selected template
  const createSpread = async (template) => {
    const tmpl = template || TEMPLATES[0]; // fallback template

    // get current authenticated user
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    // new spread object to insert into DB
    const newSpread = {
      journal_id: activeJournal.id,
      user_id: user.id,
      name: `Spread ${activeJournal.spreads.length + 1}`,
      template_id: tmpl.id,
      template_class: tmpl.tier || "free",
      template_image: tmpl.path,
      canvas: null
    };

    // insert spread into database
    const { data, error } = await supabase
      .from("spreads")
      .insert(newSpread)
      .select()
      .single();

    if (error) {
      console.error("INSERT ERROR:", error.message, error.details);
      return;
    }

    // update local journal state with new spread
    const updated = {
      ...activeJournal,
      spreads: [...activeJournal.spreads, data]
    };

    setJournals(p => p.map(j => j.id === activeJournal.id ? updated : j));
    setActiveJournal(updated);
    setActiveSpread(data);
    setJournalPage(updated.spreads.length);
    setShowTemplatePicker(false);

    // navigate to new spread route
    navigate(`/shelf/journal/${activeJournal.id}/spread/${data.id}`);
  };

  // delete a spread (DB + local state sync)
  const deleteSpread = async (id) => {
    try {
      await deleteSpreadDB(id); // remove from backend

      const updated = {
        ...activeJournal,
        spreads: activeJournal.spreads.filter(s => s.id !== id)
      };

      setJournals(p => p.map(j => j.id === activeJournal.id ? updated : j));
      setActiveJournal(updated);

      // ensure page index stays valid after deletion
      setJournalPage(p => Math.min(p, updated.spreads.length));

    } catch (err) {
      console.error("DELETE SPREAD ERROR:", err);
    }
  };

  // reusable nav button renderer
  const navBtn = (label, onClick, disabled) => (
    <button onClick={onClick} disabled={disabled} className="journal-nav-btn">
      {label}
    </button>
  );

  return (
    <div className="journal-page">

      {/* top navigation bar */}
      <nav className="nav-bar journal-nav">
        <div className="journal-nav-left">
          <button
            onClick={onGoHome}
            className="journal-back-btn"
            title="Back to home"
          >
            ← Shelf
          </button>
          <span className="journal-nav-separator">/</span>
          <span className="journal-nav-title">{journal.title}</span>
        </div>
        <HelpButton onOpen={() => setShowHelp(true)} />
      </nav>

      <div className="journal-content">

        {/* COVER PAGE */}
        {isCover && (
          <div key="cover" className="fi journal-cover-wrapper">
            <div
              className="journal-cover-book"
              style={getCoverStyle(journal)} // dynamic styling per journal
            >
              <div className="journal-cover-info">
                <div className="journal-cover-title">{journal.title}</div>
                <div className="journal-cover-date">{journal.created}</div>
              </div>
            </div>
          </div>
        )}

        {/* SPREAD VIEW */}
        {!isCover && spread && (
          <div key={spread.id} className="fi journal-spread-wrapper">
            <div
              className="journal-spread-canvas"
              onClick={() => onEditSpread(spread)} // open editor
            >
              {/* read-only preview canvas */}
              <SpreadCanvas spread={spread} editMode={false} actionsRef={{ current: null }} />
            </div>

            {/* spread metadata */}
            <div className="journal-spread-meta">

              {/* rename mode */}
              {renamingSpread?.id === spread.id
                ? <input
                    autoFocus
                    value={renamingSpread.title}
                    onChange={e => setRenamingSpread(r => ({ ...r, title: e.target.value }))}
                    onBlur={() => { renameSpread(renamingSpread.id, renamingSpread.title); setRenamingSpread(null); }}
                    onKeyDown={e => {
                      if (e.key === "Enter") { renameSpread(renamingSpread.id, renamingSpread.title); setRenamingSpread(null); }
                      if (e.key === "Escape") setRenamingSpread(null);
                    }}
                    className="journal-spread-name-input"
                  />
                : <span
                    onClick={() => setRenamingSpread({ id: spread.id, title: spread.title })}
                    title="Click to rename"
                    className="journal-spread-name"
                  >
                    {spread.title}
                  </span>
              }

              <span className="journal-spread-date">{spread.date}</span>
            </div>
          </div>
        )}
      </div>

      {/* bottom controls */}
      <div className="journal-controls">
        {navBtn("←", goLeft, journalPage === 0)}

        {!isCover && spread && (
          <button onClick={() => onEditSpread(spread)} title="Edit spread" className="pill pill-light journal-icon-btn">
            <Pencil size={14} />
          </button>
        )}

        {!isCover && spread && (
          <button onClick={() => setConfirmSpread(spread)} title="Delete spread" className="pill pill-light journal-icon-btn">
            <Trash2 size={14} />
          </button>
        )}

        <button onClick={() => setShowTemplatePicker(true)} title="Add spread" className="pill pill-light journal-icon-btn">
          <Plus size={14} />
        </button>

        {navBtn("→", goRight, journalPage === total - 1)}
      </div>

      {/* DELETE CONFIRM MODAL */}
      {confirmSpread && (
        <Modal title="Delete Spread" onClose={() => setConfirmSpread(null)}>
          <p className="journal-modal-body">
            Are you sure you want to delete <strong>{confirmSpread.title}</strong>?
          </p>
          <p className="journal-modal-warning">
            All drawings and content on this spread will be lost.
          </p>
          <div className="journal-modal-actions">
            <button onClick={() => setConfirmSpread(null)} className="journal-modal-cancel">
              cancel
            </button>
            <button onClick={() => { deleteSpread(confirmSpread.id); setConfirmSpread(null); }} className="journal-modal-delete">
              delete
            </button>
          </div>
        </Modal>
      )}

      {/* TEMPLATE PICKER */}
      {showTemplatePicker && (
        <TemplatePicker
          userTier={userTier}
          onToggleTier={onToggleTier}
          onSelect={createSpread}
          onClose={() => setShowTemplatePicker(false)}
          onShowUpgrade={onShowUpgrade}
          unlockedCategory={unlockedCategory}
        />
      )}

      {/* HELP MODAL */}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} initialTab={1} />}
    </div>
  );
}