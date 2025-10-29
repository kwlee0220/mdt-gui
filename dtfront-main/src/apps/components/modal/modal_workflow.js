import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import SubModelTree from "../Instance/SubModelTree";

const ModalWorkflowInfo = ({ open, closeModal, data }) => {
  const [tasks, setTasks] = useState("");

  const [inputData, setInputData] = useState();
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({
      ...inputData,
      [name]: value,
    });

    setError(null);
  };

  //#region 데이터 조회

  //#endregion

  useEffect(() => {
    if (data) {
      setInputData(data);
      setTasks(data.taskDescriptors);
    }
  }, [data]);

  return (
    <Modal show={open} centered animation={false} size={"lg"}>
      <Modal.Header>
        <div className="header-icon">
          <i className="ph-app-window"></i>
        </div>
        <div className="modal-title">워크플로우 정보</div>
        <button
          type="button"
          className="btn btn-link ms-auto"
          onClick={closeModal}
        >
          <i className="ph-x"></i>
        </button>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <div className="alert alert-danger m-3" role="alert">
            {error}
          </div>
        )}

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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
        <button className="btn btn-link" onClick={closeModal}>
          닫기
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalWorkflowInfo;
