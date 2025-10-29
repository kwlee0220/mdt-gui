import UtilManager from "apps/utils/util_manager";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

const variable = {
  name: "",
  kind: "INPUT",
  valueReference: null,
};

const ModalADDVariable = ({ open, closeModal, handleAdd }) => {
  const { CloneDeep } = UtilManager();
  const [inputData, setInputData] = useState();

  const clickAdd = () => {
    handleAdd(inputData);
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;

    setInputData({
      ...inputData,
      [name]: value,
    });
  };

  useEffect(() => {
    if (open) {
      let data = CloneDeep(variable);

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
        <div className="modal-title">Input/Output 추가</div>
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
          <label className="col-form-label col-4">Type</label>
          <div className="col-8">
            <select
              className="form-select"
              name="kind"
              value={inputData ? inputData.kind : "INPUT"}
              onChange={handleChangeInput}
            >
              <option value="INPUT">INPUT</option>
              <option value="OUTPUT">OUTPUT</option>
            </select>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-success" onClick={clickAdd}>
          추가
        </button>
        <button className="btn btn-link" onClick={closeModal}>
          닫기
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalADDVariable;
