import EmptyList from "apps/components/EmptyList";
import ModalADDVariable from "apps/components/modal/modal_add_variable";
import useDialog from "apps/components/modal/useDialog";
import useModal from "apps/components/modal/useModal";
import { TaskType } from "apps/datas/definedData";
import UtilManager from "apps/utils/util_manager";
import { useEffect, useRef, useState } from "react";
import PanelValueSet from "./PanelValueSet";
import PanelValueHttp from "./PanelValueHttp";
import PanelValueASS from "./PanelValueAAS";
import LogView from "apps/components/Instance/JsonView";

const LogViewPanel = ({ origin, closePanel }) => {
  const [log, setLog] = useState("");

  const convertData = (node) => {};

  useEffect(() => {
    if (origin) {
      convertData(origin);
    }
  }, [origin]);

  return (
    <div className="pnl-logview-property">
      <div className="card-logview">
        <div className="pnl-logview-title">
          <h6 className="mb-0">로그보기</h6>
          <div className="ms-auto">
            <button
              type="button"
              className="btn btn-link btn-sm text-danger ms-1"
              onClick={() => closePanel(false)}
            >
              <i className="ph-x"></i>
            </button>
          </div>
        </div>
        <div className="card-body">
          <LogView data={log} height="100%"></LogView>
        </div>
      </div>
    </div>
  );
};

export default LogViewPanel;
