import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import SpreadEditor from "../components/SpreadEditor.jsx";
import { HelpModal, HelpButton } from "../components/HelpModal.jsx";
import { supabase } from "../lib/supabase";

export default function SpreadEditorPage({ journals, setJournals, activeJournal, setActiveJournal, setActiveSpread, onGoHome, onGoJournal, onSave }) {
  const { journalId, spreadId } = useParams();
  const journal = journals.find(j => j.id === journalId);
  const spread = journal?.spreads.find(s => s.id === spreadId);

  if (!journal || !spread) return <Navigate to="/shelf" replace />;

  const updateSpread = (spread) => {
    const updated = { ...activeJournal, spreads:activeJournal.spreads.map(s => s.id===spread.id ? spread : s) };
    setJournals(p => p.map(j => j.id===activeJournal.id ? updated : j));
    setActiveJournal(updated);
    setActiveSpread(spread);
  };

  const handleSave = async (saved) => {
    const { error } = await supabase
      .from("spreads")
      .update({
        canvas: saved.canvas,
        updated_at: new Date()
      })
      .eq("id", saved.id);

    if (error) {
      console.error("SAVE CANVAS ERROR:", error);
      return;
    }

    updateSpread(saved);
    onGoJournal();
  };

  const [showHelp, setShowHelp] = useState(false);
  return (
    <div style={{ height:"100vh",display:"flex",flexDirection:"column" }}>
      <div className="nav-bar" style={{ justifyContent:"space-between" }}>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <button onClick={onGoJournal} className="nav-link">← {journal.title}</button>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <HelpButton onOpen={()=>setShowHelp(true)} />
          <div id="spread-editor-save-slot" />
        </div>
      </div>
      <div style={{ flex:1,overflow:"hidden" }}>
        <SpreadEditor spread={spread} onUpdate={updateSpread} onSave={handleSave} />
      </div>
      {showHelp && <HelpModal onClose={()=>setShowHelp(false)} initialTab={2} />}
    </div>
  );
}
