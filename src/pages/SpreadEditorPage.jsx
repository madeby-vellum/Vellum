import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import SpreadEditor from "../components/SpreadEditor.jsx";
import { HelpModal, HelpButton } from "../components/HelpModal.jsx";
import { supabase } from "../lib/supabase";
import "./SpreadEditorPage.css";

export default function SpreadEditorPage({ journals, setJournals, activeJournal, setActiveJournal, setActiveSpread, onGoHome, onGoJournal, onSave }) {
  const { journalId, spreadId } = useParams();
  const journal = journals.find(j => j.id === journalId);
  const spread = journal?.spreads.find(s => s.id === spreadId);

  // If the journal or spread doesn't exist, redirect to the shelf
  if (!journal || !spread) return <Navigate to="/shelf" replace />;

  // Updates the spread in the active journal and the journals list
  const updateSpread = (spread) => {
    const updated = { ...activeJournal, spreads: activeJournal.spreads.map(s => s.id === spread.id ? spread : s) };
    setJournals(p => p.map(j => j.id === activeJournal.id ? updated : j));
    setActiveJournal(updated);
    setActiveSpread(spread);
  };

  // Saves the spread to the database and then goes back to the journal view
  const handleSave = async (saved) => {
    const { error } = await supabase
      .from("spreads")
      .update({ canvas: saved.canvas, updated_at: new Date() })
      .eq("id", saved.id);
    // If there's an error, show in console
    if (error) {
      console.error("SAVE CANVAS ERROR:", error);
      return;
    }
    // update the spread and go back to the journal view
    updateSpread(saved);
    onGoJournal();
  };

  // State for showing the help modal
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="spread-editor-page">
      <div className="nav-bar spread-editor-nav">
        <div className="spread-editor-nav-left">
          {/* Journal Title */}
          <button onClick={onGoJournal} className="nav-link">← {journal.title}</button>
        </div>
        <div className="spread-editor-nav-right">
          {/* Help Button */}
          <HelpButton onOpen={() => setShowHelp(true)} />
          <div id="spread-editor-save-slot" />
        </div>
      </div>
      <div className="spread-editor-canvas">
        {/* Spread Editor */}
        <SpreadEditor spread={spread} onUpdate={updateSpread} onSave={handleSave} />
      </div>
      {/* Help Modal */}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} initialTab={2} />}
    </div>
  );
}