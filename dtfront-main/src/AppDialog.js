import useDialog from "apps/components/modal/useDialog";
import useCommon from "apps/hooks/useCommon";
import usePrompt from "apps/hooks/usePrompt";
import clsx from "classnames";
import { Modal } from "react-bootstrap";

const AppDialog = () => {
  const {
    show,
    type,
    title,
    message,
    confirmHandler,
    denyHandler,
    open,
    close,
  } = useDialog();

  const toggleDialog = async () => {
    if (show) {
      close();
    } else {
      open({
        type,
        title,
        message,
        confirmHandler,
        denyHandler,
      });
    }
  };

  const executeConfirm = async () => {
    if (confirmHandler) {
      await confirmHandler();
    }

    toggleDialog();
  };

  const denyConfirm = async () => {
    if (denyHandler) {
      await denyHandler();
    }

    toggleDialog();
  };

  return (
    <Modal show={show} centered animation={false} className="modal-app-dialog">
      <Modal.Header>
        <div className="header-icon">
          <i className="ph-app-window"></i>
        </div>
        <div className="modal-title">{title}</div>
        <button
          type="button"
          className="btn btn-link ms-auto"
          onClick={toggleDialog}
        >
          <i className="ph-x"></i>
        </button>
      </Modal.Header>
      <Modal.Body>
        <h6 className="mb-0" dangerouslySetInnerHTML={{ __html: message }}></h6>
      </Modal.Body>
      <Modal.Footer>
        {type === "confirm" && (
          <button className="btn btn-primary" onClick={executeConfirm}>
            확인
          </button>
        )}
        <button className="btn btn-link" onClick={denyConfirm}>
          {type === "confirm" ? "취소" : "확인"}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default AppDialog;
