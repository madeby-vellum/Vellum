// Import palette icon from lucide-react
import { Palette } from "lucide-react";

// Small reusable palette icon component
export function PaletteIcon() {
  return (

    // Prevent icon from blocking clicks
    <Palette
      size={14}
      style={{
        pointerEvents: "none",
        color: "var(--periwinkle)"
      }}
    />
  );
}

// Reusable pill-style button component
export default function Pill({
  children,
  dark,
  onClick,
  style
}) {
  return (
    <button

      // Click handler
      onClick={onClick}

      // Toggle between dark and light styles
      className={dark ? "pill pill-dark" : "pill pill-light"}

      // Optional inline styles
      style={style}
    >
      {children}
    </button>
  );
}