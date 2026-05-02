import { useState, useEffect, useRef } from "react";
import SpreadCanvas from "./SpreadCanvas.jsx";
import PenStrip from "./PenStrip.jsx";
import { IBtn, VDivider } from "./PenStrip.jsx";
import SelCtxBar from "./SelCtxBar.jsx";
import { STICKERS } from "../constants.js";

/* ─── StickerPickerPopup ─────────────────────────────────────── */
function StickerPickerPopup({ onClose, actionsRef }) {
  const handlePick = (sticker) => {
    actionsRef.current?.addImageFromURL(sticker.src);
    onClose();
  };

  return (
    <div onClick={onClose}
      style={{ position:"fixed",inset:0,background:"rgba(55,67,117,0.35)",display:"flex",alignItems:"center",
        justifyContent:"center",zIndex:2000,backdropFilter:"blur(5px)" }}>
      <div onClick={e=>e.stopPropagation()} className="fu"
        style={{ background:"var(--cloud)",width:360,maxWidth:"95vw",
          boxShadow:"0 4px 48px rgba(55,67,117,0.20)",border:"1px solid rgba(186,189,226,0.35)",
          display:"flex",flexDirection:"column",maxHeight:"75vh" }}>
        <div style={{ padding:"14px 16px 12px",borderBottom:"1px solid rgba(186,189,226,0.2)",
          display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0 }}>
          <span style={{ fontSize:10,letterSpacing:"0.13em",textTransform:"uppercase",color:"var(--navy)",fontWeight:500 }}>Stickers</span>
          <button onClick={onClose}
            style={{ background:"none",border:"none",fontSize:15,color:"var(--periwinkle)",cursor:"pointer",lineHeight:1,padding:"0 2px",transition:"color 0.12s" }}
            onMouseEnter={e=>e.currentTarget.style.color="var(--navy)"}
            onMouseLeave={e=>e.currentTarget.style.color="var(--periwinkle)"}>✕</button>
        </div>
        <div style={{ flex:1,overflowY:"auto",padding:"12px" }}>
          {STICKERS.length === 0 ? (
            <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:160,gap:10,color:"var(--periwinkle)" }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M11 13a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm10 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" fill="currentColor"/>
                <path d="M10 20s1.5 3 6 3 6-3 6-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span style={{ fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",textAlign:"center",lineHeight:1.6 }}>
                No stickers yet.<br/>Add your image URLs to the<br/><code style={{fontFamily:"monospace",fontSize:9}}>STICKERS</code> array in constants.js
              </span>
            </div>
          ) : (
            <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8 }}>
              {STICKERS.map(s => (
                <div key={s.id} onClick={()=>handlePick(s)}
                  style={{ aspectRatio:"1",overflow:"hidden",cursor:"pointer",border:"1px solid transparent",transition:"all 0.12s",padding:4 }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--periwinkle)";e.currentTarget.style.background="rgba(186,189,226,0.12)";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="transparent";e.currentTarget.style.background="transparent";}}>
                  <img src={s.src} alt={s.id}
                    style={{ width:"100%",height:"100%",objectFit:"contain",display:"block",transition:"transform 0.12s" }}
                    onMouseEnter={e=>e.currentTarget.style.transform="scale(1.08)"}
                    onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── UnsplashSearchPopup ───────────────────────────────────── */
function UnsplashSearchPopup({ onClose, actionsRef }) {
  const [query, setQuery] = useState("nature");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

  const search = async (q) => {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=16&orientation=landscape`,
        { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` } }
      );
      const data = await res.json();
      setImages(data.results || []);
    } catch(e) { setImages([]); }
    setLoading(false);
  };

  useEffect(() => { search("nature"); inputRef.current?.focus(); }, []);

  const handlePick = (img) => {
    actionsRef.current?.addImageFromURL(img.urls.small);
    onClose();
  };

  return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(55,67,117,0.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000,backdropFilter:"blur(6px)" }}>
      <div onClick={e=>e.stopPropagation()} className="fu"
        style={{ background:"var(--cloud)",width:600,maxWidth:"95vw",maxHeight:"85vh",display:"flex",flexDirection:"column",
          boxShadow:"0 4px 64px rgba(55,67,117,0.22)",border:"1px solid rgba(186,189,226,0.35)" }}>
        <div style={{ padding:"18px 20px 14px",borderBottom:"1px solid rgba(186,189,226,0.25)",display:"flex",alignItems:"center",gap:10,flexShrink:0 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color:"var(--periwinkle)",flexShrink:0 }}>
            <circle cx="6" cy="6" r="4.2" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M9.5 9.5l2.8 2.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <input ref={inputRef} value={query} onChange={e=>setQuery(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Enter") search(query); }}
            placeholder="Search photos…"
            style={{ flex:1,border:"none",outline:"none",background:"transparent",fontSize:13,color:"var(--navy)",fontFamily:"'Inter',sans-serif" }} />
          <button onClick={()=>search(query)}
            style={{ padding:"5px 14px",fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",border:"1px solid rgba(186,189,226,0.5)",background:"transparent",color:"var(--periwinkle)",cursor:"pointer",flexShrink:0,transition:"all 0.12s" }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--navy)";e.currentTarget.style.color="var(--navy)";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(186,189,226,0.5)";e.currentTarget.style.color="var(--periwinkle)";}}>
            Search
          </button>
          <button onClick={onClose}
            style={{ background:"none",border:"none",fontSize:16,color:"var(--periwinkle)",cursor:"pointer",padding:"0 0 0 6px",flexShrink:0,transition:"color 0.12s" }}
            onMouseEnter={e=>e.currentTarget.style.color="var(--navy)"}
            onMouseLeave={e=>e.currentTarget.style.color="var(--periwinkle)"}>✕</button>
        </div>
        <div style={{ flex:1,overflowY:"auto",padding:12 }}>
          {loading ? (
            <div style={{ display:"flex",alignItems:"center",justifyContent:"center",height:200,fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--periwinkle)" }}>Loading…</div>
          ) : images.length === 0 ? (
            <div style={{ display:"flex",alignItems:"center",justifyContent:"center",height:200,fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--periwinkle)" }}>No results</div>
          ) : (
            <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6 }}>
              {images.map(img => (
                <div key={img.id} onClick={()=>handlePick(img)}
                  style={{ aspectRatio:"4/3",overflow:"hidden",cursor:"pointer",position:"relative",border:"1px solid transparent",transition:"border-color 0.12s" }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--periwinkle)";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="transparent";}}>
                  <img src={img.urls.thumb} alt={img.alt_description||"photo"}
                    style={{ width:"100%",height:"100%",objectFit:"cover",display:"block",transition:"transform 0.15s" }}
                    onMouseEnter={e=>e.currentTarget.style.transform="scale(1.04)"}
                    onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"} />
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ padding:"8px 16px",borderTop:"1px solid rgba(186,189,226,0.2)",flexShrink:0,fontSize:9,letterSpacing:"0.08em",color:"rgba(55,67,117,0.4)",textAlign:"right" }}>
          Photos by Unsplash
        </div>
      </div>
    </div>
  );
}

/* ─── ImageStrip ─────────────────────────────────────────────── */
function ImageStrip({ actionsRef, onOpenUnsplash, onOpenStickers, hasImageSelected, imgOpacity, onImgOpacity, isCropping, onCrop, onFlipH, onFlipV }) {
  const UploadIco = () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="1" y="2" width="13" height="11" rx="1.2" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M7.5 9.5V5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M5.5 7.5l2-2 2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  const SearchIco = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M9.2 9.2l2.6 2.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M4.5 6h3M6 4.5v3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.7"/>
    </svg>
  );
  const StickerIco = () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.3"/>
      <circle cx="5.2" cy="6.2" r="0.9" fill="currentColor"/>
      <circle cx="9.8" cy="6.2" r="0.9" fill="currentColor"/>
      <path d="M5 9.5c.6 1.2 4.4 1.2 5 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
  const CropIco = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 1v9h9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M1 3h9v9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.55"/>
    </svg>
  );
  const FlipHIco = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 2v10M2 5l3 2-3 2M12 5l-3 2 3 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
  const FlipVIco = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 7h10M5 2l2 3-2 3M9 2l-2 3 2 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"8px 5px", gap:3 }}>
      <IBtn onClick={onOpenUnsplash} title="Search Unsplash photos"><SearchIco /></IBtn>
      <VDivider />
      <IBtn onClick={()=>actionsRef.current?.uploadImage()} title="Upload from device"><UploadIco /></IBtn>
      <VDivider />
      <IBtn onClick={onOpenStickers} title="Add sticker"><StickerIco /></IBtn>

      {hasImageSelected && <>
        <VDivider />
        <IBtn active={isCropping} onClick={onCrop} title={isCropping ? "Apply crop" : "Crop image"}><CropIco /></IBtn>
        <IBtn onClick={onFlipH} title="Flip horizontal"><FlipHIco /></IBtn>
        <IBtn onClick={onFlipV} title="Flip vertical"><FlipVIco /></IBtn>
        <VDivider />
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
          <input type="range" min={0} max={1} step={0.05} value={imgOpacity ?? 1}
            onChange={e=>onImgOpacity(parseFloat(e.target.value))}
            style={{ writingMode:"vertical-lr", direction:"rtl", width:4, height:60,
              accentColor:"var(--periwinkle)", cursor:"pointer", appearance:"slider-vertical" }} />
          <span style={{ fontSize:8, color:"var(--periwinkle)" }}>{Math.round((imgOpacity ?? 1)*100)}%</span>
        </div>
      </>}
    </div>
  );
}

