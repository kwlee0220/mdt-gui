import WorkflowModelTable from "apps/components/Table/WorkflowModelTable";
import WorkflowTable from "apps/components/Table/WorkflowTable";
import modal_icon from "assets/images/logo/header_icon.png";
import HierarchyTree from "../comps/HierarchyTree";
import useModal from "apps/components/modal/useModal";
import ModalSelectWorkflow from "apps/components/modal/modal_select_workflow";
import { useEffect, useState } from "react";
import LogViewPanel from "../comps/LogViewPanel";
import EmptyList from "apps/components/EmptyList";
import useRequestManager from "apps/utils/request_manager";

const StatusList = [
  "NOT_STARTED",
  "STARTING",
  "RUNNING",
  "COMPLETED",
  "FAILED",
  "UNKNOWN",
];

const PageWorkflowFlow = ({ mainFlow, handleShowList }) => {
  const modalSelectWorkflow = useModal();

  const { REQ_GET_Workflow_ALL } = useRequestManager();

  const [selectedFlow, setSelectedFlow] = useState();
  const [etcList, setEtcList] = useState([]);
  const [statusMap, setStatusMap] = useState();

  const handleSelectedChanged = (selected) => {
    selected.map((item) => {
      setEtcList((prev) => [...prev, item]);
    });
  };

  const handleShowLogview = (item) => {
    setSelectedFlow(item);
  };

  const handleDeleteVSFlow = (name) => {
    const list = etcList.filter((item) => item.name !== name);

    setEtcList(list);
  };

  const fetchWorkflowALL = async () => {
    let list = await REQ_GET_Workflow_ALL();

    const map = new Map();

    list.map((item) => {
      let list = [];
      let name = item.name;

      list.push({ id: name, status: item.status });

      item.tasks.map((task) => {
        list.push({ id: task.taskId, status: task.status });
      });

      map.set(name, list);
    });

    setStatusMap(map);
  };

  useEffect(() => {
    fetchWorkflowALL();

    const interval = setInterval(fetchWorkflowALL, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pnl-main">
      <div className="pnl-instance">
        <div className="inner-title">
          <h4 className="mb-0">
            <img src={modal_icon} className="me-2" height={16}></img>
            워크플로우 동작현황
          </h4>
          <div className="ms-auto">
            <button className="btn btn-light" onClick={handleShowList}>
              닫기
            </button>
          </div>
        </div>
        <div className="pnl-space"></div>
        <div className="row" style={{ position: "relative" }}>
          <div className="col-4">
            <div className="flex-ycenter mb-2" style={{ height: "40px" }}>
              <h6 className="mb-0">기준 워크플로우</h6>
            </div>
            <div className="card card-body card-dark mb-0">
              {mainFlow && (
                <HierarchyTree
                  isVS={false}
                  origin={mainFlow}
                  statusMap={statusMap}
                  handleShowLogview={handleShowLogview}
                ></HierarchyTree>
              )}
            </div>
          </div>
          <div className="col-8">
            <div className="flex-ycenter mb-2">
              <h6 className="mb-0">비교 워크플로우</h6>
              <button
                className="btn btn-default ms-auto"
                onClick={modalSelectWorkflow.toggleModal}
              >
                <i className="ph-plus me-2"></i>비교 추가
              </button>
            </div>
            {etcList && etcList.length > 0 ? (
              <div className="card card-body card-dark">
                <div className="row">
                  {etcList.map((flow, idx) => (
                    <div className="col-6 mb-3" key={idx}>
                      <HierarchyTree
                        origin={flow}
                        statusMap={statusMap}
                        handleShowLogview={handleShowLogview}
                        handleDeleteVSFlow={handleDeleteVSFlow}
                      ></HierarchyTree>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                className="card card-body card-dark mb-0"
                style={{ height: "564px" }}
              >
                <EmptyList
                  style={{ height: "100%" }}
                  message={"비교할 Workflow를 추가해주세요."}
                ></EmptyList>
              </div>
            )}
          </div>
          {selectedFlow && (
            <LogViewPanel
              origin={selectedFlow}
              closePanel={() => setSelectedFlow(null)}
            ></LogViewPanel>
          )}
        </div>
      </div>

      <ModalSelectWorkflow
        open={modalSelectWorkflow.open}
        closeModal={modalSelectWorkflow.toggleModal}
        mainFlow={mainFlow}
        etclist={etcList}
        handleSelectedChanged={handleSelectedChanged}
      ></ModalSelectWorkflow>
    </div>
  );
};

export default PageWorkflowFlow;
