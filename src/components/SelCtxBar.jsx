import { useState } from "react";
import { IBtn, VDivider, ColorCol } from "./PenStrip.jsx";
import { Crop, FlipHorizontal2, FlipVertical2 } from "lucide-react";
import "./SelCtxBar.css";

const FONTS = [
  { label: "Serif", value: "Libre Baskerville, serif", cls: "sel-font-btn--serif" },
  { label: "Mono",  value: "Inter, sans-serif",        cls: "sel-font-btn--mono"  },
  { label: "Sans",  value: "system-ui, sans-serif",    cls: "sel-font-btn--sans"  },
];

const SIZE_PRESETS = [
  { label: "S", value: 12 },
  { label: "M", value: 18 },
  { label: "L", value: 28 },
];

const STROKE_SIZES = [
  { s: 1, d: 6  },
  { s: 2, d: 9  },
  { s: 4, d: 13 },
  { s: 8, d: 18 },
];

export default function SelCtxBar({
  selType, penColor, drawWidth, drawOpacity, imgOpacity,
  textFont, textSize, textColor, actionsRef, isCropping,
  onCrop, onCropCancel, onPenColor, onDrawWidth, onDrawOpacity,
  onImgOpacity, onTextFont, onTextSize, onTextColor,
}) {
  if (!selType) return null;

  const apply = props => actionsRef.current?.applyToSelected(props);
  const [customSize, setCustomSize] = useState(null);

  return (
    <div className="sel-ctx-bar">

      {selType === "drawing" && <>
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

        <div className="sel-opacity-group">
          <input
            type="range" min={0} max={1} step={0.05} value={drawOpacity}
            onChange={e => { const v = parseFloat(e.target.value); onDrawOpacity(v); apply({ opacity: v }); }}
            className="sel-opacity-slider"
          />
          <span className="sel-opacity-label">{Math.round(drawOpacity * 100)}%</span>
        </div>

        <VDivider />
        <ColorCol value={penColor} onChange={c => { onPenColor(c); apply({ stroke: c }); }} />
      </>}

      {selType === "image" && <>
        <IBtn active={isCropping} onClick={onCrop} title={isCropping ? "Apply crop" : "Crop image"}>
          <Crop size={14} />
        </IBtn>
        <IBtn onClick={() => actionsRef.current?.flipH()} title="Flip horizontal">
          <FlipHorizontal2 size={14} />
        </IBtn>
        <IBtn onClick={() => actionsRef.current?.flipV()} title="Flip vertical">
          <FlipVertical2 size={14} />
        </IBtn>

        <VDivider />

        <div className="sel-opacity-group">
          <input
            type="range" min={0} max={1} step={0.05} value={imgOpacity}
            onChange={e => { const v = parseFloat(e.target.value); onImgOpacity(v); apply({ opacity: v }); }}
            className="sel-opacity-slider"
          />
          <span className="sel-opacity-label">{Math.round(imgOpacity * 100)}%</span>
        </div>
      </>}

      {selType === "text" && <>
        {FONTS.map(f => (
          <IBtn
            key={f.value}
            active={textFont === f.value}
            onClick={() => { onTextFont(f.value); apply({ fontFamily: f.value }); }}
            title={f.label}
            className={`sel-font-btn ${f.cls}`}
          >
            Aa
          </IBtn>
        ))}

        <VDivider />

        {SIZE_PRESETS.map(({ label, value }) => (
          <IBtn
            key={value}
            active={customSize === null && textSize === value}
            onClick={() => { setCustomSize(null); onTextSize(value); apply({ fontSize: value }); }}
            title={`${label} (${value}pt)`}
            className="sel-size-btn"
          >
            {label}
          </IBtn>
        ))}

        <div className="sel-size-input-wrap">
          <input
            type="number" min={6} max={200}
            value={customSize !== null ? customSize : textSize}
            onFocus={() => setCustomSize(textSize)}
            onChange={e => { const v = parseInt(e.target.value) || 12; setCustomSize(v); onTextSize(v); apply({ fontSize: v }); }}
            onBlur={() => setCustomSize(null)}
            className="sel-size-input"
          />
        </div>

        <VDivider />
        <ColorCol value={textColor} onChange={c => { onTextColor(c); apply({ fill: c }); }} />
      </>}

    </div>
  );
}