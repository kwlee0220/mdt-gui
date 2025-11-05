import { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import UtilManager from "apps/utils/util_manager";
import CompWidgetValue from "./comps/comp_widget_value";
import CompWidgetTable from "./comps/comp_widget_table";
import CompWidgetChart from "./comps/comp_widget_chart";
import CompWidgetTree from "./comps/comp_widget_tree";
import CompWidgetImage from "./comps/comp_widget_image";
import useCommon from "apps/hooks/useCommon";

const base_data = {
  name: "",
  type: "table",
  size: "1",
  interval: "5",
};

const ModalAddWidget = ({
  widget,
  open,
  closeModal,
  handleAddWidget,
  handleUpdateWidget,
}) => {
  const childRef = useRef();
  const { IS_NULL } = UtilManager();
  const { listWidget } = useCommon();

  const [inputData, setInputData] = useState(base_data);
  const [params, setParams] = useState();
  const [error, setError] = useState(null);

  const [showDetail, setShowDetail] = useState("table");

  const convertData = (data) => {
    let info = JSON.parse(data.widget);

    setShowDetail(info.type);
    setInputData(info);
  };

  const handleAdd = async () => {
    let widgetData = {
      name: inputData.name,
      type: inputData.type,
      size: inputData.size,
      interval: inputData.interval,
      link: "",
      params: "",
      etc: "",
    };

    if (IS_NULL(inputData.name)) {
      setError("위젯명을 입력해주세요.");
      return;
    }
    if (IS_NULL(inputData.type)) {
      setError("위젯 타입을 선택해주세요.");
      return;
    }
    if (IS_NULL(inputData.size)) {
      setError("사이즈를 선택해주세요.");
      return;
    }
    if (IS_NULL(inputData.interval)) {
      setError("조회주기를 입력해주세요.");
      return;
    }

    if (childRef.current) {
      let result = await childRef.current.getData();

      if (!result) {
        return;
      }

      widgetData.params = JSON.stringify(result);
    }

    if (widget) {
      if (handleUpdateWidget) {
        handleUpdateWidget(widgetData);
      }
    } else {
      if (handleAddWidget) {
        let prenum = 0;

        const maxPrenumWidget = listWidget.reduce((max, item) => {
          return item.prenum > (max?.prenum ?? -Infinity) ? item : max;
        }, null);

        if (maxPrenumWidget) {
          prenum = maxPrenumWidget.prenum * 1 + 1;
        }

        widgetData.prenum = prenum;

        handleAddWidget(widgetData);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({
      ...inputData,
      [name]: value,
    });

    if (name === "type") {
      setShowDetail(value);
    }

    setError(null);
  };

  useEffect(() => {
    if (open) {
      if (widget) {
        convertData(widget);
      } else {
        setInputData(base_data);
        setParams(null);
      }
      setError(null);
    }

    return () => {
      setInputData(base_data);
      setParams(null);
      setError(null);
      setShowDetail("table");
    };
  }, [open, widget]);

  return (
    <>
      <Modal show={open} centered animation={false} size={"xl"}>
        <Modal.Header>
          <div className="header-icon">
            <i className="ph-app-window"></i>
          </div>
          <div className="modal-title">위젯 {widget ? "변경" : "추가"}</div>
          <button
            type="button"
            className="btn btn-link ms-auto"
            onClick={closeModal}
          >
            <i className="ph-x"></i>
          </button>
        </Modal.Header>
        <div className="card-body">
          {error && (
            <div className="alert alert-danger m-3" role="alert">
              {error}
            </div>
          )}
          <div className="pnl-base p-3">
            <div className="row mb-3">
              <div className="col">
                <div className="row">
                  <label className="col-3 col-form-label">위젯명</label>
                  <div className="col-9">
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={inputData ? inputData.name : ""}
                      onChange={handleInputChange}
                    ></input>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="row">
                  <label className="col-3 col-form-label">조회주기</label>
                  <div className="col-9">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        name="interval"
                        value={inputData ? inputData.interval : ""}
                        onChange={handleInputChange}
                      ></input>
                      <span className="input-group-text">초</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="row">
                  <label className="col-3 col-form-label">위젯타입</label>
                  <div className="col-9">
                    <select
                      className="form-select"
                      name="type"
                      value={inputData ? inputData.type : "table"}
                      onChange={handleInputChange}
                    >
                      <option value="value">값</option>
                      <option value="table">테이블</option>
                      <option value="chart">차트</option>
                      <option value="tree">트리</option>
                      <option value="image">이미지</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="row">
                  <label className="col-3 col-form-label">패널사이즈</label>
                  <div className="col-9">
                    <select
                      className="form-select"
                      name="size"
                      value={inputData ? inputData.size : "1"}
                      onChange={handleInputChange}
                    >
                      <option value="col-12">전체</option>
                      <option value="col-6">1/2</option>
                      <option value="col-4">1/3</option>
                      <option value="col-3">1/4</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {showDetail && (
            <div className="pnl-detail">
              <h6>위젯 세부정보</h6>
              {showDetail === "table" ? (
                <CompWidgetTable
                  ref={childRef}
                  origin={params}
                ></CompWidgetTable>
              ) : showDetail === "value" ? (
                <CompWidgetValue
                  ref={childRef}
                  origin={params}
                ></CompWidgetValue>
              ) : showDetail === "chart" ? (
                <CompWidgetChart
                  ref={childRef}
                  origin={params}
                ></CompWidgetChart>
              ) : showDetail === "tree" ? (
                <CompWidgetTree ref={childRef} origin={params}></CompWidgetTree>
              ) : showDetail === "image" ? (
                <CompWidgetImage
                  ref={childRef}
                  origin={params}
                ></CompWidgetImage>
              ) : (
                <></>
              )}
            </div>
          )}
        </div>
        <Modal.Footer>
          <button className="btn btn-success" onClick={handleAdd}>
            {widget ? "변경" : "추가"}
          </button>
          <button className="btn btn-link" onClick={closeModal}>
            닫기
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalAddWidget;
