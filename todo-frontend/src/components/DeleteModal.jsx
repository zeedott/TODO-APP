
function DeleteModal({
  todo,
  isDeleting,
  onCancel,
  onConfirm,
  title = "Delete todo?",
  message = "Are you sure you want to delete this todo?",
  confirmLabel = "Delete",
}) {
  if (!todo) return null;

  return (
    <div
      className="delete-modal-overlay"
      onClick={() => {
        if (!isDeleting) onCancel();
      }}
    >
      <section
        className="delete-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-message"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="delete-modal-icon" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3 2.8 19a1.6 1.6 0 0 0 1.4 2.4h15.6a1.6 1.6 0 0 0 1.4-2.4L12 3Z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </svg>
        </div>

        <h2 id="delete-modal-title">{title}</h2>

        <p id="delete-modal-message">{message}</p>

        <div className="delete-modal-actions">
          <button
            type="button"
            className="delete-modal-cancel"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>

          <button
            type="button"
            className="delete-modal-confirm"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Processing..." : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}

export default DeleteModal;
