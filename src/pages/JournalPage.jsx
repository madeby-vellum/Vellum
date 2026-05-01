import { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import SpreadCanvas from "../components/SpreadCanvas.jsx";
import TemplatePicker from "../components/TemplatePicker.jsx";
import Modal from "../components/Modal.jsx";
import { HelpModal, HelpButton } from "../components/HelpModal.jsx";
import { getCoverStyle, uid, now, TEMPLATES } from "../constants.js";
import { supabase } from "../lib/supabase";
import { deleteSpread as deleteSpreadDB } from "../lib/spreads";

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

    // update local state
    const updated = {
      ...activeJournal,
      spreads: [...activeJournal.spreads, data]
    };

    setJournals(p => p.map(j => j.id === activeJournal.id ? updated : j));
    setActiveJournal(updated);
    setActiveSpread(data);

    setJournalPage(updated.spreads.length);
    setShowTemplatePicker(false);

    // IMPORTANT: open editor immediately
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
      await deleteSpreadDB(id); // 🔥 ACTUAL DELETE

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
    <button onClick={onClick} disabled={disabled}
      style={{ width:38,height:38,borderRadius:0,border:"1px solid rgba(55,67,117,0.25)",background:"transparent",color:"var(--navy)",fontSize:15,
        display:"flex",alignItems:"center",justifyContent:"center",cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.3:1,transition:"all 0.15s" }}>
      {label}
    </button>
  );

  return (
    <div style={{ height:"100vh",display:"flex",flexDirection:"column",background:"var(--cloud)",position:"relative",overflow:"hidden" }}>
      <nav className="nav-bar" style={{ justifyContent:"space-between" }}>
        <div style={{ display:"flex",alignItems:"center",gap:14 }}>
          <button onClick={onGoHome} style={{ background:"none",border:"none",fontSize:13,fontWeight:600,letterSpacing:"0.14em",textTransform:"uppercase",color:"var(--navy)",cursor:"pointer",transition:"opacity 0.14s",padding:0,fontFamily:"'Inter',sans-serif" }}
            onMouseEnter={e=>e.currentTarget.style.opacity="0.6"}
            onMouseLeave={e=>e.currentTarget.style.opacity="1"}
            title="Back to home">← Shelf</button>
          <span style={{ color:"rgba(55,67,117,0.3)" }}>/</span>
          <span style={{ fontSize:13,fontWeight:500,color:"var(--navy)",letterSpacing:"0.04em",fontFamily:"'Inter',sans-serif" }}>{journal.title}</span>
        </div>
        <HelpButton onOpen={()=>setShowHelp(true)} />
      </nav>

      <div style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 100px 0",overflow:"visible",gap:16 }}>
        {isCover && (
          <div key="cover" className="fi" style={{ width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:24,flex:1,minHeight:0 }}>
            <div style={{ position:"relative",height:"100%",aspectRatio:"2/3",...getCoverStyle(journal),borderRadius:0,boxShadow:"var(--sh-lg), 4px 0 10px rgba(0,0,0,0.18)" }}>
              <div style={{ position:"absolute",left:0,top:0,bottom:0,width:16,background:"rgba(0,0,0,0.2)" }} />
              <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:"22px 18px 22px 26px" }}>
                <div style={{ fontSize:17,fontWeight:500,color:"#fff",textShadow:"0 2px 12px rgba(0,0,0,0.5)",lineHeight:1.25,letterSpacing:"0.02em" }}>{journal.title}</div>
                <div style={{ fontSize:9,color:"rgba(255,255,255,0.5)",marginTop:5,letterSpacing:"0.12em" }}>{journal.created}</div>
              </div>
            </div>
          </div>
        )}

        {!isCover && spread && (
          <div key={spread.id} className="fi" style={{ width:"100%",display:"flex",flexDirection:"column",alignItems:"center",flex:1,minHeight:0 }}>
            <div style={{  boxShadow: "var(--sh-lg)", width: "min(880px, calc(100vw - 200px))", aspectRatio: "880 / 580", overflow: "hidden", cursor: "pointer" }}
              onClick={()=>onEditSpread(spread)}>
              <SpreadCanvas spread={spread} editMode={false} actionsRef={{ current:null }} />
            </div>
            <div style={{ display:"flex",alignItems:"baseline",gap:12 }}>
              {renamingSpread?.id === spread.id
                ? <input autoFocus value={renamingSpread.title}
                    onChange={e=>setRenamingSpread(r=>({...r,title:e.target.value}))}
                    onBlur={()=>{ renameSpread(renamingSpread.id,renamingSpread.title); setRenamingSpread(null); }}
                    onKeyDown={e=>{ if(e.key==="Enter"){ renameSpread(renamingSpread.id,renamingSpread.title); setRenamingSpread(null); } if(e.key==="Escape") setRenamingSpread(null); }}
                    style={{ fontSize:12,color:"var(--navy)",border:"none",borderBottom:"1px solid var(--periwinkle)",background:"transparent",outline:"none",fontFamily:"'Inter',sans-serif",padding:"2px 0",minWidth:80 }} />
                : <span onClick={()=>setRenamingSpread({id:spread.id,title:spread.title})} title="Click to rename"
                    style={{ fontSize:12,color:"var(--navy)",cursor:"text",borderBottom:"1px solid transparent",transition:"border-color 0.12s" }}
                    onMouseEnter={e=>e.currentTarget.style.borderBottom="1px solid rgba(186,189,226,0.5)"}
                    onMouseLeave={e=>e.currentTarget.style.borderBottom="1px solid transparent"}>
                    {spread.title}
                  </span>
              }
              <span style={{ fontSize:10,color:"var(--periwinkle)",letterSpacing:"0.06em" }}>{spread.date}</span>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding:"16px 32px 24px",display:"flex",alignItems:"center",justifyContent:"center",gap:10,flexShrink:0 }}>
        {navBtn("←", goLeft, journalPage===0)}
        {!isCover && spread && (
          <button onClick={()=>onEditSpread(spread)} title="Edit spread" className="pill pill-light"
            style={{ width:38,height:38,padding:0,display:"flex",alignItems:"center",justifyContent:"center" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9.5 2.5l2 2-7 7-2.5.5.5-2.5 7-7z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
        {!isCover && spread && (
          <button onClick={()=>setConfirmSpread(spread)} title="Delete spread" className="pill pill-light"
            style={{ width:38,height:38,padding:0,display:"flex",alignItems:"center",justifyContent:"center" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 4h9M5.5 4V3h3v1M4.5 4l.5 7.5h4l.5-7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
        <button onClick={()=>setShowTemplatePicker(true)} title="Add spread" className="pill pill-light"
          style={{ width:38,height:38,padding:0,display:"flex",alignItems:"center",justifyContent:"center" }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2.5v9M2.5 7h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </button>
        {navBtn("→", goRight, journalPage===total-1)}
      </div>

      {confirmSpread && (
        <Modal title="Delete Spread" onClose={()=>setConfirmSpread(null)}>
          <p style={{ fontSize:13,color:"var(--navy)",marginBottom:8,lineHeight:1.6 }}>
            Are you sure you want to delete <strong>{confirmSpread.title}</strong>?
          </p>
          <p style={{ fontSize:11,color:"var(--periwinkle)",marginBottom:28 }}>All drawings and content on this spread will be lost.</p>
          <div style={{ display:"flex",gap:10,justifyContent:"flex-end" }}>
            <button onClick={()=>setConfirmSpread(null)}
              style={{ padding:"10px 24px",borderRadius:0,border:"1px solid rgba(186,189,226,0.4)",background:"transparent",fontSize:11,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer",color:"var(--navy)" }}>cancel</button>
            <button onClick={()=>{ deleteSpread(confirmSpread.id); setConfirmSpread(null); }}
              style={{ padding:"10px 24px",borderRadius:0,border:"none",background:"var(--navy)",color:"var(--cloud)",fontSize:11,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer" }}>delete</button>
          </div>
        </Modal>
      )}

      {showTemplatePicker && (
        <TemplatePicker
          userTier={userTier}
          onToggleTier={onToggleTier}
          onSelect={createSpread}
          onClose={()=>setShowTemplatePicker(false)}
          onShowUpgrade={onShowUpgrade}
          unlockedCategory={unlockedCategory}
        />
      )}
      {showHelp && <HelpModal onClose={()=>setShowHelp(false)} initialTab={1} />}
    </div>
  );
}
