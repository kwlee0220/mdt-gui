import PageInstance from "apps/components/Instance/pages/PageInstance";
import PageInstanceInfo from "apps/components/Instance/pages/PageInstanceInfo";
import PageSubModel from "apps/components/Instance/pages/PageSubModel";
import { useEffect, useState } from "react";
import MenuTitle from "../components/MenuTitle";

const MDTInstancePage = () => {
  //#region 페이지 변경 관련

  const [selectedTable, setSelectedTable] = useState(true);
  const [selectedInstance, setSelectedInstance] = useState();
  const [selectedModel, setSelectedModel] = useState();

  const changeInstance = (instance) => {
    if (instance) {
      setSelectedTable(false);
      setSelectedInstance(instance);
    } else {
      setSelectedTable(true);
      setSelectedInstance(null);
    }
  };

  const changeSubModel = (subModel) => {
    if (subModel) {
      setSelectedTable(false);
      setSelectedModel(subModel);
    } else {
      setSelectedTable(true);
      setSelectedModel(null);
    }
  };

  useEffect(() => {}, [selectedInstance, selectedModel, selectedTable]);

  //#endregion

  return (
    <div className="main-content">
      <div className="pnl-main">
        <div className="pnl-instance">
          {selectedTable ? (
            <PageInstance
              setSelect={changeInstance}
              setSelectSubModel={changeSubModel}
            ></PageInstance>
          ) : (
            <>
              {selectedInstance && (
                <PageInstanceInfo
                  instance={selectedInstance}
                  closeInfo={() => changeInstance(null)}
                ></PageInstanceInfo>
              )}
              {selectedModel && (
                <PageSubModel
                  model={selectedModel}
                  closeInfo={() => changeSubModel(null)}
                ></PageSubModel>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MDTInstancePage;
