import NodeJslt from "apps/components/Workflow/nodes/NodeJslt";
import UtilManager from "../utils/util_manager";
import NodeAas from "apps/components/Workflow/nodes/NodeAas";
import NodeSet from "apps/components/Workflow/nodes/NodeSet";
import NodeCopy from "apps/components/Workflow/nodes/NodeCopy";
import NodeProgram from "apps/components/Workflow/nodes/NodeProgram";
import NodeHttp from "apps/components/Workflow/nodes/NodeHttp";
import NodeProperty from "apps/components/Workflow/nodes/NodeProperty";
import useRequestManager from "apps/utils/request_manager";

export const StatusList = [
  "NOT_STARTED",
  "STARTING",
  "RUNNING",
  "COMPLETED",
  "FAILED",
  "UNKNOWN",
];

// 상태별 색상 매핑
export const statusColorOrigin = {
  NOT_STARTED: "#9ca3af",
  STARTING: "#576eed",
  RUNNING: "#2196f3",
  COMPLETED: "#18be94",
  FAILED: "#ef4444",
  UNKNOWN: "#1b1b1b",
};

export const statusColors = {
  NOT_STARTED: "bg-not-started",
  STARTING: "bg-starting",
  RUNNING: "bg-running",
  COMPLETED: "bg-completed",
  FAILED: "bg-failed",
  UNKNOWN: "bg-unknown",
};

// 상태별 아이콘 매핑
export const statusIcons = {
  NOT_STARTED: "ph-fast-forward",
  STARTING: "ph-play",
  RUNNING: "ph-spinner spinner",
  COMPLETED: "ph-check",
  FAILED: "ph-x",
  UNKNOWN: "ph-dots-three",
};

export const TreeItemType = {
  MDT: "MDT",
  SubModel: "SubModel",
  Operations: "Operations",
  Parameters: "Parameters",
  SMC: "SubmodelElementCollection",
  SML: "SubmodelElementList",
  Prop: "Property",
  File: "File",
};

export const WorkflowNodeType = {
  set: NodeSet,
  copy: NodeCopy,
  program: NodeProgram,
  http: NodeHttp,
  jslt: NodeJslt,
  aas: NodeAas,
  Property: NodeProperty,
};

export const RunStatus = {
  ALL: "ALL",
  STOPPED: "STOPPED",
  STOPPING: "STOPPING",
  STARTING: "STARTING",
  RUNNING: "RUNNING",
  FAILED: "FAILED",
};

export const workflowItemData = {
  type: "",
  title: "",
  item: null,
};

export const TaskType = {
  SET: "mdt.task.builtin.SetTask",
  COPY: "mdt.task.builtin.CopyTask",
  PROGRAM: "mdt.task.builtin.ProgramTask",
  HTTP: "mdt.task.builtin.HttpTask",
  JSLT: "mdt.task.builtin.JsltTask",
  AAS: "mdt.task.builtin.AASOperationTask",
  Property: "Property",
};

export const OptionType = {
  STRING: "string",
  BOOLEAN: "boolean",
  ARRAY: "array",
  MULTILINE: "multiline",
  TWIN_REF: "twin_ref",
  SUBMODEL_REF: "submodel_ref",
  SME_REF: "sme_ref",
};

export const VariableType = {
  VALUE: "mdt:variable:value",
  REFERENCE: "mdt:variable:reference",
};

//#region GENESIS 데이터 정의

export const GenesisUIVariableData = {
  type: "value",
  name: "",
  description: "",
  value: "",
  json: null,
};

export const GenesisVariableData = {
  "@type": VariableType.VALUE,
  name: "",
  description: "",
  value: null,
};

export const GenesisValueReferenceData = {
  "@type": VariableType.REFERENCE,
  name: "",
  description: "",
  reference: null,
};

export const GenesisOptionData = {
  name: "",
  value: "",
};

export const GenesisLabelData = {
  name: "",
  value: "",
};

