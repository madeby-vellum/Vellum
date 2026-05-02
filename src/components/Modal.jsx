import "./Modal.css";

export default function Modal({ title, onClose, children, wide }) {
  return (
    <div onClick={onClose} className="modal-generic-backdrop">
      <div
        onClick={e => e.stopPropagation()}
        className={`modal-generic-card fu${wide ? " modal-generic-card--wide" : ""}`}
      >
        <div className="modal-generic-header">
          <h2 className="modal-generic-title">{title}</h2>
          <button onClick={onClose} className="modal-generic-close">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}