import useCommon from "apps/hooks/useCommon";
import TreeView from "../Tree/TreeView";
import useRequestManager from "apps/utils/request_manager";
import { TreeItemType, useConvert } from "apps/datas/definedData";
import { useEffect, useState } from "react";
import clsx from "classnames";
import UtilManager from "apps/utils/util_manager";
import EmptyList from "../EmptyList";

const MDTTreeView = ({
  isTable = false,
  isTree = false,
  handlePropertyLinkChange,
}) => {
  const { instanceList } = useCommon();
  const { REQ_SUBMODEL_INFO_WITH_CONVERT } = useRequestManager();
  const { CONVERT_MDTLIST_TO_TREELIST, CONVERT_INNER_ELEMENT_TO_TREELIST } =
    useConvert();
  const { GET_PARSING_GET_LINK, GET_TREEINFO } = UtilManager();

  const [treelist, setTreeList] = useState([]);

  const onClickNode = async (node) => {
    let treeData = {
      endPoint: "",
      subModelID: "",
      idPath: "",
      mdtID: "",
      subModelShortID: "",
    };

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

        if (isTree && handlePropertyLinkChange) {
          treeData = GET_TREEINFO(node);

          handlePropertyLinkChange({
            name: `${node.mdtID}:${node.subModelShortID}`,
            link: "",
            treeData: treeData,
          });
        }
      }
    } else if (node.type === TreeItemType.Prop && !isTree) {
      if (handlePropertyLinkChange) {
        let path = GET_PARSING_GET_LINK(node);

        handlePropertyLinkChange({
          name: `${node.mdtID}:${node.subModelShortID}:${node.idPath}`,
          link: path,
        });
      }
    } else if (node.type === TreeItemType.SMC) {
      if ((isTable || isTree) && handlePropertyLinkChange) {
        treeData = GET_TREEINFO(node);

        handlePropertyLinkChange({
          name: `${node.mdtID}:${node.subModelShortID}:${node.idPath}`,
          link: "",
          treeData: treeData,
        });
      }
    } else if (node.type === TreeItemType.SML) {
      if (isTree && handlePropertyLinkChange) {
        treeData = GET_TREEINFO(node);
        handlePropertyLinkChange({
          name: `${node.mdtID}:${node.subModelShortID}:${node.idPath}`,
          link: "",
          treeData: treeData,
        });
      }
    } else if (
      node.type !== TreeItemType.MDT &&
      node.type !== TreeItemType.SMC &&
      node.type !== TreeItemType.SML &&
      !isTree
    ) {
      if (handlePropertyLinkChange) {
        try {
          let endpoint = node.endPoint;
          let submodelid = node.subModelID;
          let idPath = node.idPath;

          let path = `${endpoint}/submodels/${btoa(
            submodelid
          )}/submodel-elements/${idPath}/attachment`;

          handlePropertyLinkChange({
            name: `${node.mdtID}:${node.subModelShortID}:${node.idPath}`,
            link: path,
          });
        } catch (err) {
          console.log(err);
        }
      }
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

  useEffect(() => {
    if (instanceList) {
      const treelist = CONVERT_MDTLIST_TO_TREELIST(instanceList);

      setTreeList(treelist);
    }
  }, [instanceList]);

  return (
    <div className="pnl-tree-wrapper">
      {treelist && treelist.length > 0 ? (
        <TreeView list={treelist} clickNode={onClickNode}></TreeView>
      ) : (
        <EmptyList message={"실행중인 MDT Instance가 없습니다."}></EmptyList>
      )}
    </div>
  );
};

export default MDTTreeView;
