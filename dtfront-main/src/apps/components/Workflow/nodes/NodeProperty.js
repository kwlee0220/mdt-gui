import { Handle, NodeResizer, Position } from "@xyflow/react";
import { memo, useEffect, useState } from "react";

const NodeProperty = ({ id, data, selected }) => {
  const [bg, setBg] = useState("#9b9b9b");

  const convertData = (item) => {
    console.log("Node", item);
    let bg = item.bg;

    if (bg) {
      setBg(bg);
    }
  };

  useEffect(() => {
    if (data && data.item) {
      convertData(data.item);
    }
  }, [data]);

  return (
    <>
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={150}
        minHeight={35}
      />
      <div className="pnl-property-node" style={{ backgroundColor: bg }}>
        <Handle type="target" position={Position.Left}></Handle>
        <div>{data?.label || ""}</div>
        <Handle type="source" position={Position.Right}></Handle>
      </div>
    </>
  );
};

export default memo(NodeProperty);
