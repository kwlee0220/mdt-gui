import { TaskType, useGenesisDataManager } from "apps/datas/definedData";
import { useEffect, useState } from "react";

const WorkflowTaskItem = ({ item = null }) => {
  const { GET_TASKLABEL } = useGenesisDataManager();
  const [title, setTitle] = useState();
  const [nodeType, setNodeType] = useState();
  const [nodeItem, setNodeItem] = useState();

  const onDragStart = (e) => {
    var info = JSON.stringify(item);
    e.dataTransfer.setData("application/reactflow", info);
    e.dataTransfer.effectAllowed = "move";
  };

  const onChangeItem = (item) => {
    setNodeItem(item);

    let label = GET_TASKLABEL(item.type);

    setNodeType(item.type);
    setTitle(label);
  };

  useEffect(() => {
    if (item) {
      onChangeItem(item);
    }
  }, [item]);

  return (
    <button
      type="button"
      className="btn btn-outline-secondary my-1 w-100 fw-semibold"
      onDragStart={onDragStart}
      draggable
    >
      {title}
    </button>
  );
};

export default WorkflowTaskItem;
