import { Pen, Eraser } from "lucide-react";
import { PaletteIcon } from "./Pill.jsx";
import "./PenStrip.css";

export const VDivider = () => <div className="pen-strip-divider" />;

export function IBtn({ children, active, disabled, onClick, title, danger }) {
  const classes = [
    "pen-ibtn",
    active   ? "active"   : "",
    disabled ? "disabled" : "",
    danger   ? "danger"   : "",
  ].filter(Boolean).join(" ");

  return (
    <button
      onClick={disabled ? undefined : onClick}
      title={title}
      className={classes}
    >
      {children}
    </button>
  );
}

export function ColorCol({ value, onChange }) {
  return (
    <div className="pen-color-col">
      <div className="pen-color-swatch" style={{ background: value }} />
      <label className="pen-color-label">
        <PaletteIcon />
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="pen-color-input"
        />
      </label>
    </div>
  );
}

const SIZES = [
  { s: 1, d: 6 },
  { s: 2, d: 9 },
  { s: 4, d: 13 },
  { s: 8, d: 18 },
];

export default function PenStrip({ activeBrush, penColor, penSize, onSwitchBrush, onColorChange, onSizeChange }) {
  const isEraser = activeBrush === "eraser";

  return (
    <div className="pen-strip">
      <IBtn active={activeBrush === "pen"} onClick={() => onSwitchBrush("pen")} title="Pen">
        <Pen size={14} />
      </IBtn>
      <IBtn active={isEraser} onClick={() => onSwitchBrush("eraser")} title="Eraser">
        <Eraser size={15} />
      </IBtn>

      <VDivider />

      {isEraser ? (
        <div className="pen-color-col--disabled">
          <div className="pen-color-swatch--disabled" />
          <div className="pen-color-label--disabled">
            <PaletteIcon />
          </div>
        </div>
      ) : (
        <ColorCol value={penColor} onChange={onColorChange} />
      )}

      <VDivider />

      {SIZES.map(({ s, d }) => (
        <div
          key={s}
          onClick={() => onSizeChange(s)}
          title={`Size ${s}`}
          className={`pen-size-dot${penSize === s ? " active" : ""}`}
          style={{ width: d, height: d }}
        />
      ))}
    </div>
  );
}