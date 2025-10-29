import UtilManager from "apps/utils/util_manager";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

const option = {
  name: "",
  optionType: "string",
  value: "",
};

const ModalADDOption = ({ open, closeModal, handleAdd }) => {
  const { CloneDeep } = UtilManager();
  const [inputData, setInputData] = useState();

  const handleAdd = () => {
    handleAdd(inputData);
  };

  useEffect(() => {
    if (open) {
      let data = CloneDeep(option);

      setInputData(data);
    }

    return () => {
      setInputData(null);
    };
  }, [open]);

  return (
    <Modal show={open} centered animation={false}>
      <Modal.Header>
        <div className="header-icon">
          <i className="ph-app-window"></i>
        </div>
        <div className="modal-title">Option 추가</div>
        <button
          type="button"
          className="btn btn-link ms-auto"
          onClick={closeModal}
        >
          <i className="ph-x"></i>
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className="row mb-2">
          <label className="col-form-label col-4">Name</label>
          <div className="col-8">
            <input
              type="text"
              className="form-control"
              name="name"
              value={inputData ? inputData.name : ""}
              onChange={handleChangeInput}
            ></input>
          </div>
        </div>

        <div className="row mb-2">
          <label className="col-form-label col-4">Option Type</label>
          <div className="col-8">
            <input
              type="text"
              className="form-control"
              name="name"
              value={inputData ? inputData.name : ""}
              onChange={handleChangeInput}
            ></input>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-success" onClick={handleAdd}>
          추가
        </button>
        <button className="btn btn-link" onClick={closeModal}>
          닫기
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalADDOption;
