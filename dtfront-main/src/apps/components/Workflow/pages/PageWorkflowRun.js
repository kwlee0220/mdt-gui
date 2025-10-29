import {
  Background,
  ConnectionLineType,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import { StatusList, WorkflowNodeType } from "apps/datas/definedData";
import useRequestManager from "apps/utils/request_manager";
import { useCallback, useEffect, useRef, useState } from "react";
import CustomSmoothStepEdge from "../edges/CustomSmoothStepEdge";

const PageWorkflowRun = ({ mainFlow, handleShowList }) => {
  const { REQ_GET_Workflow, REQ_GET_Workflow_Model } = useRequestManager();
  const [modelFlow, setModelFlow] = useState();
  const [statusList, setStatusList] = useState([]);

  //#region Flow 관련 함수
  const reactFlowWrapper = useRef(null);

  const edgeTypes = {
    smooth: CustomSmoothStepEdge,
  };

  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onLoadFlowData = useCallback(
    (contents) => {
      const restoreFlow = async (contents) => {
        const flow = JSON.parse(contents);

        if (flow) {
          const nodes = flow.nodes.map((node) => {
            let inner = { ...node };
            let data = node.data;
            let id = node.data.item.id;

            data["status"] = "UNKNOWN";
            data["id"] = id;

            inner.selected = false;
            inner.data = data;

            return inner;
          });

          setNodes(nodes);
          setEdges(flow.edges || []);

          setModelFlow(flow);
        }
      };

      restoreFlow(contents);
    },
    [setNodes, setEdges]
  );

  //#endregion

  const fetchGetModelWorkflow = async (flow) => {
    let id = flow.modelId;

    const resp = await REQ_GET_Workflow_Model(id);

    if (resp && resp.gui?.flow) {
      let flow = resp.gui.flow;

      onLoadFlowData(flow);
    }
  };

  const fetchGetWorkflowStatus = async () => {
    let result = await REQ_GET_Workflow(mainFlow.name);

    if (result && result.tasks) {
      let list = result.tasks;

      setStatusList(list);
    }
  };

  useEffect(() => {
    let interval;

    if (modelFlow) {
      interval = setInterval(fetchGetWorkflowStatus, 3000);

      fetchGetWorkflowStatus();
    }

    return () => clearInterval(interval);
  }, [modelFlow]);

  useEffect(() => {
    if (mainFlow) {
      fetchGetModelWorkflow(mainFlow);
    }
  }, [mainFlow]);

  useEffect(() => {
    if (!statusList || statusList.length === 0) return;

    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        // statusList 에서 현재 node id 에 맞는 상태 찾기
        const task = statusList.find((item) => item.taskId === node.data.id);

        if (!task) return node; // 매칭 없음 → 변경 안 함

        let status = task.status;

        //status = StatusList[Math.floor(Math.random() * 6)];

        return {
          ...node,
          data: {
            ...node.data,
            status: status, // statusList 값으로 갱신
          },
        };
      })
    );
  }, [statusList, setNodes]);

  return (
    <div
      className="px-3 h-100"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <div className="title-workflow">
        <div className="title flex-fill text-center">워크플로우 동작 현황</div>
        <div className="ms-auto">
          <button className="btn btn-light" onClick={handleShowList}>
            닫기
          </button>
        </div>
      </div>
      {mainFlow ? (
        <div className="info-run">
          <h6 className="me-3 mb-0">
            워크플로우 인스턴스 명 :
            <span className="text-default ms-1">{mainFlow.name}</span>
          </h6>
          <h6 className="me-3 mb-0">
            모델 아이디 :
            <span className="text-default ms-1">{mainFlow.modelId}</span>
          </h6>
          <div className="flex-ycenter ms-auto">
            <h6 className="mb-0 me-3">상태 정보 :</h6>
            <div className="flex-ycenter me-3">
              <div className="bg-unknown color-item"></div>
              <span className="">Unknown</span>
            </div>
            <div className="flex-ycenter me-3">
              <div className="bg-not-started color-item"></div>
              <span className="">Not Started</span>
            </div>
            <div className="flex-ycenter me-3">
              <div className="bg-starting color-item"></div>
              <span className="">Starting</span>
            </div>
            <div className="flex-ycenter me-3">
              <div className="bg-running color-item"></div>
              <span className="">Running</span>
            </div>
            <div className="flex-ycenter me-3">
              <div className="bg-completed color-item"></div>
              <span className="">Completed</span>
            </div>
            <div className="flex-ycenter me-3">
              <div className="bg-failed color-item"></div>
              <span className="">Failed</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="alert alert-danger m-3" role="alert">
          선택된 워크플로우 인스턴스가 없습니다.
        </div>
      )}

      <ReactFlowProvider>
        <div
          className="card card-body pnl-workflow-workspace mb-3"
          ref={reactFlowWrapper}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onInit={setReactFlowInstance}
            minZoom={0.4}
            maxZoom={4}
            connectionLineType={ConnectionLineType.SmoothStep}
            nodeTypes={WorkflowNodeType}
            edgeTypes={edgeTypes}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            fitView
          >
            <Background color="#777" gap={16} />
            <Controls />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default PageWorkflowRun;
