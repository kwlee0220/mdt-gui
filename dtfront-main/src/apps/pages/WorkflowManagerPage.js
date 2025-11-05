import PageWorkflowEditor from "apps/components/Workflow/pages/PageWorkflowEditor";
import PageWorkflowFlow from "apps/components/Workflow/pages/PageWorkflowFlow";
import PageWorkflowRun from "apps/components/Workflow/pages/PageWorkflowRun";
import PageWorkflowTable from "apps/components/Workflow/pages/PageWorkflowTable";
import useCommon from "apps/hooks/useCommon";
import { useEffect, useState } from "react";

const WorkflowManagerPage = () => {
  const [viewMode, setViewMode] = useState("list");
  const [selectedFlow, setSelectedFlow] = useState();
  const [selectedModel, setSelectedModel] = useState();

  const handleShowFlow = (flow) => {
    setSelectedFlow(flow);
    setViewMode("flow");
  };

  const handleShowEditor = (model) => {
    setSelectedModel(model);
    setViewMode("editor");
  };

  const handleShowList = () => {
    setSelectedFlow(null);
    setSelectedModel(null);
    setViewMode("list");
  };

  return (
    <div className="main-content">
      {viewMode === "list" ? (
        <div className="pnl-main">
          <PageWorkflowTable
            setViewMode={setViewMode}
            handleShowFlow={handleShowFlow}
            handleShowEditor={handleShowEditor}
          ></PageWorkflowTable>
        </div>
      ) : viewMode === "editor" ? (
        <PageWorkflowEditor
          selectedModel={selectedModel}
          handleShowList={handleShowList}
        ></PageWorkflowEditor>
      ) : viewMode === "flow" ? (
        <PageWorkflowRun
          mainFlow={selectedFlow}
          handleShowList={handleShowList}
        ></PageWorkflowRun>
      ) : null}
    </div>
  );
};

export default WorkflowManagerPage;
