import {
  GenesisUIVariableData,
  GenesisValueReferenceData,
  GenesisVariableData,
  SET_TaskData,
  TaskType,
  useGenesisDataManager,
} from "apps/datas/definedData";
import UtilManager from "apps/utils/util_manager";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import EmptyList from "apps/components/EmptyList";
import PanelVariable from "./PanelVariable";
import useRequestManager from "apps/utils/request_manager";
import PanelVariableOut from "./PanelVariableOut";
import useDataConvert from "apps/utils/useDataConvert";

const initialData = {
  id: "",
  name: "",
  type: TaskType.SET,
  description: "",
  dependencies: [],
  inputVariables: [],
  outputVariables: [],
  bg: "#9b9b9b",
};

const PanelValueSet = forwardRef(({ task }, ref) => {
  const { CloneDeep, IS_NULL } = UtilManager();
  const { REQ_GET_Variables_JSON, REQ_GET_EXECUTION_TIME } =
    useRequestManager();
  const { uDC_fetchModelJSON } = useDataConvert();

  useImperativeHandle(ref, () => ({
    getData: handleGetData,
  }));

  const handleGetData = async () => {
    let result = CloneDeep(SET_TaskData);

    if (IS_NULL(inputData.id)) {
      setError("식별자를 입력해주세요.");
      return null;
    }

    result.id = inputData.id;
    result.name = inputData.name;
    result.type = inputData.type;
    result.description = inputData.description;
    result.dependencies = task.dependencies;
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
        if (inputList.length === 0) {
          variable.name = "source";
          setInputList((prev) => [...prev, variable]);
        }
        break;
      case "output":
        if (outputList.length === 0) {
          variable.name = "target";
          variable.type = "reference";
          setOutputList((prev) => [...prev, variable]);
        }
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

  const [executionTime, setExecutionTime] = useState("");

  const fetchGetTime = async () => {
    let time = await REQ_GET_EXECUTION_TIME();

    setExecutionTime(time || "");
  };

  return (
    <div className="panel-value-wrapper">
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row mb-2">
        <label className="col-form-label col-2">타입</label>
        <label className="col-form-label col-10">Set</label>
      </div>
      <div className="row mb-2">
        <label className="col-form-label col-2">
          식별자 <span className="text-danger">*</span>
        </label>
        <div className="col-10">
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
        <label className="col-form-label col-2">이름</label>
        <div className="col-10">
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
        <label className="col-form-label col-2">설명</label>
        <div className="col-10">
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
        <label className="col-form-label col-3">입력 인자 목록</label>
        <div className="col-9 d-none">
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
        <label className="col-form-label col-3">출력 인자 목록</label>
        <div className="col-9 d-none">
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
      <div className="row d-none">
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

export default PanelValueSet;
