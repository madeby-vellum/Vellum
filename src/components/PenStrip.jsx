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
// Import icons
import { Pen, Eraser } from "lucide-react";

// Import palette icon component
import { PaletteIcon } from "./Pill.jsx";

// Import styles
import "./PenStrip.css";

// Small divider component
export const VDivider = () => <div className="pen-strip-divider" />;

// Reusable icon button component
export function IBtn({ children, active, disabled, onClick, title, danger }) {

  // Build class list based on state
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

// Color picker section component
export function ColorCol({ value, onChange }) {
  return (
    <div className="pen-color-col">

      {/* Current selected color preview */}
      <div className="pen-color-swatch" style={{ background: value }} />

      {/* Custom styled color input */}
      <label className="pen-color-label">
        <PaletteIcon />

        <input
          type="color"
          value={value}

          // Update selected color
          onChange={e => onChange(e.target.value)}

          className="pen-color-input"
        />
      </label>
    </div>
  );
}

// Available brush sizes
const SIZES = [
  { s: 1, d: 6 },
  { s: 2, d: 9 },
  { s: 4, d: 13 },
  { s: 8, d: 18 },
];

// Main pen toolbar component
export default function PenStrip({
  activeBrush,
  penColor,
  penSize,
  onSwitchBrush,
  onColorChange,
  onSizeChange
}) {

  // Check if eraser tool is selected
  const isEraser = activeBrush === "eraser";

  return (
    <div className="pen-strip">

      {/* Pen tool button */}
      <IBtn
        active={activeBrush === "pen"}
        onClick={() => onSwitchBrush("pen")}
        title="Pen"
      >
        <Pen size={14} />
      </IBtn>

      {/* Eraser tool button */}
      <IBtn
        active={isEraser}
        onClick={() => onSwitchBrush("eraser")}
        title="Eraser"
      >
        <Eraser size={15} />
      </IBtn>

      <VDivider />

      {/* Show disabled color picker while eraser is active */}
      {isEraser ? (
        <div className="pen-color-col--disabled">

          <div className="pen-color-swatch--disabled" />

          <div className="pen-color-label--disabled">
            <PaletteIcon />
          </div>
        </div>

      ) : (

        // Normal color picker
        <ColorCol value={penColor} onChange={onColorChange} />
      )}

      <VDivider />

      {/* Brush size selector dots */}
      {SIZES.map(({ s, d }) => (
        <div
          key={s}

          // Change brush size when clicked
          onClick={() => onSizeChange(s)}

          title={`Size ${s}`}

          // Add active class to selected size
          className={`pen-size-dot${penSize === s ? " active" : ""}`}

          // Dynamic dot size
          style={{ width: d, height: d }}
        />
      ))}
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