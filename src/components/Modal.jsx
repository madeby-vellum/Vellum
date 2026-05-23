import "./Modal.css";

// A simple modal component that can be used to display content in a modal dialog.
export default function Modal({ title, onClose, children, wide }) {
  return (
    // The backdrop covers the entire screen and closes the modal when clicked.
    <div onClick={onClose} className="modal-generic-backdrop">
      {/* The modal card */}
      <div
        onClick={e => e.stopPropagation()}
        className={`modal-generic-card fu${wide ? " modal-generic-card--wide" : ""}`}
      >
        <div className="modal-generic-header">
          {/* Modal header */}
          <h2 className="modal-generic-title">{title}</h2>
          <button onClick={onClose} className="modal-generic-close">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}