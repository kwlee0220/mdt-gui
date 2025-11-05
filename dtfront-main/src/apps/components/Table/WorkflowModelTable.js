import { dataTool } from "echarts";
import { useEffect, useRef, useState } from "react";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import EmptyList from "../EmptyList";
import modal_icon from "assets/images/logo/header_icon.png";
import UtilManager from "apps/utils/util_manager";
import useModal from "../modal/useModal";
import useRequestManager from "apps/utils/request_manager";
import ModalWorkflowInfo from "../modal/modal_workflow";
import { useDispatch } from "react-redux";
import { setWorkflow } from "apps/store/reducers/common";
import ModalCreateWorkflow from "../modal/modal_create_workflow";
import useDialog from "../modal/useDialog";
import useCommon from "apps/hooks/useCommon";

const WorkflowModelTable = ({ handleShowEditor }) => {
  const { openDialog } = useDialog();

  const { IS_INCLUDE } = UtilManager();
  const dispatch = useDispatch();

  const modalWorkflowInfo = useModal();
  const modalCreateWorkflow = useModal();
  const [selectedWorkflow, setSelectedWorkflow] = useState();

  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchText, setSearchText] = useState("");

  const [startNum, setStartNum] = useState("-");
  const [endNum, setEndNum] = useState("-");
  const [totalNum, setTotalNum] = useState("-");

  const [originList, setOriginList] = useState([]);
  const [datalist, setDatalist] = useState([]);

  //#region 데이터 조회

  const {
    REQ_GET_Workflow_Model_ALL,
    REQ_DELETE_Workflow_Model,
    REQ_START_Workflow,
  } = useRequestManager();

  const fetchWorkflowALL = async () => {
    let list = await REQ_GET_Workflow_Model_ALL();

    setOriginList(list || []);
  };

  useEffect(() => {
    fetchWorkflowALL();

    const interval = setInterval(fetchWorkflowALL, 3000);

    return () => clearInterval(interval);
  }, []);

  //#endregion

  const FilterList = () => {
    let list = [...originList];

    if (searchText && searchText !== "") {
      list = list.filter((item) => {
        if (
          IS_INCLUDE(item.id, searchText) ||
          IS_INCLUDE(item.name, searchText) ||
          IS_INCLUDE(item.description, searchText)
        ) {
          return true;
        }
        return false;
      });
    }

    changePageStatus(list);
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

  const setCurrentWorkflow = (workflow) => {
    dispatch(setWorkflow(workflow));
  };

  const onClickCreateWorkflow = (data) => {
    setCurrentWorkflow(data);

    modalCreateWorkflow.toggleModal();
  };

  const onClickConfirm = (item, type) => {
    console.log("******************** onClickConfirm", item, type);

    switch (type) {
      case "start":
        openDialog({
          title: "Workflow 실행",
          message: "Workflow를 실행하시겠습니까?",
          type: "confirm",
          confirmHandler: () => {
            REQ_START_Workflow(item.id);
          },
        });
        break;
      case "delete":
        openDialog({
          title: "Workflow 모델 삭제",
          message: "Workflow 모델을 삭제하시겠습니까?",
          type: "confirm",
          confirmHandler: () => {
            REQ_DELETE_Workflow_Model(item.id);
          },
        });
        break;
      default:
        break;
    }
  };

  return (
    <div>
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

        <button
          className="btn btn-default ms-auto"
          onClick={() => handleShowEditor(null)}
        >
          <i className="ph-file-plus me-2"></i>
          MDT 워크플로우 작성
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
              <th>아이디</th>
              <th>이름</th>
              <th>설명</th>
              <th>관리</th>
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
                        className="btn btn-outline-info border-0 btn-icon"
                        onClick={() => onClickConfirm(item, "start")}
                        title="실행하기"
                      >
                        <i className="ph-play"></i>
                      </button>
                    </td>
                    <td className="text-center">{item.id}</td>
                    <td className="text-center fixed">{item.name}</td>
                    <td className="fixed">{item.description}</td>
                    <td>
                      <div className="text-center">
                        <button
                          type="button"
                          className="btn btn-outline-success border-0 btn-icon me-1"
                          title="정보보기"
                          onClick={() => {
                            setSelectedWorkflow(item);
                            modalWorkflowInfo.toggleModal();
                          }}
                        >
                          <i className="ph-magnifying-glass"></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-primary border-0 btn-icon me-1"
                          title="편집하기"
                          onClick={() => handleShowEditor(item)}
                        >
                          <i className="ph-tree-structure"></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger border-0 btn-icon"
                          onClick={() => onClickConfirm(item, "delete")}
                          title="삭제하기"
                        >
                          <i className="ph-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </>
            ) : (
              <tr>
                <td colSpan={7} className="p-0">
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

      <ModalWorkflowInfo
        open={modalWorkflowInfo.open}
        closeModal={modalWorkflowInfo.toggleModal}
        data={selectedWorkflow}
      ></ModalWorkflowInfo>

      <ModalCreateWorkflow
        open={modalCreateWorkflow.open}
        closeModal={modalCreateWorkflow.toggleModal}
        handleCreate={onClickCreateWorkflow}
      ></ModalCreateWorkflow>
    </div>
  );
};

export default WorkflowModelTable;
