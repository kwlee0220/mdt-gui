import { useEffect, useState } from "react";
import TreeView from "../Tree/TreeView";
import { useConvert } from "apps/datas/definedData";

const WidgetTreeView = ({ instance, treeData }) => {
  const { CONVERT_WIDGET_TREEDATA } = useConvert();

  const [subModelList, setSubModelList] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  const convertInit = async (data, treeData) => {
    let resultlist = await CONVERT_WIDGET_TREEDATA(data, treeData);

    setSubModelList(resultlist);
  };

  useEffect(() => {
    if (instance && treeData) {
      convertInit(instance, treeData);
    }
  }, [instance, treeData]);

  return (
    <div className="card-widget">
      <div
        className="pnl-tree-wrapper pnl-widget-tree"
        style={{ margin: "12px", minHeight: "300px", maxHeight: "500px" }}
      >
        <TreeView list={subModelList} clickNode={setSelectedNode}></TreeView>
      </div>
    </div>
  );
};

export default WidgetTreeView;
