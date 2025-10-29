import {
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  ConnectionLineType,
  Controls,
  MarkerType,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import moment from "moment";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import useDataManager from "apps/utils/data_manager";
import TreeView from "../Tree/TreeView";
import {
  TaskType,
  useGenesisDataManager,
  VariableType,
  WorkflowNodeType,
} from "apps/datas/definedData";
import ModalNode from "../modal/modal_node";
import useModal from "../modal/useModal";
import PropertyPanel from "./comps/PropertyPanel";
import UtilManager from "apps/utils/util_manager";
import useDialog from "../modal/useDialog";
import CustomSmoothStepEdge from "./edges/CustomSmoothStepEdge";
import useDataConvert from "apps/utils/useDataConvert";

const getId = (tag) => {
  let name = "node_" + moment().valueOf() + "_" + Math.random();

  if (tag) {
    name += `_${tag}`;
  }

  return name;
};
const getLineID = () => {
  let name = "line_" + moment().valueOf();

  return name;
};

const Workflow = forwardRef(({ workflowModel }, ref) => {
  const { openDialog } = useDialog();

  const { uDC_fetchJSONConnect } = useDataConvert();

  const { getNode, getNodes, getEdge, setViewport, getViewport } =
    useReactFlow();

  const { GET_TASKLABEL, GET_NODETYPE, Get_Origin_TaskData } =
    useGenesisDataManager();
  const { SET_DEPENDENCY, IS_NULL } = UtilManager();

  //#region 컴포넌트 Accordion
  const [expandProperty, setExpandProperty] = useState(false);

  // 입력된 id에 해당하는 node와 연결된 node 목록을 조회
  const getConnectedNodes = (id) => {
    // edges에서 source 또는 target이 id인 edge를 찾음
    const connectedNodeIds = edges
      .filter((edge) => edge.source === id || edge.target === id)
      .map((edge) => (edge.source === id ? edge.target : edge.source));

    // 중복 제거
    const uniqueNodeIds = Array.from(new Set(connectedNodeIds));

    // nodes에서 해당 id의 node 객체 반환
    return nodes.filter((node) => uniqueNodeIds.includes(node.id));
  };

  const handleModifyProperty = (id, data, originID = null) => {
    setNodes((nds) =>
      nds?.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              item: data,
            },
          };
        }

        return node;
      })
    );

    if (originID !== null) {
      let nodelist = getConnectedNodes(id);

      nodelist.forEach((node) => {
        if (Array.isArray(node.data?.item?.dependencies)) {
          node.data.item.dependencies = node.data.item.dependencies.map((dep) =>
            dep === originID ? data.id : dep
          );
        }
      });
    }

    setExpandProperty(false);
    setSelectedNode(null);
  };

  const handleExpandProperty = (view) => {
    setExpandProperty(view);
  };

  //#endregion

  const reactFlowWrapper = useRef(null);

  useImperativeHandle(ref, () => ({
    onAddNode,
    onSaveFlowData,
    onLoadFlowData,
    onClearFlow,
    onLoadWorkflowDescriptor,
    AlignVertical,
    AlignHorizontal,
    onChangeColor,
    onUndo,
    onRedo,
  }));

  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedNode, setSelectedNode] = useState();

  const [sourceTreeData, setSourceTreeData] = useState();
  const [targetTreeData, setTargetTreeData] = useState();

  //#region 2025 추가함수

  /********************************
   *
   * 정렬 관리 함수
   *
   **********************************/
  const getNodeHeight = (node) => {
    return node?.measured?.height || 35;
  };

  const getNodeWidth = (node) => {
    return node?.measured?.width || 150;
  };

  const GET_POSITION_V_TOP = (selectedNodes, allNodes) => {
    const minY = Math.min(...selectedNodes.map((node) => node.position.y));

    const updatedNodes = allNodes.map((node) => {
      if (!node.selected) return node; // 선택된 노드만 수정

      return {
        ...node,
        position: {
          ...node.position,
          y: minY, // y좌표를 가장 위로
        },
      };
    });

    return updatedNodes;
  };

  const GET_POSITION_V_CENTER = (selectedNodes, allNodes) => {
    // 모든 노드의 중심 x 좌표 계산
    const middleY = Math.min(
      ...selectedNodes.map((node) => node.position.y + getNodeHeight(node) / 2)
    );

    const updatedNodes = allNodes.map((node) => {
      if (!node.selected) return node;

      const newY = middleY - getNodeHeight(node) / 2;

      return {
        ...node,
        position: { ...node.position, y: newY },
      };
    });

    return updatedNodes;
  };

  const GET_POSITION_V_BOTTOM = (selectedNodes, allNodes) => {
    const bottomY = Math.max(
      ...selectedNodes.map((node) => node.position.y + getNodeHeight(node))
    );

    const updatedNodes = allNodes.map((node) => {
      if (!node.selected) return node; // 선택된 노드만 수정

      return {
        ...node,
        position: {
          ...node.position,
          y: bottomY - getNodeHeight(node), // y좌표를 가장 아래로
        },
      };
    });

    return updatedNodes;
  };

  const AlignVertical = (type) => {
    const allNodes = getNodes();
    const selectedNodes = allNodes.filter((node) => node.selected);

    if (selectedNodes.length < 2) return; // 2개 이상 선택해야 의미 있음

    let updatedNodes;

    switch (type) {
      case "top":
        updatedNodes = GET_POSITION_V_TOP(selectedNodes, allNodes);
        break;
      case "center":
        updatedNodes = GET_POSITION_V_CENTER(selectedNodes, allNodes);
        break;
      case "bottom":
        updatedNodes = GET_POSITION_V_BOTTOM(selectedNodes, allNodes);
        break;
    }

    setNodes(updatedNodes);
  };

  const GET_POSITION_H_LEFT = (selectedNodes, allNodes) => {
    const minX = Math.min(...selectedNodes.map((node) => node.position.x));

    const updatedNodes = allNodes.map((node) => {
      if (!node.selected) return node; // 선택된 노드만 수정

      return {
        ...node,
        position: {
          ...node.position,
          x: minX, // x를 최소값으로 맞추기
        },
      };
    });

    return updatedNodes;
  };

  const GET_POSITION_H_CENTER = (selectedNodes, allNodes) => {
    // 모든 노드의 중심 x 좌표 계산
    const centerX = Math.min(
      ...selectedNodes.map((node) => node.position.x + getNodeWidth(node) / 2)
    );

    const updatedNodes = allNodes.map((node) => {
      if (!node.selected) return node;

      const newX = centerX - getNodeWidth(node) / 2;

      return {
        ...node,
        position: { ...node.position, x: newX },
      };
    });

    return updatedNodes;
  };

  const GET_POSITION_H_RIGHT = (selectedNodes, allNodes) => {
    const rightX = Math.max(
      ...selectedNodes.map((node) => node.position.x + getNodeWidth(node))
    );

    const updatedNodes = allNodes.map((node) => {
      if (!node.selected) return node; // 선택된 노드만 수정

      return {
        ...node,
        position: {
          ...node.position,
          x: rightX - getNodeWidth(node), // x를 최대값으로 맞추기
        },
      };
    });

    return updatedNodes;
  };

  const AlignHorizontal = (type) => {
    const allNodes = getNodes();
    const selectedNodes = allNodes.filter((node) => node.selected);

    if (selectedNodes.length < 2) return; // 2개 이상 선택해야 의미 있음

    let updatedNodes;

    switch (type) {
      case "left":
        updatedNodes = GET_POSITION_H_LEFT(selectedNodes, allNodes);
        break;
      case "center":
        updatedNodes = GET_POSITION_H_CENTER(selectedNodes, allNodes);
        break;
      case "right":
        updatedNodes = GET_POSITION_H_RIGHT(selectedNodes, allNodes);
        break;
    }

    setNodes(updatedNodes);
  };

  /********************************
   *
   * Flow Data 관리 함수
   *
   **********************************/
  const onAddNode = (input, output, type) => {};

  const onChangeColor = (color) => {
    const allNodes = getNodes();
    const selectedNodes = allNodes.filter((node) => node.selected);

    if (selectedNodes.length === 0) return;

    let updateNodes = allNodes.map((node) => {
      if (!node.selected) return node; // 선택된 노드만 수정

      return {
        ...node,
        data: {
          ...node.data,
          item: {
            ...node.data.item,
            bg: color,
          },
        },
      };
    });

    setNodes(updateNodes);
  };

  const undoStack = useRef([]);
  const redoStack = useRef([]);

  const saveState = () => {
    undoStack.current.push({ nodes: [...nodes], edges: [...edges] });
    redoStack.current = []; // clear redo on new action
  };

  const onUndo = () => {
    if (undoStack.current.length === 0) return;

    const prevState = undoStack.current.pop();
    redoStack.current.push({ nodes: [...nodes], edges: [...edges] });

    setNodes(prevState.nodes);
    setEdges(prevState.edges);
  };

  const onRedo = () => {
    if (redoStack.current.length === 0) return;

    const nextState = redoStack.current.pop();
    undoStack.current.push({ nodes: [...nodes], edges: [...edges] });

    setNodes(nextState.nodes);
    setEdges(nextState.edges);
  };

  //#endregion

  const onLoadWorkflowDescriptor = () => {
    let flow = reactFlowInstance.toObject();

    flow.nodes = flow.nodes.map((node) => ({
      ...node,
      data: { ...node.data, onShowNodeSetting: undefined },
    }));

    const contents = JSON.stringify(flow);

    return {
      nodes: nodes,
      edges: edges,
      contents: contents,
    };
  };

  const onClearFlow = useCallback(() => {
    setNodes([]);
    setEdges([]);
  }, [setNodes, setEdges]);

  const onSaveFlowData = useCallback(() => {
    if (reactFlowInstance) {
      let flow = reactFlowInstance.toObject();

      flow.nodes = flow.nodes.map((node) => ({
        ...node,
        data: { ...node.data, onShowNodeSetting: undefined },
      }));

      const contents = JSON.stringify(flow);
      const blob = new Blob([contents], { type: "application/json" });

      // Blob URL 생성
      const url = URL.createObjectURL(blob);

      // 가상 a 태그 생성
      const link = document.createElement("a");
      link.href = url;
      link.download = `workflow_${moment().valueOf()}.json`; // 기본 파일명 지정

      // 클릭 이벤트로 다운로드 트리거
      document.body.appendChild(link);
      link.click();

      // URL과 태그 정리
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }, [reactFlowInstance]);

  const onLoadFlowData = useCallback(
    (contents) => {
      const restoreFlow = async (contents) => {
        const flow = JSON.parse(contents);

        if (flow) {
          const { x = 0, y = 0, zoom = 1 } = flow.viewport;

          const nodes = flow.nodes.map((node) => ({
            ...node,
            data: {
              ...node.data,
              onShowNodeSetting: onClickNodeSetting,
            },
          }));

          setNodes(nodes);
          setEdges(flow.edges || []);
          setViewport({ x, y, zoom });
        }
      };

      restoreFlow(contents);
    },
    [setNodes, setViewport]
  );

  /********************************
   *
   * Node 다이얼로그 함수
   *
   **********************************/
  const getDefaultNodeData = (item) => {
    let label = "";

    if (item.type) {
      label = GET_TASKLABEL(item.type);
    } else {
      label = item.label;
    }

    if (IS_NULL(label)) {
      label = item.label;
    }

    let result = {
      label: label,
      item: item,
      onShowNodeSetting: onClickNodeSetting,
    };

    return result;
  };

  const onClickNodeSetting = (id, data) => {
    setSelectedNode({
      id: id,
      data: data,
    });

    setExpandProperty(true);
  };

  /********************************
   *
   * ReactFlow 이벤트 함수
   *
   **********************************/
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const edgeTypes = {
    smooth: CustomSmoothStepEdge,
  };

  /**
   * 노드가 연결되었을 때 호출되는 함수
   */
  const onConnect = useCallback(
    async (params) => {
      const { source, target, sourceHandle, targetHandle } = params;

      let node_source = getNode(source);
      let node_target = getNode(target);
      let source_data, target_data;

      console.log("===============================");
      console.log("Connect", params);

      console.log("Node", node_source, node_target);
      console.log("===============================");

      source_data = node_source.data.item;
      target_data = node_target.data.item;

      if (source_data && source_data.id && target_data && target_data.id) {
        let process_result = await uDC_fetchJSONConnect(
          source_data,
          target_data,
          sourceHandle,
          targetHandle
        );

        if (process_result) {
          SET_DEPENDENCY(node_source, node_target);

          const newLine = {
            ...params,
            id: getLineID(),
            type: "smooth",
          };

          setEdges((eds) => eds?.concat(newLine));
        } else {
          openDialog({
            title: "연결 에러",
            message: "연결노드의 파라메터 정보가 없습니다.",
            type: "alert",
          });
        }
      } else {
        openDialog({
          title: "연결 에러",
          message: "연결노드의 ID를 입력하세요.",
          type: "alert",
        });
      }
    },
    [edges, setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const item = event.dataTransfer.getData("application/reactflow");

      if (typeof item === "undefined" || !item) {
        return;
      }

      var info = null;

      try {
        info = JSON.parse(item);
      } catch (err) {
        console.log(err);
      }

      if (info === null) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type: GET_NODETYPE(info.type ? info.type : TaskType.Property),
        position,
        data: getDefaultNodeData(info),
      };

      setNodes((nds) => nds?.concat(newNode));
    },
    [reactFlowInstance]
  );

  const onNodeClick = (event, node) => {
    console.log("Click Node", event, node);

    const { x, y } = node.position;
    console.log("선택된 노드 좌표:", { x, y });

    onClickNodeSetting(node.id, node.data);
  };

  useEffect(() => {}, [sourceTreeData, targetTreeData]);

  useEffect(() => {
    if (workflowModel && workflowModel.gui?.flow) {
      let gui = workflowModel.gui.flow;

      onLoadFlowData(gui);
    }
  }, [workflowModel]);

  return (
    <div
      className="card card-body pnl-workflow-workspace"
      ref={reactFlowWrapper}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={(changes) => {
          saveState();
          onNodesChange(changes);
        }}
        onEdgesChange={(changes) => {
          saveState();
          onEdgesChange(changes);
        }}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        minZoom={0.4}
        maxZoom={4}
        connectionLineType={ConnectionLineType.SmoothStep}
        nodeTypes={WorkflowNodeType}
        edgeTypes={edgeTypes}
        deleteKeyCode={["Backspace", "Delete"]}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      >
        <Background color="#777" gap={16} />
        <Controls />
      </ReactFlow>

      {expandProperty && (
        <div className="pnl-property">
          <PropertyPanel
            origin={selectedNode}
            handleModify={handleModifyProperty}
            closePanel={handleExpandProperty}
          ></PropertyPanel>
        </div>
      )}
    </div>
  );
});

export default Workflow;
