import { useEffect, useState } from "react";
import clsx from "classnames";
import UtilManager from "apps/utils/util_manager";

const ELE_TreeNode = ({ node, onSelected }) => {
  const { GET_TYPE_BG_CLASS } = UtilManager();
  const [expanded, setExpanded] = useState(false);

  const hasChildren = node.children && node.children.length > 0;

  const [typeBG, setTypeBG] = useState();

  const initData = (data) => {
    let bg = GET_TYPE_BG_CLASS(data.type);

    setTypeBG(bg);
  };

  useEffect(() => {
    if (node) {
      initData(node);
    }
  }, [node]);

  return (
    <div className="tree-parent">
      <div
        onClick={() => onSelected(node)}
        className="tree-label"
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
        <span className={clsx("badge ms-1 me-2", typeBG)}>{node.type}</span>
        {node.label}
        {node.type === "Prop" ? <span className="ms-1">=</span> : ""}
        {node.subtitle ? (
          <span className="ms-1 text-muted">{node.subtitle}</span>
        ) : (
          ""
        )}
      </div>
      {hasChildren && expanded && (
        <div className="tree-child">
          {node.children.map((child, index) => (
            <ELE_TreeNode key={index} node={child} onSelected={onSelected} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ELE_TreeNode;
