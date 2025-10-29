import {
  Handle,
  NodeResizer,
  Position,
  useUpdateNodeInternals,
} from "@xyflow/react";
import UtilManager from "apps/utils/util_manager";
import { memo, useEffect, useState } from "react";
import {
  statusColorOrigin,
  statusColors,
  statusIcons,
} from "apps/datas/definedData";

const NodeSet = ({ id, data, selected }) => {
  const updateNodeInternals = useUpdateNodeInternals();
  const { CONVERT_HANDLE_DATA } = UtilManager();

  const [item, setItem] = useState();
  const [fromlist, setFromlist] = useState([]);
  const [tolist, setTolist] = useState([]);
  const [bg, setBg] = useState("#9b9b9b");

  const [status, setStatus] = useState();
  const [taskID, setTaskID] = useState();
  const [statusColor, setStatusColor] = useState(statusColors.NOT_STARTED);
  const [statusIcon, setStatusIcon] = useState(statusIcons.NOT_STARTED);
  const [borderColor, setBorderColor] = useState("#1a192b");

  const onClickSetting = () => {
    if (data.onShowNodeSetting) {
      console.log("Click Setting", data);

      data.onShowNodeSetting(id, data);
    }
  };

  const convertData = (item) => {
    setItem(item);

    let inputlist = CONVERT_HANDLE_DATA(id, item.inputVariables);
    let outputlist = CONVERT_HANDLE_DATA(id, item.outputVariables, "output");
    let bg = item.bg;

    setFromlist(inputlist);
    setTolist(outputlist);
    setBg(bg);
  };

  const convertStatus = (id, status) => {
    if (id && status) {
      setTaskID(id);
      setStatus(status);

      setStatusColor(statusColors[status]);
      setStatusIcon(statusIcons[status]);
      setBorderColor(statusColorOrigin[status]);
      setBg(statusColorOrigin[status]);
    } else {
      setTaskID(null);
      setStatus(null);
    }
  };

  useEffect(() => {
    updateNodeInternals(id);
  }, [tolist, fromlist]);

  useEffect(() => {
    if (data && data.item) {
      convertData(data.item);
      convertStatus(data.id, data.status);
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
      <div
        className="pnl-expand-node"
        style={{ backgroundColor: bg, border: `2px solid ${borderColor}` }}
      >
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
            <div
              className="node-label"
              style={{ color: `${status ? "white" : "black"}` }}
            >
              {item?.name ? item.name : item?.id ? item.id : "NoName"}
            </div>
            <div
              className="task-label"
              style={{ color: `${status ? "white" : "black"}` }}
            >
              {data?.label || ""}
            </div>
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
        {status ? (
          <div className="panel-status">
            <div className={`panel-icon`}>
              <i className={`${statusIcon}`}></i>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default memo(NodeSet);
