import { useEffect, useState } from "react";

const WorkflowItem = ({ item = null }) => {
  const [title, setTitle] = useState("Start/End");
  const [nodeType, setNodeType] = useState("data");
  const [nodeItem, setNodeItem] = useState();

  const onDragStart = (e) => {
    var info = JSON.stringify(item);
    e.dataTransfer.setData("application/reactflow", info);
    e.dataTransfer.effectAllowed = "move";
  };

  const onChangeItem = (item) => {
    setNodeItem(item);

    var type = item.type;
    var title = item.title;
    var nodeitem = item.item;

    setNodeType(type);
    setNodeItem(nodeitem);
    setTitle(title);
  };

  useEffect(() => {
    if (item) {
      onChangeItem(item);
    }
  }, [item]);

  return (
    <button
      type="button"
      className="btn btn-outline-secondary my-1 w-100"
      onDragStart={onDragStart}
      draggable
    >
      {title}
    </button>
  );
};

export default WorkflowItem;
