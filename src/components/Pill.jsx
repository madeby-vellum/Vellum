export function PaletteIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ pointerEvents:"none" }}>
      <path d="M8 1.5C4.41 1.5 1.5 4.41 1.5 8c0 3.04 2.1 5.58 4.95 6.28.27.07.55-.13.55-.41v-1.4c-1.67.36-2.02-.8-2.02-.8-.27-.7-.67-.88-.67-.88-.55-.37.04-.36.04-.36.61.04.93.62.93.62.54.92 1.41.65 1.76.5.05-.39.21-.65.38-.8-1.33-.15-2.73-.67-2.73-2.96 0-.65.23-1.19.62-1.6-.06-.15-.27-.76.06-1.58 0 0 .51-.16 1.66.62a5.8 5.8 0 0 1 3.02 0c1.15-.78 1.66-.62 1.66-.62.33.82.12 1.43.06 1.58.39.42.62.95.62 1.6 0 2.3-1.4 2.8-2.74 2.95.22.19.41.55.41 1.11v1.65c0 .28.28.49.56.41C12.4 13.58 14.5 11.04 14.5 8c0-3.59-2.91-6.5-6.5-6.5z" fill="currentColor" style={{ color:"var(--periwinkle)" }}/>
      <circle cx="5.5" cy="7" r="0.9" fill="#b5541a"/>
      <circle cx="7.5" cy="5.5" r="0.9" fill="#2d5a4e"/>
      <circle cx="9.5" cy="5.5" r="0.9" fill="#3d5a6e"/>
      <circle cx="11" cy="7" r="0.9" fill="#8a4a6e"/>
    </svg>
  );
}

export default function Pill({ children, dark, onClick, style }) {
  return (
    <button onClick={onClick} className={dark ? "pill pill-dark" : "pill pill-light"} style={style}>
      {children}
    </button>
  );
}
