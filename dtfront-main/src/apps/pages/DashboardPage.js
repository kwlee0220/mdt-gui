import PanelCount from "apps/components/PanelCount";
import MenuTitle from "../components/MenuTitle";
import React, { useEffect, useRef, useState } from "react";
import PanelTotal from "apps/components/PanelTotal";
import MDITable from "apps/components/Table/MDITable";
import useRequestManager from "apps/utils/request_manager";
import BarChart from "apps/components/charts/BarChart";
import modal_icon from "assets/images/logo/header_icon.png";
import PieChart from "apps/components/charts/PieChart";
import RealtimeLineChart from "apps/components/charts/RealtimeLineChart";
import { RunStatus } from "apps/datas/definedData";
import EmptyList from "apps/components/EmptyList";
import ModalAddWidget from "apps/components/modal/modal_add_widget";
import useModal from "apps/components/modal/useModal";
import useCommon from "apps/hooks/useCommon";
import WidgetWrapper from "apps/components/widget/WidgetWrapper";
import InstanceUpdater from "apps/components/InstanceUpdater";
import UtilManager from "apps/utils/util_manager";
import useDataManager from "apps/utils/data_manager";
import WidgetPanel from "apps/components/widget/WidgetPanel";
import useDialog from "apps/components/modal/useDialog";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "apps/store/reducers/auth";
import { setExpandRealTimePanel } from "apps/store/reducers/common";

