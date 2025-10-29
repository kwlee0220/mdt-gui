import {
  Handle,
  NodeResizer,
  Position,
  useUpdateNodeInternals,
} from "@xyflow/react";
import UtilManager from "apps/utils/util_manager";
import { memo, useEffect, useState } from "react";

const NodeCopy = ({ id, data, selected }) => {
  const updateNodeInternals = useUpdateNodeInternals();
  const { CONVERT_HANDLE_DATA } = UtilManager();

  const [item, setItem] = useState();
  const [fromlist, setFromlist] = useState([]);
  const [tolist, setTolist] = useState([]);
  const [bg, setBg] = useState("#9b9b9b");

  const onClickSetting = () => {
    if (data.onShowNodeSetting) {
      console.log("Click Setting", data);

      data.onShowNodeSetting(id, data);
    }
  };

  const convertData = (item) => {
    setItem(item);

    let variable = item.variables;
    let result = CONVERT_HANDLE_DATA(id, variable);
    let bg = item.bg;

    setFromlist(result.from);
    setTolist(result.to);
    setBg(bg);
  };

  useEffect(() => {
    updateNodeInternals(id);
  }, [tolist, fromlist]);

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
      <div className="pnl-expand-node" style={{ backgroundColor: bg }}>
        <div className="btn-node-setting">
          <button
            className="btn btn-default btn-icon btn-sm"
            onClick={onClickSetting}
          >
            <i className="ph-gear"></i>
          </button>
        </div>

        <div className="expand-node-wrapper">
          <div className="node-left">
            {fromlist.map((item, index) => (
              <Handle
                key={index}
                type="target"
                position={Position.Left}
                id={item.id}
                className="node-handle"
              >
                {item.name}
              </Handle>
            ))}
          </div>
          <div className="node-wrapper flex-fill">
            <div className="node-label">{item?.id || "NoName"}</div>
            <div className="task-label">{data?.label || ""}</div>
          </div>
          <div className="node-right">
            {tolist.map((item, index) => (
              <Handle
                key={index}
                type="source"
                position={Position.Right}
                id={item.id}
                className="node-handle out-handle"
              >
                {item.name}
              </Handle>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(NodeCopy);
