import MDTTreeView from "apps/components/common/MDTTreeView";
import TreeViewMDTParameter from "apps/components/common/TreeViewMDTParameter";
import TreeViewMDTSubmodel from "apps/components/common/TreeViewMDTSubmodel";
import useRequestManager from "apps/utils/request_manager";
import UtilManager from "apps/utils/util_manager";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

const CompWidgetTable = forwardRef(({ origin }, ref) => {
  const { REQ_Instance_Resolve_Reference_GET } = useRequestManager();

  useImperativeHandle(ref, () => ({
    getData: handleCheckData,
  }));

  const handleCheckData = async () => {
    let result = {
      name: name,
      link: link,
    };

    if (IS_NULL(result.name)) {
      setError("조회경로를 입력해주세요.");
      return null;
    }

    let resp = await REQ_Instance_Resolve_Reference_GET(name);

    if (IS_NULL(resp)) {
      setError(
        "경로에 대한 링크를 가져오지 못했습니다. 조회경로를 확인해주세요."
      );
      return null;
    }

    result.link = resp;

    setError(null);

    return result;
  };

  const { IS_NULL } = UtilManager();

  const [error, setError] = useState(null);
  const [name, setName] = useState();
  const [link, setLink] = useState();
  const [showTab, setShowTab] = useState("elements");

  const handleChangeName = (e) => {
    const { name, value } = e.target;

    setName(value);

    setError(null);
  };

  const handleChangeLink = (info) => {
    const { name, link } = info;
    setName(name);
    setLink(link);
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
        <div className="col-2 col-form-label">조회경로</div>
        <div className="col-10">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              name="name"
              value={name ? name : ""}
              onChange={handleChangeName}
            ></input>
          </div>
        </div>
      </div>
      {error && (
        <div className="alert alert-danger my-3" role="alert">
          {error}
        </div>
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
                  isTable={true}
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

export default CompWidgetTable;
