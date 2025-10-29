import { dataTool } from "echarts";
import { useEffect, useRef, useState } from "react";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import EmptyList from "../EmptyList";
import UtilManager from "apps/utils/util_manager";
import useModal from "../modal/useModal";
import useRequestManager from "apps/utils/request_manager";
import ModalWorkflowInfo from "../modal/modal_workflow";
import { useDispatch } from "react-redux";
import { setWorkflow } from "apps/store/reducers/common";
import ModalCreateWorkflow from "../modal/modal_create_workflow";
import useCommon from "apps/hooks/useCommon";
import clsx from "classnames";
import useDialog from "../modal/useDialog";

const StatusList = [
  "NOT_STARTED",
  "STARTING",
  "RUNNING",
  "COMPLETED",
  "FAILED",
  "UNKNOWN",
];

const WorkflowTable = ({ handleShowFlow }) => {
  const { openDialog } = useDialog();
  const {
    REQ_DELETE_Workflow,
    REQ_STOP_Workflow,
    REQ_SUSPEND_Workflow,
    REQ_RESUME_Workflow,
  } = useRequestManager();

  const { IS_INCLUDE, formatDateTime } = UtilManager();
  const dispatch = useDispatch();

  //#region 데이터 조회

  const { REQ_GET_Workflow_ALL } = useRequestManager();

  const fetchWorkflowALL = async () => {
    let list = await REQ_GET_Workflow_ALL();

    setOriginList(list || []);
  };

  useEffect(() => {
    fetchWorkflowALL();

    const interval = setInterval(fetchWorkflowALL, 3000);

    return () => clearInterval(interval);
  }, []);

  //#endregion

  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchText, setSearchText] = useState("");

  const [startNum, setStartNum] = useState("-");
  const [endNum, setEndNum] = useState("-");
  const [totalNum, setTotalNum] = useState("-");

  const [originList, setOriginList] = useState([]);
  const [datalist, setDatalist] = useState([]);

  const getStatusBG = (status) => {
    let str_bg = "bg-unknown";

    switch (status?.toUpperCase()) {
      case "NOT_STARTED":
        str_bg = "bg-not-started";
        break;
      case "STARTING":
        str_bg = "bg-starting";
        break;
      case "RUNNING":
        str_bg = "bg-running";
        break;
      case "COMPLETED":
        str_bg = "bg-completed";
        break;
      case "FAILED":
        str_bg = "bg-failed";
        break;
    }

    return str_bg;
  };

  const FilterList = () => {
    if (originList) {
      let list = [...originList];

      if (searchText && searchText !== "") {
        list = list.filter((item) => {
          if (
            IS_INCLUDE(item.modelId, searchText) ||
            IS_INCLUDE(item.name, searchText)
          ) {
            return true;
          }
          return false;
        });
      }

      changePageStatus(list);
    }
  };

  const changePageStatus = (list) => {
    const endOffset = (currentPage + 1) * 10;
    const start = currentPage * 10;

    var index_start = 1;
    var index_end = 1;

    index_start = currentPage * 10 + 1;
    index_end = (currentPage + 1) * 10;

    if (index_end > list.length) {
      index_end = list.length;
    }

    setStartNum(index_start);
    setEndNum(index_end);
    setTotalNum(list.length);

    setDatalist(list.slice(start, endOffset));
    setPageCount(Math.ceil(list.length / 10));
  };

  const handlePageClick = (e) => {
    setCurrentPage(e.selected);
  };

  useEffect(() => {
    FilterList();
  }, [originList, currentPage]);

  //#region REQUEST

  const fetchResume = async (item) => {
    await REQ_RESUME_Workflow(item.name);
  };

  const fetchSuspend = async (item) => {
    await REQ_SUSPEND_Workflow(item.name);
  };

  const fetchStop = async (item) => {
    await REQ_STOP_Workflow(item.name);
  };

  const fetchDelete = async (item) => {
    await REQ_DELETE_Workflow(item.name);
  };

  //#endregion

  const onClickConfirm = (item, type) => {
    console.log("******************** onClickConfirm", item, type);

    switch (type) {
      case "resume":
        openDialog({
          title: "Workflow 재개",
          message: "재개하시겠습니까?",
          type: "confirm",
          confirmHandler: () => {
            fetchResume(item);
          },
        });
        break;
      case "pause":
        openDialog({
          title: "Workflow 수행중지",
          message: "동작을 일시중지하시겠습니까?",
          type: "confirm",
          confirmHandler: () => {
            fetchSuspend(item);
          },
        });
        break;
      case "stop":
        openDialog({
          title: "Workflow 종료",
          message: "동작을 종료시겠습니까?",
          type: "confirm",
          confirmHandler: () => {
            fetchStop(item);
          },
        });
        break;
      case "delete":
        openDialog({
          title: "Workflow 삭제",
          message: "삭제하시겠습니까?",
          type: "confirm",
          confirmHandler: () => {
            fetchDelete(item);
          },
        });
        break;
      default:
        break;
    }
  };

  const onClickShowFlow = (item) => {
    handleShowFlow(item);
  };

  return (
    <>
      <div className="flex-ycenter my-2">
        <div className="input-group" style={{ width: "500px" }}>
          <span className="input-group-text bg-transparent text-default">
            검색
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="검색어를 입력해주세요"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          ></input>
          <button
            className="btn btn-light btn-icon bg-transparent text-default"
            type="button"
            onClick={FilterList}
          >
            <i className="ph-magnifying-glass"></i>
          </button>
        </div>

        <button className="btn bg-indigo text-white ms-auto d-none">
          <i className="ph-circle-wavy-check me-2"></i>
          동작상태 점검
        </button>
      </div>
      <div className="table-responsive">
        <table
          style={{ width: "100%" }}
          className="table datatable-basic table-bordered"
        >
          <thead>
            <tr>
              <th>#</th>
              <th>이름</th>
              <th>모델 아이디</th>
              <th>현재상태</th>
              <th>생성일시</th>
              <th>제어</th>
            </tr>
          </thead>
          <tbody>
            {datalist && datalist.length > 0 ? (
              <>
                {datalist.map((item, index) => (
                  <tr key={"item-" + index}>
                    <td className="text-center">
                      <button
                        type="button"
                        className="btn bg-indigo text-white btn-icon"
                        title="상태보기"
                        onClick={() => {
                          onClickShowFlow(item);
                        }}
                      >
                        <i className="ph-git-branch"></i>
                      </button>
                    </td>
                    <td className="text-center">{item.name}</td>
                    <td className="text-center">{item.modelId}</td>
                    <td className="text-center">
                      <span
                        className={`label-status ${getStatusBG(item.status)}`}
                      >
                        {item.status || "UNKNOWN"}
                      </span>
                    </td>
                    <td className="text-center">
                      {formatDateTime(item.creationTime)}
                    </td>
                    <td className="text-center">
                      {item.status === "NOT_STARTED" ||
                      item.status === "COMPLETED" ? (
                        <button
                          type="button"
                          className="btn btn-outline-info border-0 btn-icon me-1"
                          onClick={() => onClickConfirm(item, "resume")}
                          title="재시작"
                        >
                          <i className="ph-skip-forward"></i>
                        </button>
                      ) : item.status === "RUNNING" ||
                        item.status === "STARTING" ? (
                        <>
                          <button
                            type="button"
                            className="btn btn-outline-primary border-0 btn-icon me-1"
                            onClick={() => onClickConfirm(item, "pause")}
                            title="일시정지"
                          >
                            <i className="ph-pause"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-primary border-0 btn-icon me-1"
                            onClick={() => onClickConfirm(item, "stop")}
                            title="동작 멈추기"
                          >
                            <i className="ph-stop"></i>
                          </button>
                        </>
                      ) : null}
                      <button
                        type="button"
                        className="btn btn-outline-danger border-0 btn-icon"
                        onClick={() => onClickConfirm(item, "delete")}
                        title="삭제하기"
                      >
                        <i className="ph-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </>
            ) : (
              <tr>
                <td colSpan={8} className="p-0">
                  <EmptyList message={"조회된 데이터가 없습니다."}></EmptyList>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-between mt-3">
        <div>
          Showing<span style={{ margin: "0px 2px" }}>{startNum}</span>to
          <span style={{ margin: "0px 2px" }}>{endNum}</span>of
          <span style={{ margin: "0px 2px" }}>{totalNum}</span>entries
        </div>
        <ReactPaginate
          breakLabel="..."
          nextLabel="next"
          forcePage={currentPage}
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="prev"
          renderOnZeroPageCount={null}
          className="pagination pagination-flat align-self-center ms-auto"
          pageClassName="page-item"
          activeClassName="active"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          nextClassName="page-item"
          previousLinkClassName="page-link"
          nextLinkClassName="page-link"
        ></ReactPaginate>
      </div>
    </>
  );
};

export default WorkflowTable;
