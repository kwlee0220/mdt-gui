import { useTreeConvert } from "apps/datas/definedData";
import { useEffect, useState } from "react";
import ELE_TreeNode from "./ELE_TreeNode";

const ELE_Tree = ({ item, onSelected }) => {
  const [treelist, setTreeList] = useState([]);

  const convertData = (data) => {
    setTreeList(data);
  };

  useEffect(() => {
    if (item) {
      convertData(item);
    }
  }, [item]);

  return (
    <div
      className="tree-wrapper"
      style={{ height: "400px", overflowY: "auto" }}
    >
      {treelist.map((node, index) => (
        <ELE_TreeNode
          key={index}
          node={node}
          onSelected={onSelected}
        ></ELE_TreeNode>
      ))}
    </div>
  );
};

export default ELE_Tree;
