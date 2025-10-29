import MDITable from "apps/components/Table/MDITable";
import useRequestManager from "apps/utils/request_manager";
import { useEffect, useState } from "react";
import ToggleStatusCard from "../ToggleStatusCard";
import { RunStatus } from "apps/datas/definedData";
import modal_icon from "assets/images/logo/header_icon.png";
import useCommon from "apps/hooks/useCommon";

const templist = [
  {
    id: "ID",
    arguments: "arguments",
    imageId: "imageId",
    endpoint: "endpoint",
    baseendpoint: "baseendpoint",
    aasId: "aasId",
    aasIdShort: "aasIdShort",
    globalAssetId: "globalAssetId",
    assetType: "assetType",
    assetKind: "assetKind",
    status: "STOPPED",
    statusMessage: "statusMessage",
    subModels: [
      {
        id: "id",
        idShort: "idShort",
        semanticId: "semanticId",
      },
    ],
  },
];

const PageInstance = ({ setSelect, setSelectSubModel }) => {
  //#region 데이터 조회 및 테이블 관련
  const { instanceList } = useCommon();

  const [originList, setOriginList] = useState([]);
  const [datalist, setDatalist] = useState([]);

  const [checkAll, setCheckAll] = useState(true);
  const [checkStopped, setCheckStopped] = useState(true);
  const [checkStopping, setCheckStopping] = useState(true);
  const [checkStarting, setCheckStarting] = useState(true);
  const [checkRunning, setCheckRunning] = useState(true);
  const [checkFailed, setCheckFailed] = useState(true);

  const [countAll, setCountAll] = useState(0);
  const [countStopped, setCountStopped] = useState(0);
  const [countStopping, setCountStopping] = useState(0);
  const [countStarting, setCountStarting] = useState(0);
  const [countRunning, setCountRunning] = useState(0);
  const [countFailed, setCountFailed] = useState(0);

  const DATA_TEST = () => {
    searchGeneration(templist);
  };

  const changeInstanceList = (list) => {
    setOriginList(list);
    searchGeneration(list);
  };

  const searchGeneration = (list) => {
    let ct_stopped = 0;
    let ct_stopping = 0;
    let ct_starting = 0;
    let ct_running = 0;
    let ct_failed = 0;

    var searchlist = list.filter((item) => {
      let result = false;
      const status = item.status;

      switch (status) {
        case RunStatus.STOPPED:
          ct_stopped++;
          if (checkStopped) {
            result = true;
          }
          break;
        case RunStatus.STOPPING:
          ct_stopping++;
          if (checkStopping) {
            result = true;
          }
          break;
        case RunStatus.STARTING:
          ct_starting++;
          if (checkStarting) {
            result = true;
          }
          break;
        case RunStatus.RUNNING:
          ct_running++;
          if (checkRunning) {
            result = true;
          }
          break;
        case RunStatus.FAILED:
          ct_failed++;
          if (checkFailed) {
            result = true;
          }
          break;
        default:
          break;
      }

      return result;
    });

    setCountStopped(ct_stopped);
    setCountStopping(ct_stopping);
    setCountStarting(ct_starting);
    setCountRunning(ct_running);
    setCountFailed(ct_failed);

    setDatalist(searchlist);
  };

  useEffect(() => {
    searchGeneration(originList);
  }, [checkStopped, checkStopping, checkStarting, checkRunning, checkFailed]);

  useEffect(() => {
    if (instanceList) {
      changeInstanceList(instanceList);
    }
    //DATA_TEST();
  }, [instanceList]);

  //#endregion

  useEffect(() => {}, []);

  return (
    <div>
      <div className="inner-title">
        <h4 className="mb-0">
          <img src={modal_icon} className="me-2" height={16}></img>
          MDT Instance
        </h4>
      </div>

      <div className="pnl-space"></div>
      <div className="container-ift mb-3">
        <ToggleStatusCard
          count={countStopped}
          status={RunStatus.STOPPED}
          checked={checkStopped}
          setChecked={setCheckStopped}
        ></ToggleStatusCard>
        <ToggleStatusCard
          count={countStopping}
          status={RunStatus.STOPPING}
          checked={checkStopping}
          setChecked={setCheckStopping}
        ></ToggleStatusCard>
        <ToggleStatusCard
          count={countStarting}
          status={RunStatus.STARTING}
          checked={checkStarting}
          setChecked={setCheckStarting}
        ></ToggleStatusCard>
        <ToggleStatusCard
          count={countRunning}
          status={RunStatus.RUNNING}
          checked={checkRunning}
          setChecked={setCheckRunning}
        ></ToggleStatusCard>
        <ToggleStatusCard
          count={countFailed}
          status={RunStatus.FAILED}
          checked={checkFailed}
          setChecked={setCheckFailed}
          margin=""
        ></ToggleStatusCard>
      </div>

      <MDITable
        list={datalist}
        setSelect={setSelect}
        setSelectSubModel={setSelectSubModel}
      ></MDITable>
    </div>
  );
};

export default PageInstance;
