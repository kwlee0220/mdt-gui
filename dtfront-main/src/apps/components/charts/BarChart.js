import EChartsReact from "echarts-for-react";
import { useEffect, useState } from "react";

const BarChart = ({ series }) => {
  // X축 라벨
  const xAxisData = ["stopped", "stopping", "starting", "running", "failed"];

  // Y축 데이터 (각 상태의 카운트)
  const yAxisData = [10, 5, 8, 20, 3]; // 예시 데이터

  // 카테고리별 색상 설정
  const barColors = ["#FF5733", "#FFC300", "#DAF7A6", "#4CAF50", "#C70039"];

  // Echarts 옵션
  const getOption = () => {
    return {
      title: {
        text: "Status Counts",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow", // 차트에서 bar를 마우스로 가리킬 때 표시되는 타입
        },
      },
      xAxis: {
        type: "category",
        data: xAxisData,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "Count",
          type: "bar",
          data: yAxisData.map((value, index) => ({
            value,
            itemStyle: {
              color: barColors[index], // 각 막대마다 다른 색상 적용
            },
          })),
          barWidth: "50%", // 막대의 폭
        },
      ],
    };
  };

  return (
    <EChartsReact
      option={getOption()}
      style={{ height: "500px", width: "100%" }}
    ></EChartsReact>
  );
};

export default BarChart;
