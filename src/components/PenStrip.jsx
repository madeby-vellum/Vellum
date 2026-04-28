import { PaletteIcon } from "./Pill.jsx";

export const VDivider = () => (
  <div style={{ width:24, height:1, background:"rgba(186,189,226,0.35)", margin:"6px auto" }} />
);

export function IBtn({ children, active, disabled, onClick, title, danger, style={} }) {
  const base = {
    width:34, height:34, border:"none", borderRadius:0, cursor: disabled ? "default" : "pointer",
    display:"flex", alignItems:"center", justifyContent:"center",
    background: active ? "var(--periwinkle)" : "transparent",
    color: disabled ? "rgba(186,189,226,0.4)"
         : danger   ? "var(--maroon)"
         : active   ? "var(--navy)"
         :            "rgba(55,67,117,0.6)",
    transition:"all 0.12s",
    opacity: disabled ? 0.45 : 1,
    ...style,
  };
  return (
    <button onClick={disabled ? undefined : onClick} title={title} style={base}
      onMouseEnter={e=>{ if(!active&&!disabled){ e.currentTarget.style.background="rgba(186,189,226,0.22)"; e.currentTarget.style.color= danger ? "var(--maroon)" : "var(--navy)"; } }}
      onMouseLeave={e=>{ if(!active&&!disabled){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color= danger ? "var(--maroon)" : "rgba(55,67,117,0.6)"; } }}>
      {children}
    </button>
  );
}

export function ColorCol({ value, onChange }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
      <div style={{ width:22, height:22, borderRadius:"50%", background:value,
        border:"2px solid var(--navy)", boxShadow:"0 0 0 2px rgba(255,255,255,0.8)" }} />
      <label style={{ width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center",
        borderRadius:0, border:"1px solid rgba(186,189,226,0.45)", background:"transparent",
        cursor:"pointer", position:"relative", transition:"border-color 0.12s" }}
        onMouseEnter={e=>e.currentTarget.style.borderColor="var(--navy)"}
        onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(186,189,226,0.45)"}>
        <PaletteIcon />
        <input type="color" value={value} onChange={e=>onChange(e.target.value)}
          style={{ position:"absolute", inset:0, opacity:0, width:"100%", height:"100%", cursor:"pointer", border:"none" }} />
      </label>
    </div>
  );
}

export default function PenStrip({ activeBrush, penColor, penSize, onSwitchBrush, onColorChange, onSizeChange }) {
  const PenIco = () => (
    <svg width="14" height="14" viewBox="0 0 13 13" fill="none">
      <path d="M8.8 2.2l2 2-6.5 6.5-2.3.5.5-2.3 6.3-6.7z" stroke="currentColor" strokeWidth="1.4" fill="none"/>
    </svg>
  );
  const EraserIco = () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M2.5 11.5l3-3 4-4 2.5 2.5-4 4-2.5.5-3-3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M5.5 8.5l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M2 13h11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );

  const isEraser = activeBrush === "eraser";

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"8px 5px", gap:3 }}>
      <IBtn active={activeBrush==="pen"}    onClick={()=>onSwitchBrush("pen")}    title="Pen"><PenIco /></IBtn>
      <IBtn active={isEraser} onClick={()=>onSwitchBrush("eraser")} title="Eraser"><EraserIco /></IBtn>

      <VDivider />

      {isEraser ? (
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5, opacity:0.35, pointerEvents:"none" }}>
          <div style={{ width:22, height:22, borderRadius:"50%", background:"#ccc",
            border:"2px solid var(--navy)", boxShadow:"0 0 0 2px rgba(255,255,255,0.8)" }} />
          <div style={{ width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center",
            borderRadius:0, border:"1px solid rgba(186,189,226,0.45)", background:"transparent" }}>
            <PaletteIcon />
          </div>
        </div>
      ) : (
        <ColorCol value={penColor} onChange={onColorChange} />
      )}

      <VDivider />

      {[{s:1,d:6},{s:2,d:9},{s:4,d:13},{s:8,d:18}].map(({s,d})=>(
        <div key={s} onClick={()=>onSizeChange(s)} title={`Size ${s}`}
          style={{ width:d, height:d, borderRadius:"50%", background:"var(--navy)", cursor:"pointer",
            opacity:penSize===s?1:0.2, transition:"opacity 0.12s,transform 0.1s",
            display:"flex", alignItems:"center", justifyContent:"center" }}
          onMouseEnter={e=>e.currentTarget.style.transform="scale(1.15)"}
          onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"} />
      ))}
    </div>
  );
}
