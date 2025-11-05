import useCommon from "apps/hooks/useCommon";
import TreeView from "../Tree/TreeView";
import { TreeItemType, useConvert } from "apps/datas/definedData";
import { useEffect, useState } from "react";
import EmptyList from "../EmptyList";

const TreeViewMDTSubmodel = ({ handleSelectedSubmodel }) => {
  const { instanceList } = useCommon();
  const { CONVERT_OPERATION_TO_TREELIST } = useConvert();

  const [treelist, setTreeList] = useState([]);

  const onClickNode = async (node) => {
    if (node.type === TreeItemType.Operations) {
      let mdtID = node.mdtID;
      let operationID = node.operationID;

      if (handleSelectedSubmodel) {
        handleSelectedSubmodel(`${mdtID}:${operationID}`);
      }
    }
  };

  useEffect(() => {
    if (instanceList) {
      const treelist = CONVERT_OPERATION_TO_TREELIST(instanceList);

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

export default TreeViewMDTSubmodel;
