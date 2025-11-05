import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import LogView from "../Instance/LogView";
import useRequestManager from "apps/utils/request_manager";
import useCommon from "apps/hooks/useCommon";
import {
  TreeItemType,
  useConvert,
  useTreeConvert,
} from "apps/datas/definedData";
import TreeView from "../Tree/TreeView";

const ModalSelectProperty = ({ open, closeModal, handleSelectedLink }) => {
  const { instanceList } = useCommon();
  const { REQ_SUBMODEL_INFO_WITH_CONVERT } = useRequestManager();
  const { CONVERT_MDTLIST_TO_TREELIST, CONVERT_INNER_ELEMENT_TO_TREELIST } =
    useConvert();

  const [link, setLink] = useState("");
  const [treelist, setTreeList] = useState([]);

  const onClickNode = async (node) => {
    if (node.type === TreeItemType.SubModel) {
      let parent = node.parent;
      let data = node.data;

      if (parent && parent.data && data) {
        let endpoint = parent.data.baseEndpoint;
        let id = data.id;

        let result = await REQ_SUBMODEL_INFO_WITH_CONVERT(endpoint, id);

        let nodeItem = CONVERT_INNER_ELEMENT_TO_TREELIST(result, node);

        node.children = nodeItem;

        let newtreelist = updateTreeNodeData(treelist, node.id, node);

        setTreeList(newtreelist);
      }
    } else if (node.type === TreeItemType.Prop) {
    }
  };

  const updateTreeNodeData = (tree, id, newData) => {
    return tree.map((node) => {
      if (node.id === id) {
        return { ...node, newData };
      }
      if (node.children && node.children.length > 0) {
        return {
          ...node,
          children: updateTreeNodeData(node.children, id, newData),
        };
      }
      return node;
    });
  };

  const initData = () => {
    setLink("");
  };

  useEffect(() => {
    if (instanceList) {
      const treelist = CONVERT_MDTLIST_TO_TREELIST(instanceList);

      setTreeList(treelist);
    }
  }, [instanceList]);

  useEffect(() => {
    if (open) {
      initData();
    }
  }, [open]);

  return (
    <Modal show={open} centered animation={false} size={"xl"}>
      <Modal.Header>
        <div className="header-icon">
          <i className="ph-app-window"></i>
        </div>
        <div className="modal-title">참조링크 조회</div>
        <button
          type="button"
          className="btn btn-link ms-auto"
          onClick={closeModal}
        >
          <i className="ph-x"></i>
        </button>
      </Modal.Header>

      <div className="card card-input">
        <table className="table table-border mb-0">
          <colgroup>
            <col style={{ width: "140px" }}></col>
            <col></col>
          </colgroup>
          <tbody>
            <tr>
              <td>선택 링크</td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  name="link"
                  value={link ? link : ""}
                  readOnly
                ></input>
              </td>
            </tr>
            <tr>
              <td>속성 선택</td>
              <td>
                <div className="pnl-tree-wrapper">
                  <TreeView list={treelist} clickNode={onClickNode}></TreeView>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Modal.Footer>
        <button className="btn btn-success" onClick={handleSelectedLink}>
          선택
        </button>
        <button className="btn btn-link" onClick={closeModal}>
          닫기
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalSelectProperty;
