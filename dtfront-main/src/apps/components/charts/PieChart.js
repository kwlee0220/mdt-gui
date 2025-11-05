import EChartsReact from "echarts-for-react";
import { useEffect, useState } from "react";

const PieChart = ({ item }) => {
  // 카테고리별 색상 설정
  const barColors = ["#4b5563", "#2196f3", "#ef4444"];
  const listCategory = ["Stopped", "Running", "Failed"];

  const [chartData, setChartData] = useState([]);

  const getOption = () => {
    return {
      tooltip: {
        trigger: "item",
      },
      color: barColors,
      series: [
        {
          name: "MDI Instance 현황",
          type: "pie",
          radius: ["60%", "90%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#4d4d51",
            borderWidth: 1,
          },
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: chartData,
        },
      ],
    };
  };

  const convertData = (item) => {
    const item_stop = { name: "Stopped", value: item.stopped };
    const item_running = { name: "Running", value: item.running };
    const item_failed = { name: "Failed", value: item.failed };

    setChartData([item_stop, item_running, item_failed]);
  };

  useEffect(() => {
    if (item) {
      convertData(item);
    }
  }, [item]);

  return (
    <EChartsReact
      option={getOption()}
      style={{ height: "300px", width: "100%" }}
    ></EChartsReact>
  );
};

export default PieChart;
