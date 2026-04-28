import { useState } from "react";
const HELP_TABS = [
  {
    id: "getting-started", label: "Getting Started",
    steps: [
      { heading: "Create Your First Journal", body: "Tap '+ New Journal' on the shelf page to begin. Give your journal a title and choose a cover — a preset colour or your own photo.", image: null },
      { heading: "Choose a Cover", body: "Pick from six preset cover colours or upload any image from your device. Your cover is always editable from the journal options menu.", image: null },
      { heading: "Opening a Journal", body: "Click any journal card on the shelf to open it. You'll land on the cover page first — use the arrows at the bottom to move between spreads.", image: null },
    ],
  },
  {
    id: "journal", label: "The Journal",
    steps: [
      { heading: "Navigating Spreads", body: "Use the ← → arrows at the bottom to flip between your cover and spreads. You can also use the arrow keys on your keyboard.", image: null },
      { heading: "Adding a Spread", body: "Press the + button in the bottom bar to add a new spread. You'll be prompted to choose a template first.", image: null },
      { heading: "Renaming & Deleting", body: "Click the spread title beneath the page to rename it inline. Use the trash icon in the bottom bar to delete the current spread.", image: null },
      { heading: "Editing a Spread", body: "Click the pencil icon or tap anywhere on the spread preview to open it in the editor.", image: null },
    ],
  },
  {
    id: "editor", label: "The Editor",
    steps: [
      { heading: "Drawing", body: "Select the pen tool in the left toolbar. Choose your brush size and colour from the floating panel that appears. Switch to the eraser to remove strokes.", image: null },
      { heading: "Adding Text", body: "Select the text tool (T) and click anywhere on the spread to place a text box. Double-click any existing text to edit it.", image: null },
      { heading: "Adding Images", body: "Click the image tool to upload a photo from your device. Once placed, you can resize, reposition, crop, and flip it.", image: null },
      { heading: "Selecting & Editing Objects", body: "Use the select tool to tap any object. A context panel appears with options for opacity, colour, and more. Use the layer buttons to move objects forward or back.", image: null },
      { heading: "Undo & Redo", body: "Use the undo/redo buttons in the toolbar, or ⌘Z / ⌘⇧Z on your keyboard. Changes are tracked per session.", image: null },
      { heading: "Saving", body: "Press '✓ Save' in the top-right to save your spread and return to the journal view. Navigating away without saving will discard unsaved changes.", image: null },
    ],
  },
  {
    id: "tiers", label: "Free vs Pro",
    steps: [
      { heading: "Free Plan", body: "Create up to 3 journals. Access all four basic templates: Blank, Dotted, Grid, and Lined. Full use of the drawing, text, and image tools.", image: null },
      { heading: "Free Pack Redemption", body: "Every new account can redeem one free Pro template pack — choose from Planner, Cooking Journal, Reading Journal, Movie Journal, or Tracker.", image: null },
      { heading: "Pro Plan", body: "Unlimited journals and access to all template categories including Planner, Cooking Journal, Reading Journal, Movie Journal, and Tracker.", image: null },
      { heading: "Upgrading", body: "Tap '✦ Upgrade to Pro' in the nav bar or inside the template picker to see pricing and unlock all features.", image: null },
    ],
  },
];

