import {
  GenesisTaskData,
  GenesisUIVariableData,
  GenesisVariableData,
  TaskType,
  useGenesisDataManager,
} from "apps/datas/definedData";
import UtilManager from "apps/utils/util_manager";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import ButtonWithPopup from "./ButtonWithPopup";
import EmptyList from "apps/components/EmptyList";
import PanelVariable from "./PanelVariable";
import TreeViewMDTSubmodel from "apps/components/common/TreeViewMDTSubmodel";
import useRequestManager from "apps/utils/request_manager";
import PanelVariableOut from "./PanelVariableOut";
import useDataConvert from "apps/utils/useDataConvert";

const initialData = {
  id: "",
  name: "",
  type: TaskType.AAS,
  description: "",
  submodel: "",
  operation: "",
  timeout: "",
  poll: "1.0",
  logger: "info",
  dependencies: [],
  inputVariables: [],
  outputVariables: [],
  bg: "#9b9b9b",
};

const PanelValueAAS = forwardRef(({ task }, ref) => {
  const { CloneDeep, IS_NULL } = UtilManager();
  const {
    REQ_GET_Instance_MDT_Model,
    REQ_GET_Variables_JSON,
    REQ_GET_EXECUTION_TIME,
  } = useRequestManager();
  const { Get_Operation_To_Reference } = useGenesisDataManager();
  const { uDC_fetchModelJSON } = useDataConvert();

  useImperativeHandle(ref, () => ({
    getData: handleGetData,
  }));

  const [showTree, setShowTree] = useState(false);

  const handleGetData = async () => {
    let result = CloneDeep(GenesisTaskData);

    if (IS_NULL(inputData.id)) {
      setError("식별자를 입력해주세요");
      return null;
    }

    if (IS_NULL(inputData.submodel)) {
      setError("연산 서브모델을 입력해주세요.");
      return null;
    }

    if (IS_NULL(inputData.logger)) {
      setError("연산 식별자를 입력해주세요.");
      return null;
    }

    if (IS_NULL(inputData.poll)) {
      setError("종료 확인주기(초)를 입력해주세요.");
      return null;
    }

    /*
    if (inputList.length === 0) {
      setError("입력인자를 입력해주세요.");
      return null;
    }

    if (outputList.length === 0) {
      setError("출력인자를 입력해주세요.");
      return null;
    }
      */

    result.id = inputData.id;
    result.name = inputData.name;
    result.type = inputData.type;
    result.description = inputData.description;
    result.dependencies = task.dependencies;
    result.submodel = inputData.submodel;
    result.operation = inputData.operation;
    result.timeout = inputData.timeout;
    result.poll = inputData.poll;
    result.logger = inputData.logger;
    result.inputVariables = inputList;
    result.outputVariables = outputList;
    result.bg = task.bg;

    if (!IS_NULL(result.inputVariables) && result.inputVariables.length > 0) {
      let lst_input_json = await uDC_fetchModelJSON(result.inputVariables);

      if (IS_NULL(lst_input_json.error) && IS_NULL(lst_input_json.none_check)) {
        result.inputVariables = lst_input_json.list;
      } else {
        if (IS_NULL(lst_input_json.none_check)) {
          setError(
            `입력인자 중 ${lst_input_json.error} Task의 타입을 조회할 수 없습니다.`
          );
        } else {
          setError(`입력인자의 ${lst_input_json.none_check}`);
        }
        return null;
      }
    } else {
      result.inputVariables = [];
    }

    if (!IS_NULL(result.outputVariables) && result.outputVariables.length > 0) {
      let lst_output_json = await uDC_fetchModelJSON(result.outputVariables);

      if (
        IS_NULL(lst_output_json.error) &&
        IS_NULL(lst_output_json.none_check)
      ) {
        result.outputVariables = lst_output_json.list;
      } else {
        if (IS_NULL(lst_output_json.none_check)) {
          setError(
            `출력인자 중 ${lst_output_json.error} Task의 타입을 조회할 수 없습니다.`
          );
        } else {
          setError(`출력인자의 ${lst_output_json.none_check}`);
        }
        return null;
      }
    } else {
      result.outputVariables = [];
    }

    return result;
  };

  const [error, setError] = useState(null);
  const [inputData, setInputData] = useState(initialData);
  const [inputList, setInputList] = useState([]);
  const [outputList, setOutputList] = useState([]);

  const handleChangeSubModel = (info) => {
    setInputData({
      ...inputData,
      submodel: info,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({
      ...inputData,
      [name]: value,
    });

    setError(null);
  };

  const handleUpdateInput = (index, name, value) => {
    setInputList((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, [name]: value } : item
      )
    );
  };

  const handleUpdateOutput = (index, name, value) => {
    setOutputList((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, [name]: value } : item
      )
    );
  };

  const convertTask = (data) => {
    let input = { ...inputData };

    input.id = data.id;
    input.name = data.name;
    input.description = data.description;
    input.submodel = data.submodel;
    input.operation = data.operation;
    input.timeout = data.timeout;
    input.poll = data.poll;
    input.logger = data.logger;
    input.dependencies = data.dependencies;
    input.inputVariables = data.inputVariables;
    input.outputVariables = data.outputVariables;

    setInputData(input);
    setInputList([...data.inputVariables]);
    setOutputList([...data.outputVariables]);
    setExecutionTime("");
  };

  useEffect(() => {
    if (task) {
      convertTask(task);
    }

    return () => {
      setExecutionTime("");
    };
  }, [task]);

  const onClickAddVariable = (type) => {
    let variable = CloneDeep(GenesisUIVariableData);

    switch (type) {
      case "input":
        setInputList((prev) => [...prev, variable]);
        break;
      case "output":
        variable.type = "reference";
        setOutputList((prev) => [...prev, variable]);
        break;
    }
  };

  const onClickDeleteVariable = (type, idx) => {
    switch (type) {
      case "input":
        setInputList((prev) => prev.filter((_, i) => i !== idx));
        break;
      case "output":
        setOutputList((prev) => prev.filter((_, i) => i !== idx));
        break;
    }
  };

  const onClickLoadRelationSubModel = () => {
    if (IS_NULL(inputData.submodel)) {
      return;
    }

    setInputData({
      ...inputData,
      operation: inputData.submodel + ":Operation",
    });

    let list = inputData.submodel.split(":");

    if (list.length > 0) {
      let mdtID = list[0];
      let submodelShortID = list.length > 1 ? list[1] : "";

      fetchGetMdtModel(mdtID, submodelShortID);
    }
  };

  const fetchGetMdtModel = async (mdtID, shortID) => {
    let result = await REQ_GET_Instance_MDT_Model(mdtID);

    if (result) {
      let operations = result.operations;

      if (operations) {
        let item = operations.find((item) => item.id === shortID);

        if (item) {
          let inputlist = Get_Operation_To_Reference(item.inputArguments);
          let outputlist = Get_Operation_To_Reference(item.outputArguments);

          setInputList(inputlist);
          setOutputList(outputlist);
        }
      }
    } else {
      setInputData([]);
      setOutputList([]);
    }
  };

  const [executionTime, setExecutionTime] = useState("");

  const fetchGetTime = async () => {
    if (inputData?.submodel) {
      let time = await REQ_GET_EXECUTION_TIME(inputData.submodel);

      setExecutionTime(time || "");
    }
  };

  return (
    <div className="panel-value-wrapper">
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row mb-2">
        <label className="col-form-label col-3">타입</label>
        <label className="col-form-label col-9">MDT</label>
      </div>
      <div className="row mb-2">
        <label className="col-form-label col-3">
          식별자 <span className="text-danger">*</span>
        </label>
        <div className="col-9">
          <input
            type="text"
            className="form-control"
            name="id"
            value={inputData ? inputData.id : ""}
            onChange={handleInputChange}
          ></input>
        </div>
      </div>
      <div className="row mb-2">
        <label className="col-form-label col-3">이름</label>
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
      <div className="row mb-2">
        <label className="col-form-label col-3">설명</label>
        <div className="col-9">
          <input
            type="text"
            className="form-control"
            name="description"
            value={inputData ? inputData.description : ""}
            onChange={handleInputChange}
          ></input>
        </div>
      </div>
      <div className="row mb-2">
        <label className="col-form-label col-3">
          연산 서브모델 <span className="text-danger">*</span>
        </label>
        <div className="col-9">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              name="submodel"
              value={inputData ? inputData.submodel : ""}
              onChange={handleInputChange}
            ></input>
            <button
              className="btn btn-light"
              type="button"
              onClick={onClickLoadRelationSubModel}
            >
              입출력 인자조회
            </button>
            <button
              className="btn btn-light"
              type="button"
              onClick={() => setShowTree(!showTree)}
            >
              <i className="ph-magnifying-glass"></i>
            </button>
          </div>
        </div>
      </div>
      {showTree && (
        <div className="row mb-2">
          <div className="col">
            <div className="pnl-widget-tree">
              <TreeViewMDTSubmodel
                handleSelectedSubmodel={handleChangeSubModel}
              ></TreeViewMDTSubmodel>
            </div>
          </div>
        </div>
      )}
      <div className="row mb-2">
        <label className="col-form-label col-3">
          연산 식별자 <span className="text-danger">*</span>
        </label>
        <div className="col-9">
          <input
            type="text"
            className="form-control"
            name="operation"
            value={inputData ? inputData.operation : ""}
            onChange={handleInputChange}
          ></input>
        </div>
      </div>
      <div className="row mb-2">
        <label className="col-form-label col-3">로그 레벨</label>
        <div className="col-9">
          <input
            type="text"
            className="form-control"
            name="logger"
            value={inputData ? inputData.logger : ""}
            onChange={handleInputChange}
          ></input>
        </div>
      </div>
      <div className="row mb-2">
        <label className="col-form-label col-3">
          종료 확인주기(초) <span className="text-danger">*</span>
        </label>
        <div className="col-9">
          <input
            type="text"
            className="form-control"
            name="poll"
            value={inputData ? inputData.poll : ""}
            onChange={handleInputChange}
          ></input>
        </div>
      </div>
      <div className="row mb-2">
        <label className="col-form-label col-3">시간제한(초)</label>
        <div className="col-9">
          <input
            type="text"
            className="form-control"
            name="timeout"
            value={inputData ? inputData.timeout : ""}
            onChange={handleInputChange}
          ></input>
        </div>
      </div>
      <div className="row mb-2">
        <label className="col-form-label col-3">
          입력 인자 목록 <span className="text-danger">*</span>
        </label>
        <div className="col-9">
          <button
            className="btn btn-icon btn-primary"
            onClick={() => onClickAddVariable("input")}
          >
            <i className="ph-plus me-1"></i>
            추가
          </button>
        </div>
      </div>
      <div className="row mb-2">
        <div className="col">
          {inputList.length > 0 ? (
            inputList.map((item, idx) => (
              <PanelVariable
                key={idx}
                inputData={item}
                handleDelete={() => onClickDeleteVariable("input", idx)}
                handleChange={(name, value) =>
                  handleUpdateInput(idx, name, value)
                }
              ></PanelVariable>
            ))
          ) : (
            <EmptyList message={"없음"}></EmptyList>
          )}
        </div>
      </div>
      <div className="row mb-2">
        <label className="col-form-label col-3">
          출력 인자 목록 <span className="text-danger">*</span>
        </label>
        <div className="col-9">
          <button
            className="btn btn-icon btn-primary"
            onClick={() => onClickAddVariable("output")}
          >
            <i className="ph-plus me-1"></i>
            추가
          </button>
        </div>
      </div>
      <div className="row mb-2">
        <div className="col">
          {outputList.length > 0 ? (
            outputList.map((item, idx) => (
              <PanelVariableOut
                key={idx}
                inputData={item}
                handleDelete={() => onClickDeleteVariable("output", idx)}
                handleChange={(name, value) =>
                  handleUpdateOutput(idx, name, value)
                }
              ></PanelVariableOut>
            ))
          ) : (
            <EmptyList message={"없음"}></EmptyList>
          )}
        </div>
      </div>
      <div className="row">
        <label className="col-form-label col-2">예상수행시간</label>
        <div className="col-10">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              name="value"
              placeholder="예상수행시간"
              value={executionTime || ""}
              readOnly
            ></input>
            <button
              className="btn btn-light"
              type="button"
              onClick={fetchGetTime}
            >
              <i className="ph-magnifying-glass"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default PanelValueAAS;
