import { useState } from "react";
import { IBtn, VDivider, ColorCol } from "./PenStrip.jsx";
import { Crop, FlipHorizontal2, FlipVertical2 } from "lucide-react";
import "./SelCtxBar.css";

// Font options for text objects
const FONTS = [
  { label: "Serif", value: "Libre Baskerville, serif", cls: "sel-font-btn--serif" },
  { label: "Mono",  value: "Inter, sans-serif",        cls: "sel-font-btn--mono"  },
  { label: "Sans",  value: "system-ui, sans-serif",    cls: "sel-font-btn--sans"  },
];

// Quick preset sizes for text
const SIZE_PRESETS = [
  { label: "S", value: 12 },
  { label: "M", value: 18 },
  { label: "L", value: 28 },
];

// Predefined stroke sizes for drawing selection UI
const STROKE_SIZES = [
  { s: 1, d: 6  },
  { s: 2, d: 9  },
  { s: 4, d: 13 },
  { s: 8, d: 18 },
];

// UI for Selection Context Bar - shows relevant controls based on selected object type
export default function SelCtxBar({
  selType, penColor, drawWidth, drawOpacity, imgOpacity,
  textFont, textSize, textColor, actionsRef, isCropping,
  onCrop, onCropCancel, onPenColor, onDrawWidth, onDrawOpacity,
  onImgOpacity, onTextFont, onTextSize, onTextColor,
}) {

  // If nothing is selected, render nothing
  if (!selType) return null;

  // Helper to apply changes directly to selected canvas object
  const apply = props => actionsRef.current?.applyToSelected(props);

  // Tracks custom text size input override state
  const [customSize, setCustomSize] = useState(null);

  return (
    <div className="sel-ctx-bar">

      {/* ───────────────── DRAWING CONTROLS ───────────────── */}
      {selType === "drawing" && <>

        {/* Stroke size presets */}
        {STROKE_SIZES.map(({ s, d }) => (
          <div
            key={s}
            onClick={() => { onDrawWidth(s); apply({ strokeWidth: s }); }}
            title={`Stroke ${s}`}
            className={`sel-stroke-dot${drawWidth === s ? " active" : ""}`}
            style={{ width: d, height: d }}
          />
        ))}

        <VDivider />

        {/* Opacity slider for drawing */}
        <div className="sel-opacity-group">
          <input
            type="range" min={0} max={1} step={0.05} value={drawOpacity}
            onChange={e => {
              const v = parseFloat(e.target.value);
              onDrawOpacity(v);
              apply({ opacity: v });
            }}
            className="sel-opacity-slider"
          />
          <span className="sel-opacity-label">
            {Math.round(drawOpacity * 100)}%
          </span>
        </div>

        <VDivider />

        {/* Stroke color picker */}
        <ColorCol
          value={penColor}
          onChange={c => {
            onPenColor(c);
            apply({ stroke: c });
          }}
        />
      </>}

      {/* ───────────────── IMAGE CONTROLS ───────────────── */}
      {selType === "image" && <>

        {/* Crop toggle */}
        <IBtn
          active={isCropping}
          onClick={onCrop}
          title={isCropping ? "Apply crop" : "Crop image"}
        >
          <Crop size={14} />
        </IBtn>

        {/* Flip horizontally */}
        <IBtn
          onClick={() => actionsRef.current?.flipH()}
          title="Flip horizontal"
        >
          <FlipHorizontal2 size={14} />
        </IBtn>

        {/* Flip vertically */}
        <IBtn
          onClick={() => actionsRef.current?.flipV()}
          title="Flip vertical"
        >
          <FlipVertical2 size={14} />
        </IBtn>

        <VDivider />

        {/* Image opacity control */}
        <div className="sel-opacity-group">
          <input
            type="range" min={0} max={1} step={0.05} value={imgOpacity}
            onChange={e => {
              const v = parseFloat(e.target.value);
              onImgOpacity(v);
              apply({ opacity: v });
            }}
            className="sel-opacity-slider"
          />
          <span className="sel-opacity-label">
            {Math.round(imgOpacity * 100)}%
          </span>
        </div>
      </>}

      {/* ───────────────── TEXT CONTROLS ───────────────── */}
      {selType === "text" && <>

        {/* Font selection buttons */}
        {FONTS.map(f => (
          <IBtn
            key={f.value}
            active={textFont === f.value}
            onClick={() => {
              onTextFont(f.value);
              apply({ fontFamily: f.value });
            }}
            title={f.label}
            className={`sel-font-btn ${f.cls}`}
          >
            Aa
          </IBtn>
        ))}

        <VDivider />

        {/* Quick font size presets */}
        {SIZE_PRESETS.map(({ label, value }) => (
          <IBtn
            key={value}
            active={customSize === null && textSize === value}
            onClick={() => {
              setCustomSize(null);
              onTextSize(value);
              apply({ fontSize: value });
            }}
            title={`${label} (${value}pt)`}
            className="sel-size-btn"
          >
            {label}
          </IBtn>
        ))}

        {/* Manual font size input */}
        <div className="sel-size-input-wrap">
          <input
            type="number" min={6} max={200}
            value={customSize !== null ? customSize : textSize}

            // Switch to manual control on focus
            onFocus={() => setCustomSize(textSize)}

            onChange={e => {
              const v = parseInt(e.target.value) || 12;
              setCustomSize(v);
              onTextSize(v);
              apply({ fontSize: v });
            }}

            // Reset custom override when leaving input
            onBlur={() => setCustomSize(null)}

            className="sel-size-input"
          />
        </div>

        <VDivider />

        {/* Text color picker */}
        <ColorCol
          value={textColor}
          onChange={c => {
            onTextColor(c);
            apply({ fill: c });
          }}
        />
      </>}

    </div>
  );
}