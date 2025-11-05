import EmptyList from "apps/components/EmptyList";
import ModalADDVariable from "apps/components/modal/modal_add_variable";
import useDialog from "apps/components/modal/useDialog";
import useModal from "apps/components/modal/useModal";
import { TaskType } from "apps/datas/definedData";
import UtilManager from "apps/utils/util_manager";
import { useEffect, useRef, useState } from "react";
import PanelValueSet from "./PanelValueSet";
import PanelValueHttp from "./PanelValueHttp";
import PanelValueASS from "./PanelValueAAS";

const PropertyPanel = ({ origin, handleModify, closePanel }) => {
  const childRef = useRef();

  const { IS_NULL } = UtilManager();

  const [nodeData, setNodeData] = useState();
  const [nodeID, setNodeID] = useState();
  const [taskID, setTaskID] = useState();
  const [taskData, setTaskData] = useState();

  const onClickModify = async () => {
    if (childRef.current) {
      let result = await childRef.current.getData();

      if (handleModify && result) {
        let originID = null;

        if (IS_NULL(taskID)) {
        } else if (taskID !== result.id) {
          originID = taskID;
        }

        handleModify(nodeID, result, originID);
      }
    }
  };

  const convertData = (node) => {
    let itemData = node.data.item;

    setNodeID(node.id);
    setTaskID(itemData.id);
    setNodeData(node);
    setTaskData(itemData);
  };

  useEffect(() => {
    if (origin) {
      convertData(origin);
    }
  }, [origin]);

  return (
    <>
      <div className="card-property">
        <div className="pnl-property-title">
          <h6 className="mb-0">속성</h6>
          <div className="ms-auto">
            <button className="btn btn-sm btn-default" onClick={onClickModify}>
              적용
            </button>
            <button
              type="button"
              className="btn btn-link btn-sm text-danger ms-1"
              onClick={() => closePanel(false)}
            >
              <i className="ph-x"></i>
            </button>
          </div>
        </div>
        <div className="card-body">
          {taskData &&
            (taskData.type === TaskType.SET ? (
              <PanelValueSet ref={childRef} task={taskData}></PanelValueSet>
            ) : taskData.type === TaskType.HTTP ? (
              <PanelValueHttp ref={childRef} task={taskData}></PanelValueHttp>
            ) : taskData.type === TaskType.AAS ? (
              <PanelValueASS ref={childRef} task={taskData}></PanelValueASS>
            ) : null)}
        </div>
      </div>
    </>
  );
};

export default PropertyPanel;