export function HelpButton({ onOpen }) {
  return (
    <button onClick={onOpen} title="Help & Guide"
      style={{ width:32,height:32,borderRadius:"0%",border:"1px solid rgba(55,67,117,0.3)",background:"var(--cloud)",color:"var(--periwinkle)",fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.14s",flexShrink:0,fontFamily:"'Inter',sans-serif",lineHeight:1 }}
      onMouseEnter={e=>{ e.currentTarget.style.background="var(--cloud)"; e.currentTarget.style.color="var(--navy)"; e.currentTarget.style.borderColor="var(--navy)"; }}
      onMouseLeave={e=>{ e.currentTarget.style.background="var(--cloud)"; e.currentTarget.style.color="var(--periwinkle)"; e.currentTarget.style.borderColor="rgba(55,67,117,0.3)"; }}>?</button>
  );
}

export function HelpModal({ onClose, initialTab = 0 }) {
  const [activeTab,  setActiveTab]  = useState(initialTab);
  const [activeStep, setActiveStep] = useState(0);

  const tab   = HELP_TABS[activeTab];
  const step  = tab.steps[activeStep];
  const total = tab.steps.length;
  const goTab = (i) => { setActiveTab(i); setActiveStep(0); };

  const tabStyle = (active) => ({
    padding: "9px 0", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase",
    background: "none", border: "none",
    borderBottom: active ? "2px solid var(--navy)" : "2px solid transparent",
    marginBottom: -1, color: active ? "var(--navy)" : "rgba(186,189,226,0.7)",
    cursor: "pointer", transition: "all 0.14s", fontFamily: "'Inter',sans-serif", flex: 1,
  });

  return (
    <div onClick={onClose}
      style={{ position:"fixed",inset:0,background:"rgba(55,67,117,0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1200,backdropFilter:"blur(5px)" }}>
      <div onClick={e=>e.stopPropagation()} className="fu"
        style={{ background:"var(--cloud)",width:520,maxWidth:"95vw",maxHeight:"90vh",display:"flex",flexDirection:"column",boxShadow:"0 4px 64px rgba(55,67,117,0.2)",border:"1px solid rgba(186,189,226,0.3)" }}>

        <div style={{ padding:"24px 28px 0",borderBottom:"1px solid rgba(186,189,226,0.25)",flexShrink:0 }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
            <div style={{ fontSize:10,fontWeight:600,letterSpacing:"0.18em",textTransform:"uppercase",color:"var(--navy)" }}>Help & Guide</div>
            <button onClick={onClose}
              style={{ background:"none",border:"none",fontSize:16,color:"var(--periwinkle)",cursor:"pointer",lineHeight:1,padding:0,transition:"color 0.12s" }}
              onMouseEnter={e=>e.currentTarget.style.color="var(--navy)"}
              onMouseLeave={e=>e.currentTarget.style.color="var(--periwinkle)"}>✕</button>
          </div>
          <div style={{ display:"flex" }}>
            {HELP_TABS.map((t,i) => (
              <button key={t.id} onClick={()=>goTab(i)} style={tabStyle(activeTab===i)}>{t.label}</button>
            ))}
          </div>
        </div>

        <div style={{ margin:"24px 28px 0",background:"rgba(186,189,226,0.12)",border:"1px dashed rgba(186,189,226,0.45)",height:188,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden" }}>
          {step.image
            ? <img src={step.image} alt={step.heading} style={{ width:"100%",height:"100%",objectFit:"cover" }} />
            : <div style={{ textAlign:"center",userSelect:"none" }}>
                <div style={{ fontSize:28,marginBottom:6,opacity:0.2 }}>◻</div>
                <div style={{ fontSize:9,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--periwinkle)" }}>image placeholder</div>
              </div>
          }
        </div>

        <div style={{ padding:"20px 28px 4px",flex:1,minHeight:0,overflowY:"auto" }}>
          <div style={{ fontSize:9,letterSpacing:"0.14em",textTransform:"uppercase",color:"var(--periwinkle)",marginBottom:8 }}>
            {activeStep + 1} / {total}
          </div>
          <div style={{ fontSize:13,fontWeight:600,color:"var(--navy)",marginBottom:8,letterSpacing:"0.01em" }}>{step.heading}</div>
          <div style={{ fontSize:12,color:"rgba(55,67,117,0.7)",lineHeight:1.75 }}>{step.body}</div>
        </div>

        <div style={{ padding:"16px 28px",borderTop:"1px solid rgba(186,189,226,0.2)",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0 }}>
          <div style={{ display:"flex",gap:5,alignItems:"center" }}>
            {tab.steps.map((_,i) => (
              <div key={i} onClick={()=>setActiveStep(i)}
                style={{ width:i===activeStep?16:5,height:5,borderRadius:3,background:i===activeStep?"var(--navy)":"rgba(186,189,226,0.45)",cursor:"pointer",transition:"all 0.2s" }} />
            ))}
          </div>
          <div style={{ display:"flex",gap:8 }}>
            <button onClick={()=>setActiveStep(s=>Math.max(0,s-1))} disabled={activeStep===0}
              style={{ padding:"6px 16px",fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",border:"1px solid rgba(186,189,226,0.4)",background:"transparent",color:"var(--navy)",cursor:activeStep===0?"default":"pointer",opacity:activeStep===0?0.3:1,transition:"all 0.12s" }}
              onMouseEnter={e=>{ if(activeStep>0) e.currentTarget.style.background="rgba(186,189,226,0.15)"; }}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>← prev</button>
            {activeStep < total - 1
              ? <button onClick={()=>setActiveStep(s=>s+1)}
                  style={{ padding:"6px 16px",fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",border:"none",background:"var(--navy)",color:"var(--cloud)",cursor:"pointer",transition:"background 0.12s" }}
                  onMouseEnter={e=>e.currentTarget.style.background="var(--navy-dim)"}
                  onMouseLeave={e=>e.currentTarget.style.background="var(--navy)"}>next →</button>
              : <button onClick={onClose}
                  style={{ padding:"6px 16px",fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",border:"none",background:"var(--periwinkle)",color:"var(--navy)",cursor:"pointer",transition:"background 0.12s" }}
                  onMouseEnter={e=>e.currentTarget.style.background="#a8abce"}
                  onMouseLeave={e=>e.currentTarget.style.background="var(--periwinkle)"}>done ✓</button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}