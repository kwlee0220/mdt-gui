import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import SubModelTree from "../Instance/SubModelTree";
import useRequestManager from "apps/utils/request_manager";
import EmptyList from "../EmptyList";

const ModalSelectWorkflow = ({
  open,
  closeModal,
  mainFlow,
  etclist,
  handleSelectedChanged,
}) => {
  const [workflowList, setWorkflowList] = useState([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState([]);

  const getStatusBG = (status) => {
    let str_bg = "bg-unknown";

    switch (status?.toUpperCase()) {
      case "NOT_STARTED":
        str_bg = "bg-not-started";
        break;
      case "STARTING":
        str_bg = "bg-starting";
        break;
      case "RUNNING":
        str_bg = "bg-running";
        break;
      case "COMPLETED":
        str_bg = "bg-completed";
        break;
      case "FAILED":
        str_bg = "bg-failed";
        break;
    }

    return str_bg;
  };

  //#region 데이터 조회

  const { REQ_GET_Workflow_ALL } = useRequestManager();

  const fetchWorkflowALL = async () => {
    let result = await REQ_GET_Workflow_ALL();

    if (result) {
      let etcIds = new Set(etclist.map((etc) => etc.name));
      etcIds.add(mainFlow.name);
      const filteredResult = result.filter((item) => !etcIds.has(item.name));

      setWorkflowList(filteredResult);
    } else {
      setWorkflowList([]);
    }
  };

  useEffect(() => {
    if (open) {
      setSelectedWorkflow([]);
      fetchWorkflowALL();
    }
  }, [open]);

  //#endregion

  return (
    <Modal show={open} centered animation={false} size={"lg"}>
      <Modal.Header>
        <div className="header-icon">
          <i className="ph-app-window"></i>
        </div>
        <div className="modal-title">비교 워크플로우 선택</div>
        <button
          type="button"
          className="btn btn-link ms-auto"
          onClick={closeModal}
        >
          <i className="ph-x"></i>
        </button>
      </Modal.Header>
      <div className="table-responsive">
        <table
          style={{ width: "100%" }}
          className="table datatable-basic table-bordered"
        >
          <thead>
            <tr>
              <th>선택</th>
              <th>이름</th>
              <th>모델 아이디</th>
              <th>현재상태</th>
            </tr>
          </thead>
          <tbody>
            {workflowList && workflowList.length > 0 ? (
              <>
                {workflowList.map((item, index) => {
                  const isChecked = selectedWorkflow.some(
                    (wf) => wf.name === item.name
                  );

                  return (
                    <tr key={index}>
                      <td className="text-center">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={isChecked} // 체크 상태 반영
                          onChange={() => {
                            setSelectedWorkflow(
                              (prev) =>
                                isChecked
                                  ? prev.filter((wf) => wf.name !== item.name) // 이미 있으면 제거
                                  : [...prev, item] // 없으면 추가
                            );
                          }}
                        ></input>
                      </td>
                      <td>{item.name}</td>
                      <td>{item.modelId}</td>
                      <td>
                        <span
                          className={`label-status ${getStatusBG(item.status)}`}
                        >
                          {item.status || "UNKNOWN"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </>
            ) : (
              <tr>
                <td colSpan={4} className="p-0">
                  <EmptyList
                    message={"추가로 비교할 워크플로우가 없습니다."}
                  ></EmptyList>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Modal.Footer>
        <button
          className="btn btn-success"
          onClick={() => {
            handleSelectedChanged(selectedWorkflow);
            closeModal();
          }}
        >
          선택완료
        </button>
        <button className="btn btn-link" onClick={closeModal}>
          닫기
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalSelectWorkflow;
