import { useEffect, useRef, useState } from "react";
import clsx from "classnames";
import EmptyImage from "../EmptyImage";
import moment from "moment";
import UtilManager from "apps/utils/util_manager";
import useRequestManager from "apps/utils/request_manager";
import { TaskType } from "apps/datas/definedData";

const WidgetValue = ({ item }) => {
  const intervalRef = useRef(null);

  const { IS_NULL, IS_OBJECT } = UtilManager();
  const { REQ_RELATION_CALL } = useRequestManager();

  const [link, setLink] = useState("");
  const [data, setData] = useState("-");
  const [time, setTime] = useState();
  const [pause, setPause] = useState(false);
  const [error, setError] = useState(false);

  const initData = (data) => {
    const params = JSON.parse(data.params);
    const link = params.link;
    setLink(link);
  };

  //#region 실시간 수집데이터

  const fetchGetValue = async () => {
    const timeLabel = moment().format("YYYY-MM-DD HH:mm:ss");
    setTime(timeLabel);

    let result = await REQ_RELATION_CALL({
      url: link,
    });

    if (result && result.value) {
      let type = result.modelType;
      let value = result.value;

      if (type === TaskType.Property && !IS_OBJECT(value)) {
        setData(result.value);
        setError(false);
        return;
      }
    }

    setError(true);
  };

  useEffect(() => {
    if (IS_NULL(link)) return;

    if (pause) {
      clearInterval(intervalRef.current);
    }

    fetchGetValue();

    intervalRef.current = setInterval(() => {
      if (pause) return;

      fetchGetValue();
    }, item.interval * 1000);

    return () => clearInterval(intervalRef.current);
  }, [link, pause]);

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
      <div className="title-wrapper">
        {error ? (
          <div className="text-warning" style={{ fontSize: "30px" }}>
            잘못된 참조
          </div>
        ) : (
          <div className="value-title">{data}</div>
        )}
      </div>
      <span className="opacity-75 my-3">{time}</span>
    </div>
  );
};

export default WidgetValue;
