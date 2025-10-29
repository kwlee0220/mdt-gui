import { useEffect, useRef, useState } from "react";
import clsx from "classnames";
import useModal from "../modal/useModal";
import useDialog from "../modal/useDialog";
import useRequestManager from "apps/utils/request_manager";
import UtilManager from "apps/utils/util_manager";
import { TreeItemType } from "apps/datas/definedData";

const WidgetTable = ({ item }) => {
  const intervalRef = useRef(null);

  const { IS_NULL } = UtilManager();
  const { REQ_Instance_Read_SubModel_Elements_GET } = useRequestManager();

  const [name, setName] = useState("");
  const [listHeader, setListHeader] = useState([]);
  const [listItem, setListItem] = useState([]);
  const [pause, setPause] = useState(false);

  const initData = (data) => {
    const params = JSON.parse(data.params);
    const name = params.name;
    setName(name);

    setListHeader([]);
    setListItem([]);
  };

  //#region 실시간 수집데이터

  const fetchGetValue = async () => {
    let result = await REQ_Instance_Read_SubModel_Elements_GET(name);

    if (result) {
      const entries = Object.entries(result);
      let arrWithKey = entries.map(([key, value]) => ({
        idx: Number(key),
        ...value,
      }));

      if (arrWithKey.length > 0) {
        arrWithKey.sort((a, b) => a.idx - b.idx);
        let item = arrWithKey[0];
        let list = arrWithKey.map((obj) => Object.values(obj));

        setListHeader(Object.keys(item));
        setListItem(list);
      } else {
        setListItem([]);
      }

      console.log("fetchGetValue", arrWithKey);
    }
  };

  /*
  const fetchGetValue = async () => {
    let result = await REQ_Instance_Read_SubModel_Elements_GET(name);

    if (result && result.modelType === TreeItemType.SMC) {
      let list = result.value;

      if (Array.isArray(list)) {
        let lst_header = [];
        let lst_value = [];

        list.map((item) => {
          if (item.modelType === TreeItemType.Prop) {
            let id = item.idShort;
            let val = item.value;

            lst_header.push(id);
            lst_value.push(val);
          }
        });

        setListHeader(lst_header);
        setListItem(lst_value);
      }
    }
  };
  */

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

  //#endregion

  useEffect(() => {
    if (item) {
      initData(item);
    }
  }, [item]);

  return (
    <div className="value-wrapper">
      <div className="btn-wrapper">
        <button
          type="button"
          className="btn btn-primary btn-icon rounded-pill"
          onClick={() => setPause(!pause)}
        >
          {pause ? <i className="ph-play"></i> : <i className="ph-pause"></i>}
        </button>
      </div>
      <div className="table-responsive" style={{ maxHeight: "400px" }}>
        <table className="table mb-0">
          <thead>
            <tr>
              {listHeader.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {listItem.map((item, index) => (
              <tr key={index}>
                {item.map((txt, idx) => (
                  <td key={idx}>{txt}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WidgetTable;
