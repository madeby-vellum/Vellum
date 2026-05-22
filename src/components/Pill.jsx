import { Palette } from "lucide-react";

export function PaletteIcon() {
  return <Palette size={14} style={{ pointerEvents: "none", color: "var(--periwinkle)" }} />;
}

export default function Pill({ children, dark, onClick, style }) {
  return (
    <button onClick={onClick} className={dark ? "pill pill-dark" : "pill pill-light"} style={style}>
      {children}
    </button>
  );
}