import { useState } from "react";
import { TEMPLATES, PRO_CATEGORIES } from "../constants.js";

export default function TemplatePicker({ userTier, onToggleTier, onSelect, onClose, onShowUpgrade, unlockedCategory }) {
  const freeTmpl = TEMPLATES.filter(t => t.tier === "free");
  const [activeTab,      setActiveTab]      = useState("free");
  const [activeCategory, setActiveCategory] = useState(PRO_CATEGORIES[0]);
  const categoryTmpl    = TEMPLATES.filter(t => t.tier === "pro" && t.category === activeCategory);
  const categoryUnlocked = userTier === "pro" || activeCategory === unlockedCategory;

  const TAB_STYLE = (active) => ({
    flex:1, padding:"10px 0", fontSize:9, letterSpacing:"0.14em", textTransform:"uppercase",
    background:"none", border:"none", cursor:"pointer", transition:"all 0.14s",
    borderBottom: active ? "2px solid var(--navy)" : "2px solid transparent",
    marginBottom: -1,
    color: active ? "var(--navy)" : "rgba(186,189,226,0.6)",
    fontFamily:"'Inter',sans-serif",
  });

  return (
    <div onClick={onClose}
      style={{ position:"fixed",inset:0,background:"rgba(55,67,117,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:800,backdropFilter:"blur(6px)" }}>
      <div onClick={e=>e.stopPropagation()} className="fu"
        style={{ background:"var(--cloud)",borderRadius:0,padding:"40px 48px",width:860,maxWidth:"94vw",maxHeight:"92vh",overflowY:"auto",boxShadow:"var(--sh-lg)",border:"1px solid rgba(186,189,226,0.35)" }}>

        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24 }}>
          <h2 style={{ fontSize:14,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--navy)",fontFamily:"'Inter',sans-serif" }}>Choose a Template</h2>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <button onClick={onToggleTier}
              style={{ padding:"4px 12px",fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",border:"1px solid rgba(186,189,226,0.5)",borderRadius:0,background:"transparent",cursor:"pointer",color:"var(--periwinkle)",transition:"all 0.12s" }}
              onMouseEnter={e=>e.currentTarget.style.color="var(--navy)"}
              onMouseLeave={e=>e.currentTarget.style.color="var(--periwinkle)"}>
              demo: {userTier==="free" ? "switch to pro ↑" : "switch to free ↓"}
            </button>
            <button onClick={onClose}
              style={{ background:"none",border:"none",fontSize:18,color:"var(--periwinkle)",cursor:"pointer",transition:"color 0.12s" }}
              onMouseEnter={e=>e.currentTarget.style.color="var(--navy)"}
              onMouseLeave={e=>e.currentTarget.style.color="var(--periwinkle)"}>✕</button>
          </div>
        </div>

        <div style={{ display:"flex",borderBottom:"1px solid rgba(186,189,226,0.3)",marginBottom:24 }}>
          <button onClick={()=>setActiveTab("free")} style={TAB_STYLE(activeTab==="free")}>Free</button>
          <button onClick={()=>setActiveTab("pro")}  style={TAB_STYLE(activeTab==="pro")}>
            Pro {userTier==="free" && <span style={{ marginLeft:4, fontSize:8, color:"var(--maroon)" }}>↑</span>}
          </button>
        </div>

        {activeTab==="free" && (
          <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16 }}>
            {freeTmpl.map(t=>(
              <div key={t.id} onClick={()=>onSelect(t)} className="template-card">
                <div style={{
                  height:100,
                  backgroundImage: t.path ? `url(${t.path})` : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundColor: t.bg || "#f6f7fb"
                }} />
              </div>
            ))}
          </div>
        )}

        {activeTab==="pro" && <>
          {userTier==="free" && (
            <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:16 }}>
              <span onClick={onShowUpgrade}
                style={{ fontSize:8,letterSpacing:"0.1em",textTransform:"uppercase",padding:"2px 10px",borderRadius:0,background:"transparent",color:"var(--navy)",border:"1px solid rgba(137,81,89,0.4)",cursor:"pointer",transition:"background 0.12s" }}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(137,81,89,0.08)"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>upgrade to unlock ↑</span>
            </div>
          )}

          <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:16 }}>
            {PRO_CATEGORIES.map(cat => (
              <button key={cat} onClick={()=>setActiveCategory(cat)}
                style={{
                  display:"flex",alignItems:"center",gap:5,
                  padding:"5px 14px",
                  fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",
                  border:`1px solid ${activeCategory===cat ? "var(--navy)" : "rgba(186,189,226,0.45)"}`,
                  borderRadius:0,
                  background: activeCategory===cat ? "var(--navy)" : "transparent",
                  color: activeCategory===cat ? "var(--cloud)" : "var(--periwinkle)",
                  cursor:"pointer", transition:"all 0.15s",
                }}>
                {cat}
                {cat === unlockedCategory && userTier === "free" && <span style={{ fontSize:8,opacity:0.75 }}>✓</span>}
              </button>
            ))}
          </div>

          <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16 }}>
            {categoryTmpl.map(t=>(
              <div key={t.id}
                onClick={()=>{ if(categoryUnlocked) onSelect(t); }}
                className={`template-card${categoryUnlocked ? "" : " locked"}`}
                style={{ position:"relative" }}>
                <div style={{
                  height:100,
                  backgroundImage: t.path ? `url(${t.path})` : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundColor: t.bg || "#f6f7fb"
                }} />
                <div style={{ padding:"7px 0",textAlign:"center",fontSize:9,letterSpacing:"0.12em",textTransform:"uppercase",color:t.labelColor||"var(--periwinkle)" }}>{t.label}</div>
                {!categoryUnlocked && <div style={{ position:"absolute",top:6,right:6,fontSize:11 }}>🔒</div>}
              </div>
            ))}
          </div>
        </>}
      </div>
    </div>
  );
}
