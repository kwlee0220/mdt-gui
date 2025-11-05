import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import useRequestManager from "apps/utils/request_manager";

const ModalWorkflowTemplates = ({ open, closeModal, onSelectTemplate }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { REQ_GET_Workflow_Model_ALL } = useRequestManager();

  useEffect(() => {
    if (open) {
      fetchTemplates();
    }
  }, [open]);

  const fetchTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await REQ_GET_Workflow_Model_ALL();
      if (result) {
        setTemplates(result);
      } else {
        setTemplates([]);
        setError("템플릿을 불러오는데 실패했습니다.");
      }
    } catch (err) {
      console.error("워크플로우 템플릿 로드 오류:", err);
      setError("템플릿을 불러오는 중 오류가 발생했습니다: " + err.message);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTemplate = (template) => {
    onSelectTemplate(template);
    closeModal();
  };

  return (
    <Modal show={open} centered animation={false}>
      <Modal.Header>
        <div className="header-icon">
          <i className="ph-flow-arrow"></i>
        </div>
        <div className="modal-title">워크플로우 템플릿 선택</div>
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
            onClick={fetchTemplates}
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
        ) : templates.length === 0 ? (
          <div className="alert alert-info">
            사용 가능한 워크플로우 템플릿이 없습니다.
          </div>
        ) : (
          <div className="list-group">
            {templates.map((template) => (
              <button
                key={template.id}
                className="list-group-item list-group-item-action"
                onClick={() => handleSelectTemplate(template)}
              >
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-1">{template.name || template.id}</h5>
                </div>
                {template.description && (
                  <p className="mb-1">{template.description}</p>
                )}
                <small>ID: {template.id}</small>
              </button>
            ))}
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

export default ModalWorkflowTemplates;
