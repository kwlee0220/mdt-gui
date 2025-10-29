import { RunStatus } from "apps/datas/definedData";
import { useEffect, useState } from "react";
import clsx from "classnames";

const ToggleStatusCard = ({
  status,
  count,
  checked,
  setChecked,
  margin = "me-2",
}) => {
  const [bg, setBG] = useState("bg-default");

  const getStatusBG = (status) => {
    let bg = "bg-default";

    switch (status) {
      case "STOPPED":
        bg = "bg-stopped";
        break;
      case "STOPPING":
        bg = "bg-stopping";
        break;
      case "STARTING":
        bg = "bg-starting";
        break;
      case "RUNNING":
        bg = "bg-running";
        break;
      case "FAILED":
        bg = "bg-failed";
        break;
      default:
        break;
    }

    return bg;
  };

  useEffect(() => {}, [status, count, checked]);

  return (
    <div
      className={clsx(
        `card card-body ${margin}`,
        checked ? getStatusBG(status) : "border-default"
      )}
      onClick={() => setChecked(!checked)}
    >
      <div className="d-flex align-items-center">
        <div className="flex-fill">
          <h6 className="mb-0">{status ? status : ""}</h6>
          <span className="opacity-75">수집 건수 : {count}건</span>
        </div>
        <i className="ph-check-circle ph-2x ms-3"></i>
      </div>
    </div>
  );
};

export default ToggleStatusCard;
