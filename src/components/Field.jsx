export default function Field({ label, ...props }) {
  return (
    <div style={{ marginBottom:16 }}>
      {label && <label style={{ display:"block",fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--periwinkle)",marginBottom:6 }}>{label}</label>}
      <input {...props} className="field-input" />
    </div>
  );
}
