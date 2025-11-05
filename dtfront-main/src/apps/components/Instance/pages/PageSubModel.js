import { useEffect, useState } from "react";
import modal_icon from "assets/images/logo/header_icon.png";
import SubModelTree from "../SubModelTree";
import useRequestManager from "apps/utils/request_manager";
import TreeView from "apps/components/Tree/TreeView";
import ELE_View from "apps/components/mdt/ELE_View";
import Split from "react-split";
import { useConvert } from "apps/datas/definedData";
import SubModelView from "apps/components/common/SubModelTreeView";
import SubModelInnerTreeView from "apps/components/common/SubModelInnerTreeView";

const PageSubModel = ({ model, closeInfo }) => {
  const [originData, setOriginData] = useState();
  const [baseInfo, setBaseInfo] = useState();

  const makeData = (info) => {
    const { instance, endPoint, model } = info;

    setBaseInfo(model);
    setOriginData(info);
  };

  useEffect(() => {
    if (model) {
      makeData(model);
    }
  }, [model]);

  return (
    <div>
      <div className="page-title">
        <img src={modal_icon}></img>
        <div className="title">Submodel 정보</div>
        <button
          className="btn btn-info btn-icon width-100 ms-auto"
          onClick={closeInfo}
        >
          <i className="ph-x me-2"></i>
          닫기
        </button>
      </div>

      <div className="contents-part mb-4">
        <div className="table-container">
          <table className="table mb-0">
            <thead>
              <tr>
                <td>기본정보</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="row">
                    <label className="col-form-label col-2">ID</label>
                    <label className="col-form-label col-10 label-value">
                      {baseInfo ? baseInfo.id : ""}
                    </label>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="row">
                    <label className="col-form-label col-2">Short ID</label>
                    <label className="col-form-label col-10 label-value">
                      {baseInfo ? baseInfo.idShort : ""}
                    </label>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="row">
                    <label className="col-form-label col-2">Semantic ID</label>
                    <label className="col-form-label col-10 label-value">
                      {baseInfo ? baseInfo.semanticId : ""}
                    </label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="contents-part">
        <div className="contents-title">
          <div className="title">
            <img src={modal_icon} className="me-2" height={16}></img>
            <span>Submodel 트리</span>
          </div>
        </div>
        <div className="table-container">
          <SubModelInnerTreeView instance={originData}></SubModelInnerTreeView>
        </div>
      </div>
    </div>
  );
};

export default PageSubModel;
