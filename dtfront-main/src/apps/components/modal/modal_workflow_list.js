import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import useRequestManager from "apps/utils/request_manager";
import moment from "moment";
import "./modal_workflow_list.css";
import useDialog from "apps/components/modal/useDialog";

const ModalWorkflowList = ({ open, closeModal }) => {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { openDialog } = useDialog();

  const {
    REQ_GET_Workflow_ALL,
    REQ_SUSPEND_Workflow,
    REQ_RESUME_Workflow,
    REQ_STOP_Workflow,
    REQ_DELETE_Workflow_Model,
  } = useRequestManager();

  useEffect(() => {
    if (open) {
      fetchWorkflows();
    }
  }, [open]);

  const fetchWorkflows = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await REQ_GET_Workflow_ALL();
      if (result) {
        setWorkflows(result);
      } else {
        setWorkflows([]);
        setError("워크플로우 목록을 불러오는데 실패했습니다.");
      }
    } catch (err) {
      console.error("워크플로우 목록 로드 오류:", err);
      setError(
        "워크플로우 목록을 불러오는 중 오류가 발생했습니다: " + err.message
      );
      setWorkflows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendWorkflow = async (workflow) => {
    if (!workflow || !workflow.name) {
      openDialog({
        title: "오류",
        message: "워크플로우 정보가 올바르지 않습니다.",
        type: "alert",
      });
      return;
    }

    try {
      setLoading(true);
      const result = await REQ_SUSPEND_Workflow(workflow.name);
      if (result) {
        openDialog({
          title: "성공",
          message: "워크플로우가 일시중지되었습니다.",
          type: "alert",
        });
      } else {
        openDialog({
          title: "실패",
          message: "워크플로우 일시중지에 실패했습니다.",
          type: "alert",
        });
      }
    } catch (err) {
      console.error("워크플로우 일시중지 오류:", err);
      openDialog({
        title: "오류",
        message: `워크플로우 일시중지 중 오류가 발생했습니다: ${
          err.message || "알 수 없는 오류"
        }`,
        type: "alert",
      });
    } finally {
      setLoading(false);
      // 성공 여부와 관계없이 목록 새로고침
      fetchWorkflows();
    }
  };

  const handleResumeWorkflow = async (workflow) => {
    if (!workflow || !workflow.name) {
      openDialog({
        title: "오류",
        message: "워크플로우 정보가 올바르지 않습니다.",
        type: "alert",
      });
      return;
    }

    try {
      setLoading(true);
      const result = await REQ_RESUME_Workflow(workflow.name);
      if (result) {
        openDialog({
          title: "성공",
          message: "워크플로우가 재개되었습니다.",
          type: "alert",
        });
      } else {
        openDialog({
          title: "실패",
          message: "워크플로우 재개에 실패했습니다.",
          type: "alert",
        });
      }
    } catch (err) {
      console.error("워크플로우 재개 오류:", err);
      openDialog({
        title: "오류",
        message: `워크플로우 재개 중 오류가 발생했습니다: ${
          err.message || "알 수 없는 오류"
        }`,
        type: "alert",
      });
    } finally {
      setLoading(false);
      // 성공 여부와 관계없이 목록 새로고침
      fetchWorkflows();
    }
  };

  const handleStopWorkflow = async (workflow) => {
    if (!workflow || !workflow.name) {
      openDialog({
        title: "오류",
        message: "워크플로우 정보가 올바르지 않습니다.",
        type: "alert",
      });
      return;
    }

    try {
      setLoading(true);
      const result = await REQ_STOP_Workflow(workflow.name);
      if (result) {
        openDialog({
          title: "성공",
          message: "워크플로우가 중지되었습니다.",
          type: "alert",
        });
      } else {
        openDialog({
          title: "실패",
          message: "워크플로우 중지에 실패했습니다.",
          type: "alert",
        });
      }
    } catch (err) {
      console.error("워크플로우 중지 오류:", err);
      openDialog({
        title: "오류",
        message: `워크플로우 중지 중 오류가 발생했습니다: ${
          err.message || "알 수 없는 오류"
        }`,
        type: "alert",
      });
    } finally {
      setLoading(false);
      // 성공 여부와 관계없이 목록 새로고침
      fetchWorkflows();
    }
  };

  const handleDeleteWorkflow = async (workflow) => {
    if (!workflow || !workflow.name) {
      openDialog({
        title: "오류",
        message: "워크플로우 정보가 올바르지 않습니다.",
        type: "alert",
      });
      return;
    }

    try {
      setLoading(true);
      const result = await REQ_DELETE_Workflow_Model(workflow.name);
      if (result) {
        openDialog({
          title: "성공",
          message: "워크플로우가 삭제되었습니다.",
          type: "alert",
        });
      } else {
        openDialog({
          title: "실패",
          message: "워크플로우 삭제에 실패했습니다.",
          type: "alert",
        });
      }
    } catch (err) {
      console.error("워크플로우 삭제 오류:", err);
      openDialog({
        title: "오류",
        message: `워크플로우 삭제 중 오류가 발생했습니다: ${
          err.message || "알 수 없는 오류"
        }`,
        type: "alert",
      });
    } finally {
      setLoading(false);
      // 성공 여부와 관계없이 목록 새로고침
      fetchWorkflows();
    }
  };

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "-";
    return moment(dateTimeStr).format("YYYY-MM-DD HH:mm:ss");
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "running":
        return "bg-primary";
      case "succeeded":
        return "bg-success";
      case "failed":
        return "bg-danger";
      case "pending":
        return "bg-warning";
      case "suspended":
        return "bg-info";
      default:
        return "bg-secondary";
    }
  };

  const isWorkflowRunning = (status) => {
    return status?.toLowerCase() === "running";
  };

  const isWorkflowSuspended = (status) => {
    return status?.toLowerCase() === "suspended";
  };

  const canStopWorkflow = (status) => {
    const lowerStatus = status?.toLowerCase();
    return (
      lowerStatus === "running" ||
      lowerStatus === "suspended" ||
      lowerStatus === "pending"
    );
  };

  const canDeleteWorkflow = (status) => {
    const lowerStatus = status?.toLowerCase();
    return lowerStatus === "succeeded" || lowerStatus === "failed";
  };

  return (
    <Modal
      show={open}
      centered
      animation={false}
      size="xl"
      dialogClassName="modal-90w"
    >
      <Modal.Header>
        <div className="header-icon">
          <i className="ph-list-bullets"></i>
        </div>
        <div className="modal-title">워크플로우 목록</div>
        <div className="ms-auto d-flex align-items-center">
          {loading && (
            <div
              className="spinner-border spinner-border-sm text-primary me-2"
              role="status"
            >
              <span className="visually-hidden">로딩 중...</span>
            </div>
          )}
          <button
            type="button"
            className="btn btn-sm btn-icon btn-outline-secondary me-1"
            onClick={fetchWorkflows}
            disabled={loading}
            title="새로고침"
          >
            <i className="ph-arrows-clockwise"></i>
          </button>
          <button
            type="button"
            className="btn btn-sm btn-icon btn-link"
            onClick={closeModal}
          >
            <i className="ph-x"></i>
          </button>
        </div>
      </Modal.Header>
      <div className="modal-body">
        {error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>이름</th>
                  <th>템플릿</th>
                  <th>실행상태</th>
                  <th>시작일시</th>
                  <th>종료일시</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {workflows.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      실행 중인 워크플로우가 없습니다.
                    </td>
                  </tr>
                ) : (
                  workflows.map((workflow) => (
                    <tr key={workflow.name || workflow.id}>
                      <td>{workflow.name || "-"}</td>
                      <td>{workflow.modelId || "-"}</td>
                      <td>
                        <span
                          className={`badge ${getStatusClass(workflow.status)}`}
                        >
                          {workflow.status || "Unknown"}
                        </span>
                      </td>
                      <td>{formatDateTime(workflow.startTime)}</td>
                      <td>{formatDateTime(workflow.finishTime)}</td>
                      <td className="text-center">
                        <div className="btn-group btn-group-sm" role="group">
                          <button
                            className="btn btn-xs btn-icon btn-outline-warning"
                            onClick={() => handleSuspendWorkflow(workflow)}
                            disabled={
                              !isWorkflowRunning(workflow.status) || loading
                            }
                            title="일시중지"
                          >
                            <i className="ph-pause"></i>
                          </button>
                          <button
                            className="btn btn-xs btn-icon btn-outline-success"
                            onClick={() => handleResumeWorkflow(workflow)}
                            disabled={
                              !isWorkflowSuspended(workflow.status) || loading
                            }
                            title="재개"
                          >
                            <i className="ph-play"></i>
                          </button>
                          <button
                            className="btn btn-xs btn-icon btn-outline-danger"
                            onClick={() => handleStopWorkflow(workflow)}
                            disabled={
                              !canStopWorkflow(workflow.status) || loading
                            }
                            title="중지"
                          >
                            <i className="ph-stop"></i>
                          </button>
                          <button
                            className="btn btn-xs btn-icon btn-outline-danger"
                            onClick={() => handleDeleteWorkflow(workflow)}
                            disabled={
                              !canDeleteWorkflow(workflow.status) || loading
                            }
                            title="삭제"
                          >
                            <i className="ph-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Modal.Footer>
        <button className="btn btn-link" onClick={closeModal}>
          닫기
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalWorkflowList;
