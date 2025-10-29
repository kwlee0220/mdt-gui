import { useEffect, useRef, useState } from "react";
import clsx from "classnames";

import ELE_Viewer from "../mdt/ELE_Viewer";
import SubModelTreeView from "../common/SubModelTreeView";
import useCommon from "apps/hooks/useCommon";
import useRequestManager from "apps/utils/request_manager";
import UtilManager from "apps/utils/util_manager";
import WidgetTreeView from "../common/WidgetTreeView";
import { TreeItemType } from "apps/datas/definedData";

const WidgetTree = ({ item }) => {
  const intervalRef = useRef(null);

  const { IS_NULL } = UtilManager();

  const { REQ_Instance_SubModel_Elements_Tree, REQ_RELATION_CALL } =
    useRequestManager();

  const [instanceInfo, setInstanceInfo] = useState();
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [treeData, setTreeData] = useState();
  const [pause, setPause] = useState(false);

  const initData = async (data) => {
    const params = JSON.parse(data.params);
    const name = params.name;
    const link = params.link;
    const treeData = params.treeData;

    setName(name);
    setLink(link);
    setTreeData(treeData);
  };

  const fetchGetValue = async () => {
    if (IS_NULL(link)) {
      let result = await REQ_Instance_SubModel_Elements_Tree(name);

      if (result) {
        if (result.modelType.toLowerCase() === "submodel") {
          result.modelType = TreeItemType.SubModel;
        }

        setInstanceInfo(result);
      }
    } else {
      let result = await REQ_RELATION_CALL({
        url: link,
      });

      if (result) {
        setInstanceInfo(result);
      }
    }
  };

  useEffect(() => {
    if (IS_NULL(name)) return;

    if (pause) {
      clearInterval(intervalRef.current);
    }

    fetchGetValue();

    intervalRef.current = setInterval(() => {
      if (pause) return;

      fetchGetValue();
    }, item.interval * 1000);

    return () => clearInterval(intervalRef.current);
  }, [name, pause]);

  useEffect(() => {
    if (item) {
      initData(item);
    }
  }, [item]);

  return (
    <div className="">
      <WidgetTreeView
        instance={instanceInfo}
        treeData={treeData}
      ></WidgetTreeView>
    </div>
  );
};

export default WidgetTree;
