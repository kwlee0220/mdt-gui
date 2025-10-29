import { RunStatus } from "apps/datas/definedData";
import { useEffect, useState } from "react";

const MDIStatusCard = ({ type, instanceInfo }) => {
  const [count, setCount] = useState("0");
  const [percent, setPercent] = useState("0%");
  const [color, setColor] = useState("bg-default");
  const [icon, setIcon] = useState("ph-gear");
  const [title, setTitle] = useState("STOPPED");

  const changeUI = (type, data) => {
    var color = "bg-stopped";
    var icon = "ph-stop-circle";
    var title = "STOPPED";

    switch (type) {
      case RunStatus.STOPPED:
        color = "bg-stopped";
        icon = "ph-stop-circle";
        title = "STOPPED";
        break;
      case RunStatus.STOPPING:
        color = "bg-stopping";
        icon = "ph-pause-circle";
        title = "STOPPING";
        break;
      case RunStatus.STARTING:
        color = "bg-starting";
        icon = "ph-fast-forward-circle";
        title = "STARTING";
        break;
      case RunStatus.RUNNING:
        color = "bg-running";
        icon = "ph-play-circle";
        title = "RUNNING";
        break;
      case RunStatus.FAILED:
        color = "bg-failed";
        icon = "ph-warning-circle";
        title = "FAILED";
        break;
      default:
        break;
    }

    setColor(color);
    setIcon(icon);
    setTitle(title);
  };

  useEffect(() => {
    console.log(type, instanceInfo);
    if (type && instanceInfo) {
      changeUI(type, instanceInfo);
    }
  }, [type, instanceInfo]);

  return (
    <div className={`card card-body card-dark text-white h-100`}>
      <div className="flex-ycenter mb-3">
        <h6 className="mb-0">
          {instanceInfo ? `${instanceInfo.aasIdShort} 인스턴스` : ""}
        </h6>
        <div className={`ms-auto pnl-status ${color}`}>
          <span>{title}</span>
          <i className={`${icon} ms-3`}></i>
        </div>
      </div>

      <table className="table table-dark table-bordered table-info">
        <colgroup>
          <col width="200px" />
          <col width="*" />
        </colgroup>
        <tbody>
          <tr>
            <td>ID</td>
            <td>{instanceInfo ? instanceInfo.id : ""}</td>
          </tr>
          <tr>
            <td>AAS Short ID</td>
            <td>{instanceInfo ? instanceInfo.aasIdShort : ""}</td>
          </tr>
          <tr>
            <td>AAS ID</td>
            <td>{instanceInfo ? instanceInfo.aasId : ""}</td>
          </tr>
          <tr>
            <td>Base EndPoint</td>
            <td>{instanceInfo ? instanceInfo.baseEndpoint : ""}</td>
          </tr>
          <tr>
            <td>Asset Global ID</td>
            <td>{instanceInfo ? instanceInfo.globalAssetId : ""}</td>
          </tr>
          <tr>
            <td>Asset Type</td>
            <td>{instanceInfo ? instanceInfo.assetType : ""}</td>
          </tr>
          <tr>
            <td>Asset Kind</td>
            <td>{instanceInfo ? instanceInfo.assetKind : ""}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MDIStatusCard;