const DashboardPage = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const intervalRef = useRef(null);
  const { listWidget, current_UserID, expandRealTimePanel, instanceList } =
    useCommon();
  const { REQ_Widget_Add, REQ_Widget_List } = useRequestManager();
  const { GET_INSTANCE_LIST_FOR_TIMER } = useDataManager();

  const modalAddWidget = useModal();
  const { openDialog } = useDialog();

  const [stopped, setStopped] = useState({ count: "30", total: "100" });
  const [stopping, setStopping] = useState({ count: "30", total: "100" });
  const [starting, setStarting] = useState({ count: "30", total: "100" });
  const [running, setRunning] = useState({ count: "40", total: "100" });
  const [failed, setFailed] = useState({ count: "20", total: "100" });

  const [pieItem, setPieItem] = useState();
  const [realtimeItem, setRealtimeItem] = useState();

  const changeInstaceList = (list) => {
    const convertList = CalcInstanceList(list);
    ConvertList(convertList);
  };

  const CalcInstanceList = (list) => {
    let convertList = [];
    let item_stopped = {
      label: "Stopped",
      value: 0,
    };
    let item_stopping = {
      label: "Stopping",
      value: 0,
    };
    let item_starting = {
      label: "Starting",
      value: 0,
    };
    let item_running = {
      label: "Running",
      value: 0,
    };
    let item_failed = {
      label: "Failed",
      value: 0,
    };

    list.map((item) => {
      switch (item.status) {
        case "STOPPED":
          item_stopped.value++;
          break;
        case "STOPPING":
          item_stopping.value++;
          break;
        case "STARTING":
          item_starting.value++;
          break;
        case "RUNNING":
          item_running.value++;
          break;
        case "FAILED":
          item_failed.value++;
          break;
        default:
          break;
      }
    });

    convertList.push(item_stopped);
    convertList.push(item_stopping);
    convertList.push(item_starting);
    convertList.push(item_running);
    convertList.push(item_failed);

    return convertList;
  };

  const ConvertList = (list) => {
    let item_pie = {
      stopped: 0,
      running: 0,
      failed: 0,
    };
    let item_realtime = {
      stopped: 0,
      stopping: 0,
      starting: 0,
      running: 0,
      failed: 0,
    };

    list.map((item) => {
      switch (item.label) {
        case "Stopped":
          item_pie.stopped = item.value;
          item_realtime.stopped = item.value;
          break;
        case "Stopping":
          item_realtime.stopping = item.value;
          break;
        case "Starting":
          item_realtime.starting = item.value;
          break;
        case "Running":
          item_pie.running = item.value;
          item_realtime.running = item.value;
          break;
        case "Failed":
          item_pie.failed = item.value;
          item_realtime.failed = item.value;
          break;
        default:
          break;
      }
    });

    const count_stopped = { ...stopped };
    const count_stopping = { ...stopping };
    const count_starting = { ...starting };
    const count_running = { ...running };
    const count_failed = { ...failed };

    let total =
      item_realtime.stopped +
      item_realtime.stopping +
      item_realtime.starting +
      item_realtime.running +
      item_realtime.failed;

    count_stopped.count = item_realtime.stopped;
    count_stopped.total = total;

    count_stopping.count = item_realtime.stopping;
    count_stopping.total = total;

    count_starting.count = item_realtime.starting;
    count_starting.total = total;

    count_running.count = item_realtime.running;
    count_running.total = total;

    count_failed.count = item_realtime.failed;
    count_failed.total = total;

    setStopped(count_stopped);
    setStopping(count_stopping);
    setStarting(count_starting);
    setRunning(count_running);
    setFailed(count_failed);

    setPieItem(item_pie);
    setRealtimeItem(item_realtime);
  };

  const onClickShowAddWidget = () => {
    if (!current_UserID || current_UserID === "") {
      openDialog({
        title: "세션 만료",
        message: "세션이 만료되어 로그인 페이지로 이동합니다.",
        type: "alert",
        denyConfirm: () => {
          dispatch(logout());
          navigate("/login");
        },
      });
      return;
    }

    modalAddWidget.toggleModal();
  };

  const handleAddWidget = (info) => {
    let addInfo = {
      prenum: info.prenum,
      userid: current_UserID,
      name: info.name,
      type: info.type,
      size: info.size,
      link: info.link,
      interval: info.interval,
      params: info.params,
      etc: info.etc,
      widget: JSON.stringify(info),
    };

    REQ_Widget_Add(addInfo);

    modalAddWidget.toggleModal();
  };

  useEffect(() => {}, [listWidget]);

  const [timerCheck, setTimerCheck] = useState(0);

  useEffect(() => {
    if (timerCheck) {
      changeInstaceList(instanceList);
    }
  }, [timerCheck]);

  useEffect(() => {
    if (current_UserID) {
      try {
        REQ_Widget_List(current_UserID);
      } catch (error) {
        console.error("Error fetching widget list:", error);
      }
    }
  }, [current_UserID]);

  useEffect(() => {
    setTimerCheck((prev) => prev + 1);

    intervalRef.current = setInterval(() => {
      setTimerCheck((prev) => prev + 1);
    }, 3 * 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  const toggleShowRealtime = () => {
    dispatch(setExpandRealTimePanel(!expandRealTimePanel));
  };

  return (
    <div className="main-content">
      <div className="pnl_main">
        <div className="pnl_dashboard">
          <div className="inner-title">
            <h4 className="mb-0">
              <img src={modal_icon} className="me-2" height={16}></img>
              Dashboard
            </h4>
          </div>
          <div className="pnl-space"></div>

          <div className="panel-contents pt-0">
            <div className="row">
              <div className="col">
                <PanelCount
                  type={RunStatus.STOPPED}
                  data={stopped}
                ></PanelCount>
              </div>
              <div className="col">
                <PanelCount
                  type={RunStatus.STOPPING}
                  data={stopping}
                ></PanelCount>
              </div>
              <div className="col">
                <PanelCount
                  type={RunStatus.STARTING}
                  data={starting}
                ></PanelCount>
              </div>
              <div className="col">
                <PanelCount
                  type={RunStatus.RUNNING}
                  data={running}
                ></PanelCount>
              </div>
              <div className="col">
                <PanelCount type={RunStatus.FAILED} data={failed}></PanelCount>
              </div>
            </div>
          </div>
          <div className="panel-contents">
            <div className="row">
              <div className="col-12">
                <div className="inner-title">
                  <h4 className="mb-0">
                    <img src={modal_icon} className="me-2" height={16}></img>
                    실시간 현황
                  </h4>
                  <button
                    className="btn btn-default btn-icon ms-auto"
                    onClick={toggleShowRealtime}
                  >
                    <i
                      className={`ph-caret-${
                        expandRealTimePanel ? "up" : "down"
                      }`}
                    ></i>
                  </button>
                </div>
              </div>
            </div>
            <div className={`row ${expandRealTimePanel ? "" : "d-none"}`}>
              <div className="col-4">
                <div className="card card-body card-dark text-white mb-0">
                  <h4>동작 현황</h4>
                  <PieChart item={pieItem}></PieChart>
                  <div className="pnl-detail">
                    <div className="flex-ycenter mb-3">
                      <div className="">
                        <span className="d-inline-block bg-running rounded-pill p-1 me-2"></span>
                        <span className="">Running</span>
                      </div>
                      <div className="ms-auto">
                        <span>{running.count}</span>
                        <span className="">건</span>
                      </div>
                    </div>
                    <div className="flex-ycenter mb-3">
                      <div className="">
                        <span className="d-inline-block bg-stopped rounded-pill p-1 me-2"></span>
                        <span className="">Stopped</span>
                      </div>
                      <div className="ms-auto">
                        <span>{stopped.count}</span>
                        <span className="">건</span>
                      </div>
                    </div>
                    <div className="flex-ycenter mb-3">
                      <div className="">
                        <span className="d-inline-block bg-failed rounded-pill p-1 me-2"></span>
                        <span className="">Failed</span>
                      </div>
                      <div className="ms-auto">
                        <span>{failed.count}</span>
                        <span className="">건</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-8">
                <div className="card card-body card-dark text-white mb-0">
                  <h4>실시간 상태</h4>
                  <RealtimeLineChart item={realtimeItem}></RealtimeLineChart>
                </div>
              </div>
            </div>
          </div>

          <div className="panel-contents">
            <div className="inner-title">
              <h4 className="mb-0">
                <img src={modal_icon} className="me-2" height={16}></img>위젯
                패널
              </h4>
              <button
                className="btn btn-default ms-auto"
                onClick={onClickShowAddWidget}
              >
                <i className="ph-plus me-2"></i>위젯 추가
              </button>
            </div>

            {listWidget && listWidget.length > 0 ? (
              <WidgetPanel list={listWidget}></WidgetPanel>
            ) : (
              <div className="pnl-empty">
                <EmptyList message={"등록된 위젯이 없습니다."}></EmptyList>
              </div>
            )}
          </div>
        </div>
      </div>

      <ModalAddWidget
        open={modalAddWidget.open}
        closeModal={modalAddWidget.toggleModal}
        handleAddWidget={handleAddWidget}
      ></ModalAddWidget>
    </div>
  );
};

export default DashboardPage;
