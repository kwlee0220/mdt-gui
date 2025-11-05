import { ReactFlowProvider } from "@xyflow/react";
import ModalAddWorkflow from "apps/components/modal/modal_add_workflow";
import useDialog from "apps/components/modal/useDialog";
import useModal from "apps/components/modal/useModal";
import TreeView from "apps/components/Tree/TreeView";
import PropertyPanel from "apps/components/Workflow/comps/PropertyPanel";
import Workflow from "apps/components/Workflow/Workflow";
import WorkflowTaskItem from "apps/components/Workflow/WorkflowTaskItem";
import {
  TaskType,
  TreeItemType,
  useConvert,
  useGenesisDataManager,
} from "apps/datas/definedData";
import useRequestManager from "apps/utils/request_manager";
import UtilManager from "apps/utils/util_manager";
import clsx from "classnames";
import { useEffect, useRef, useState } from "react";
import {
  add_workflow,
  start_workflow,
  get_workflow_model_all,
  get_workflow,
} from "apps/remote/urls";
import ModalWorkflowTemplates from "apps/components/modal/modal_workflow_templates";
import ModalWorkflowList from "apps/components/modal/modal_workflow_list";
import WorkflowMenu from "apps/components/ctr/WorkflowMenu";
import useCommon from "apps/hooks/useCommon";
import ModalCreateWorkflow from "apps/components/modal/modal_create_workflow";
import { useDispatch } from "react-redux";
import { setWorkflow } from "apps/store/reducers/common";
import usePrompt from "apps/hooks/usePrompt";
import useDataConvert from "apps/utils/useDataConvert";

