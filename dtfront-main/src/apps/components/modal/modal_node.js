import UtilManager from "apps/utils/util_manager";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

const ModalNode = ({ node, open, closeModal, handleModify }) => {
  const { CloneDeep } = UtilManager();

  const [nodedata, setNodeData] = useState();

  const handleChangeInput = (e) => {
    const { name, value } = e.target;

    setNodeData({
      ...nodedata,
      [name]: value,
    });
  };

  const changeData = () => {
    let data = CloneDeep(node.data.item);

    setNodeData(data);
  };

  const onClickModify = () => {};

  useEffect(() => {
    if (open && node) {
      changeData();
    }
  }, [open, node]);

  return (
    <Modal show={open} centered animation={false} size={"xl"}>
      <Modal.Header>
        <div className="header-icon">
          <i className="ph-app-window"></i>
        </div>
        <div className="modal-title">Task 정보</div>
        <button
          type="button"
          className="btn btn-link ms-auto"
          onClick={closeModal}
        >
          <i className="ph-x"></i>
        </button>
      </Modal.Header>
      <div>
        <table className="table table-border table-input">
          <tbody>
            <tr>
              <td className="td-label">ID</td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  name="id"
                  value={nodedata ? nodedata.id : ""}
                  onChange={handleChangeInput}
                ></input>
              </td>
              <td className="td-label">Name</td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={nodedata ? nodedata.name : ""}
                  onChange={handleChangeInput}
                ></input>
              </td>
            </tr>
            <tr>
              <td className="td-label">Type</td>
              <td>
                <label className="form-control">
                  {nodedata ? nodedata.type : ""}
                </label>
              </td>
              <td className="td-label"></td>
              <td></td>
            </tr>
            <tr>
              <td className="td-label">Description</td>
              <td>
                <textarea
                  rows={5}
                  className="form-control"
                  name="description"
                  value={nodedata ? nodedata.description : ""}
                  onChange={handleChangeInput}
                ></textarea>
              </td>
              <td className="td-label">Dependencies</td>
              <td>
                <textarea
                  rows={5}
                  className="form-control"
                  name="dependencies"
                  value={
                    nodedata
                      ? JSON.stringify(nodedata.dependencies, null, 2)
                      : "[]"
                  }
                  onChange={handleChangeInput}
                ></textarea>
              </td>
            </tr>
            <tr>
              <td className="td-label">Variables</td>
              <td>
                <textarea
                  rows={5}
                  className="form-control"
                  name="variables"
                  value={
                    nodedata
                      ? JSON.stringify(nodedata.variables, null, 2)
                      : "[]"
                  }
                  onChange={handleChangeInput}
                ></textarea>
              </td>
              <td className="td-label">Options</td>
              <td>
                <textarea
                  rows={5}
                  className="form-control"
                  name="options"
                  value={
                    nodedata ? JSON.stringify(nodedata.options, null, 2) : "[]"
                  }
                  onChange={handleChangeInput}
                ></textarea>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Modal.Footer>
        <button className="btn btn-success" onClick={onClickModify}>
          변경
        </button>
        <button className="btn btn-link" onClick={closeModal}>
          닫기
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalNode;
