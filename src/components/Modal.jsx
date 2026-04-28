export default function Modal({ title, onClose, children, wide }) {
  return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(55,67,117,0.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,backdropFilter:"blur(4px)" }}>
      <div onClick={e=>e.stopPropagation()} className="fu"
        style={{ background:"var(--cloud)",borderRadius:0,padding:"48px 52px",width:wide?700:460,maxWidth:"95vw",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 2px 48px rgba(55,67,117,0.12)",border:"1px solid rgba(186,189,226,0.3)" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:32 }}>
          <h2 style={{ fontSize:14,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--navy)",fontFamily:"'Inter',sans-serif" }}>{title}</h2>
          <button onClick={onClose} style={{ background:"none",border:"none",fontSize:16,color:"var(--periwinkle)",padding:"0 0 0 16px",transition:"color 0.12s" }}
            onMouseEnter={e=>e.currentTarget.style.color="var(--navy)"}
            onMouseLeave={e=>e.currentTarget.style.color="var(--periwinkle)"}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
