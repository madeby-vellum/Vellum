import { Pencil, Trash2, Plus } from "lucide-react";

import { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import SpreadCanvas from "../components/SpreadCanvas.jsx";
import TemplatePicker from "../components/TemplatePicker.jsx";
import Modal from "../components/Modal.jsx";
import { HelpModal, HelpButton } from "../components/HelpModal.jsx";
import { getCoverStyle, uid, now, TEMPLATES } from "../constants.js";
import { supabase } from "../lib/supabase";
import { deleteSpread as deleteSpreadDB } from "../lib/spreads";
import "./JournalPage.css";

export default function JournalPage({
  journals, setJournals, activeJournal, setActiveJournal, setActiveSpread, setJournalPage, navigate,
  journalPage,
  showTemplatePicker, setShowTemplatePicker,
  userTier, onToggleTier,
  confirmSpread, setConfirmSpread,
  renamingSpread, setRenamingSpread,
  onGoHome, onEditSpread, onShowUpgrade, unlockedCategory,
}) {
  const { journalId } = useParams();
  const journal = journals.find(j => j.id === journalId);
  if (!journal) return <Navigate to="/shelf" replace />;
  const pages   = journal.spreads;
  const total   = 1 + pages.length;
  const isCover = journalPage === 0;
  const spread  = isCover ? null : pages[journalPage - 1];
  const [showHelp, setShowHelp] = useState(false);
  const goLeft  = () => setJournalPage(p => Math.max(0, p - 1));
  const goRight = () => setJournalPage(p => Math.min(total - 1, p + 1));

  useEffect(() => {
    const handler = e => {
      if (e.key==="ArrowRight"||e.key==="ArrowDown") setJournalPage(p=>Math.min(total-1,p+1));
      if (e.key==="ArrowLeft" ||e.key==="ArrowUp")   setJournalPage(p=>Math.max(0,p-1));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [total]);

  const createSpread = async (template) => {
    const tmpl = template || TEMPLATES[0];

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    const newSpread = {
      journal_id: activeJournal.id,
      user_id: user.id,
      name: `Spread ${activeJournal.spreads.length + 1}`,
      template_id: tmpl.id,
      template_class: tmpl.tier || "free",
      template_image: tmpl.path,
      canvas: null
    };

    const { data, error } = await supabase
      .from("spreads")
      .insert(newSpread)
      .select()
      .single();

    if (error) {
      console.error("INSERT ERROR:", error.message, error.details);
      return;
    }

    const updated = {
      ...activeJournal,
      spreads: [...activeJournal.spreads, data]
    };

    setJournals(p => p.map(j => j.id === activeJournal.id ? updated : j));
    setActiveJournal(updated);
    setActiveSpread(data);
    setJournalPage(updated.spreads.length);
    setShowTemplatePicker(false);

    navigate(`/shelf/journal/${activeJournal.id}/spread/${data.id}`);
  };

  // const renameSpread = (id, title) => {
  //   if (!title.trim()) return;
  //   const updated = { ...activeJournal, spreads:activeJournal.spreads.map(s => s.id===id ? {...s, title} : s) };
  //   setJournals(p => p.map(j => j.id===activeJournal.id ? updated : j));
  //   setActiveJournal(updated);
  // };

  const deleteSpread = async (id) => {
    try {
      await deleteSpreadDB(id);

      const updated = {
        ...activeJournal,
        spreads: activeJournal.spreads.filter(s => s.id !== id)
      };

      setJournals(p => p.map(j => j.id === activeJournal.id ? updated : j));
      setActiveJournal(updated);
      setJournalPage(p => Math.min(p, updated.spreads.length));

    } catch (err) {
      console.error("DELETE SPREAD ERROR:", err);
    }
  };

  const navBtn = (label, onClick, disabled) => (
    <button onClick={onClick} disabled={disabled} className="journal-nav-btn">
      {label}
    </button>
  );

  return (
    <div className="journal-page">
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
        {isCover && (
          <div key="cover" className="fi journal-cover-wrapper">
            <div
              className="journal-cover-book"
              style={getCoverStyle(journal)}
            >
              <div className="journal-cover-info">
                <div className="journal-cover-title">{journal.title}</div>
                <div className="journal-cover-date">{journal.created}</div>
              </div>
            </div>
          </div>
        )}

        {!isCover && spread && (
          <div key={spread.id} className="fi journal-spread-wrapper">
            <div
              className="journal-spread-canvas"
              onClick={() => onEditSpread(spread)}
            >
              <SpreadCanvas spread={spread} editMode={false} actionsRef={{ current: null }} />
            </div>
            <div className="journal-spread-meta">
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

      {confirmSpread && (
        <Modal title="Delete Spread" onClose={() => setConfirmSpread(null)}>
          <p className="journal-modal-body">
            Are you sure you want to delete <strong>{confirmSpread.title}</strong>?
          </p>
          <p className="journal-modal-warning">All drawings and content on this spread will be lost.</p>
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
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} initialTab={1} />}
    </div>
  );
}