const PageWorkflowEditor = ({ selectedModel, handleShowList }) => {
  const projectFlowRef = useRef();
  const dispatch = useDispatch();

  const { GET_NODE_ORDER, CloneDeep } = UtilManager();
  const { uDC_UIData_To_WorkflowModel } = useDataConvert();

  const modalAddWorkflow = useModal();
  const modalCreateWorkflow = useModal();
  const modalWorkflowTemplates = useModal();
  const modalWorkflowList = useModal();
  const { openDialog } = useDialog();
  const { GET_TASKLIST } = useGenesisDataManager();

  //#region 데이터 조회

  const {
    REQ_START_Workflow_Model,
    REQ_ADD_Workflow_Model,
    REQ_GET_Workflow_Model,
    REQ_GET_Workflow_Model_ALL,
  } = useRequestManager();

  const [workflowData, setWorkflowData] = useState();

  const fetchAddWorkflow = async (workflow) => {
    console.log("******************** fetchAddWorkflow ", workflow);

    let result = await REQ_ADD_Workflow_Model(workflow);

    if (result) {
      modalAddWorkflow.toggleModal();

      openDialog({
        title: `워크플로우 ${originModel ? "변경" : "등록"}`,
        message: `워크플로우 ${
          originModel ? "변경" : "등록"
        }이 완료되었습니다.`,
        type: "alert",
      });
    }
  };

  const fetchExecWorkflow = async (workflow) => {
    console.log(
      "********************* Starting workflow execution 2:",
      workflow
    );

    if (!workflow || !workflow.id) {
      console.error("Invalid workflow object:", workflow);
      return;
    }

    try {
      let r = await REQ_GET_Workflow_Model(workflow.id);
      console.log("get_workflow with id(" + workflow.id + "): ", r);

      r = await REQ_GET_Workflow_Model_ALL();
      console.log("get_workflow_all:", r);

      const result = await REQ_START_Workflow_Model(workflow.id);
      console.log("Workflow execution successful:", result);
      openDialog({
        title: "워크플로우 실행",
        message: "워크플로우 실행이 시작되었습니다.",
        type: "alert",
      });
    } catch (error) {
      console.error("Workflow execution failed:", error);
      openDialog({
        title: "워크플로우 실행 오류",
        message: `워크플로우 실행 중 오류가 발생했습니다: ${error.message}`,
        type: "alert",
      });
    }
  };

  //#endregion

  //#region 컴포넌트 Accordion

  const [expandTask, setExpandTask] = useState(true);

  //#endregion

  //#region 리스트 관리

  const [tasklist, setTasklist] = useState([]);

  const initData = () => {
    let list = GET_TASKLIST();

    setTasklist(list);
  };

  //#endregion

  //#region 워크플로우 상단 메뉴 관련 함수

  const fileInputRef = useRef();

  const handleOpenFile = () => {
    fileInputRef.current.click(); // 파일 입력 요소를 클릭하여 다이얼로그 띄우기
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0]; // 선택한 파일들

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        let result = e.target.result;

        if (projectFlowRef) {
          projectFlowRef.current.onLoadFlowData(result);
        }
      };

      reader.readAsText(file);
    }
  };

  const onClickClear = () => {
    if (projectFlowRef) {
      projectFlowRef.current.onClearFlow();
    }
  };

  const onClickMakeScript = () => {
    if (projectFlowRef) {
      const resp = projectFlowRef.current.onLoadWorkflowDescriptor();

      console.log("flow script", JSON.parse(resp.contents));

      const flow = GET_NODE_ORDER(resp.nodes, resp.edges);
      let tasklist = [];

      flow.forEach((id) => {
        let node = resp.nodes.find((inner) => inner.id === id);

        if (node) {
          let task = node.data.item;

          tasklist.push(task);
        }
      });

      let workflow = uDC_UIData_To_WorkflowModel(tasklist, resp.contents);

      if (originModel) {
        workflow.id = originModel.id;
        workflow.name = originModel.name;
        workflow.description = originModel.description;
      }

      setWorkflowData(workflow);

      modalAddWorkflow.toggleModal();
    }
  };

  const onClickCreateWorkflow = (data) => {
    dispatch(setWorkflow(data));

    modalCreateWorkflow.toggleModal();
  };

  const onClickStart = () => {
    modalWorkflowTemplates.toggleModal();
  };

  const onClickStop = () => {};

  const handleSelectTemplate = async (template) => {
    try {
      console.log("Selected template:", template);
      const result = await REQ_START_Workflow_Model(template.id);
      if (result) {
        openDialog({
          title: "워크플로우 실행",
          message: "워크플로우가 성공적으로 시작되었습니다.",
          type: "alert",
        });
      } else {
        openDialog({
          title: "워크플로우 실행 실패",
          message: "워크플로우를 시작하는데 실패했습니다.",
          type: "alert",
        });
      }
    } catch (error) {
      console.error("워크플로우 실행 오류:", error);
      openDialog({
        title: "워크플로우 실행 오류",
        message: `오류: ${error.message || "알 수 없는 오류가 발생했습니다."}`,
        type: "alert",
      });
    }
  };

  const onClickSave = () => {
    if (projectFlowRef) {
      openDialog({
        title: "Flow 저장",
        message: "Flow를 저장하시겠습니까?",
        type: "confirm",
        confirmHandler: () => {
          projectFlowRef.current.onSaveFlowData();
        },
      });
    }
  };

  //#endregion

  //#region Toolbar 메뉴 관련 함수

  //#region 정렬관련 함수

  const onClickAlignVertical = (type) => {
    if (projectFlowRef && projectFlowRef.current) {
      projectFlowRef.current.AlignVertical(type);
    }
  };

  const onClickAlignHorizotal = (type) => {
    if (projectFlowRef && projectFlowRef.current) {
      projectFlowRef.current.AlignHorizontal(type);
    }
  };

  //#endregion

  //#region 편집 관련 함수

  const handleAddNode = (input, output, type) => {
    if (projectFlowRef && projectFlowRef.current) {
      projectFlowRef.current.onAddNode(input, output, type);
    }
  };

  const handleChangeColor = (color) => {
    if (projectFlowRef && projectFlowRef.current) {
      projectFlowRef.current.onChangeColor(color);
    }
  };

  const handleUndo = () => {
    if (projectFlowRef && projectFlowRef.current) {
      projectFlowRef.current.onUndo();
    }
  };

  const handleRedo = () => {
    if (projectFlowRef && projectFlowRef.current) {
      projectFlowRef.current.onRedo();
    }
  };

  //#endregion

  //#endregion

  const updateTreeNodeData = (tree, id, newData) => {
    return tree.map((node) => {
      if (node.id === id) {
        return { ...node, newData };
      }
      if (node.children && node.children.length > 0) {
        return {
          ...node,
          children: updateTreeNodeData(node.children, id, newData),
        };
      }
      return node;
    });
  };

  useEffect(() => {
    initData();

    return () => {
      setOriginModel(null);
    };
  }, []);

  //#region 워크플로우 초기화

  const [originModel, setOriginModel] = useState();

  const convertData = (model) => {
    setOriginModel(model);
  };

  useEffect(() => {
    if (selectedModel) {
      convertData(selectedModel);
    }
  }, [selectedModel]);

  const handleCloseEditor = () => {
    setOriginModel(null);
    handleShowList();
  };

  //#endregion

  return (
    <div className="px-3 h-100">
      <div className="title-workflow">
        <button className="btn btn-primary" onClick={onClickMakeScript}>
          <i className="ph-cloud-arrow-up me-2"></i>
          워크플로우 {originModel ? "변경" : "등록"}
        </button>
        <div className="title flex-fill text-center">
          워크플로우 저작도구
          {originModel && (
            <span className="ms-3 text-default">{`${originModel.id} [${originModel.name}]`}</span>
          )}
        </div>
        <div className="ms-auto">
          <button className="btn btn-light" onClick={handleCloseEditor}>
            닫기
          </button>
        </div>
      </div>

      <WorkflowMenu
        addNode={handleAddNode}
        alignVertical={onClickAlignVertical}
        alignHorizontal={onClickAlignHorizotal}
        changeColor={handleChangeColor}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        handleClear={onClickClear}
        handleStart={onClickStart}
        handleStop={onClickStop}
      ></WorkflowMenu>

      <div className="pnl-workflow">
        <ReactFlowProvider>
          <div className="card pnl-workflow-components">
            <div className="accordion">
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className={clsx(
                      "accordion-button fw-semibold",
                      expandTask ? "" : "collapsed"
                    )}
                    type="button"
                    onClick={() => setExpandTask(!expandTask)}
                  >
                    Task
                  </button>
                </h2>
                <div
                  className={clsx(
                    "accordion-collapse collapse",
                    expandTask ? "show" : ""
                  )}
                >
                  <div className="accordion-body">
                    {tasklist &&
                      tasklist.map((item, index) => {
                        return <WorkflowTaskItem key={index} item={item} />;
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Workflow workflowModel={originModel} ref={projectFlowRef}></Workflow>
        </ReactFlowProvider>
      </div>

      <ModalCreateWorkflow
        open={modalCreateWorkflow.open}
        closeModal={modalCreateWorkflow.toggleModal}
        handleCreate={onClickCreateWorkflow}
      ></ModalCreateWorkflow>

      <ModalAddWorkflow
        open={modalAddWorkflow.open}
        closeModal={modalAddWorkflow.toggleModal}
        flowInfo={workflowData}
        origin={originModel}
        handleAdd={fetchAddWorkflow}
      ></ModalAddWorkflow>

      <ModalWorkflowTemplates
        open={modalWorkflowTemplates.open}
        closeModal={modalWorkflowTemplates.toggleModal}
        onSelectTemplate={handleSelectTemplate}
      />

      <ModalWorkflowList
        open={modalWorkflowList.open}
        closeModal={modalWorkflowList.toggleModal}
      />
    </div>
  );
};

export default PageWorkflowEditor;
