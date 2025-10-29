import { useState } from "react";

const WidgetTreeNode = ({ node }) => {
  const [expanded, setExpanded] = useState(false);

  const hasChildren = node.children && node.children.length > 0;

  return (
    <div style={{ marginLeft: 20 }}>
      <div
        onClick={() => setExpanded(!expanded)}
        className="tree-label"
        style={{ cursor: hasChildren ? "pointer" : "default" }}
      >
        {hasChildren &&
          (expanded ? (
            <i className="ph-caret-down"></i>
          ) : (
            <i className="ph-caret-right"></i>
          ))}{" "}
        {node.name}
      </div>
      {hasChildren && expanded && (
        <div className="tree-child">
          {node.children.map((child) => (
            <WidgetTreeNode key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WidgetTreeNode;
