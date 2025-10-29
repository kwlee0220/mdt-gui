import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import useRequestManager from "apps/utils/request_manager";
import MDTTreeView from "../common/MDTTreeView";
import HoverPopoverButton from "../common/HoverPopoverButton";

const ModalSelectPath = ({ open, closeModal, handleSetData }) => {
  const { REQ_GET_Variables_JSON } = useRequestManager();

  const [name, setName] = useState();
  const [link, setLink] = useState();

  const onClickRequestJSON = async () => {
    let result = await REQ_GET_Variables_JSON(name);

    if (result) {
      setLink(result);
    }
  };

  const onClickSetData = () => {
    if (handleSetData) {
      let result = {
        name: name,
        link: link,
      };

      handleSetData(result);
    }
  };

  const handleChangeLink = (info) => {
    const { name } = info;
    setName(name);
  };

  useEffect(() => {
    if (open) {
      setName("");
      setLink("");
    }

    return () => {
      setName("");
      setLink("");
    };
  }, [open]);

  return (
    <Modal show={open} centered animation={false}>
      <Modal.Header>
        <div className="header-icon">
          <i className="ph-app-window"></i>
        </div>
        <div className="modal-title">경로조회</div>
        <button
          type="button"
          className="btn btn-link ms-auto"
          onClick={closeModal}
        >
          <i className="ph-x"></i>
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className="row mb-3">
          <div className="col-3 col-form-label">조회경로</div>
          <div className="col-9">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                name="name"
                value={name ? name : ""}
                onChange={(e) => setName(e.target.value)}
              ></input>
              <HoverPopoverButton
                title="JSON Value"
                link={link ? JSON.stringify(link, null, 2) : ""}
              ></HoverPopoverButton>
              <button
                className="btn btn-light"
                type="button"
                onClick={onClickRequestJSON}
              >
                JSON
              </button>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="pnl-widget-tree">
              <MDTTreeView
                handlePropertyLinkChange={handleChangeLink}
              ></MDTTreeView>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-success" onClick={onClickSetData}>
          적용
        </button>
        <button className="btn btn-link" onClick={closeModal}>
          닫기
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalSelectPath;
