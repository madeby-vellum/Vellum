import "./Field.css";

// A reusable input field component that accepts a label and other input props
export default function Field({ label, ...props }) {
  return (
    <div className="field-container">
      {label && <label className="field-label">{label}</label>}
      <input {...props} className="field-input" />
    </div>
  );
}