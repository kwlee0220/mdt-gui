import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

const variable = {
  id: "",
  name: "",
  description: "",
  taskDescriptors: [],
};

const ModalCreateWorkflow = ({ open, closeModal, handleCreate }) => {
  const [inputs, setInputs] = useState(variable);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;

    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const onClickAdd = () => {
    if (handleCreate) {
      handleCreate(inputs);
    }
  };

  useEffect(() => {
    if (open) {
      setInputs(variable);
    }
  }, [open]);

  return (
    <Modal show={open} centered animation={false}>
      <Modal.Header>
        <div className="header-icon">
          <i className="ph-app-window"></i>
        </div>
        <div className="modal-title">워크플로우 생성</div>
        <button
          type="button"
          className="btn btn-link ms-auto"
          onClick={closeModal}
        >
          <i className="ph-x"></i>
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className="row mb-3">
          <label className="col-form-label col-2">ID</label>
          <div className="col-10">
            <input
              type="text"
              className="form-control"
              name="id"
              value={inputs ? inputs.id : ""}
              onChange={handleChangeInput}
            ></input>
          </div>
        </div>
        <div className="row mb-3">
          <label className="col-form-label col-2">Name</label>
          <div className="col-10">
            <input
              type="text"
              className="form-control"
              name="name"
              value={inputs ? inputs.name : ""}
              onChange={handleChangeInput}
            ></input>
          </div>
        </div>
        <div className="row">
          <label className="col-form-label col-2">Description</label>
          <div className="col-10">
            <textarea
              rows="5"
              className="form-control"
              name="description"
              value={inputs ? inputs.description : ""}
              onChange={handleChangeInput}
            ></textarea>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-success" onClick={onClickAdd}>
          Workflow 만들기
        </button>
        <button className="btn btn-link" onClick={closeModal}>
          닫기
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalCreateWorkflow;
