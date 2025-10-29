import { Modal } from "react-bootstrap";

const ConfirmModal = ({
  open,
  closeModal,
  handleConfirm,
  title,
  message,
  btnclose = "닫기",
  btnok = "확인",
}) => {
  return (
    <Modal show={open} centered animation={false}>
      <Modal.Header>
        <div className="modal-title">{title}</div>
        <button
          type="button"
          className="btn-close"
          onClick={closeModal}
        ></button>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <button
          className="btn btn-link"
          onClick={() => {
            if (closeModal) {
              closeModal();
            }
          }}
        >
          {btnclose}
        </button>
        <button
          className="btn btn-default"
          onClick={() => {
            if (handleConfirm) {
              handleConfirm();
            }
          }}
        >
          {btnok}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
