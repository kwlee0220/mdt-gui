import { useEffect, useState } from "react";
import SubModelTree from "../SubModelTree";
import modal_icon from "assets/images/logo/header_icon.png";
import LogView from "../LogView";
import MDIStatusCard from "../MDIStatusCard";
import useRequestManager from "apps/utils/request_manager";
import SubModelTreeView from "apps/components/common/SubModelTreeView";
import useModal from "apps/components/modal/useModal";
import ModalLogView from "apps/components/modal/modal_logview";

const PageInstanceInfo = ({ instance, closeInfo }) => {
  const modalLogView = useModal();

  const [instanceInfo, setInstanceInfo] = useState();

  const makeData = (info) => {
    setInstanceInfo(info);
  };

  useEffect(() => {
    if (instance) {
      makeData(instance);
    }
  }, [instance]);

  console.log("change PageInstanceInfo");

  return (
    <div>
      <div className="page-title">
        <img src={modal_icon}></img>
        <div className="title">MDT 인스턴스 정보</div>
        <button
          className="btn btn-link ms-3"
          onClick={modalLogView.toggleModal}
        >
          <i className="ph-terminal-window me-2"></i>로그보기
        </button>
        <button
          className="btn btn-info btn-icon width-100 ms-auto"
          onClick={closeInfo}
        >
          <i className="ph-x me-2"></i>
          닫기
        </button>
      </div>
      <div className="pnl-space"></div>

      <div className="contents-part">
        <MDIStatusCard
          type={instanceInfo ? instanceInfo.status : "STOPPED"}
          instanceInfo={instanceInfo}
        ></MDIStatusCard>
      </div>
      <div className="row">
        <div className="col">
          <div className="contents-part">
            <div className="contents-title">
              <div className="title">
                <img src={modal_icon} className="me-2" height={16}></img>
                <span>Submodel 트리</span>
              </div>
            </div>
            <div className="table-container">
              <SubModelTreeView instance={instanceInfo}></SubModelTreeView>
            </div>
          </div>
        </div>
      </div>

      <ModalLogView
        open={modalLogView.open}
        closeModal={modalLogView.toggleModal}
        data={instanceInfo}
      ></ModalLogView>
    </div>
  );
};

export default PageInstanceInfo;
