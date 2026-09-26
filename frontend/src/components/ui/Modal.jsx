function Modal({
  isOpen,
  title,
  children,
  onClose,
  footer,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="ui-modal-overlay"
      onClick={onClose}
    >

      <div
        className="ui-modal"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="ui-modal-header">

          <h2>
            {title}
          </h2>

          <button
            type="button"
            className="ui-modal-close"
            onClick={onClose}
          >
            ×
          </button>

        </div>

        <div className="ui-modal-body">
          {children}
        </div>

        {footer && (
          <div className="ui-modal-footer">
            {footer}
          </div>
        )}

      </div>

    </div>
  );
}

export default Modal;