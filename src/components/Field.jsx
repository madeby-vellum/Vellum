import "./Field.css";

export default function Field({ label, ...props }) {
  return (
    <div className="field-container">
      {label && <label className="field-label">{label}</label>}
      <input {...props} className="field-input" />
    </div>
  );
}