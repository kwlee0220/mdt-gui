import { useEffect, useState } from "react";
import Split from "react-split";
import TreeView from "../Tree/TreeView";
import ELE_View from "../mdt/ELE_View";
import { useConvert } from "apps/datas/definedData";

const SubModelTreeView = ({ instance }) => {
  const { CONVERT_ALLINONE_SUBMODEL_TREEDATA } = useConvert();

  const [subModelList, setSubModelList] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  const onHandleValueChange = () => {
    convertInit(instance);
  };

  const convertInit = async (data) => {
    let resultlist = await CONVERT_ALLINONE_SUBMODEL_TREEDATA(data);

    setSubModelList(resultlist);
  };

  useEffect(() => {
    if (instance) {
      convertInit(instance);
    }
  }, [instance]);

  return (
    <div className="card-widget">
      <Split
        className="split-line"
        sizes={[50, 50]}
        minSize={100}
        gutterSize={4}
        direction="horizontal"
        cursor="col-resize"
      >
        <div className="pnl-tree-wrapper" style={{ margin: "12px" }}>
          <TreeView list={subModelList} clickNode={setSelectedNode}></TreeView>
        </div>
        <ELE_View
          item={selectedNode}
          handleChange={onHandleValueChange}
        ></ELE_View>
      </Split>
    </div>
  );
};

export default SubModelTreeView;
