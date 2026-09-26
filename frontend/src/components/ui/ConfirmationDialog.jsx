import Modal from "./Modal";
import Button from "./Button";

function ConfirmationDialog({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) {
  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={onCancel}
      footer={
        <>
          <Button
            variant="secondary"
            onClick={onCancel}
          >
            {cancelText}
          </Button>

          <Button
            variant="danger"
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <p className="confirmation-message">
        {message}
      </p>
    </Modal>
  );
}

export default ConfirmationDialog;