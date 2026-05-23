import { Pen, Eraser } from "lucide-react";
import { PaletteIcon } from "./Pill.jsx";
import "./PenStrip.css";

// Divider component for separating sections in the pen strip
export const VDivider = () => <div className="pen-strip-divider" />;

// Button component for pen strip actions (pen, eraser, color picker)
export function IBtn({ children, active, disabled, onClick, title, danger }) {
  const classes = [
    "pen-ibtn",
    active   ? "active"   : "",
    disabled ? "disabled" : "",
    danger   ? "danger"   : "",
  ].filter(Boolean).join(" ");

  // If the button is disabled, we don't attach the onClick handler
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

// Component for selecting pen color, showing a swatch and a color input
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

// Predefined pen sizes with corresponding dot dimensions for the UI
const SIZES = [
  { s: 1, d: 6 },
  { s: 2, d: 9 },
  { s: 4, d: 13 },
  { s: 8, d: 18 },
];

// Main component for the pen strip
export default function PenStrip({ activeBrush, penColor, penSize, onSwitchBrush, onColorChange, onSizeChange }) {
  const isEraser = activeBrush === "eraser";

  // Render the pen strip with buttons
  return (
    <div className="pen-strip">
      {/* Pen and Eraser Buttons */}
      <IBtn active={activeBrush === "pen"} onClick={() => onSwitchBrush("pen")} title="Pen">
        <Pen size={14} />
      </IBtn>
      <IBtn active={isEraser} onClick={() => onSwitchBrush("eraser")} title="Eraser">
        <Eraser size={15} />
      </IBtn>

      <VDivider />

      {/* Color Picker */}
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

      {/* Size Selectors */}
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