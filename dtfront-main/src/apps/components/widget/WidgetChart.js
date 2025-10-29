import { useEffect, useRef, useState } from "react";
import clsx from "classnames";
import EChartsReact from "echarts-for-react";
import moment from "moment";
import UtilManager from "apps/utils/util_manager";
import useRequestManager from "apps/utils/request_manager";
import { TaskType } from "apps/datas/definedData";

const WidgetChart = ({ item }) => {
  const intervalRef = useRef(null);

  const { IS_NUMBER, GET_Duration_To_Second, IS_OBJECT } = UtilManager();
  const { REQ_RELATION_CALL } = useRequestManager();

  const [title, setTitle] = useState("");
  const [linklist, setLinklist] = useState([]);
  const [pause, setPause] = useState(false);
  const [yLabel, setYLabel] = useState("조회값");
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(5);
  const [useMinMax, setUseMinMax] = useState(false);

  const [series, setSeries] = useState([]);
  const [error, setError] = useState(false);

  const initData = (data) => {
    const params = JSON.parse(data.params);
    const linklist = params.linklist;
    const useMinMax = params.useMinMax;
    const min = params.min;
    const max = params.max;
    const yLabel = params.yLabel;

    setUseMinMax(useMinMax);
    setLinklist(linklist);
    setMin(min * 1);
    setMax(max * 1);
    setYLabel(yLabel);
    setTitle(data.name);

    let serieslist = linklist.map((item) => {
      let series = {
        name: item.name,
        type: "line",
        data: [],
        showSymbol: false,
      };

      return series;
    });

    setSeries(serieslist);
  };

  //#region 실시간 수집데이터

  const requestData = (list) => {
    const timeLabel = moment().format("mm:ss");
    let checklist = [];

    list.forEach(async (item) => {
      let result = await fetchGetValue(item.name, item.link, timeLabel);

      checklist.push(result);
    });

    if (checklist.includes(false)) {
      setError(true);
    } else {
      setError(false);
    }
  };

  const fetchGetValue = async (name, link, label) => {
    let result = await REQ_RELATION_CALL({
      url: link,
    });

    let data = [label, "-"];

    if (result && result.value) {
      let type = result.modelType;
      let value = result.value;

      if (type === TaskType.Property && !IS_OBJECT(value)) {
        if (!IS_NUMBER(value)) {
          value = GET_Duration_To_Second(value);
        }

        data[1] = value;

        setSeries((series) =>
          series.map((seriesItem) => {
            if (seriesItem.name === name) {
              let newData = [...seriesItem.data, data];
              newData =
                newData.length > 60
                  ? newData.slice(newData.length - 60)
                  : newData;

              return {
                ...seriesItem,
                data: newData,
              };
            }

            return seriesItem;
          })
        );

        return true;
      }
    }

    return false;
  };

  useEffect(() => {
    if (!linklist || linklist.length === 0) return;

    if (pause) {
      clearInterval(intervalRef.current);
    }

    requestData(linklist);

    intervalRef.current = setInterval(() => {
      if (pause) return;

      requestData(linklist);
    }, item.interval * 1000);

    return () => clearInterval(intervalRef.current);
  }, [linklist, pause]);

  //#endregion

  //#region 차트 관련 함수

  const getOption = () => {
    let option = {
      color: ["#2196f3", "#2b9919", "#576eed", "#f59e0b"],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985",
          },
        },
      },
      legend: {
        textStyle: {
          color: "#fff",
        },
      },
      title: {
        text: title,
        textStyle: {
          color: "#fff",
        },
        show: false,
      },
      grid: {
        left: "60px",
        right: "40px",
        bottom: "40px",
      },
      xAxis: {
        type: "category",
        axisPointer: {
          type: "shadow",
        },
        boundaryGap: false,
      },
      yAxis: {
        type: "value",
        name: yLabel,
        min: min * 1,
        max: max * 1,
        axisLabel: {
          formatter: "{value}",
        },
      },
      series: series,
    };

    if (!useMinMax) {
      delete option.yAxis.min;
      delete option.yAxis.max;
    }

    return option;
  };

  //#endregion

  useEffect(() => {
    if (item) {
      initData(item);
    }
  }, [item]);

  return (
    <>
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
      </div>
      <div className="card-body">
        {error ? (
          <div className="text-warning" style={{ fontSize: "30px" }}>
            잘못된 참조
          </div>
        ) : (
          <EChartsReact
            option={getOption()}
            style={{ height: "460px", width: "100%" }}
          ></EChartsReact>
        )}
      </div>
    </>
  );
};

export default WidgetChart;
