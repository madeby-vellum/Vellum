// Import modal styles
import "./Modal.css";

// Reusable generic modal wrapper
export default function Modal({
  title,
  onClose,
  children,
  wide
}) {
  return (

    // Close modal when clicking outside
    <div
      onClick={onClose}
      className="modal-generic-backdrop"
    >

      {/* Prevent modal close when clicking inside */}
      <div
        onClick={e => e.stopPropagation()}

        // Add wide modifier class if needed
        className={`modal-generic-card fu${wide ? " modal-generic-card--wide" : ""}`}
      >

        {/* ───────────── Header ───────────── */}
        <div className="modal-generic-header">

          {/* Modal title */}
          <h2 className="modal-generic-title">
            {title}
          </h2>

          {/* Close button */}
          <button
            onClick={onClose}
            className="modal-generic-close"
          >
            ✕
          </button>
        </div>

        {/* Modal content */}
        {children}
      </div>
    </div>
  );
}