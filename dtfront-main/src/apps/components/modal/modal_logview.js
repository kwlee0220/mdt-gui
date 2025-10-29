import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import LogView from "../Instance/LogView";
import useRequestManager from "apps/utils/request_manager";

const ModalLogView = ({ open, closeModal, data, mode = "log" }) => {
  const [log, setLog] = useState("");

  //#region 데이터 조회

  const { REQ_Instance_GET_Stderr, REQ_Instance_GET_Stdout } =
    useRequestManager();

  const fetchStdout = async () => {
    let result = await REQ_Instance_GET_Stdout(data.id);

    if (result) {
      console.log("LOG OUT", result);

      setLog(result);
    }
  };

  const fetchStderr = async () => {
    let result = await REQ_Instance_GET_Stderr(data.id);

    if (result) {
      console.log("LOG ERROR", result);
      setLog(result);
    }
  };

  //#endregion

  useEffect(() => {
    if (open && data) {
      if (mode === "log") {
        fetchStdout();
      } else {
        fetchStderr();
      }
    }
  }, [open, data]);

  return (
    <Modal show={open} centered animation={false} size={"xl"}>
      <Modal.Header>
        <div className="header-icon">
          <i className="ph-app-window"></i>
        </div>
        <div className="modal-title">로그뷰</div>
        <button
          type="button"
          className="btn btn-link ms-auto"
          onClick={closeModal}
        >
          <i className="ph-x"></i>
        </button>
      </Modal.Header>
      <Modal.Body>
        <LogView data={log}></LogView>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-link" onClick={closeModal}>
          닫기
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalLogView;
