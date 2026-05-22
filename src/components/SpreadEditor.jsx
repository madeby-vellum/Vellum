import { MousePointer2, Pen, Image, Undo2, Redo2, BringToFront, SendToBack, Trash2, Upload, Search, Smile, Crop, FlipHorizontal2, FlipVertical2, ZoomIn, ZoomOut } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import SpreadCanvas from "./SpreadCanvas.jsx";
import PenStrip from "./PenStrip.jsx";
import { IBtn, VDivider } from "./PenStrip.jsx";
import SelCtxBar from "./SelCtxBar.jsx";
import { STICKERS } from "../constants.js";
import "./SpreadEditor.css";

/* ─── StickerPickerPopup ─────────────────────────────────────── */
// Popup UI for selecting predefined stickers and adding them to canvas
function StickerPickerPopup({ onClose, actionsRef }) {

  const handlePick = (sticker) => {
    // Inserts sticker image into canvas using its URL
    actionsRef.current?.addImageFromURL(sticker.src);
    onClose(); // close popup after selection
  };

  // UI for sticker picker with grid of available stickers
  return (
    <div onClick={onClose} className="sticker-backdrop">
      <div onClick={e => e.stopPropagation()} className="sticker-card fu">

        <div className="sticker-header">
          <span className="sticker-header-label">Stickers</span>
          <button onClick={onClose} className="sticker-header-close">✕</button>
        </div>

        <div className="sticker-body">
          {STICKERS.length === 0 ? (
            <div className="sticker-empty">
              <Smile size={32} strokeWidth={1.5} />
              <span className="sticker-empty-label">
                No stickers yet.<br />Add your image URLs to the<br /><code>STICKERS</code> array in constants.js
              </span>
            </div>
          ) : (
            <div className="sticker-grid">
              {STICKERS.map(s => (
                <div key={s.id} onClick={() => handlePick(s)} className="sticker-item">
                  <img src={s.src} alt={s.id} />
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
// Popup that lets user search and insert images from Unsplash API
function UnsplashSearchPopup({ onClose, actionsRef }) {
  const [query,   setQuery]   = useState("nature");
  const [images,  setImages]  = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

  // Fetch images from Unsplash based on query
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

  useEffect(() => { 
    search("nature"); // default initial search
    inputRef.current?.focus(); // auto-focus input on open
  }, []);

  const handlePick = (img) => {
    // Adds selected image (both sizes) into canvas
    actionsRef.current?.addImageFromURL(img.urls.regular);
    actionsRef.current?.addImageFromURL(img.urls.small);
    onClose();
  };

  // UI for unsplash image search with input, results grid, and loading/no results states
  return (
    <div onClick={onClose} className="unsplash-backdrop">
      <div onClick={e => e.stopPropagation()} className="unsplash-card fu">

        <div className="unsplash-search-bar">
          <Search size={14} className="unsplash-search-icon" />

          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") search(query); }}
            placeholder="Search photos…"
            className="unsplash-search-input"
          />

          <button onClick={() => search(query)} className="unsplash-search-btn">Search</button>
          <button onClick={onClose} className="unsplash-close">✕</button>
        </div>

        <div className="unsplash-body">
          {loading ? (
            <div className="unsplash-status">Loading…</div>
          ) : images.length === 0 ? (
            <div className="unsplash-status">No results</div>
          ) : (
            <div className="unsplash-grid">
              {images.map(img => (
                <div key={img.id} onClick={() => handlePick(img)} className="unsplash-thumb">
                  <img src={img.urls.thumb} alt={img.alt_description || "photo"} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="unsplash-footer">Photos by Unsplash</div>
      </div>
    </div>
  );
}

/* ─── ImageStrip ─────────────────────────────────────────────── */
// Toolbar shown when an image is selected or image tool is active
function ImageStrip({ actionsRef, onOpenUnsplash, onOpenStickers, hasImageSelected, imgOpacity, onImgOpacity, isCropping, onCrop, onFlipH, onFlipV }) {
  return (
    <div className="image-strip">
      <IBtn onClick={onOpenUnsplash} title="Search Unsplash photos"><Search size={14} /></IBtn>
      <VDivider />
      <IBtn onClick={() => actionsRef.current?.uploadImage()} title="Upload from device"><Upload size={15} /></IBtn>
      <VDivider />
      <IBtn onClick={onOpenStickers} title="Add sticker"><Smile size={15} /></IBtn>

      {hasImageSelected && <>
        <VDivider />

        {/* Crop toggle (apply vs activate) */}
        <IBtn active={isCropping} onClick={onCrop} title={isCropping ? "Apply crop" : "Crop image"}><Crop size={14} /></IBtn>

        <IBtn onClick={onFlipH} title="Flip horizontal"><FlipHorizontal2 size={14} /></IBtn>
        <IBtn onClick={onFlipV} title="Flip vertical"><FlipVertical2 size={14} /></IBtn>

        <VDivider />

        {/* Image opacity control */}
        <div className="image-strip-opacity-group">
          <input
            type="range" min={0} max={1} step={0.05} value={imgOpacity ?? 1}
            onChange={e => onImgOpacity(parseFloat(e.target.value))}
            className="image-strip-opacity-slider"
          />
          <span className="image-strip-opacity-label">{Math.round((imgOpacity ?? 1) * 100)}%</span>
        </div>
      </>}
    </div>
  );
}

/* ─── SpreadEditor ──────────────────────────────────────────── */
// Main editor that controls tools, canvas, state, and UI panels
export default function SpreadEditor({ spread, onUpdate, onSave }) {

  // Variables for tracking current tool, selection, pen settings, cropping state, and zoom level
  const [tool, setTool] = useState(null);
  const [activeBrush, setActiveBrush] = useState("pen");
  const [penColor, setPenColor] = useState("#1a1a18");
  const [penSize, setPenSize] = useState(2);
  const [selectedObj, setSelectedObj] = useState(null);
  const [drawOpacity, setDrawOpacity] = useState(1);
  const [drawWidth, setDrawWidth] = useState(2);
  const [imgOpacity, setImgOpacity] = useState(1);
  const [textFont, setTextFont] = useState("Libre Baskerville, serif");
  const [textSize, setTextSize] = useState(20);
  const [textColor, setTextColor] = useState("#1a1a18");
  const [isCropping, setIsCropping] = useState(false);
  const [showUnsplash, setShowUnsplash] = useState(false);
  const [showStickers, setShowStickers] = useState(false);
  const actionsRef = useRef(null);

  const [zoom, setZoom] = useState(1);

  const zoomIn = () => setZoom(z => Math.min(3, parseFloat((z + 0.1).toFixed(1))));
  const zoomOut = () => setZoom(z => Math.max(0.3, parseFloat((z - 0.1).toFixed(1))));

  useEffect(() => {
    const slot = document.getElementById("spread-editor-save-slot");
    if (!slot) return;
    slot.innerHTML = "";

    const btn = document.createElement("button");
    btn.textContent = "✓ save";

    // Injects styled save button into external DOM slot
    btn.onclick = () => onSave({ ...spread, canvas: actionsRef.current?.save() });

    slot.appendChild(btn);

    return () => { slot.innerHTML = ""; };
  }, []);

  // Global keyboard shortcuts for undo, redo, and delete
  useEffect(() => {
    // Keyboard shortcuts: undo, redo, delete
    const handler = e => {
      const active = document.activeElement;
      if (active?.tagName === "INPUT" || active?.tagName === "TEXTAREA") return;

      if ((e.ctrlKey||e.metaKey) && e.key==="z" && !e.shiftKey) actionsRef.current?.undo();
      if ((e.ctrlKey||e.metaKey) && (e.key==="y"||(e.key==="z"&&e.shiftKey))) actionsRef.current?.redo();
      if (e.key==="Delete"||e.key==="Backspace") actionsRef.current?.deleteSelected();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Determines selection type for context-sensitive UI based on selected object properties
  const selType = !selectedObj ? null
    : (selectedObj.type==="path"||selectedObj.type==="group") ? "drawing"
    : selectedObj.type==="image" ? "image"
    : selectedObj._isSticker ? null
    : (selectedObj.type==="i-text"||selectedObj.type==="text") ? "text"
    : null;

  // Determines which context panels to show based on current tool and selection
  const hasSelection = !!selType;
  const showPenStrip = tool === "pen";
  const showImgStrip = tool === "image" || selType === "image";
  const showSelBar = !showPenStrip && !showImgStrip && !!selType && selType !== "image";
  const showCtxPanel = showPenStrip || showImgStrip || showSelBar;

  // Handles object selection on canvas
  const handleSelect = obj => {
    if (tool === "pen") return;

    const o = obj && !obj.isTemplate && !obj.isEraserStroke && !obj._isCropRect ? obj : null;
    if (obj && obj._isCropRect) return;

    setSelectedObj(o);
    if (!o) { setIsCropping(false); return; }

    // Sync UI state with selected object type
    if (o.type==="path"||o.type==="group") {
      setDrawOpacity(o.opacity??1);
      setDrawWidth(o.strokeWidth??2);
      setPenColor(o.stroke||o.fill||"#1a1a18");
    } else if (o.type==="image") {
      setImgOpacity(o.opacity??1);
    } else if (o.type==="i-text"||o.type==="text") {
      setTextFont(o.fontFamily||"Libre Baskerville, serif");
      setTextSize(o.fontSize||20);
      setTextColor(o.fill||"#1a1a18");
    }
  };

  // Handles tool selection, toggling, and special cases for pen and image tools
  const selectTool = id => {
    const canvas = window._fabricCanvas;
    if (canvas) { canvas.discardActiveObject(); canvas.renderAll(); }

    setSelectedObj(null);

    // Image tool toggles on/off but always resets to select mode since image insertion is the main action, not selection
    if (id==="image") {
      const next = tool==="image" ? null : "image";
      setTool(next);
      actionsRef.current?.setTool("select");
      return;
    }

    // Select tool always resets to select mode (no active tool) since selection is default action; other tools toggle on/off
    if (id==="select") {
      setTool(null);
      actionsRef.current?.setTool("select");
      return;
    }

    // Toggle tool if clicking active, otherwise switch to new tool
    const next = tool===id ? null : id;
    setTool(next);

    // If clicking the active tool, toggle back to select; otherwise switch to new tool
    if (!next) {
      actionsRef.current?.setTool("select");
      return;
    }

    // If switching to pen, default to pen brush; otherwise set tool directly
    if (next==="pen") {
      setActiveBrush("pen");
      actionsRef.current?.setTool("pen", {color:penColor,size:penSize});
    } else {
      actionsRef.current?.setTool(next, {color:penColor,size:penSize});
    }
  };

  // Switches between pen and marker brushes, updating both state and canvas tool
  const switchBrush = b => {
    setActiveBrush(b);
    actionsRef.current?.setTool(b, {color:penColor,size:penSize});
  };

  // Updates pen color in state and canvas brush
  const handlePenColor = c => {
    setPenColor(c);
    actionsRef.current?.updateBrush?.(c, penSize);
  };

  // Updates pen size in state and canvas brush
  const handlePenSize = s => {
    setPenSize(s);
    actionsRef.current?.updateBrush?.(penColor, s);
  };

  return (
    <div className="spread-editor fi">
      <div className="spread-editor-stage">
        <div className="spread-editor-center">
          <div
            className="spread-editor-canvas-shell"
            style={{ transform: `scale(${zoom})` }}
          >
            <SpreadCanvas
              spread={spread}
              editMode={true}
              actionsRef={actionsRef}
              onSelect={handleSelect}
              onToolReset={() => setTool(null)}
            />
          </div>
        </div>

        {/* Main toolbar for tools and actions */}
        <div className="editor-toolbar float-card">
          {/* Selection buttons */}
          <IBtn active={false} onClick={() => selectTool("select")} title="Select"><MousePointer2 size={13} /></IBtn>
          <IBtn active={tool === "pen"} onClick={() => selectTool("pen")} title="Draw"><Pen size={13} /></IBtn>
          <IBtn active={tool === "text"} onClick={() => selectTool("text")} title="Text" className="editor-tool-text">T</IBtn>
          <IBtn active={tool === "image"} onClick={() => selectTool("image")} title="Image"><Image size={15} /></IBtn>

          <VDivider />

          {/* Undo/Redo buttons */}
          <IBtn onClick={() => actionsRef.current?.undo()} title="Undo (⌘Z)"><Undo2 size={15} /></IBtn>
          <IBtn onClick={() => actionsRef.current?.redo()} title="Redo (⌘⇧Z)"><Redo2 size={15} /></IBtn>

          <VDivider />

          {/* Bring to front / Send to back buttons */}
          <IBtn disabled={!hasSelection} onClick={() => actionsRef.current?.bringToFront()} title="Bring forward"><BringToFront size={14} /></IBtn>
          <IBtn disabled={!hasSelection} onClick={() => actionsRef.current?.sendToBack()} title="Send back"><SendToBack size={14} /></IBtn>

          <VDivider />

          {/* Delete button */}
          <IBtn disabled={!hasSelection} danger onClick={() => actionsRef.current?.deleteSelected()} title="Delete"><Trash2 size={13} /></IBtn>
        </div>

        {/* Context-sensitive tool panel */}
        {showCtxPanel && (
          <div className="editor-ctx-panel float-card">
            {showPenStrip && (
              <PenStrip activeBrush={activeBrush} penColor={penColor} penSize={penSize}
                onSwitchBrush={switchBrush} onColorChange={handlePenColor} onSizeChange={handlePenSize} />
            )}

            {/* Image tool strip */}
            {showImgStrip && (
              <ImageStrip
                actionsRef={actionsRef}
                onOpenUnsplash={() => setShowUnsplash(true)}
                onOpenStickers={() => setShowStickers(true)}
                hasImageSelected={selType === "image"}
                imgOpacity={imgOpacity}
                onImgOpacity={v => {
                  setImgOpacity(v);
                  actionsRef.current?.applyToSelected({opacity:v});
                }}
                isCropping={isCropping}
                onCrop={() => { actionsRef.current?.cropImage(); setIsCropping(c => !c); }}
                onFlipH={() => actionsRef.current?.flipH()}
                onFlipV={() => actionsRef.current?.flipV()}
              />
            )}

            {/* Selection context bar */}
            {showSelBar && (
              <SelCtxBar
                selType={selType}
                penColor={penColor}
                drawWidth={drawWidth}
                drawOpacity={drawOpacity}
                imgOpacity={imgOpacity}
                textFont={textFont}
                textSize={textSize}
                textColor={textColor}
                actionsRef={actionsRef}
                isCropping={isCropping}
                onCrop={() => { const wasC = isCropping; actionsRef.current?.cropImage(); setIsCropping(!wasC); }}
                onCropCancel={() => { actionsRef.current?.cancelCrop(); setIsCropping(false); }}
                onPenColor={setPenColor}
                onDrawWidth={setDrawWidth}
                onDrawOpacity={setDrawOpacity}
                onImgOpacity={setImgOpacity}
                onTextFont={setTextFont}
                onTextSize={setTextSize}
                onTextColor={setTextColor}
              />
            )}
          </div>
        )}

        {/* Crop confirmation bar */}
        {isCropping && (
          <div className="editor-crop-bar float-card">
            <button onClick={() => { actionsRef.current?.cancelCrop(); setIsCropping(false); }} className="editor-crop-btn-cancel">cancel</button>
            <button onClick={() => { actionsRef.current?.cropImage(); setIsCropping(false); }} className="editor-crop-btn-apply">✓ apply crop</button>
          </div>
        )}

        {/* Zoom controls */}
        <div className="editor-zoom-panel float-card">
          <IBtn onClick={zoomIn} title="Zoom in" disabled={zoom >= 3}><ZoomIn size={14} /></IBtn>
          <div className="editor-zoom-label">{Math.round(zoom * 100)}%</div>
          <IBtn onClick={zoomOut} title="Zoom out" disabled={zoom <= 0.3}><ZoomOut size={14} /></IBtn>
          <VDivider />
          <IBtn onClick={() => setZoom(1)} title="Reset zoom">1:1</IBtn>
        </div>
      </div>

      {/* Popup modals */}
      {showStickers && <StickerPickerPopup actionsRef={actionsRef} onClose={() => setShowStickers(false)} />}
      {showUnsplash && (
        <UnsplashSearchPopup
          actionsRef={actionsRef}
          onClose={() => setShowUnsplash(false)}
          onSelect={url => { actionsRef.current?.addImageFromURL(url); setShowUnsplash(false); }}
        />
      )}
    </div>
  );
}