/* ─── SpreadEditor ──────────────────────────────────────────── */
export default function SpreadEditor({ spread, onUpdate, onSave }) {
  const [tool,        setTool]        = useState(null);
  const [activeBrush, setActiveBrush] = useState("pen");
  const [penColor,    setPenColor]    = useState("#1a1a18");
  const [penSize,     setPenSize]     = useState(2);
  const [selectedObj, setSelectedObj] = useState(null);
  const [drawOpacity, setDrawOpacity] = useState(1);
  const [drawWidth,   setDrawWidth]   = useState(2);
  const [imgOpacity,  setImgOpacity]  = useState(1);
  const [textFont,    setTextFont]    = useState("Libre Baskerville, serif");
  const [textSize,    setTextSize]    = useState(20);
  const [textColor,   setTextColor]   = useState("#1a1a18");
  const [isCropping,  setIsCropping]  = useState(false);
  const [showUnsplash, setShowUnsplash] = useState(false);
  const [showStickers, setShowStickers] = useState(false);
  const actionsRef = useRef(null);

  const [zoom, setZoom] = useState(1);
  const zoomIn  = () => setZoom(z => Math.min(3, parseFloat((z + 0.1).toFixed(1))));
  const zoomOut = () => setZoom(z => Math.max(0.3, parseFloat((z - 0.1).toFixed(1))));

  useEffect(() => {
    const slot = document.getElementById("spread-editor-save-slot");
    if (!slot) return;
    slot.innerHTML = "";
    const btn = document.createElement("button");
    btn.textContent = "✓ save";
    btn.style.cssText = `padding:9px 16px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;background:var(--cloud);color:var(--navy);border:none;cursor:pointer;font-family:inherit;`;
    btn.onclick = () => onSave({ ...spread, canvas: actionsRef.current?.save() });
    slot.appendChild(btn);
    return () => { slot.innerHTML = ""; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handler = e => {
      const active = document.activeElement;
      if (active?.tagName === "INPUT" || active?.tagName === "TEXTAREA") return;
      if ((e.ctrlKey||e.metaKey) && e.key==="z" && !e.shiftKey) { e.preventDefault(); actionsRef.current?.undo(); }
      if ((e.ctrlKey||e.metaKey) && (e.key==="y"||(e.key==="z"&&e.shiftKey))) { e.preventDefault(); actionsRef.current?.redo(); }
      if (e.key==="Delete"||e.key==="Backspace") actionsRef.current?.deleteSelected();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const selType = !selectedObj ? null
    : (selectedObj.type==="path"||selectedObj.type==="group") ? "drawing"
    : selectedObj.type==="image" ? "image"
    : selectedObj._isSticker ? null
    : (selectedObj.type==="i-text"||selectedObj.type==="text") ? "text"
    : null;

  const hasSelection = !!selType;
  const showPenStrip  = tool === "pen";
  const showImgStrip  = tool === "image" || selType === "image";
  const showSelBar    = !showPenStrip && !showImgStrip && !!selType && selType !== "image";
  const showCtxPanel  = showPenStrip || showImgStrip || showSelBar;

  const handleSelect = obj => {
    if (tool === "pen") return;
    const o = obj && !obj.isTemplate && !obj.isEraserStroke && !obj._isCropRect ? obj : null;
    if (obj && obj._isCropRect) return;
    setSelectedObj(o);
    if (!o) { setIsCropping(false); return; }
    if (o.type==="path"||o.type==="group") { setDrawOpacity(o.opacity??1); setDrawWidth(o.strokeWidth??2); setPenColor(o.stroke||o.fill||"#1a1a18"); }
    else if (o.type==="image") { setImgOpacity(o.opacity??1); }
    else if (o.type==="i-text"||o.type==="text") { setTextFont(o.fontFamily||"Libre Baskerville, serif"); setTextSize(o.fontSize||20); setTextColor(o.fill||"#1a1a18"); }
  };

  const selectTool = id => {
    const canvas = window._fabricCanvas;
    if (canvas) { canvas.discardActiveObject(); canvas.renderAll(); }
    setSelectedObj(null);
    if (id==="image") { const next = tool==="image" ? null : "image"; setTool(next); actionsRef.current?.setTool("select"); return; }
    if (id==="select") { setTool(null); actionsRef.current?.setTool("select"); return; }
    const next = tool===id ? null : id;
    setTool(next);
    if (!next) { actionsRef.current?.setTool("select"); return; }
    if (next==="pen") { setActiveBrush("pen"); actionsRef.current?.setTool("pen", {color:penColor,size:penSize}); }
    else { actionsRef.current?.setTool(next, {color:penColor,size:penSize}); }
  };

  const switchBrush    = b => { setActiveBrush(b); actionsRef.current?.setTool(b, {color:penColor,size:penSize}); };
  const handlePenColor = c => { setPenColor(c); actionsRef.current?.updateBrush?.(c, penSize); };
  const handlePenSize  = s => { setPenSize(s);  actionsRef.current?.updateBrush?.(penColor, s); };

  const floatCard = {
    background:"rgba(255,252,245,0.96)",
    borderRadius:0,
    boxShadow:"0 2px 16px rgba(55,67,117,0.13), 0 0 0 1px rgba(186,189,226,0.35)",
    backdropFilter:"blur(8px)",
  };

  const SelectIco = () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 1.5l7.5 4.2-3.8.95-1.88 4.25L1.5 1.5z" fill="currentColor"/></svg>;
  const PenIco    = () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M8.8 2.2l2 2-6.5 6.5-2.3.5.5-2.3 6.3-6.7z" stroke="currentColor" strokeWidth="1.4" fill="none"/></svg>;
  const ImgIco    = () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="1" y="2" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M1 10l3.5-3.5 2.5 2.5 2-2 4 4" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      <circle cx="10.5" cy="5.5" r="1.2" fill="currentColor"/>
    </svg>
  );
  const UndoIco = () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M2.5 6.5H9a3.5 3.5 0 010 7H5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2.5 6.5L5 4M2.5 6.5L5 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  const RedoIco = () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M12.5 6.5H6a3.5 3.5 0 000 7h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12.5 6.5L10 4M12.5 6.5L10 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  const FrontIco = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 2.5v9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M3.5 6L7 2.5 10.5 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  const BackIco = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 11.5v-9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M3.5 8L7 11.5 10.5 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  const TrashIco  = () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 3.5h9M5 3.5V2.5h3v1M4 3.5l.5 7h4l.5-7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;

  return (
    <div className="fi" style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      <div style={{ flex:1, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}>
          <div style={{ transform:`scale(${zoom})`, transformOrigin:"center center", transition:"transform 0.15s ease",
            boxShadow:"var(--sh-lg)", height:"min(580px,calc(100vh - 100px))", width:"min(880px,100%)", flexShrink:0, borderRadius:0, overflow:"hidden" }}>
            <SpreadCanvas spread={spread} editMode={true} actionsRef={actionsRef}
              onSelect={handleSelect} onToolReset={()=>setTool(null)} />
          </div>
        </div>

        {/* Main toolbar */}
        <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", display:"flex", flexDirection:"column", alignItems:"center", padding:"8px 5px", gap:2, zIndex:10, ...floatCard }}>
          <IBtn active={false}        onClick={()=>selectTool("select")} title="Select"><SelectIco /></IBtn>
          <IBtn active={tool==="pen"} onClick={()=>selectTool("pen")}    title="Draw"><PenIco /></IBtn>
          <IBtn active={tool==="text"} onClick={()=>selectTool("text")}  title="Text"
            style={{ fontFamily:"'Libre Baskerville',serif", fontWeight:700, fontSize:17 }}>T</IBtn>
          <IBtn active={tool==="image"} onClick={()=>selectTool("image")} title="Image"><ImgIco /></IBtn>
          <VDivider />
          <IBtn onClick={()=>actionsRef.current?.undo()} title="Undo (⌘Z)"><UndoIco /></IBtn>
          <IBtn onClick={()=>actionsRef.current?.redo()} title="Redo (⌘⇧Z)"><RedoIco /></IBtn>
          <VDivider />
          <IBtn disabled={!hasSelection} onClick={()=>actionsRef.current?.bringToFront()} title="Move forward one layer"><FrontIco /></IBtn>
          <IBtn disabled={!hasSelection} onClick={()=>actionsRef.current?.sendToBack()}   title="Move back one layer"><BackIco /></IBtn>
          <VDivider />
          <IBtn disabled={!hasSelection} danger onClick={()=>actionsRef.current?.deleteSelected()} title="Delete selected"><TrashIco /></IBtn>
        </div>

        {/* Context panel */}
        {showCtxPanel && (
          <div style={{ position:"absolute", left:62, top:"50%", transform:"translateY(-50%)", maxHeight:"calc(100% - 40px)", overflowY:"auto", zIndex:10, ...floatCard, animation:"fadeIn 0.18s ease both" }}>
            {showPenStrip && (
              <PenStrip activeBrush={activeBrush} penColor={penColor} penSize={penSize}
                onSwitchBrush={switchBrush} onColorChange={handlePenColor} onSizeChange={handlePenSize} />
            )}
            {showImgStrip && (
              <ImageStrip actionsRef={actionsRef} onOpenUnsplash={()=>setShowUnsplash(true)} onOpenStickers={()=>setShowStickers(true)}
                hasImageSelected={selType==="image"}
                imgOpacity={imgOpacity} onImgOpacity={v=>{ setImgOpacity(v); actionsRef.current?.applyToSelected({opacity:v}); }}
                isCropping={isCropping}
                onCrop={()=>{ actionsRef.current?.cropImage(); setIsCropping(c=>!c); }}
                onFlipH={()=>actionsRef.current?.flipH()}
                onFlipV={()=>actionsRef.current?.flipV()} />
            )}
            {showSelBar && (
              <SelCtxBar selType={selType} penColor={penColor}
                drawWidth={drawWidth} drawOpacity={drawOpacity}
                imgOpacity={imgOpacity} textFont={textFont} textSize={textSize} textColor={textColor}
                actionsRef={actionsRef} isCropping={isCropping}
                onCrop={()=>{ const wasC = isCropping; actionsRef.current?.cropImage(); setIsCropping(!wasC); }}
                onCropCancel={()=>{ actionsRef.current?.cancelCrop(); setIsCropping(false); }}
                onPenColor={setPenColor} onDrawWidth={setDrawWidth} onDrawOpacity={setDrawOpacity}
                onImgOpacity={setImgOpacity} onTextFont={setTextFont} onTextSize={setTextSize} onTextColor={setTextColor} />
            )}
          </div>
        )}

        {/* Crop bar */}
        {isCropping && (
          <div style={{ position:"absolute", bottom:20, left:"50%", transform:"translateX(-50%)",
            display:"flex", gap:8, zIndex:20, ...floatCard, padding:"6px 10px", animation:"fadeIn 0.15s ease" }}>
            <button onClick={()=>{ actionsRef.current?.cancelCrop(); setIsCropping(false); }}
              style={{ padding:"5px 14px", fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase",
                border:"1px solid rgba(186,189,226,0.5)", background:"transparent", color:"var(--navy)", cursor:"pointer" }}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(186,189,226,0.2)"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>cancel</button>
            <button onClick={()=>{ actionsRef.current?.cropImage(); setIsCropping(false); }}
              style={{ padding:"5px 14px", fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase",
                border:"none", background:"var(--periwinkle)", color:"var(--navy)", cursor:"pointer" }}
              onMouseEnter={e=>e.currentTarget.style.opacity="0.85"}
              onMouseLeave={e=>e.currentTarget.style.opacity="1"}>✓ apply crop</button>
          </div>
        )}

        {/* Zoom panel */}
        <div style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
          display:"flex", flexDirection:"column", alignItems:"center", padding:"8px 5px", gap:2, zIndex:10, ...floatCard }}>
          <IBtn onClick={zoomIn} title="Zoom in" disabled={zoom >= 3}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="6" cy="6" r="4.2" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M4.5 6h3M6 4.5v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              <path d="M9.5 9.5l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </IBtn>
          <div style={{ fontSize:8, color:"var(--periwinkle)", fontFamily:"'Inter',sans-serif",
            padding:"2px 0", letterSpacing:"0.04em", textAlign:"center", minWidth:28 }}>
            {Math.round(zoom * 100)}%
          </div>
          <IBtn onClick={zoomOut} title="Zoom out" disabled={zoom <= 0.3}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="6" cy="6" r="4.2" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M4.5 6h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              <path d="M9.5 9.5l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </IBtn>
          <VDivider />
          <IBtn onClick={()=>setZoom(1)} title="Reset zoom"
            style={{ fontSize:8, fontFamily:"'Inter',sans-serif", letterSpacing:"0.02em" }}>1:1</IBtn>
        </div>
      </div>

      {showStickers && <StickerPickerPopup actionsRef={actionsRef} onClose={()=>setShowStickers(false)} />}
      {showUnsplash && (
        <UnsplashSearchPopup actionsRef={actionsRef} onClose={()=>setShowUnsplash(false)}
          onSelect={url=>{ actionsRef.current?.addImageFromURL(url); setShowUnsplash(false); }} />
      )}
    </div>
  );
}
