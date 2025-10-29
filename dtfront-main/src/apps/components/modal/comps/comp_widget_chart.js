import MDTTreeView from "apps/components/common/MDTTreeView";
import EmptyList from "apps/components/EmptyList";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import useDialog from "../useDialog";
import UtilManager from "apps/utils/util_manager";
import useRequestManager from "apps/utils/request_manager";
import HoverPopoverButton from "apps/components/common/HoverPopoverButton";
import TreeViewMDTSubmodel from "apps/components/common/TreeViewMDTSubmodel";
import TreeViewMDTParameter from "apps/components/common/TreeViewMDTParameter";

const CompWidgetChart = forwardRef(({ origin }, ref) => {
  const { REQ_Instance_Resolve_Reference_GET } = useRequestManager();

  useImperativeHandle(ref, () => ({
    getData: handleCheckData,
  }));

  const handleCheckData = () => {
    let result = {
      useMinMax: useMinMax,
      min: min,
      max: max,
      yLabel: yLabel,
      linklist: linklist,
    };

    if (useMinMax) {
      if (IS_NULL(result.min)) {
        setError("Min값을 입력해주세요.");
        return null;
      }

      if (IS_NULL(result.max)) {
        setError("Max값을 입력해주세요.");
        return null;
      }
    }

    if (IS_NULL(result.yLabel)) {
      setError("Y축 라벨명을 입력해주세요.");
      return null;
    }

    if (result.linklist?.length === 0) {
      setError("조회링크 정보를 입력해주세요.");
      return null;
    }

    return result;
  };

  const { IS_NULL } = UtilManager();

  const [error, setError] = useState(null);
  const [useMinMax, setUseMinMax] = useState(false);
  const [max, setMax] = useState("5");
  const [min, setMin] = useState("0");
  const [yLabel, setYLabel] = useState("조회값");
  const [name, setName] = useState();
  const [link, setLink] = useState();
  const [linklist, setLinklist] = useState([]);
  const [showTab, setShowTab] = useState("elements");

  const handleChangeLink = (info) => {
    const { name, link } = info;
    setName(name);
    setLink(link);
  };

  const onClickAddSeries = async () => {
    let temp_name = name;
    let temp_link = link;

    if (IS_NULL(temp_name)) {
      setError("조회경로를 입력해주세요.");
      return;
    }

    if (IS_NULL(temp_link)) {
      let resp = await REQ_Instance_Resolve_Reference_GET(temp_name);

      if (IS_NULL(resp)) {
        setError(
          "경로에 대한 링크를 가져오지 못했습니다. 조회경로를 확인해주세요."
        );
        return;
      }

      temp_link = resp;
    }

    let item = linklist.find((data) => data.name === temp_name);

    if (item) {
      setError("동일한 조회경로가 존재합니다. 다른 이름을 사용해주세요.");
      return;
    }

    setError(null);

    setName("");
    setLink("");

    let info = {
      name: temp_name,
      link: temp_link,
    };

    setLinklist((linklist) => [...linklist, info]);
  };

  const onClickRemoveSeries = (item) => {
    setLinklist((linklist) =>
      linklist.filter((data) => data.name !== item.name)
    );
  };

  const convertData = (data) => {
    let info = JSON.parse(data);

    setName(info.name);
    setLink(info.link);
  };

  useEffect(() => {
    if (origin) {
      convertData(origin);
    }
  }, [origin]);

  return (
    <div>
      <div className="row mb-3">
        <div className="col-1 col-form-label">범위사용</div>
        <div className="col-3 flex-ycenter">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="cc_ls_c"
              checked={useMinMax}
              onChange={() => setUseMinMax((prev) => !prev)}
            ></input>
            <label className="form-check-label" for="cc_ls_c">
              사용
            </label>
          </div>
        </div>
        {useMinMax && (
          <>
            <div className="col-1 col-form-label">최소값</div>
            <div className="col-3">
              <input
                type="text"
                className="form-control"
                name="min"
                value={min ? min : ""}
                onChange={(e) => setMin(e.target.value)}
              ></input>
            </div>
            <div className="col-1 col-form-label">최대값</div>
            <div className="col-3">
              <input
                type="text"
                className="form-control"
                name="max"
                value={max ? max : ""}
                onChange={(e) => setMax(e.target.value)}
              ></input>
            </div>
          </>
        )}
      </div>

      <div className="row mb-3">
        <div className="col-1 col-form-label">Y축 라벨명</div>
        <div className="col-3">
          <input
            type="text"
            className="form-control"
            name="yLabel"
            value={yLabel ? yLabel : ""}
            onChange={(e) => setYLabel(e.target.value)}
          ></input>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-1 col-form-label">조회경로</div>
        <div className="col-8">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              name="name"
              value={name ? name : ""}
              onChange={(e) => setName(e.target.value)}
            ></input>
          </div>
        </div>
        <div className="col-2">
          <button
            className="btn btn-default ms-auto"
            onClick={onClickAddSeries}
          >
            <i className="ph-plus me-2"></i>시리즈 추가
          </button>
        </div>
      </div>
      {error && (
        <div className="alert alert-danger my-3" role="alert">
          {error}
        </div>
      )}
      {linklist && linklist.length > 0 ? (
        <div className="pnl-linklist">
          {linklist.map((item, index) => (
            <div className="pnl-linkitem" key={index}>
              <span>{item.name}</span>
              <button
                className="btn btn-link btn-icon ms-auto"
                onClick={() => onClickRemoveSeries(item)}
              >
                <i className="ph-x"></i>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyList
          message={"등록된 리스트가 없습니다."}
          style={{ margin: "16px 0px", minHeight: "100px" }}
        ></EmptyList>
      )}
      <div className="row">
        <div className="col">
          <div className="pnl-widget-tree">
            <ul className="nav nav-tabs nav-tabs-underline">
              <li className="nav-item">
                <div
                  className={`nav-link ${
                    showTab !== "parameters" ? "active" : ""
                  }`}
                  onClick={() => setShowTab("elements")}
                >
                  Elements
                </div>
              </li>
              <li className="nav-item">
                <div
                  className={`nav-link ${
                    showTab === "parameters" ? "active" : ""
                  }`}
                  onClick={() => setShowTab("parameters")}
                >
                  Parameters
                </div>
              </li>
            </ul>
            <div>
              {showTab !== "parameters" ? (
                <MDTTreeView
                  handlePropertyLinkChange={handleChangeLink}
                ></MDTTreeView>
              ) : (
                <TreeViewMDTParameter
                  handleSelectedSubmodel={(node, reference) =>
                    handleChangeLink({
                      name: `${reference}`,
                    })
                  }
                ></TreeViewMDTParameter>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default CompWidgetChart;
