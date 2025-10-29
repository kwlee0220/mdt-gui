import { TaskType, TreeItemType } from "apps/datas/definedData";
import { parse } from "iso8601-duration";
import moment from "moment";
import useRequestManager from "./request_manager";

const UtilManager = () => {
  const CloneDeep = (obj) => {
    let origin = obj;

    try {
      origin = JSON.parse(JSON.stringify(origin));
    } catch (err) {
      console.log(err);
    }

    return origin;
  };

  const ADD_COMMA = (num) => {
    if (num) {
      var regexp = /\B(?=(\d{3})+(?!\d))/g;
      return num.toString().replace(regexp, ",");
    }

    return "";
  };

  const InRange_Number = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const InRange_Float = (min, max) => {
    return (Math.random() * (max - min + 1) + min).toFixed(2);
  };

  const GET_NOW_STR = () => {
    return moment().format("YYYY-MM-DD HH:mm:ss");
  };

  const GET_DATE_TO_STR = (date, format) => {
    let result = date;

    if (result) {
      try {
        result = moment(result, "YYYYMMDD HH:mm:ss").format(format);

        if (result === "Invalid date") {
          result = date;
        }
      } catch (err) {
        console.log(err);
      }
    }

    return result;
  };

  const GET_NULL_CHECK = (data, result = "") => {
    if (data && data.length > 0) {
      return data;
    }

    return result;
  };

  const GET_Duration_To_Second = (duration) => {
    try {
      const dur = parse(duration); // { years, months, weeks, days, hours, minutes, seconds }
      return (
        dur.years * 365 * 24 * 3600 +
        dur.months * 30 * 24 * 3600 +
        dur.weeks * 7 * 24 * 3600 +
        dur.days * 24 * 3600 +
        dur.hours * 3600 +
        dur.minutes * 60 +
        dur.seconds
      );
    } catch (err) {
      console.log(err);

      return null;
    }
  };

  const IS_NULL = (data) => {
    let result = false;

    if (data === undefined || data === null || data.length === 0) {
      result = true;
    }

    return result;
  };

  const IS_NUMBER = (data) => {
    const regex = /^\d+(\.\d+)?$/;

    if (typeof data === "number") {
      return true;
    }

    if (!regex.test(data)) {
      return false;
    }

    const value = Number(data);

    if (Number.isNaN(value)) {
      return false;
    }

    return true;
  };

  const IS_INCLUDE = (base, search) => {
    let result = false;

    if (base && search) {
      if (base.toLowerCase().includes(search.toLowerCase())) {
        return true;
      }
    }

    return result;
  };

  const GET_COMPACT = (modellist) => {
    let result = "";

    let count_info = 0;
    let count_ai = 0;
    let count_sim = 0;
    let count_bhv = 0;
    let count_data = 0;
    let count_shape = 0;

    let list = [];

    if (modellist) {
      modellist.map((item) => {
        let label = item.idShort;
        let type = "";

        try {
          const match = item.semanticId.match(/\/([^\/]+)\/1\/1/);
          if (match) {
            type = match[1];
          }
        } catch (err) {
          console.log(err);
        }

        switch (type.toLowerCase()) {
          case "informationmodel":
            label = "[ Info ] " + label;
            count_info++;
            break;
          case "ai":
            label = "[ AI ] " + label;
            count_ai++;
            break;
          case "simulation":
            label = "[ Sim ] " + label;
            count_sim++;
            break;
          case "behavior":
            label = "[ Bhv ] " + label;
            count_bhv++;
            break;
          case "data":
            label = "[ Data ] " + label;
            count_data++;
            break;
          case "shape":
            label = "[ Shp ] " + label;
            count_shape++;
            break;
          default:
            break;
        }

        return label;
      });
    }
    list = [];

    if (count_info > 0) {
      list.push("Info(" + count_info + ")");
    }

    if (count_ai > 0) {
      list.push("AI(" + count_ai + ")");
    }

    if (count_sim > 0) {
      list.push("Sim(" + count_sim + ")");
    }

    if (count_bhv > 0) {
      list.push("Bhv(" + count_bhv + ")");
    }

    if (count_data > 0) {
      list.push("Data(" + count_data + ")");
    }

    if (count_shape > 0) {
      list.push("Shp(" + count_shape + ")");
    }

    result = list.join(", ");

    return result;
  };

  const GET_MODELTYPE = (item) => {
    let label = "";
    let type = "";

    try {
      const match = item.semanticId.match(/\/([^\/]+)\/1\/1/);
      if (match) {
        type = match[1];
      }
    } catch (err) {
      console.log(err);
    }

    return type;
  };

  const CONVERT_HANDLE_DATA = (id, list, field = "input") => {
    let handlelist = [];

    list.map((inner) => {
      let handle = {
        id: `handle_${field}_${id}_${inner.name}`,
        name: inner.name,
      };

      handlelist.push(handle);
    });

    return handlelist;
  };

  const IS_POSSIBLE_CONNECT = (source, target) => {
    if (source.type === target.type) {
      return false;
    }

    if (
      source.type !== TaskType.Property &&
      target.type !== TaskType.Property
    ) {
      return false;
    }

    if (
      source.type === TaskType.Property &&
      target.type === TaskType.Property
    ) {
      return false;
    }

    return true;
  };

  const SET_DATA_CONNECT = (task, property, handleId) => {
    let lst_name = handleId ? handleId.split("_") : [];
    let idShort = property.idShort;
    let list = task.variables;

    if (lst_name.length > 0) {
      let name = lst_name[lst_name.length - 1];

      list = list.map((item) => {
        if (item.name === name) {
          item["valueReference"] = {
            idShortPath: idShort,
            submodelIdShort: "",
            twinId: "",
          };
        }

        return item;
      });

      task.variables = list;
    }
  };

  const SET_DEPENDENCIES_CONNECT = (task, property, handleId) => {
    let lst_name = handleId ? handleId.split("_") : [];
    let idShort = property.idShort;
    let list = task.variables;

    if (lst_name.length > 0) {
      let name = lst_name[lst_name.length - 1];

      list = list.map((item) => {
        if (item.name === name) {
          item["valueReference"] = {
            idShortPath: idShort,
            submodelIdShort: "",
            twinId: "",
          };
        }

        return item;
      });

      task.variables = list;
    }
  };

  const CHECK_EXIST = (list, str) => {
    let exist = false;

    exist = list.some((item) => item.name === str);

    return exist;
  };

  // TODO--etri update
  const FIND_NODE = (nodes, id) => {
    if (!nodes) return null;
    return nodes.find((node) => node.id === id);
  };

  const FIND_PARENT_TASK = (nodes, edges, id) => {
    let node = FIND_NODE(nodes, id);
    if (node && node.type != TaskType.Property) return node;

    let edge = edges.find(({ source, target }) => target === id);
    if (edge) {
      return FIND_PARENT_TASK(nodes, edges, edge.source);
    } else {
      return null;
    }
  };

  const SET_DEPENDENCY = (source, target) => {
    if (source && source.data && source.data.item && source.data.item.id) {
      if (target && target.data && target.data.item) {
        target.data.item.dependencies = target.data.item.dependencies || [];
        let exist = target.data.item.dependencies.find(
          (item) => item === source.data.item.id
        );
        if (!exist) {
          target.data.item.dependencies.push(source.data.item.id);
        }
      }
    }
  };

  const SET_DEPENDENCIES = (nodes, edges) => {
    // 엣지 데이터로 그래프 및 in-degree 계산
    edges.forEach(({ source, target }, idx) => {
      let sourceNode = FIND_NODE(nodes, source);
      let targetNode = FIND_NODE(nodes, target);

      if (sourceNode && sourceNode.type === TaskType.Property) {
        sourceNode = FIND_PARENT_TASK(nodes, edges, source);
        SET_DEPENDENCY(sourceNode, targetNode);
      }
    });
  };

  const GET_PORT_NAME = (id, handle) => {
    if (!id || !handle) return null;

    const startIndex = handle.indexOf(id) + id.length + 1;
    if (startIndex === -1) return handle;

    return handle.substring(startIndex);
  };

  const SET_PORT_PROPS = (type, node, portName, props) => {
    if (!node || !portName || !props) return;

    let port = node.data.item.variables.find(
      (item) => item.kind === type && item.name === portName
    );
    if (port) {
      port.valueReference = props;
    }
  };

  const SET_VALUE_REF = (nodes, edges) => {
    if (!nodes || !edges) return;

    edges.forEach(({ source, sourceHandle, target, targetHandle }) => {
      console.log("--------------------------------");
      console.log("source:", source);
      console.log("sourceHandle:", sourceHandle);
      console.log("target:", target);
      console.log("targetHandle:", targetHandle);
      let sourceNode = FIND_NODE(nodes, source);
      let targetNode = FIND_NODE(nodes, target);

      console.log("sourceNode:", sourceNode);
      console.log("targetNode:", targetNode);

      if (sourceNode && sourceNode.type === TaskType.Property) {
        let portName = GET_PORT_NAME(target, targetHandle);
        console.log("portName:", portName);
        SET_PORT_PROPS(
          "INPUT",
          targetNode,
          portName,
          sourceNode.data?.item?.meta
        );
        console.log("targetNode:", targetNode);
      } else if (targetNode && targetNode.type === TaskType.Property) {
        let portName = GET_PORT_NAME(source, sourceHandle);
        console.log("portName:", portName);

        SET_PORT_PROPS(
          "OUTPUT",
          sourceNode,
          portName,
          targetNode.data?.item?.meta
        );
        console.log("sourceNode:", sourceNode);
      }
    });
  };
  //---

  const GET_NODE_ORDER = (nodes, edges) => {
    // TODO---etri update
    SET_DEPENDENCIES(nodes, edges);
    SET_VALUE_REF(nodes, edges);
    //---

    // 그래프 생성
    const graph = {};
    const inDegree = {};

    // 노드 초기화
    nodes.forEach((node) => {
      graph[node.id] = [];
      inDegree[node.id] = 0;
    });

    // 엣지 데이터로 그래프 및 in-degree 계산
    edges.forEach(({ source, target }) => {
      graph[source].push(target);
      inDegree[target] += 1;
    });

    // 위상 정렬 (Kahn's Algorithm)
    const queue = [];
    const order = [];

    // in-degree가 0인 노드부터 시작
    Object.keys(inDegree).forEach((node) => {
      if (inDegree[node] === 0) queue.push(node);
    });

    while (queue.length > 0) {
      const current = queue.shift();
      order.push(current);

      let xc = nodes.find((node) => node.id === current);
      graph[current].forEach((neighbor) => {
        inDegree[neighbor] -= 1;
        if (inDegree[neighbor] === 0) queue.push(neighbor);
      });
    }

    return order;
  };

  const GET_TYPE_BG_CLASS = (type) => {
    let label = "";
    let bg = "";

    switch (type) {
      case TreeItemType.MDT:
        label = "MDT";
        bg = "bg-primary";
        break;
      case TreeItemType.SubModel:
        label = "SM";
        bg = "bg-success";
        break;
      case TreeItemType.SMC:
        label = "SMC";
        bg = "bg-indigo";
        break;
      case TreeItemType.SML:
        label = "SML";
        bg = "bg-indigo";
        break;
      case TreeItemType.Prop:
        label = "Prop";
        bg = "bg-indigo";
        break;
      default:
        label = type;
        bg = "bg-indigo";
        break;
    }

    return {
      label: label,
      bg: bg,
    };
  };

  const GET_PARSING_SUBMODEL_LINK = (url, id) => {
    let path = "";

    const encodeID = btoa(id);
    path = url + "/submodels/" + encodeID + "?$value";

    return path;
  };

  const GET_PARSING_GET_LINK = (node) => {
    let path = "";
    try {
      let endpoint = node.endPoint;
      let submodelid = node.subModelID;
      let idPath = node.idPath;

      path = `${endpoint}/submodels/${btoa(
        submodelid
      )}/submodel-elements/${idPath}`;
    } catch (err) {
      console.log(err);
    }

    return path;
  };

  const GET_PARSING_UPDATE_LINK = (node) => {
    let path = "";
    try {
      let endpoint = node.endPoint;
      let submodelid = node.subModelID;
      let idPath = node.idPath;

      path = `${endpoint}/submodels/${btoa(
        submodelid
      )}/submodel-elements/${idPath}/$value`;
    } catch (err) {
      console.log(err);
    }

    return path;
  };

  const GET_TREEINFO = (node) => {
    let treeData = {
      endPoint: "",
      subModelID: "",
      idPath: "",
      mdtID: "",
      subModelShortID: "",
    };

    if (node.type === TreeItemType.SubModel) {
      treeData.endPoint = node.parent.data.baseEndpoint;
      treeData.subModelID = node.data.id;
      treeData.subModelShortID = node.subModelShortID;
      treeData.mdtID = node.mdtID;
    } else {
      treeData.endPoint = node.endPoint;
      treeData.subModelID = node.subModelID;
      treeData.subModelShortID = node.subModelShortID;
      treeData.mdtID = node.mdtID;
      treeData.idPath = `${node.idPath}`;
    }

    return treeData;
  };

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "-";

    let result = moment(dateTimeStr).format("YYYY-MM-DD HH:mm:ss");
    return result;
  };

  const IS_OBJECT = (value) => {
    return typeof value === "object" && value !== null;
  };

  return {
    IS_OBJECT,
    GET_TREEINFO,
    GET_PARSING_SUBMODEL_LINK,
    GET_PARSING_GET_LINK,
    GET_PARSING_UPDATE_LINK,
    GET_TYPE_BG_CLASS,
    GET_NODE_ORDER,
    CHECK_EXIST,
    SET_DATA_CONNECT,
    SET_DEPENDENCIES_CONNECT,
    IS_POSSIBLE_CONNECT,
    CONVERT_HANDLE_DATA,
    CloneDeep,
    GET_MODELTYPE,
    GET_DATE_TO_STR,
    GET_NOW_STR,
    GET_NULL_CHECK,
    GET_Duration_To_Second,
    IS_NULL,
    IS_NUMBER,
    InRange_Float,
    InRange_Number,
    ADD_COMMA,
    IS_INCLUDE,
    GET_COMPACT,
    SET_DEPENDENCY,
    SET_DEPENDENCIES,
    formatDateTime,
  };
};

export default UtilManager;
