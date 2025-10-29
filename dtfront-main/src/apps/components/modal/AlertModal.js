import { useEffect } from "react";
import { Modal } from "react-bootstrap";

const AlertModal = ({ open, closeModal, title, message }) => {
  useEffect(() => {}, []);

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
      <Modal.Body>
        <div dangerouslySetInnerHTML={{ __html: message }}></div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-link" onClick={closeModal}>
          닫기
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default AlertModal;
