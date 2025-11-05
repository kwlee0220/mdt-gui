import { getSmoothStepPath, MarkerType } from "@xyflow/react";

const CustomSmoothStepEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
}) => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });
  const markerId = `arrowhead-${id}`;

  return (
    <>
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 10 10"
          markerWidth={5} // 선택 시 크기 키우기
          markerHeight={5}
          refX="8" // 화살표 위치 조정
          refY="5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M0,0 L10,5 L0,10 Z"
            fill={selected ? "#ff0072" : "#fff"} // 선택 시 색 변경
          />
        </marker>
      </defs>
      <path
        id={id}
        d={edgePath}
        style={{
          stroke: selected ? "#ff0072" : "#fff", // 선택 시 강조색
          strokeWidth: selected ? 3 : 2, // 선택 시 두껍게
          strokeDasharray: selected ? "6,3" : "0", // 선택 시 dash
        }}
        fill="none"
        markerEnd={`url(#${markerId})`}
      />
    </>
  );
};

export default CustomSmoothStepEdge;
