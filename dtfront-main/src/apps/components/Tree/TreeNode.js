import { useEffect, useState } from "react";
import clsx from "classnames";
import { TaskType, TreeItemType } from "apps/datas/definedData";

const TreeNode = ({ node, clickNode }) => {
  const [typeLabel, setTypeLabel] = useState();
  const [typeBG, setTypeBG] = useState();
  const [title, setTitle] = useState("");
  const [expanded, setExpanded] = useState(false);

  const hasChildren = node.children && node.children.length > 0;

  const initData = (data) => {
    let label = "";
    let bg = "";
    let title = "";

    switch (data.type) {
      case TreeItemType.MDT:
        label = "MDT";
        bg = "bg-primary";
        break;
      case TreeItemType.SubModel:
        label = "SM";
        bg = "bg-success";
        break;
      case TreeItemType.SMC:
        label = "SMC";
        bg = "bg-indigo";
        break;
      case TreeItemType.SML:
        label = "SML";
        bg = "bg-indigo";
        break;
      case TreeItemType.Prop:
        label = "Prop";
        bg = "bg-indigo";
        break;
      default:
        label = data.type;

        switch (label) {
          case "Operations":
            label = "Operation";
            break;
          case "Parameters":
            label = "Param";
            break;
        }
        bg = "bg-indigo";
        break;
    }

    if (data.data) {
      title = data.data.path;
    }

    setTitle(title);
    setTypeLabel(label);
    setTypeBG(bg);
  };

  useEffect(() => {}, [node?.children]);

  useEffect(() => {
    if (node) {
      initData(node);
    }
  }, [node]);

  const onDragStart = (e) => {
    if (node.data?.modelType === TaskType.Property) {
      var info = JSON.stringify(node.data);
      e.dataTransfer.setData("application/reactflow", info);
      e.dataTransfer.effectAllowed = "move";
    }
  };

  return (
    <div className="tree-parent">
      {/* 노드를 클릭하면 확장/축소 */}
      <div
        onClick={() => clickNode(node)}
        className="tree-label"
        onDragStart={onDragStart}
        draggable
        title={title}
        style={{ cursor: hasChildren ? "pointer" : "default" }}
      >
        {hasChildren ? (
          expanded ? (
            <i
              className="ph-caret-down"
              onClick={() => setExpanded(!expanded)}
            ></i>
          ) : (
            <i
              className="ph-caret-right"
              onClick={() => setExpanded(!expanded)}
            ></i>
          )
        ) : (
          <span style={{ marginRight: "20px" }}></span>
        )}
        <span className={clsx("badge ms-1 me-2", typeBG)}>{typeLabel}</span>
        {node.label}
        {node.type === TreeItemType.Prop ? (
          <span className="ms-1 text-muted">{`= ${
            node.data.value ? node.data.value : ""
          }`}</span>
        ) : (
          ""
        )}
      </div>

      {/* 자식 노드를 렌더링 */}
      {expanded && hasChildren && (
        <div style={{ marginLeft: 10 }} className="tree-child">
          {node.children.map((childNode, index) => (
            <TreeNode key={index} node={childNode} clickNode={clickNode} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
