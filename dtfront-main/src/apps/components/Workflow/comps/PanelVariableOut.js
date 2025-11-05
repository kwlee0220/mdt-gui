import HoverPopoverButton from "apps/components/common/HoverPopoverButton";
import MDTTreeView from "apps/components/common/MDTTreeView";
import TreeViewMDTParameter from "apps/components/common/TreeViewMDTParameter";
import { useGenesisDataManager, VariableType } from "apps/datas/definedData";
import useRequestManager from "apps/utils/request_manager";
import UtilManager from "apps/utils/util_manager";
import { useEffect, useState } from "react";

const initialData = {
  type: "value",
  name: "",
  description: "",
  value: "",
  json: null,
};

const PanelVariableOut = ({ inputData, handleDelete, handleChange }) => {
  const [showTree, setShowTree] = useState(false);
  const [showTab, setShowTab] = useState("elements");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (handleChange) {
      handleChange(name, value);
    }
  };

  const onClickDelete = () => {
    if (handleDelete) {
      handleDelete();
    }
  };

  const handleChangeLink = (info) => {
    const { name } = info;

    handleInputChange({
      target: {
        name: "value",
        value: name,
      },
    });
  };

  return (
    <div className="pnl-variable">
      <div className="flex-ycenter mb-2 ">
        <div className="col-2 me-1">
          <select
            className="form-select"
            name="type"
            value={inputData?.type || ""}
            readOnly
            disabled
          >
            <option value="value">값</option>
            <option value="reference">참조</option>
          </select>
        </div>
        <div className="col-9 me-1">
          <input
            type="text"
            className="form-control"
            name="name"
            placeholder="이름"
            value={inputData?.name || ""}
            onChange={handleInputChange}
          ></input>
        </div>
        <div className={`col-1 ms-auto ${handleDelete ? "" : "d-none"}`}>
          <button className="btn link-danger" onClick={onClickDelete}>
            <i className="ph-trash"></i>
          </button>
        </div>
      </div>
      <div className="flex-ycenter ">
        <div className="col-12">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              name="value"
              placeholder="값"
              value={inputData?.value || ""}
              onChange={handleInputChange}
            ></input>
            <button
              className="btn btn-light"
              type="button"
              onClick={() => setShowTree(!showTree)}
            >
              <i className="ph-magnifying-glass"></i>
            </button>
          </div>
        </div>
      </div>

      {showTree && (
        <div className="pnl-widget-tree mt-2">
          <ul className="nav nav-tabs nav-tabs-underline">
            <li className="nav-item">
              <div
                className={`nav-link ${
                  showTab !== "parameters" ? "active" : ""
                }`}
                onClick={() => setShowTab("elements")}
              >
                Elements
              </div>
            </li>
            <li className="nav-item">
              <div
                className={`nav-link ${
                  showTab === "parameters" ? "active" : ""
                }`}
                onClick={() => setShowTab("parameters")}
              >
                Parameters
              </div>
            </li>
          </ul>
          <div>
            {showTab !== "parameters" ? (
              <MDTTreeView
                isTable={true}
                handlePropertyLinkChange={handleChangeLink}
              ></MDTTreeView>
            ) : (
              <TreeViewMDTParameter
                handleSelectedSubmodel={(node, reference) =>
                  handleChangeLink({
                    name: `${reference}`,
                  })
                }
              ></TreeViewMDTParameter>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelVariableOut;
