import { TreeItemType } from "apps/datas/definedData";
import UtilManager from "apps/utils/util_manager";
import clsx from "classnames";
import { useEffect, useState } from "react";

const ELE_ValueList = ({ children }) => {
  const { GET_TYPE_BG_CLASS } = UtilManager();

  const [valueList, setValueList] = useState([]);

  const GetPropertyElement = (item, index) => {
    let result = GET_TYPE_BG_CLASS(item.type);

    return (
      <div className="py-1" key={index}>
        <span className={clsx("badge me-2", result.bg)}>{result.label}</span>
        {item.label}
        {item.type !== TreeItemType.SMC && item.type !== TreeItemType.SML ? (
          <>
            <span className="ms-1">=</span>
            {item.data?.value && (
              <span className="ms-1 text-muted">
                {Array.isArray(item.data.value) ? (
                  <pre>{JSON.stringify(item.data.value, null, 2)}</pre>
                ) : (
                  item.data.value
                )}
              </span>
            )}
          </>
        ) : (
          ""
        )}
      </div>
    );
  };

  const convertData = (list) => {
    setValueList(list);
  };

  useEffect(() => {
    if (children) {
      convertData(children);
    }
  }, [children]);

  return children ? (
    <div className="view-item">
      <div className="row">
        <label className="col-form-label col-3">Value</label>
        <div className="col-9">
          {valueList &&
            valueList.map((item, index) => GetPropertyElement(item, index))}
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default ELE_ValueList;
