import Split from "react-split";
import ELE_Tree from "./ELE_Tree";
import ELE_View from "./ELE_View";
import { useEffect, useState } from "react";
import { useTreeConvert } from "apps/datas/definedData";

const ELE_Viewer = ({ item }) => {
  const { TreeMakeDirectory } = useTreeConvert();

  const [originData, setOriginData] = useState();
  const [selectedNode, setSelectedNode] = useState(null);
  const [treelist, setTreeList] = useState([]);

  const convertData = (data) => {
    let list = TreeMakeDirectory(data);

    setTreeList(list);

    setOriginData(data);
  };

  useEffect(() => {
    if (item) {
      convertData(item);
    }
  }, [item]);

  return (
    <div className="my-2">
      <Split
        className="split-line"
        sizes={[50, 50]}
        minSize={100}
        gutterSize={4}
        direction="horizontal"
        cursor="col-resize"
      >
        <ELE_Tree item={treelist} onSelected={setSelectedNode}></ELE_Tree>
        <ELE_View item={selectedNode}></ELE_View>
      </Split>
    </div>
  );
};

export default ELE_Viewer;