export const GenesisTaskData = {
  id: "",
  name: "",
  type: TaskType.SET,
  description: "",
  dependencies: [],
  inputVariables: [],
  outputVariables: [],
  options: [],
  labels: [],
  bg: "#9b9b9b",
};

export const GenesisWorkflowModelData = {
  id: "",
  name: "",
  description: "",
  taskDescriptors: [],
  gui: {},
};

export const GenesisWorkflowModelTaskData = {
  id: "",
  name: "",
  type: TaskType.SET,
  description: "",
  dependencies: [],
  inputVariables: [],
  outputVariables: [],
  options: [],
  labels: [],
};

export const SET_TaskData = {
  id: "",
  name: "",
  type: TaskType.SET,
  description: "",
  dependencies: [],
  inputVariables: [],
  outputVariables: [],
  bg: "#9b9b9b",
};

export const HTTP_TaskData = {
  id: "",
  name: "",
  type: TaskType.HTTP,
  description: "",
  submodel: "",
  opId: "",
  url: "",
  timeout: "",
  poll: "1.0",
  logger: "info",
  dependencies: [],
  inputVariables: [],
  outputVariables: [],
  bg: "#9b9b9b",
};

export const AAS_TaskData = {
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

//#endregion

export const useGenesisDataManager = () => {
  const { CloneDeep } = UtilManager();

  const GET_TASKLABEL = (type) => {
    let label = "";

    switch (type) {
      case TaskType.SET:
        label = "SET";
        break;
      case TaskType.COPY:
        label = "COPY";
        break;
      case TaskType.PROGRAM:
        label = "PROGRAM";
        break;
      case TaskType.HTTP:
        label = "HTTP";
        break;
      case TaskType.JSLT:
        label = "JSLT";
        break;
      case TaskType.AAS:
        label = "MDT";
        break;
      default:
        break;
    }

    return label;
  };

  const GET_NODETYPE = (type) => {
    let label = "";

    switch (type) {
      case TaskType.SET:
        label = "set";
        break;
      case TaskType.COPY:
        label = "copy";
        break;
      case TaskType.PROGRAM:
        label = "program";
        break;
      case TaskType.HTTP:
        label = "http";
        break;
      case TaskType.JSLT:
        label = "jslt";
        break;
      case TaskType.AAS:
        label = "mdt";
        break;
      case TaskType.Property:
        label = "Property";
        break;
      default:
        break;
    }

    return label;
  };

  const GET_TASKLIST = () => {
    let list = [];

    list.push(Get_Origin_TaskData(TaskType.SET));
    list.push(Get_Origin_TaskData(TaskType.HTTP));
    list.push(Get_Origin_TaskData(TaskType.AAS));

    return list;
  };

  const Get_Origin_TaskData = (type) => {
    let base;

    switch (type) {
      case TaskType.SET:
        base = CloneDeep(SET_TaskData);
        base.inputVariables.push(
          Get_Origin_VariableData("source", "value", "")
        );
        base.outputVariables.push(
          Get_Origin_VariableData("target", "reference", "")
        );
        break;
      case TaskType.HTTP:
        base = CloneDeep(HTTP_TaskData);
        /*
        base.inputVariables.push(
          Get_Origin_VariableData("Data", "reference", "")
        );
        base.inputVariables.push(
          Get_Origin_VariableData("IncAmount", "value", "")
        );
        base.inputVariables.push(
          Get_Origin_VariableData("SleepTime", "reference", "")
        );
        base.outputVariables.push(
          Get_Origin_VariableData("Output", "reference", "")
        );
        */
        break;
      case TaskType.AAS:
        base = CloneDeep(AAS_TaskData);
        /*
        base.inputVariables.push(
          Get_Origin_VariableData("Data", "reference", "")
        );
        base.inputVariables.push(
          Get_Origin_VariableData("IncAmount", "value", "")
        );
        base.inputVariables.push(
          Get_Origin_VariableData("SleepTime", "reference", "")
        );
        base.outputVariables.push(
          Get_Origin_VariableData("Output", "reference", "")
        );
        */
        break;
      default:
        break;
    }

    return base;
  };

  const Get_Origin_OptionData = (name, value = "") => {
    let base = CloneDeep(GenesisOptionData);

    base.name = name;
    base.value = value;

    return base;
  };

  const Get_Origin_VariableData = (name, type, val) => {
    let base = CloneDeep(GenesisUIVariableData);
    base.type = type;
    base.name = name;
    base.value = val;

    return base;
  };

  const Get_Operation_To_Reference = (args) => {
    let list = [];
    let keylist = Object.keys(args);

    keylist.forEach((key) => {
      let item = args[key];

      let variable = CloneDeep(GenesisUIVariableData);
      variable.type = "reference";
      variable.name = item.id;
      variable.value = item.reference;

      list.push(variable);
    });

    return list;
  };

  const Get_Convert_VariableData_To_Value = (data) => {
    let input = {
      type: "value",
      name: "",
      description: "",
      value: "",
    };

    input.name = data.name;

    let type = data["@type"];

    if (type === VariableType.REFERENCE) {
      input.type = "reference";

      let reference = data.reference;

      if (reference) {
        let value_type = reference["@type"];
        let instanceID = "";
        let modelID = "";
        let path = "";

        switch (value_type) {
          case "mdt:ref:param":
            instanceID = reference.instanceId || "";
            modelID = reference.parameterId || "";
            path = reference.subPath || "";
            break;
          case "mdt:ref:element":
            instanceID = reference.submodelReference?.instanceId || "";
            modelID = reference.submodelReference?.submodelIdShort || "";
            path = reference.elementPath || "";
            break;
        }

        if (instanceID && modelID && path) {
          input.value = `${instanceID}:${modelID}:${path}`;
        }
      }
    } else if (type === VariableType.VALUE) {
      input.type = "value";

      let val = data.value;

      if (val) {
        input.value = val.value || "";
      }
    }

    return input;
  };

  const Get_InitJSON_VariableData = (type, name) => {
    let result;

    switch (type) {
      case "value":
        result = {
          "@type": VariableType.VALUE,
          name: name,
          description: "",
          value: {
            "@type": "mdt:value:integer",
            value: "",
          },
        };
        break;
      case "reference":
        result = {
          "@type": VariableType.REFERENCE,
          name: name,
          description: "",
          reference: {},
        };
        break;
    }

    return result;
  };

  return {
    GET_NODETYPE,
    GET_TASKLABEL,
    GET_TASKLIST,
    Get_Origin_TaskData,
    Get_Origin_OptionData,
    Get_Origin_VariableData,
    Get_Convert_VariableData_To_Value,
    Get_InitJSON_VariableData,
    Get_Operation_To_Reference,
  };
};

export const useConvert = () => {
  const { REQ_SUBMODEL_INFO_WITH_CONVERT } = useRequestManager();

  const CREATE_TREEITEM = (data, type, parent = null) => {
    let result = {
      id: "",
      mdtID: "",
      subModelShortID: "",
      operationID: "",
      reference: "",
      label: "",
      parent: null,
      type: type,
      data: data,
      idShort: "",
      children: [],
    };

    switch (type) {
      case TreeItemType.MDT:
        result.id = data.id;
        result.mdtID = data.id;
        result.label = data.id;
        result.idShort = data.aasIdShort;
        break;
      case TreeItemType.Operations:
        result.id = parent.id + "-" + data.id;
        result.mdtID = parent.mdtID;
        result.operationID = data.id;
        result.label = data.id + " [" + data.operationType + "]";
        result.parent = parent;
        result.idShort = data.idShort;
        delete result.children;
        break;
      case TreeItemType.Parameters:
        result.id = parent.id + "-" + data.id;
        result.mdtID = parent.mdtID;
        result.reference = data.reference;
        result.label = data.id;
        result.parent = parent;
        result.idShort = data.idShort;
        delete result.children;
        break;
      case TreeItemType.SubModel:
        result.id = parent.id + "-" + data.idShort;
        result.mdtID = parent.mdtID;
        result.subModelShortID = data.idShort;
        result.label = data.idShort;
        result.parent = parent;
        result.idShort = data.idShort;
        break;
      case TreeItemType.SMC:
      case TreeItemType.SML:
        result.id = parent.id + "-" + data.idShort;
        result.mdtID = parent.mdtID;
        result.subModelShortID = parent.subModelShortID;
        result.label = data.idShort;
        result.parent = parent;
        result.idShort = data.idShort;
        break;
      case TreeItemType.Prop:
        result.id = parent.id + "-" + data.idShort;
        result.mdtID = parent.mdtID;
        result.subModelShortID = parent.subModelShortID;
        result.label = data.idShort;
        result.parent = parent;
        result.idShort = data.idShort;
        delete result.children;
        break;
      default:
        result.id = parent.id + "-" + data.idShort;
        result.mdtID = parent.mdtID;
        result.subModelShortID = parent.subModelShortID;
        result.label = data.idShort;
        result.parent = parent;
        result.idShort = data.idShort;
        delete result.children;
        break;
    }

    return result;
  };

  const CONVERT_WIDGET_TO_TREELIST = (list, parent) => {
    let resultlist = [];

    if (list) {
      list.forEach((element, idx) => {
        let modelType = element.modelType;
        let item;

        switch (modelType) {
          case TreeItemType.SMC:
          case TreeItemType.SML:
            item = CREATE_TREEITEM(element, modelType, parent);
            SET_WIDGET_INFO(item, parent, idx);

            let valuelist = element.value;

            let children = CONVERT_WIDGET_TO_TREELIST(valuelist, item);

            item.children = children;

            break;
          case TreeItemType.Prop:
            item = CREATE_TREEITEM(element, modelType, parent);
            SET_WIDGET_INFO(item, parent, idx);
            break;
          default:
            item = CREATE_TREEITEM(element, modelType, parent);
            SET_WIDGET_INFO(item, parent, idx);
            break;
        }

        if (item) {
          // console.log("item:", item);
          resultlist.push(item);
        }
      });
    }

    return resultlist;
  };

  const CONVERT_INNER_ELEMENT_TO_TREELIST = (list, parent) => {
    let resultlist = [];

    if (list) {
      list.forEach((element, idx) => {
        let modelType = element.modelType;
        let item;

        switch (modelType) {
          case TreeItemType.SMC:
          case TreeItemType.SML:
            item = CREATE_TREEITEM(element, modelType, parent);
            SET_META_INFO(item, parent, idx);

            let valuelist = element.value;

            let children = CONVERT_INNER_ELEMENT_TO_TREELIST(valuelist, item);

            item.children = children;

            break;
          case TreeItemType.Prop:
            item = CREATE_TREEITEM(element, modelType, parent);
            SET_META_INFO(item, parent, idx);
            break;
          default:
            item = CREATE_TREEITEM(element, modelType, parent);
            SET_META_INFO(item, parent, idx);
            break;
        }

        if (item) {
          // console.log("item:", item);
          resultlist.push(item);
        }
      });
    }

    return resultlist;
  };

  const CONVERT_MDTLIST_TO_TREELIST = (list) => {
    let resultlist = [];

    list.forEach((element) => {
      let item = CREATE_TREEITEM(element, TreeItemType.MDT);

      if (element.status === RunStatus.RUNNING) {
        let lst_submodels = element.submodels;

        if (lst_submodels && Array.isArray(lst_submodels)) {
          for (const submodel of lst_submodels) {
            let model = CREATE_TREEITEM(submodel, TreeItemType.SubModel, item);

            item.children.push(model);
          }

          resultlist.push(item);
        }
      }
    });

    return resultlist;
  };

  const CONVERT_OPERATION_TO_TREELIST = (list) => {
    let resultlist = [];

    list.forEach((element) => {
      let item = CREATE_TREEITEM(element, TreeItemType.MDT);

      if (element.status === RunStatus.RUNNING) {
        let lst_operations = element.operations;

        if (lst_operations && Array.isArray(lst_operations)) {
          for (const operation of lst_operations) {
            let model = CREATE_TREEITEM(
              operation,
              TreeItemType.Operations,
              item
            );

            item.children.push(model);
          }

          resultlist.push(item);
        }
      }
    });

    return resultlist;
  };

  const CONVERT_PARAMETER_TO_TREELIST = (list) => {
    let resultlist = [];

    list.forEach((element) => {
      let item = CREATE_TREEITEM(element, TreeItemType.MDT);

      if (element.status === RunStatus.RUNNING) {
        let lst_parameters = element.parameters;

        if (lst_parameters && Array.isArray(lst_parameters)) {
          for (const parameter of lst_parameters) {
            let model = CREATE_TREEITEM(
              parameter,
              TreeItemType.Parameters,
              item
            );

            item.children.push(model);
          }

          resultlist.push(item);
        }
      }
    });

    return resultlist;
  };

  const CONVERT_ALLINONE_SUBMODEL_TREEDATA = async (instance) => {
    let resultlist = [];

    if (instance.status === RunStatus.RUNNING) {
      let lst_submodels = instance.submodels;

      if (lst_submodels && Array.isArray(lst_submodels)) {
        let root = CREATE_TREEITEM(instance, TreeItemType.MDT);

        for (const submodel of lst_submodels) {
          let model = CREATE_TREEITEM(submodel, TreeItemType.SubModel, root);
          let url = instance.baseEndpoint;
          let id = model.data.id;

          const data = await REQ_SUBMODEL_INFO_WITH_CONVERT(url, id);

          let nodeItem = CONVERT_INNER_ELEMENT_TO_TREELIST(data, model);

          model.children = nodeItem;

          resultlist.push(model);
        }
      }
    }

    return resultlist;
  };

  const CONVERT_ALLINONE_PICKED_SUBMODEL_TREEDATA = async (
    instance,
    submodel
  ) => {
    let resultlist = [];

    if (instance.status === RunStatus.RUNNING) {
      if (submodel) {
        let root = CREATE_TREEITEM(instance, TreeItemType.MDT);

        let model = CREATE_TREEITEM(submodel, TreeItemType.SubModel, root);
        let url = instance.baseEndpoint;
        let id = model.data.id;

        const data = await REQ_SUBMODEL_INFO_WITH_CONVERT(url, id);

        let nodeItem = CONVERT_INNER_ELEMENT_TO_TREELIST(data, model);

        model.children = nodeItem;

        resultlist.push(model);
      }
    }

    return resultlist;
  };

  const CONVERT_WIDGET_TREEDATA = (root, treeData) => {
    let list = [];
    let rootTree = CREATE_TREEITEM(root, root.modelType, {
      id: treeData.idPath,
      idPath: treeData.idPath,
      mdtID: treeData.mdtID,
      subModelShortID: treeData.subModelShortID,
      endPoint: treeData.endPoint,
      subModelID: treeData.subModelID,
    });

    rootTree.idPath = treeData.idPath;
    rootTree.endPoint = treeData.endPoint;
    rootTree.subModelID = treeData.subModelID;
    rootTree.subModelShortID = treeData.subModelShortID;

    let datalist = [];

    if (root.modelType === TreeItemType.SubModel) {
      datalist = root.submodelElements;
    } else {
      datalist = root.value;
    }

    let nodeItem = CONVERT_WIDGET_TO_TREELIST(datalist, rootTree);

    rootTree.children = nodeItem;

    list.push(rootTree);

    return list;
  };

  // TODO---etri update
  const FIND_TWIN_ID = (node, level) => {
    if (!node || !node.data) return null;
    if (node.twinId) return node.twinId;

    level = level || 1;
    let modelType = node.data?.modelType || node.type;
    if (modelType === TreeItemType.MDT) {
      return node.data?.aasId || node.data?.id || node.id;
    } else {
      return FIND_TWIN_ID(node.parent, level + 1);
    }
  };

  const FIND_AAS_TWIN_ID = (node, level) => {
    if (!node || !node.data) return null;
    if (node.aasTwinId) return node.aasTwinId;

    level = level || 1;
    let modelType = node.data?.modelType || node.type;
    if (modelType === TreeItemType.MDT) {
      return node.data?.aasId || null;
    } else {
      return FIND_AAS_TWIN_ID(node.parent, level + 1);
    }
  };

  const FIND_AAS_TWIN_ID_SHORT = (node, level) => {
    if (!node || !node.data) return null;
    if (node.aasTwinIdShort) return node.aasTwinIdShort;

    level = level || 1;
    let modelType = node.data?.modelType || node.type;
    if (modelType === TreeItemType.MDT) {
      return node.data?.aasIdShort || null;
    } else {
      return FIND_AAS_TWIN_ID_SHORT(node.parent, level + 1);
    }
  };

  const FIND_SUBMODEL_ID_SHORT = (node) => {
    if (!node || !node.data) return null;
    if (node.submodelIdShort) return node.submodelIdShort;

    let modelType = node.data?.modelType || node.type;
    if (modelType === TreeItemType.SubModel) {
      return node.data?.idShort || node.label;
    } else {
      return FIND_SUBMODEL_ID_SHORT(node.parent);
    }
  };

  const FIND_SUBMODEL_ID = (node) => {
    if (!node || !node.data) return null;
    if (node.submodelId) return node.submodelId;

    let modelType = node.data?.modelType || node.type;
    if (modelType === TreeItemType.SubModel) {
      return node.data?.id || null;
    } else {
      return FIND_SUBMODEL_ID(node.parent);
    }
  };

  const FIND_MDT_ENDPOINT = (node) => {
    if (!node || !node.data) return null;
    if (node.endPoint) return node.endPoint;

    let modelType = node.data?.modelType || node.type;
    if (modelType === TreeItemType.MDT) {
      return node.data?.baseEndpoint || null;
    } else {
      return FIND_MDT_ENDPOINT(node.parent);
    }
  };

  const SET_WIDGET_INFO = (item, parent, idx) => {
    if (!item || !item.data || !parent) return;

    item.parent = parent;

    item.endPoint = parent.endPoint;
    item.subModelID = parent.subModelID;

    if (parent.type === TreeItemType.MDT) {
      // do nothing
    } else if (parent.type === TreeItemType.SubModel) {
      item.idPath = item.idShort;
    } else if (parent.type === TreeItemType.SML) {
      item.idPath = parent.idPath + "[" + idx + "]";
    } else {
      item.idPath = parent.idPath + "." + item.data.idShort;
    }
  };

  const SET_META_INFO = (item, parent, idx) => {
    if (!item || !item.data || !parent) return;

    item.parent = parent;
    item.data.meta = {};
    item.data.meta.twinId = FIND_TWIN_ID(parent);
    item.data.meta.aasTwinId = FIND_AAS_TWIN_ID(parent);
    item.data.meta.aasTwinIdShort = FIND_AAS_TWIN_ID_SHORT(parent);
    item.data.meta.submodelId = FIND_SUBMODEL_ID(parent);
    item.data.meta.submodelIdShort = FIND_SUBMODEL_ID_SHORT(parent);

    item.endPoint = FIND_MDT_ENDPOINT(parent);
    item.subModelID = item.data.meta.submodelId;

    if (parent.type === TreeItemType.MDT) {
      // do nothing
    } else if (parent.type === TreeItemType.SubModel) {
      item.data.meta.idPath = parent.data.idShort + "." + item.data.idShort;
      item.idPath = item.data.idShort;
    } else if (parent.data?.modelType === TreeItemType.SML) {
      item.data.meta.idPath = parent.data?.meta?.idPath + "[" + idx + "]";
      item.idPath = parent.idPath + "[" + idx + "]";
    } else {
      item.data.meta.idPath =
        parent.data?.meta?.idPath + "." + item.data.idShort;
      item.idPath = parent.idPath + "." + item.data.idShort;
    }
  };
  //--------

  return {
    CREATE_TREEITEM,
    CONVERT_MDTLIST_TO_TREELIST,
    CONVERT_OPERATION_TO_TREELIST,
    CONVERT_PARAMETER_TO_TREELIST,
    CONVERT_WIDGET_TO_TREELIST,
    CONVERT_INNER_ELEMENT_TO_TREELIST,
    CONVERT_ALLINONE_SUBMODEL_TREEDATA,
    CONVERT_ALLINONE_PICKED_SUBMODEL_TREEDATA,
    CONVERT_WIDGET_TREEDATA,
  };
};

export const useTreeConvert = () => {
  const TreeFindPath = (obj, currentPath = "root") => {
    if (typeof obj !== "object" || obj === null) return null;

    for (let [key, val] of Object.entries(obj)) {
      const nextPath = `${currentPath}-${key}`;
      const result = TreeFindPath(val, nextPath);
      if (result !== null) return result;
    }

    return null;
  };

  const TreeMakeFieldData = (data, parentKey = "") => {
    let fields = [];

    if (Array.isArray(data)) {
      data.forEach((item, idx) => {
        fields = fields.concat(TreeMakeFieldData(item, `${parentKey}[${idx}]`));
      });
    } else if (typeof data === "object" && data !== null) {
      Object.entries(data).forEach(([key, value]) => {
        const newKey = parentKey ? `${parentKey}.${key}` : key;
        fields = fields.concat(TreeMakeFieldData(value, newKey));
      });
    } else {
      fields.push({ key: parentKey, value: data });
    }

    return fields;
  };

  const TreeMakeDirectory = (origin) => {
    let mdtlist = origin.assetAdministrationShells;
    let submodellist = origin.submodels;

    let resultlist = [];

    mdtlist?.forEach((data) => {
      let mdt = {
        type: "MDT",
        label: `${data.idShort}`,
        subtitle: data.id ? data.id : null,
        data: data,
        children: [],
      };

      submodellist?.forEach((model) => {
        let submodel = TreeMakeSubmodel(model);
        mdt.children.push(submodel);
      });

      resultlist.push(mdt);
    });

    return resultlist;
  };

  const TreeMakeSubmodel = (model, parent, idx = null) => {
    let type = "SM";
    let vstype = model.modelType.toLowerCase();
    let label = idx ? `[#${idx}] ` : "";
    label += `${model.idShort}`;

    let subtitle = "";
    let idPath = model.idShort;

    let children = [];

    switch (vstype) {
      case "submodel":
        type = "SM";
        children = model.submodelElements;
        subtitle = model.id ? model.id : null;
        idPath = model.idShort;
        break;
      case "submodelelementcollection":
        type = "SMC";
        children = model.value;
        subtitle = model.id ? model.id : null;
        if (parent) {
          if (idx) {
            idPath = parent.idPath + "[" + idx + "]";
          } else {
            idPath = parent.idPath + "." + model.idShort;
          }
        }
        break;
      case "submodelelementlist":
        type = "SML";
        children = model.value;
        subtitle = model.id ? model.id : null;
        if (parent) {
          idPath = parent.idPath + "." + model.idShort;
        }
        break;
      case "property":
        type = "Prop";
        subtitle = model.value ? model.value : null;
        children = null;
        if (parent) {
          idPath = parent.idPath + "." + model.idShort;
        }
        break;
    }

    let item = {
      type: type,
      label: label,
      subtitle: subtitle,
      idPath: idPath,
      data: model,
      children: [],
    };

    if (children) {
      children.forEach((inner, index) => {
        if (type !== "SML") {
          index = null;
        }

        let innerItem = TreeMakeSubmodel(inner, item, index);
        item.children.push(innerItem);
      });
    } else {
      delete item.children;
    }

    return item;
  };

  return {
    TreeFindPath,
    TreeMakeFieldData,
    TreeMakeDirectory,
  };
};
