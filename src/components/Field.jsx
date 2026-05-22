// Import component styles
import "./Field.css";

// Reusable input field component
export default function Field({ label, ...props }) {
  return (
    // Wrapper for label + input
    <div className="field-container">

      {/* Render label only if one is provided */}
      {label && <label className="field-label">{label}</label>}

      {/* Input field with passed props */}
      <input {...props} className="field-input" />
    </div>
  );
}