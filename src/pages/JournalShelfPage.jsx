import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { getJournals } from "../lib/journals";
import Modal from "../components/Modal.jsx";
import Field from "../components/Field.jsx";
import Pill from "../components/Pill.jsx";
import { PRESET_COVERS, getCoverStyle, uid, now } from "../constants.js";

import { HelpModal, HelpButton } from "../components/HelpModal.jsx";

/* ─── JournalShelfPage ─────────────────────────────────────── */
export default function JournalShelfPage({ user, journals, setJournals, activeJournal, setActiveJournal,
    showNewJournal, setShowNewJournal, journalForm, setJournalForm,
    onOpenJournal, onSignOut, onDeleteAccount,
    menuOpen, setMenuOpen, renaming, setRenaming, confirmDelete, setConfirmDelete,
    onShowUpgrade, userTier, onShowRedeem, redeemUsed }) {

  const coverImgRef = useRef(null);
  const [userMenuOpen,      setUserMenuOpen]      = useState(false);
  const [confirmDeleteAcct, setConfirmDeleteAcct] = useState(false);
  const [showHelp,          setShowHelp]          = useState(false);

  useEffect(() => {
    if (!userMenuOpen) return;
    const close = () => setUserMenuOpen(false);
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, [userMenuOpen]);

  const createJournal = async () => {
    if (!journalForm.title.trim()) return;
    if (userTier === "free" && journals.length >= 3) return;

    const { data, error } = await supabase
      .from("journals")
      .insert([
        {
          user_id: user.id,
          name: journalForm.title,
          cover_type: journalForm.coverType,
          cover_id: journalForm.coverId,
          cover_image: journalForm.coverImg || null,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("CREATE JOURNAL ERROR:", error);
      return;
    }

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

  const renameJournal = async (id, title) => {
    if (!title.trim()) return;

    const { error } = await supabase
      .from("journals")
      .update({ name: title }) // ✅ FIXED
      .eq("id", id);

    if (error) {
      console.error("RENAME JOURNAL ERROR:", error);
      return;
    }

    setJournals(prev =>
      prev.map(j =>
        j.id === id ? { ...j, title } : j
      )
    );
  };

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

  const initial = (user?.name || user?.email || "?")[0].toUpperCase();

  return (
    <div style={{ minHeight:"100vh",background:"var(--cloud)" }}>
      <nav style={{ padding:"16px 40px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"var(--periwinkle)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <a href="/" className="navbar-logo">
            <img src="/logo/blue-logo.png" alt="Vellum" style={{ height:36, width:"auto", display:"block" }} />
          </a>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          {userTier !== "pro"
            ? <button onClick={onShowUpgrade}
                style={{ padding:"10px 14px",fontSize:10,letterSpacing:"0.13em",textTransform:"uppercase",
                  border:"1px solid var(--navy)",borderRadius:0,background:"var(--navy)",color:"var(--cloud)",
                  cursor:"pointer",transition:"all 0.14s",display:"inline-flex",alignItems:"center",gap:6 }}
                onMouseEnter={e=>{ e.currentTarget.style.background="rgba(10,24,63,0.9)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.background="var(--navy)"; }}>
                ✦ upgrade to pro
              </button>
            : <div style={{ padding:"10px 14px",fontSize:10,letterSpacing:"0.13em",textTransform:"uppercase",
                border:"1px solid var(--navy)",background:"var(--navy)",color:"var(--cloud)",display:"inline-flex",alignItems:"center",gap:6 }}>
                <span style={{ fontSize:11 }}>✦</span> pro
              </div>
          }
          <div style={{ position:"relative" }} onMouseDown={e=>e.stopPropagation()}>
            <button onClick={()=>setUserMenuOpen(o=>!o)}
              style={{ width:34,height:34,borderRadius:"50%",background:"var(--navy)",border:"none",cursor:"pointer",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:13,fontWeight:600,color:"var(--cloud)",transition:"opacity 0.14s" }}
              onMouseEnter={e=>e.currentTarget.style.opacity="0.8"}
              onMouseLeave={e=>e.currentTarget.style.opacity="1"}
              title={user?.name}>{initial}</button>
            {userMenuOpen && (
              <div style={{ position:"absolute",right:0,top:"calc(100% + 8px)",background:"var(--cloud)",
                border:"1px solid rgba(186,189,226,0.35)",boxShadow:"0 4px 20px rgba(55,67,117,0.12)",
                minWidth:192,zIndex:500 }}>
                <div style={{ padding:"12px 16px 10px",borderBottom:"1px solid rgba(186,189,226,0.2)" }}>
                  <div style={{ fontSize:12,fontWeight:600,color:"var(--navy)",letterSpacing:"0.01em" }}>{user?.name}</div>
                  <div style={{ fontSize:10,color:"var(--periwinkle)",marginTop:2 }}>{user?.email}</div>
                </div>
                <button onClick={()=>{ setUserMenuOpen(false); onShowRedeem(); }}
                  style={{ display:"flex",width:"100%",textAlign:"left",padding:"11px 16px",
                    background:"none",border:"none",borderBottom:"1px solid rgba(186,189,226,0.2)",
                    fontSize:11,color: redeemUsed ? "rgba(55,67,117,0.4)" : "var(--navy)",cursor:"pointer",letterSpacing:"0.06em",transition:"background 0.1s",alignItems:"center",justifyContent:"space-between" }}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(186,189,226,0.18)"}
                  onMouseLeave={e=>e.currentTarget.style.background="none"}>
                  <span>Redeem free pack</span>
                  {redeemUsed
                    ? <span style={{ fontSize:9,letterSpacing:"0.08em",color:"var(--periwinkle)" }}>used</span>
                    : <span style={{ fontSize:9,letterSpacing:"0.08em",color:"var(--maroon)",border:"1px solid rgba(137,81,89,0.4)",padding:"1px 6px" }}>1 left</span>
                  }
                </button>
                <button onClick={()=>{ setUserMenuOpen(false); onSignOut(); }}
                  style={{ display:"block",width:"100%",textAlign:"left",padding:"11px 16px",
                    background:"none",border:"none",borderBottom:"1px solid rgba(186,189,226,0.2)",
                    fontSize:11,color:"var(--navy)",cursor:"pointer",letterSpacing:"0.06em",transition:"background 0.1s" }}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(186,189,226,0.18)"}
                  onMouseLeave={e=>e.currentTarget.style.background="none"}>Sign out</button>
                <button onClick={()=>{ setUserMenuOpen(false); setConfirmDeleteAcct(true); }}
                  style={{ display:"block",width:"100%",textAlign:"left",padding:"11px 16px",
                    background:"none",border:"none",fontSize:11,color:"var(--maroon)",cursor:"pointer",
                    letterSpacing:"0.06em",transition:"background 0.1s" }}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(137,81,89,0.07)"}
                  onMouseLeave={e=>e.currentTarget.style.background="none"}>Delete account</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div style={{ maxWidth:960,margin:"0 auto",padding:"48px 40px" }}>
        <div className="fu" style={{ display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:36 }}>
          <div>
            <div style={{ fontSize:20,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:"var(--navy)" }}>Your Journals</div>
            <div style={{ fontSize:10,color:"var(--periwinkle)",marginTop:6,letterSpacing:"0.06em" }}>
              {journals.length} journal{journals.length!==1?"s":""}
              {userTier==="free" && <span style={{ marginLeft:10,color:journals.length>=3?"var(--maroon)":"var(--periwinkle)",opacity:0.8 }}>· {journals.length}/3 free</span>}
            </div>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <HelpButton onOpen={()=>setShowHelp(true)} />
            <Pill dark onClick={()=>{ if(userTier==="free" && journals.length>=3){ onShowUpgrade(); } else { setShowNewJournal(true); } }}>+ new journal</Pill>
          </div>
        </div>

        {journals.length===0
          ? <div className="fu" style={{ textAlign:"center",padding:"100px 0" }}>
              <div style={{ fontSize:14,fontWeight:300,color:"var(--periwinkle)",fontStyle:"italic" }}>No journals yet — create your first one</div>
            </div>
          : <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:28 }}>
              {journals.map((j,i)=>(
                <div key={j.id} className="fu" style={{ animationDelay:`${i*0.06}s` }}>
                  <div style={{ height:250,borderRadius:0,...getCoverStyle(j),boxShadow:"var(--sh)",position:"relative",cursor:"pointer",transition:"transform 0.2s,box-shadow 0.2s" }}
                    onClick={()=>onOpenJournal(j)}
                    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-5px)";e.currentTarget.style.boxShadow="var(--sh-lg)";}}
                    onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="var(--sh)";}}>
                    <div style={{ position:"absolute",left:0,top:0,bottom:0,width:12,background:"rgba(0,0,0,0.15)" }} />
                    <div style={{ position:"absolute",bottom:20,left:18,right:12 }}>
                      <div style={{ fontSize:14,fontWeight:500,color:"#fff",textShadow:"0 1px 8px rgba(0,0,0,0.4)",lineHeight:1.3,letterSpacing:"0.02em" }}>{j.title}</div>
                      <div style={{ fontSize:9,color:"rgba(255,255,255,0.65)",marginTop:4,letterSpacing:"0.1em" }}>{j.spreads.length} spreads</div>
                    </div>
                  </div>
                  <div style={{ marginTop:9,display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:6 }}>
                    <div style={{ cursor:"pointer",minWidth:0 }} onClick={()=>onOpenJournal(j)}>
                      <div style={{ fontSize:12,color:"var(--navy)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{j.title}</div>
                      <div style={{ fontSize:10,color:"var(--periwinkle)",marginTop:2 }}>{j.created}</div>
                    </div>
                    <div style={{ position:"relative",flexShrink:0 }}>
                      <button onClick={e=>{ e.stopPropagation(); setMenuOpen(menuOpen===j.id?null:j.id); }}
                        style={{ background:"none",border:"none",cursor:"pointer",padding:"2px 5px",fontSize:15,lineHeight:1,color:"var(--navy)",transition:"opacity 0.12s" }}
                        onMouseEnter={e=>e.currentTarget.style.opacity="0.6"}
                        onMouseLeave={e=>e.currentTarget.style.opacity="1"}>···</button>
                      {menuOpen===j.id && (
                        <div onClick={e=>e.stopPropagation()} className="fu"
                          style={{ position:"absolute",right:0,top:"calc(100% + 4px)",background:"var(--cloud)",border:"1px solid rgba(186,189,226,0.4)",boxShadow:"var(--sh)",zIndex:200,minWidth:130 }}>
                          <button onClick={()=>{ setRenaming({id:j.id,title:j.title}); setMenuOpen(null); }}
                            style={{ display:"block",width:"100%",textAlign:"left",padding:"9px 14px",background:"none",border:"none",borderBottom:"1px solid rgba(186,189,226,0.2)",fontSize:10,letterSpacing:"0.08em",textTransform:"uppercase",color:"var(--navy)",cursor:"pointer",transition:"background 0.1s" }}
                            onMouseEnter={e=>e.currentTarget.style.background="rgba(186,189,226,0.15)"}
                            onMouseLeave={e=>e.currentTarget.style.background="none"}>rename</button>
                          <button onClick={()=>{ setConfirmDelete(j); setMenuOpen(null); }}
                            style={{ display:"block",width:"100%",textAlign:"left",padding:"9px 14px",background:"none",border:"none",fontSize:10,letterSpacing:"0.08em",textTransform:"uppercase",color:"var(--maroon)",cursor:"pointer",transition:"background 0.1s" }}
                            onMouseEnter={e=>e.currentTarget.style.background="rgba(137,81,89,0.08)"}
                            onMouseLeave={e=>e.currentTarget.style.background="none"}>delete</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
        }
      </div>

      {renaming && (
        <Modal title="Rename Journal" onClose={()=>setRenaming(null)}>
          <Field label="Title" value={renaming.title} autoFocus
            onChange={e=>setRenaming(r=>({...r,title:e.target.value}))}
            onKeyDown={e=>{ if(e.key==="Enter"){ renameJournal(renaming.id,renaming.title); setRenaming(null); } }} />
          <div style={{ display:"flex",gap:10,justifyContent:"flex-end",marginTop:24 }}>
            <button type="button" onClick={()=>setRenaming(null)}
              style={{ padding:"10px 24px",borderRadius:0,border:"1px solid rgba(186,189,226,0.4)",background:"transparent",fontSize:11,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer",color:"var(--navy)" }}>cancel</button>
            <button type="button" onClick={()=>{ renameJournal(renaming.id,renaming.title); setRenaming(null); }}
              style={{ padding:"10px 24px",borderRadius:0,border:"none",background:"var(--periwinkle)",color:"var(--navy)",fontSize:11,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer" }}>save</button>
          </div>
        </Modal>
      )}

      {confirmDelete && (
        <Modal title="Delete Journal" onClose={()=>setConfirmDelete(null)}>
          <p style={{ fontSize:13,color:"var(--navy)",marginBottom:8,lineHeight:1.6 }}>
            Are you sure you want to delete <strong>{confirmDelete.title}</strong>?
          </p>
          <p style={{ fontSize:11,color:"var(--periwinkle)",marginBottom:28 }}>
            This will permanently remove all {confirmDelete.spreads.length} spread{confirmDelete.spreads.length!==1?"s":""} inside it.
          </p>
          <div style={{ display:"flex",gap:10,justifyContent:"flex-end" }}>
            <button type="button" onClick={()=>setConfirmDelete(null)}
              style={{ padding:"10px 24px",borderRadius:0,border:"1px solid rgba(186,189,226,0.4)",background:"transparent",fontSize:11,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer",color:"var(--navy)" }}>cancel</button>
            <button type="button" onClick={()=>{ deleteJournal(confirmDelete.id); setConfirmDelete(null); }}
              style={{ padding:"10px 24px",borderRadius:0,border:"none",background:"var(--navy)",color:"var(--cloud)",fontSize:11,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer" }}>delete</button>
          </div>
        </Modal>
      )}

      {showNewJournal && (
        <Modal title="New Journal" onClose={()=>setShowNewJournal(false)} wide>
          <form onSubmit={e => { e.preventDefault(); createJournal(); }}>
            <Field label="Title" placeholder="My 2025 Journal" value={journalForm.title}
              onChange={e=>setJournalForm(f=>({...f,title:e.target.value}))}
              onKeyDown={e=>{ if (e.key === "Enter") { e.preventDefault(); createJournal(); } }} />
            <div style={{ marginBottom:18 }}>
              <label style={{ display:"block",fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--periwinkle)",marginBottom:12 }}>Cover</label>
              <div style={{ display:"flex",gap:10,marginBottom:14 }}>
                {["preset","image"].map(t=>(
                  <button key={t} type="button" onClick={()=>setJournalForm(f=>({...f,coverType:t}))}
                    style={{ padding:"7px 18px",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",border:"1px solid rgba(186,189,226,0.5)",borderRadius:0,cursor:"pointer",transition:"all 0.12s",background:journalForm.coverType===t?"var(--periwinkle)":"transparent",color:"var(--navy)" }}>
                    {t==="preset" ? "Preset Covers" : "Upload Image"}
                  </button>
                ))}
              </div>
              {journalForm.coverType==="preset"
                ? <div style={{ display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:10 }}>
                    {PRESET_COVERS.map(c=>(
                      <div key={c.id} onClick={()=>setJournalForm(f=>({...f,coverId:c.id}))}
                        style={{ height:76,borderRadius:0,...c.style,cursor:"pointer",outline:journalForm.coverId===c.id?"2px solid var(--periwinkle)":"2px solid transparent",outlineOffset:2,position:"relative" }}>
                        <div style={{ position:"absolute",left:0,top:0,bottom:0,width:7,background:"rgba(0,0,0,0.15)" }} />
                      </div>
                    ))}
                  </div>
                : <div>
                    <div onClick={()=>coverImgRef.current.click()}
                      style={{ height:90,border:"1.5px dashed rgba(186,189,226,0.5)",borderRadius:0,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>
                      {journalForm.coverImg
                        ? <img src={journalForm.coverImg} alt="" style={{ height:"100%",objectFit:"cover" }} />
                        : <span style={{ fontSize:11,color:"var(--periwinkle)" }}>click to upload cover image</span>}
                    </div>
                    <input ref={coverImgRef} type="file" accept="image/*" style={{ display:"none" }}
                      onChange={e=>{ const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=ev=>setJournalForm(f=>({...f,coverImg:ev.target.result})); r.readAsDataURL(f); }} />
                  </div>
              }
            </div>
            <div style={{ display:"flex",gap:10,justifyContent:"flex-end",marginTop:24 }}>
              <button type="button" onClick={()=>setShowNewJournal(false)}
                style={{ padding:"10px 24px",borderRadius:0,border:"1px solid rgba(186,189,226,0.4)",background:"transparent",fontSize:11,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer",color:"var(--navy)" }}>cancel</button>
              <button type="submit"
                style={{ padding:"10px 24px",borderRadius:0,border:"none",background:"var(--periwinkle)",color:"var(--navy)",fontSize:11,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer" }}>create journal</button>
            </div>
          </form>
        </Modal>
      )}

      {confirmDeleteAcct && (
        <Modal title="Delete Account" onClose={()=>setConfirmDeleteAcct(false)}>
          <p style={{ fontSize:13,color:"var(--navy)",marginBottom:8,lineHeight:1.6 }}>Are you sure you want to delete your account?</p>
          <p style={{ fontSize:11,color:"var(--periwinkle)",marginBottom:28 }}>
            This will permanently remove your account and all {journals.length} journal{journals.length!==1?"s":""} inside it. This cannot be undone.
          </p>
          <div style={{ display:"flex",gap:10,justifyContent:"flex-end" }}>
            <button type="button" onClick={()=>setConfirmDeleteAcct(false)}
              style={{ padding:"10px 24px",borderRadius:0,border:"1px solid rgba(186,189,226,0.4)",background:"transparent",fontSize:11,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer",color:"var(--navy)" }}>cancel</button>
            <button type="button" onClick={()=>{ setConfirmDeleteAcct(false); onDeleteAccount(); }}
              style={{ padding:"10px 24px",borderRadius:0,border:"none",background:"var(--maroon)",color:"#fff",fontSize:11,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer" }}>delete account</button>
          </div>
        </Modal>
      )}

      {showHelp && <HelpModal onClose={()=>setShowHelp(false)} initialTab={0} />}
    </div>
  );
}
