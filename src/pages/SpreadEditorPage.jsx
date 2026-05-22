import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import SpreadEditor from "../components/SpreadEditor.jsx";
import { HelpModal, HelpButton } from "../components/HelpModal.jsx";
import { supabase } from "../lib/supabase";
import "./SpreadEditorPage.css";

export default function SpreadEditorPage({
  journals,
  setJournals,
  activeJournal,
  setActiveJournal,
  setActiveSpread,
  onGoHome,
  onGoJournal,
  onSave
}) {

  // Get route params (journal + spread IDs from URL)
  const { journalId, spreadId } = useParams();

  // Find current journal from global state
  const journal = journals.find(j => j.id === journalId);

  // Find current spread inside that journal
  const spread = journal?.spreads.find(s => s.id === spreadId);

  // Redirect if journal or spread doesn't exist
  if (!journal || !spread) return <Navigate to="/shelf" replace />;

  // Sync updated spread into global state (journals + active journal)
  const updateSpread = (spread) => {

    // Build updated journal with modified spread list
    const updated = {
      ...activeJournal,
      spreads: activeJournal.spreads.map(s =>
        s.id === spread.id ? spread : s
      )
    };

    // Update global journals state
    setJournals(p =>
      p.map(j =>
        j.id === activeJournal.id ? updated : j
      )
    );

    // Update active journal context
    setActiveJournal(updated);

    // Update active spread context
    setActiveSpread(spread);
  };

  // Save canvas changes to Supabase database
  const handleSave = async (saved) => {

    const { error } = await supabase
      .from("spreads")
      .update({
        canvas: saved.canvas,
        updated_at: new Date()
      })
      .eq("id", saved.id);

    // Log DB error if save fails
    if (error) {
      console.error("SAVE CANVAS ERROR:", error);
      return;
    }

    // Sync saved spread into local state
    updateSpread(saved);

    // Return user back to journal view after saving
    onGoJournal();
  };

  // Help modal visibility state
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="spread-editor-page">

      {/* Top navigation bar */}
      <div className="nav-bar spread-editor-nav">

        {/* Back button to journal */}
        <div className="spread-editor-nav-left">
          <button onClick={onGoJournal} className="nav-link">
            ← {journal.title}
          </button>
        </div>

        {/* Right-side actions */}
        <div className="spread-editor-nav-right">

          {/* Help modal trigger */}
          <HelpButton onOpen={() => setShowHelp(true)} />

          {/* Save button mount/portal target */}
          <div id="spread-editor-save-slot" />
        </div>
      </div>

      {/* Main canvas editor area */}
      <div className="spread-editor-canvas">
        <SpreadEditor
          spread={spread}
          onUpdate={updateSpread}
          onSave={handleSave}
        />
      </div>

      {/* Help modal */}
      {showHelp && (
        <HelpModal
          onClose={() => setShowHelp(false)}
          initialTab={2}
        />
      )}
    </div>
  );
}