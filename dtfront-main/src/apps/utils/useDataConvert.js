import {
  GenesisWorkflowModelData,
  GenesisWorkflowModelTaskData,
  TaskType,
} from "apps/datas/definedData";
import UtilManager from "./util_manager";
import useRequestManager from "./request_manager";

const useDataConvert = () => {
  const { CloneDeep, IS_NULL } = UtilManager();
  const { REQ_GET_Variables_JSON } = useRequestManager();

  const uDC_fetchJSONConnect = async (
    source,
    target,
    source_handle_id,
    target_handle_id
  ) => {
    let result = false;

    const regex = /[^_]+$/;

    const sourceID = source_handle_id.match(regex)[0];
    const targetID = target_handle_id.match(regex)[0];

    let source_json = source.outputVariables?.find(
      (item) => item.name === sourceID
    );

    if (source_json && source_json.json && target.inputVariables) {
      const updatedList = await Promise.all(
        target.inputVariables.map(async (item) => {
          if (item.name === targetID) {
            let data = CloneDeep(source_json);

            let new_result = await REQ_GET_Variables_JSON(
              targetID,
              data.value,
              data.type === "value"
            );

            if (new_result) {
              data.name = targetID;
              data.json = new_result;
            }

            return data;
          }

          return item;
        })
      );

      target.inputVariables = updatedList;

      result = true;
    }

    return result;
  };

  const uDC_fetchModelJSON = async (list) => {
    let error_name = "";
    let none_check = "";
    let resultlist = [];

    for (let i = 0; i < list.length; i++) {
      let item = list[i];
      let type = item.type;
      let value = item.value;
      let name = item.name;

      if (IS_NULL(value) || IS_NULL(name)) {
        none_check = "이름과 값을 입력해주세요.";
        break;
      }

      try {
        let res;

        res = await REQ_GET_Variables_JSON(name, value, type === "value");

        if (res) {
          item.json = res;

          resultlist.push(item);
        } else {
          error_name = item.value;
        }
      } catch (error) {
        error_name = item.value;
        break;
      }
    }

    return {
      none_check: none_check,
      error: error_name,
      list: resultlist,
    };
  };

  const uDC_WorkflowModel_To_UIData = (data) => {};

  const uDC_UIData_To_WorkflowModel = (tasklist, flow) => {
    let result = CloneDeep(GenesisWorkflowModelData);

    result.gui = {
      flow: flow,
    };

    tasklist.forEach((task) => {
      let taskResult;

      switch (task.type) {
        case TaskType.SET:
          taskResult = uDC_UIData_To_SetTask(task);
          break;
        case TaskType.HTTP:
          taskResult = uDC_UIData_To_HttpTask(task);
          break;
        case TaskType.AAS:
          taskResult = uDC_UIData_To_AASTask(task);
          break;
      }

      result.taskDescriptors.push(taskResult);
    });

    return result;
  };

  const uDC_UIData_To_SetTask = (data) => {
    let result = CloneDeep(GenesisWorkflowModelTaskData);

    result.id = data.id;
    result.name = data.name;
    result.type = data.type;
    result.description = data.description;
    result.dependencies = data.dependencies;

    data.inputVariables.forEach((item) => {
      if (item.json) {
        result.inputVariables.push(item.json);
      }
    });

    data.outputVariables.forEach((item) => {
      if (item.json) {
        result.outputVariables.push(item.json);
      }
    });

    return result;
  };

  const uDC_UIData_To_HttpTask = (data) => {
    let result = CloneDeep(GenesisWorkflowModelTaskData);

    result.id = data.id;
    result.name = data.name;
    result.type = data.type;
    result.description = data.description;
    result.dependencies = data.dependencies;

    result.options.push({ name: "endpoint", value: data.url });
    result.options.push({ name: "opId", value: data.opId });
    result.options.push({ name: "timeout", value: data.timeout });
    result.options.push({
      name: "poll",
      value: IS_NULL(data.poll) ? "1.0" : data.poll,
    });
    result.options.push({
      name: "loglevel",
      value: IS_NULL(data.logger) ? "info" : data.logger,
    });
    result.labels.push({ name: "mdt-operation", value: data.submodel });

    data.inputVariables.forEach((item) => {
      if (item.json) {
        result.inputVariables.push(item.json);
      }
    });

    data.outputVariables.forEach((item) => {
      if (item.json) {
        result.outputVariables.push(item.json);
      }
    });

    return result;
  };

  const uDC_UIData_To_AASTask = (data) => {
    let result = CloneDeep(GenesisWorkflowModelTaskData);

    result.id = data.id;
    result.name = data.name;
    result.type = data.type;
    result.description = data.description;
    result.dependencies = data.dependencies;

    result.options.push({ name: "operation", value: data.operation });
    result.options.push({ name: "timeout", value: data.timeout });
    result.options.push({ name: "poll", value: data.poll });
    result.options.push({
      name: "loglevel",
      value: IS_NULL(data.logger) ? "info" : data.logger,
    });
    result.labels.push({ name: "mdt-operation", value: data.submodel });

    data.inputVariables.forEach((item) => {
      if (item.json) {
        result.inputVariables.push(item.json);
      }
    });

    data.outputVariables.forEach((item) => {
      if (item.json) {
        result.outputVariables.push(item.json);
      }
    });

    return result;
  };

  return {
    uDC_fetchJSONConnect,
    uDC_fetchModelJSON,
    uDC_WorkflowModel_To_UIData,
    uDC_UIData_To_WorkflowModel,
  };
};

export default useDataConvert;
