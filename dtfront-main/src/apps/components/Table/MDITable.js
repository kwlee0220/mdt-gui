import { useEffect, useRef, useState } from "react";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import EmptyList from "../EmptyList";
import useDialog from "../modal/useDialog";
import { RunStatus } from "apps/datas/definedData";
import useModal from "../modal/useModal";
import ModalMDTInstance from "../modal/modal_mdtInstance";
import ModalLogView from "../modal/modal_logview";
import modal_icon from "assets/images/logo/header_icon.png";
import useRequestManager from "apps/utils/request_manager";
import UtilManager from "apps/utils/util_manager";
import clsx from "classnames";
import ModalSubModelList from "../modal/modal_submodel_list";
import { useDispatch } from "react-redux";

const MDITable = ({ list, setSelect, setSelectSubModel }) => {
  const { openDialog } = useDialog();
  const { IS_INCLUDE, GET_COMPACT, IS_NULL } = UtilManager();

  const modalLogView = useModal();
  const modalErrorLogView = useModal();
  const modalSubModelTable = useModal();
  const modalMDTAdd = useModal();

  const [selectedInstance, setSelectedInstance] = useState();

  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [searchType, setSearchType] = useState("all");

  const [startNum, setStartNum] = useState("-");
  const [endNum, setEndNum] = useState("-");
  const [totalNum, setTotalNum] = useState("-");

  const [originList, setOriginList] = useState([]);
  const [datalist, setDatalist] = useState([]);

  const [sortCategory, setSortCategory] = useState("");
  const [sortType, setSortType] = useState("asc");

  const getSortIcon = (type) => {
    let icon = "ph-arrows-down-up";

    if (type === sortCategory) {
      if (sortType === "asc") {
        icon = "ph-caret-down";
      } else {
        icon = "ph-caret-up";
      }
    }

    return icon;
  };

  const handleSort = (type) => {
    if (sortCategory === type) {
      if (sortType === "asc") {
        setSortType("desc");
      } else {
        setSortType("asc");
      }
    } else {
      setSortCategory(type);
      setSortType("asc");
    }
  };

  const getStatusBG = (status) => {
    let bg = "";

    switch (status) {
      case "STOPPED":
        bg = "bg-stopped";
        break;
      case "STOPPING":
        bg = "bg-stopping";
        break;
      case "STARTING":
        bg = "bg-starting";
        break;
      case "RUNNING":
        bg = "bg-running";
        break;
      case "FAILED":
        bg = "bg-failed";
        break;
      default:
        break;
    }

    return bg;
  };

  useEffect(() => {
    if (!IS_NULL(sortCategory)) {
      FilterList();
    }
  }, [sortType, sortCategory]);

  const getSubModelText = (submodels) => {
    let result = "";

    result = GET_COMPACT(submodels);

    return result;
  };

  const activeEnter = (e) => {
    if (e.key === "Enter") {
      FilterList();
    }
  };

  const FilterList = () => {
    let list = [...originList];

    if (searchText && searchText !== "") {
      if (searchType === "all") {
        list = list.filter((item) => {
          if (
            IS_INCLUDE(item.id, searchText) ||
            IS_INCLUDE(item.aasId, searchText) ||
            IS_INCLUDE(item.baseEndpoint, searchText) ||
            IS_INCLUDE(item.assetType, searchText) ||
            IS_INCLUDE(item.status, searchText)
          ) {
            return true;
          }

          return false;
        });
      } else {
        list = list.filter((item) => {
          if (IS_INCLUDE(item[searchType], searchText)) {
            return true;
          }

          return false;
        });
      }
    }

    if (!IS_NULL(sortCategory)) {
      list = [...list].sort((a, b) => {
        if (sortType === "asc") {
          return a[sortCategory] < b[sortCategory] ? -1 : 1;
        } else {
          return a[sortCategory] > b[sortCategory] ? -1 : 1;
        }
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

  const onClickSubModel = (item, model) => {
    setSelectSubModel({
      instance: item,
      endPoint: item.baseEndpoint,
      model: model,
    });

    modalSubModelTable.toggleModal();
  };

  //#region REQUEST
  const fetchStart = (item) => {
    REQ_Instance_START(item.id);
  };

  const fetchStop = (item) => {
    REQ_Instance_STOP(item.id);
  };

  const fetchDelete = (item) => {
    REQ_Instance_DELETE(item.id);
  };

  const fetchAdd = async (formData) => {
    try {
      const result = await REQ_Instance_ADD(formData);
      if (result) {
        openDialog({
          title: "MDT Instance 추가",
          message: "Instance가 성공적으로 추가되었습니다.",
          type: "alert",
        });
        modalMDTAdd.toggleModal();
        // 목록 새로고침
      } else {
        openDialog({
          title: "MDT Instance 추가 실패",
          message: "Instance 추가에 실패했습니다.",
          type: "alert",
        });
      }
    } catch (error) {
      console.error("MDT Instance 추가 오류:", error);
      openDialog({
        title: "MDT Instance 추가 실패",
        message: `오류: ${error.message}`,
        type: "alert",
      });
    }
  };

  //#endregion

  const {
    REQ_Instance_START,
    REQ_Instance_STOP,
    REQ_Instance_DELETE,
    REQ_Instance_ADD,
  } = useRequestManager();

  const onClickConfirm = (item, type) => {
    console.log("******************** onClickConfirm", item, type);

    switch (type) {
      case "start":
        openDialog({
          title: "MDT Instance 시작",
          message: "시작하시겠습니까?",
          type: "confirm",
          confirmHandler: () => {
            fetchStart(item);
          },
        });
        break;
      case "stop":
        openDialog({
          title: "MDT Instance 종료",
          message: "동작을 멈추시겠습니까?",
          type: "confirm",
          confirmHandler: () => {
            fetchStop(item);
          },
        });
        break;
      case "delete":
        openDialog({
          title: "MDT Instance 삭제",
          message: "Instance를 삭제하시겠습니까?",
          type: "confirm",
          confirmHandler: () => {
            fetchDelete(item);
          },
        });
        break;
      case "add":
        fetchAdd(item);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (list) {
      setOriginList(list);
    }
  }, [list]);

  useEffect(() => {
    FilterList();
  }, [originList, currentPage]);

  return (
    <div>
      <div className="inner-title">
        <h4 className="mb-0">
          <img src={modal_icon} className="me-2" height={16}></img>MDT Instance
          목록
        </h4>
      </div>
      <div className="flex-ycenter my-2">
        <div className="input-group" style={{ width: "500px" }}>
          <select
            className="form-select w-auto flex-grow-0"
            value={searchType ? searchType : "all"}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="all">전체</option>
            <option value="id">MDT 식별자</option>
            <option value="aasId">ASS 식별자</option>
            <option value="baseEndpoint">Global 에셋 식별자</option>
            <option value="assetType">에셋 타입</option>
            <option value="status">MDT 상태</option>
          </select>
          <input
            type="text"
            className="form-control"
            placeholder="검색어를 입력해주세요"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => activeEnter(e)}
          ></input>
          <button
            className="btn btn-light bg-transparent text-default"
            type="button"
            onClick={FilterList}
          >
            <i className="ph-magnifying-glass me-2"></i>검색
          </button>
        </div>

        <button
          className="btn btn-default ms-auto"
          onClick={modalMDTAdd.toggleModal}
        >
          <i className="ph-plus me-2"></i>
          MDT 인스턴스 추가
        </button>
      </div>
      <div className="table-responsive">
        <table
          style={{ width: "100%" }}
          className="table datatable-basic table-bordered table-mdt"
        >
          <thead>
            <tr>
              <th style={{ width: "80px" }}>No</th>
              <th>
                ID
                <span className="sort" onClick={() => handleSort("id")}>
                  <i className={getSortIcon("id")}></i>
                </span>
              </th>
              <th>
                ASS ID
                <span className="sort" onClick={() => handleSort("aasId")}>
                  <i className={getSortIcon("aasId")}></i>
                </span>
              </th>
              <th>
                ASS ID Short
                <span className="sort" onClick={() => handleSort("aasIdShort")}>
                  <i className={getSortIcon("aasIdShort")}></i>
                </span>
              </th>
              <th style={{ width: "160px" }}>
                Asset Type
                <span className="sort" onClick={() => handleSort("assetType")}>
                  <i className={getSortIcon("assetType")}></i>
                </span>
              </th>
              <th style={{ width: "300px" }}>Submodels</th>
              <th>상태</th>
              <th>정보</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {datalist && datalist.length > 0 ? (
              <>
                {datalist.map((item, index) => (
                  <tr key={"item-" + index}>
                    <td className="text-center">{startNum + index}</td>
                    <td>{item.id}</td>
                    <td>{item.aasId}</td>
                    <td>{item.aasIdShort}</td>
                    <td>{item.assetType}</td>
                    <td>
                      <div
                        className="eclipse"
                        onClick={() => {
                          setSelectedInstance(item);
                          modalSubModelTable.toggleModal();
                        }}
                      >
                        {getSubModelText(item.submodels)}
                      </div>
                    </td>
                    <td>
                      <div
                        className={clsx(
                          "label-status",
                          getStatusBG(item.status)
                        )}
                      >
                        {item.status}
                      </div>
                    </td>
                    <td className="text-center">
                      <button
                        type="button"
                        className="btn btn-outline-success border-0 btn-icon me-1"
                        onClick={() => setSelect(item)}
                        title="정보보기"
                      >
                        <i className="ph-magnifying-glass"></i>
                      </button>

                      <button
                        type="button"
                        className="btn btn-outline-dark text-white  border-0 btn-icon"
                        onClick={() => {
                          setSelectedInstance(item);
                          modalLogView.toggleModal();
                        }}
                        title="로그보기"
                      >
                        <i className="ph-terminal-window"></i>
                      </button>
                    </td>
                    <td className="text-center">
                      {item.status === "RUNNING" && (
                        <>
                          <button
                            type="button"
                            className="btn btn-outline-primary border-0 btn-icon"
                            onClick={() => onClickConfirm(item, "stop")}
                            title="동작 멈추기"
                          >
                            <i className="ph-stop"></i>
                          </button>
                        </>
                      )}
                      {(item.status === "STOPPED" ||
                        item.status === "FAILED") && (
                        <button
                          type="button"
                          className="btn btn-outline-info border-0 btn-icon"
                          onClick={() => onClickConfirm(item, "start")}
                          title="시작하기"
                        >
                          <i className="ph-play"></i>
                        </button>
                      )}
                      {item.status !== "STOPPED" &&
                        item.status !== "RUNNING" &&
                        item.status !== "FAILED" && (
                          <i className="ph-spinner spinner"></i>
                        )}
                      <button
                        type="button"
                        className="btn btn-outline-danger border-0 btn-icon ms-1"
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
                <td colSpan={9} className="p-0">
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

      <ModalLogView
        open={modalLogView.open}
        closeModal={modalLogView.toggleModal}
        data={selectedInstance}
      ></ModalLogView>

      <ModalLogView
        open={modalErrorLogView.open}
        closeModal={modalErrorLogView.toggleModal}
        data={selectedInstance}
        mode="error"
      ></ModalLogView>

      <ModalSubModelList
        open={modalSubModelTable.open}
        closeModal={modalSubModelTable.toggleModal}
        instance={selectedInstance}
        showSubModel={onClickSubModel}
      ></ModalSubModelList>

      <ModalMDTInstance
        open={modalMDTAdd.open}
        closeModal={modalMDTAdd.toggleModal}
        handleAddInstance={onClickConfirm}
      ></ModalMDTInstance>
    </div>
  );
};

export default MDITable;
