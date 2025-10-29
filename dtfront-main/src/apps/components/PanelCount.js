import { RunStatus } from "apps/datas/definedData";
import { useEffect, useState } from "react";

const PanelCount = ({ type, data }) => {
  const [count, setCount] = useState("0");
  const [percent, setPercent] = useState("0%");
  const [color, setColor] = useState("bg-default");
  const [icon, setIcon] = useState("ph-gear");
  const [title, setTitle] = useState("Instance");

  const changeUI = (type, data) => {
    var count = "0";
    var percent = "0%";
    var color = "bg-stopped";
    var icon = "ph-stop-circle";
    var title = "STOPPED Instance";

    switch (type) {
      case RunStatus.STOPPED:
        color = "bg-stopped";
        icon = "ph-stop-circle";
        title = "STOPPED Instance";
        break;
      case RunStatus.STOPPING:
        color = "bg-stopping";
        icon = "ph-pause-circle";
        title = "STOPPING Instance";
        break;
      case RunStatus.STARTING:
        color = "bg-starting";
        icon = "ph-fast-forward-circle";
        title = "STARTING Instance";
        break;
      case RunStatus.RUNNING:
        color = "bg-running";
        icon = "ph-play-circle";
        title = "RUNNING Instance";
        break;
      case RunStatus.FAILED:
        color = "bg-failed";
        icon = "ph-warning-circle";
        title = "FAILED Instance";
        break;
      default:
        break;
    }

    if (data) {
      count = data.count;
      percent = Math.round(((data.count * 1) / (data.total * 1)) * 100);
    }

    setCount(count);
    setPercent(percent + "%");
    setColor(color);
    setIcon(icon);
    setTitle(title);
  };

  useEffect(() => {
    if (type && data) {
      changeUI(type, data);
    }
  }, [type, data]);

  return (
    <div className={`card card-body ${color} text-white mb-0`}>
      <div className="d-flex align-items-center mb-3">
        <div className="flex-fill">
          <h6 className="mb-0">{title}</h6>
          <span className="opacity-75">수집 건수 : {count}건</span>
        </div>

        <i className={`${icon} ph-2x ms-3`}></i>
      </div>

      <div className={`progress ${color} mb-2`} style={{ height: "2px" }}>
        <div className="progress-bar bg-white" style={{ width: percent }}></div>
      </div>

      <div>
        <span className="float-end">{percent}</span>
        분포율
      </div>
    </div>
  );
};

export default PanelCount;
