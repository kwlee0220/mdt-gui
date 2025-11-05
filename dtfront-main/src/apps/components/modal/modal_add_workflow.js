import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import modal_icon from "assets/images/logo/header_icon.png";
import JsonView from "../Instance/LogView";
import SubModelTree from "../Instance/SubModelTree";

const ModalAddWorkflow = ({
  flowInfo,
  origin,
  open,
  closeModal,
  handleAdd,
}) => {
  const [inputData, setInputData] = useState({
    id: "",
    name: "",
    description: "",
    taskDescriptors: [],
    gui: {},
  });

  const [tasks, setTasks] = useState();

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setInputData({
      ...inputData,
      [name]: value,
    });
  };

  const onClickAdd = () => {
    // TODO -- etri updated
    let workflow = {
      id: inputData.id,
      name: inputData.name,
      description: inputData.description,
      taskDescriptors: flowInfo.taskDescriptors,
      gui: flowInfo.gui,
    };

    handleAdd(workflow);
    //---
  };

  const convertData = (data) => {
    setTasks(data.taskDescriptors);
    setInputData(data);
  };

  useEffect(() => {
    if (flowInfo && open) {
      convertData(flowInfo);
    }
  }, [flowInfo, open]);

  return (
    <Modal show={open} centered animation={false} size={"lg"}>
      <Modal.Header>
        <div className="header-icon">
          <i className="ph-app-window"></i>
        </div>
        <div className="modal-title">워크플로우 {origin ? "변경" : "등록"}</div>
        <button
          type="button"
          className="btn btn-link ms-auto"
          onClick={closeModal}
        >
          <i className="ph-x"></i>
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className="pnl-base">
          <div className="row mb-3">
            <div className="col">
              <div className="row">
                <label className="col-2 col-form-label">ID</label>
                <div className="col-10">
                  <input
                    type="text"
                    className="form-control"
                    name="id"
                    value={inputData ? inputData.id : ""}
                    onChange={handleChangeInput}
                  ></input>
                </div>
              </div>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col">
              <div className="row">
                <label className="col-2 col-form-label">Name</label>
                <div className="col-10">
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={inputData ? inputData.name : ""}
                    onChange={handleChangeInput}
                  ></input>
                </div>
              </div>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col">
              <div className="row">
                <label className="col-2 col-form-label">Description</label>
                <div className="col-10">
                  <textarea
                    rows="5"
                    className="form-control"
                    name="description"
                    value={inputData ? inputData.description : ""}
                    onChange={handleChangeInput}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pnl-detail m-0">
          <h6>Tasks 정보</h6>

          <SubModelTree data={tasks ? tasks : []}></SubModelTree>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-default me-2" onClick={onClickAdd}>
          워크플로우 {origin ? "변경" : "등록"}
        </button>
        <button className="btn btn-link" onClick={closeModal}>
          닫기
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalAddWorkflow;
