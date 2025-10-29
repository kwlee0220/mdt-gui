import UtilManager from "apps/utils/util_manager";
import { useEffect } from "react";
import { Modal } from "react-bootstrap";

const ModalSubModelList = ({ open, closeModal, instance, showSubModel }) => {
  const { GET_MODELTYPE } = UtilManager();
  useEffect(() => {}, [open, instance]);

  return (
    <Modal show={open} centered animation={false} size={"lg"}>
      <Modal.Header>
        <div className="header-icon">
          <i className="ph-app-window"></i>
        </div>
        <div className="modal-title">Submodel 리스트</div>
        <button
          type="button"
          className="btn btn-link ms-auto"
          onClick={closeModal}
        >
          <i className="ph-x"></i>
        </button>
      </Modal.Header>
      <div className="table-responsive">
        <table className="table table-border table-mdt">
          <thead>
            <tr>
              <th>ID</th>
              <th style={{ width: "200px" }}>Short ID</th>
              <th>Type</th>
              <th>Semantic ID</th>
              <th style={{ width: "80px" }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {instance &&
              instance.submodels &&
              instance.submodels.map((submodel, idx) => (
                <tr key={idx}>
                  <td>{submodel.id}</td>
                  <td>{submodel.idShort}</td>
                  <td>{GET_MODELTYPE(submodel)}</td>
                  <td>{submodel.semanticId}</td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      type="button"
                      className="btn btn-outline-success border-0 btn-icon"
                      title="정보보기"
                      onClick={() => showSubModel(instance, submodel)}
                    >
                      <i className="ph-magnifying-glass"></i>
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <Modal.Footer>
        <button className="btn btn-link" onClick={closeModal}>
          닫기
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalSubModelList;
