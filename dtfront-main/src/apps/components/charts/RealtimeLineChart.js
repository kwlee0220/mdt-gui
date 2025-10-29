import EChartsReact from "echarts-for-react";
import moment from "moment";
import { useEffect, useState } from "react";

const RealtimeLineChart = ({ item }) => {
  // 카테고리별 색상 설정
  const barColors = ["#4b5563", "#f97316", "#576eed", "#2196f3", "#ef4444"];
  const listCategory = ["Stopped", "Stopping", "Starting", "Running", "Failed"];
  const initialData = Array(60).fill(0);

  const [chartData, setChartData] = useState({
    times: Array(60).fill(""),
    starting: initialData, // 'starting' 상태 발생 건수
    stopped: initialData, // 'stopped' 상태 발생 건수
    stopping: initialData, // 'stopping' 상태 발생 건수
    running: initialData, // 'running' 상태 발생 건수
    failed: initialData, // 'failed' 상태 발생 건수
  });

  const getOption = () => {
    return {
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
        data: listCategory,
        textStyle: {
          color: "#fff",
        },
      },
      grid: {
        right: "10px",
        bottom: "40px",
      },
      xAxis: {
        type: "category",
        axisPointer: {
          type: "shadow",
        },
        boundaryGap: false,
        data: chartData.times,
      },
      yAxis: {
        type: "value",
        name: "건수",
        axisLabel: {
          formatter: "{value} 건",
        },
      },
      series: [
        {
          name: listCategory[0],
          type: "line",
          data: chartData.stopped,
          lineStyle: { color: barColors[0] },
          showSymbol: false,
          smooth: true,
        },
        {
          name: listCategory[1],
          type: "line",
          data: chartData.stopping,
          lineStyle: { color: barColors[1] },
          showSymbol: false,
          smooth: true,
        },
        {
          name: listCategory[2],
          type: "line",
          data: chartData.starting,
          lineStyle: { color: barColors[2] },
          showSymbol: false,
          smooth: true,
        },
        {
          name: listCategory[3],
          type: "line",
          data: chartData.running,
          lineStyle: { color: barColors[3] },
          showSymbol: false,
          smooth: true,
        },
        {
          name: listCategory[4],
          type: "line",
          data: chartData.failed,
          lineStyle: { color: barColors[4] },
          showSymbol: false,
          smooth: true,
        },
      ],
    };
  };

  const convertData = (item) => {
    const now = moment().format("HH:mm:ss");

    const updatedTimes = [...chartData.times, now];
    const updatedStarting = [...chartData.starting, item.starting];
    const updatedStopped = [...chartData.stopped, item.stopped];
    const updatedStopping = [...chartData.stopping, item.stopping];
    const updatedRunning = [...chartData.running, item.running];
    const updatedFailed = [...chartData.failed, item.failed];

    if (updatedTimes.length > 60) {
      updatedTimes.shift();
      updatedStarting.shift();
      updatedStopped.shift();
      updatedStopping.shift();
      updatedRunning.shift();
      updatedFailed.shift();
    }

    const updateData = {
      times: updatedTimes,
      starting: updatedStarting,
      stopped: updatedStopped,
      stopping: updatedStopping,
      running: updatedRunning,
      failed: updatedFailed,
    };

    setChartData(updateData);
  };

  useEffect(() => {
    if (item) {
      convertData(item);
    }
  }, [item]);

  return (
    <EChartsReact
      option={getOption()}
      style={{ height: "460px", width: "100%" }}
    ></EChartsReact>
  );
};

export default RealtimeLineChart;
