import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { OrgChart } from "d3-org-chart";
import UtilManager from "apps/utils/util_manager";

const HierarchyTree = ({
  origin,
  statusMap,
  handleShowLogview,
  isVS = true,
  handleDeleteVSFlow,
}) => {
  const { IS_NULL } = UtilManager();
  const d3Container = useRef();

  // 상태별 색상 매핑
  const statusColors = {
    NOT_STARTED: "bg-not-started",
    STARTING: "bg-starting",
    RUNNING: "bg-running",
    COMPLETED: "bg-completed",
    FAILED: "bg-failed",
    UNKNOWN: "bg-unknown",
  };

  // 상태별 아이콘 매핑
  const statusIcons = {
    NOT_STARTED: "ph-fast-forward",
    STARTING: "ph-play",
    RUNNING: "ph-spinner spinner",
    COMPLETED: "ph-check",
    FAILED: "ph-x",
    UNKNOWN: "ph-dots-three",
  };

  useEffect(() => {
    if (origin) {
      convertData(origin);
    }
  }, [origin]);

  const [tree, setTree] = useState();

  const buildFlatStructure = (flow, tasks) => {
    let flowlist = [];
    let root = {
      id: flow.name,
      parentId: null,
      name: flow.name,
      status: flow.status,
      origin: flow,
    };

    flowlist.push(root);

    tasks.map((task) => {
      let parentId = task.dependents.length > 0 ? task.dependents[0] : null;

      if (IS_NULL(parentId)) {
        parentId = root.id;
      }

      flowlist.push({
        id: task.taskId, // taskId 그대로 id
        parentId: parentId, // dependents[0] → 부모 taskId
        name: task.taskId, // name은 taskId로 설정
        status: task.status,
        origin: task,
      });
    });

    return flowlist;
  };

  const convertData = (flow) => {
    const tree = buildFlatStructure(flow, flow.tasks || []);

    setTree(tree);

    if (d3Container.current) {
      const chart = new OrgChart()
        .container(d3Container.current)
        .data(tree)
        .nodeWidth((d) => 52)
        .nodeHeight((d) => 52)
        .siblingsMargin((d) => 100)
        .nodeContent((d) => {
          const color = statusColors[d.data.status] || "#60A5FA";
          const icon = statusIcons[d.data.status];
          return `
          <div class="${d.data.id}">
            <div class="argo-workflow-node ${color}">
              <i class="${icon}"></i>
            </div>
            <div class="item-name">${d.data.name}</div>
            </div>
          `;
        })
        .render()
        .expandAll();

      d3.selectAll(".node-button-g").remove();

      // 모든 링크에 화살표 및 색상 적용
      d3.select(d3Container.current)
        .selectAll("path.link")
        .attr("stroke", "#EF4444") // 링크 색상
        .attr("stroke-width", 2);
    }
  };

  const onClickShowLogView = () => {
    if (handleShowLogview) {
      handleShowLogview({
        title: "test",
      });
    }
  };

  const onChangeStatus = (map) => {
    try {
      const list = map.get(origin.name);

      if (list) {
        list.forEach((info) => {
          let id = info.id;
          let color = statusColors[info.status];
          let icon = statusIcons[info.status];

          // id와 일치하는 엘리먼트 찾기
          const nodeElem = document.querySelector(`.${id}`);
          if (nodeElem) {
            // argo-workflow-node 엘리먼트 찾기
            const argoNode = nodeElem.querySelector(".argo-workflow-node");
            if (argoNode) {
              // bg-로 시작하는 클래스 제거
              argoNode.className = argoNode.className
                .split(" ")
                .filter((cls) => !cls.startsWith("bg-"))
                .join(" ");
              // color 클래스 추가
              argoNode.classList.add(color);
            }
            // i 태그 찾기
            const iconElem = nodeElem.querySelector("i");
            if (iconElem) {
              iconElem.className = icon;
            }
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (statusMap && origin) {
      onChangeStatus(statusMap);
    }
  }, [statusMap, origin]);

  return (
    <div className="card card-body bg-black mb-0">
      <div className="flex-ycenter mb-2">
        <span className="fw-semibold">{origin?.name || ""}</span>
        <div className="ms-auto">
          <button
            className="btn btn-outline-secondary border-transparent btn-sm"
            onClick={onClickShowLogView}
          >
            <i className="ph-terminal-window"></i>
          </button>
          {isVS && (
            <button
              className="btn btn-outline-danger border-transparent btn-sm ms-1"
              onClick={() => handleDeleteVSFlow(origin.name)}
            >
              <i className="ph-trash"></i>
            </button>
          )}
        </div>
      </div>
      <div className="flex-center">
        <div
          ref={d3Container}
          style={{ width: "100%", height: "440px", overflow: "hidden" }}
        />
      </div>
    </div>
  );
};

export default HierarchyTree;
