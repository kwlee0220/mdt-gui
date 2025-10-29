import WorkflowModelTable from "apps/components/Table/WorkflowModelTable";
import WorkflowTable from "apps/components/Table/WorkflowTable";
import modal_icon from "assets/images/logo/header_icon.png";

const PageWorkflowTable = ({
  setViewMode,
  handleShowFlow,
  handleShowEditor,
}) => {
  return (
    <div className="pnl-instance">
      <div className="inner-title">
        <h4 className="mb-0">
          <img src={modal_icon} className="me-2" height={16}></img>MDT
          워크플로우
        </h4>
      </div>

      <div className="pnl-space"></div>
      <div className="card card-body card-dark">
        <WorkflowModelTable
          handleShowEditor={handleShowEditor}
        ></WorkflowModelTable>
      </div>
      <div className="inner-title mt-4">
        <h4 className="mb-0">
          <img src={modal_icon} className="me-2" height={16}></img>MDT
          워크플로우 인스턴스
        </h4>
      </div>
      <div className="card card-body card-dark">
        <WorkflowTable handleShowFlow={handleShowFlow}></WorkflowTable>
      </div>
    </div>
  );
};

export default PageWorkflowTable;
