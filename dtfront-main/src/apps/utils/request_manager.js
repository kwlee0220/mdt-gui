import useCommon from "apps/hooks/useCommon";
import {
  get_aas,
  get_submodel,
  get_node_relation_submodel,
  get_simulation,
  delete_simulation,
  get_instance,
  get_instance_all,
  start_instance,
  stop_instance,
  get_instance_ass_descriptor,
  get_instance_stderr,
  get_instance_stdout,
  get_instance_submodel_descriptors,
  req_login,
  get_users_all,
  get_users,
  post_users,
  put_users,
  delete_users,
  delete_instance,
  add_instance,
  get_instance_resolve_reference,
  get_instance_read_reference,
  get_variable_json,
  get_instance_mdt_model,

  // Workflow API
  get_workflow_all_model,
  get_workflow_model,
  get_workflow_model_script,
  add_workflow_model,
  delete_workflow_model_all,
  delete_workflow_model,
  get_workflow_all,
  get_workflow,
  get_workflow_log,
  delete_workflow,
  start_workflow,
  stop_workflow,
  suspend_workflow,
  resume_workflow,

  // Argo Workflow API
  argo_workflow_create,
  argo_workflow_delete,
  argo_workflow_get,
  argo_workflow_lint,
  argo_workflow_list,
  argo_workflow_pod_logs,
  argo_workflow_resubmit,
  argo_workflow_resume,
  argo_workflow_retry,
  argo_workflow_set,
  argo_workflow_stop,
  argo_workflow_submit,
  argo_workflow_suspend,
  argo_workflow_terminate,
  argo_watch_events,
  argo_watch_workflows,
  argo_workflow_logs,
  get_widget_list,
  add_widget,
  update_widget,
  delete_widget,
  get_relation,
  patch_relation,
  post_upload_relation,
  change_order_widget,
  get_relation_image,
  get_reference_json,
  get_task_execution_time,
  get_instance_read_submodel_elements,
  get_instance_submodel_elements_tree,
} from "apps/remote/urls";
import { setListWidget } from "apps/store/reducers/common";
import {
  setInstanceList,
  setWorkflowList,
  setWorkflowModelList,
  updateInstanceList,
} from "apps/store/reducers/datalist";
import { useDispatch } from "react-redux";
import UtilManager from "./util_manager";
import useDialog from "apps/components/modal/useDialog";

const useRequestManager = () => {
  const dispatch = useDispatch();
  const { current_UserID } = useCommon();

  const { openDialog } = useDialog();
  const { GET_PARSING_SUBMODEL_LINK } = UtilManager();

  const ShowErrorAlert = (resp) => {
    let msg = resp.data;
    let title = `${resp.status} : ${resp.statusText}`;

    if (msg.message || msg.code) {
      msg = `${msg.code ? msg.code : ""} : ${msg.message}`;
    }

    openDialog({
      title: title,
      message: msg,
      type: "alert",
    });
  };

  const GET_RESULT = (resp) => {
    let result = {
      error: "Error",
      status: resp.status,
      data: resp.data,
    };

    return result;
  };

  //#region Auth API

  const REQ_LOGIN = async (data) => {
    let result;

    try {
      const resp = await req_login(data);
      const resp_data = resp.data;

      result = resp_data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_LOGIN ERROR", e.response);

        result = GET_RESULT(e.response);
      }
    }

    return result;
  };

  //#endregion

  // 안전하게 path parameter 인코딩
  const encodePath = (path) => {
    return encodeURIComponent(path);
  };

  //#region Users API

  const REQ_GET_USERS_ALL = async () => {
    let result;

    try {
      const resp = await get_users_all();
      const resp_data = resp.data;

      result = resp_data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_GET_USERS_ALL ERROR", e.response);

        result = GET_RESULT(e.response);
      }
    }

    return result;
  };

  const REQ_GET_USERS = async (userid) => {
    let result;

    try {
      const resp = await get_users(userid);
      const resp_data = resp.data;

      result = resp_data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_GET_USERS ERROR", e.response);

        result = GET_RESULT(e.response);
      }
    }

    return result;
  };

  const REQ_POST_USERS = async (data) => {
    let result;

    try {
      const resp = await post_users(data);
      const resp_data = resp.data;

      result = resp_data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_POST_USERS ERROR", e.response);

        result = GET_RESULT(e.response);
      }
    }

    return result;
  };

  const REQ_PUT_USERS = async (userid, data) => {
    let result;

    try {
      const resp = await put_users(userid, data);
      const resp_data = resp.data;

      result = resp_data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_PUT_USERS ERROR", e.response);

        result = GET_RESULT(e.response);
      }
    }

    return result;
  };

  const REQ_DELETE_USERS = async (userid) => {
    let result;

    try {
      const resp = await delete_users(userid);
      const resp_data = resp.data;

      result = resp_data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_DELETE_USERS ERROR", e.response);

        result = GET_RESULT(e.response);
      }
    }

    return result;
  };

  //#endregion

  //#region 위젯 API

  const REQ_Widget_List = async (userid) => {
    let result;

    try {
      const resp = await get_widget_list(userid);
      const resp_data = resp.data;

      result = resp_data;

      dispatch(setListWidget(result));
    } catch (e) {
      if (e.response) {
        console.log("REQ_Widget_List ERROR", e.response);

        result = GET_RESULT(e.response);
      }
    }

    return result;
  };

  const REQ_Widget_Add = async (data) => {
    let result;

    try {
      const resp = await add_widget(data);
      const resp_data = resp.data;

      result = resp_data;

      REQ_Widget_List(current_UserID);
    } catch (e) {
      if (e.response) {
        console.log("REQ_Widget_Add ERROR", e.response);

        result = GET_RESULT(e.response);
      }
    }

    return result;
  };

  const REQ_Widget_Update = async (no, data) => {
    let result;

    try {
      const resp = await update_widget(no, data);
      const resp_data = resp.data;

      result = resp_data;

      REQ_Widget_List(current_UserID);
    } catch (e) {
      if (e.response) {
        console.log("REQ_Widget_Update ERROR", e.response);

        result = GET_RESULT(e.response);
      }
    }

    return result;
  };

  const REQ_Widget_Delete = async (no) => {
    let result;

    try {
      const resp = await delete_widget(no);
      const resp_data = resp.data;

      result = resp_data;

      REQ_Widget_List(current_UserID);
    } catch (e) {
      if (e.response) {
        console.log("REQ_Widget_Delete ERROR", e.response);

        result = GET_RESULT(e.response);
      }
    }

    return result;
  };

  const REQ_Widget_Change_Order = async (list) => {
    let result;

    try {
      const resp = await change_order_widget(list);
      const resp_data = resp.data;

      result = resp_data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_Widget_Add ERROR", e.response);

        result = GET_RESULT(e.response);
      }
    }

    return result;
  };

  //#endregion

  //#region AAS API

  const REQ_AAS_GET = async (id) => {
    let result;

    try {
      const resp = await get_aas(id);
      const resp_data = resp.data;

      result = resp_data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_AAS_GET ERROR", e.response);
      }
    }

    return result;
  };

  //#endregion

  //#region SubModel API

  const REQ_SUBMODEL_INFO_WITH_CONVERT = async (url, id) => {
    const path = GET_PARSING_SUBMODEL_LINK(url, id);

    let result = await REQ_Node_SubModel_GET({
      url: path,
    });

    let resultlist = [];

    if (result && result.submodelElements) {
      resultlist = result.submodelElements;
    }

    return resultlist;
  };

  const REQ_SubModel_GET = async (id) => {
    let result;

    try {
      const resp = await get_submodel(id);
      const resp_data = resp.data;

      result = resp_data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_SubModel_GET ERROR", e.response);
      }
    }

    return result;
  };

  const REQ_Node_SubModel_GET = async (data) => {
    let result;

    try {
      const resp = await get_node_relation_submodel(data);
      const resp_data = resp.data;

      result = resp_data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_Node_SubModel_GET ERROR", e.response);
      }
    }

    return result;
  };

  //#endregion

  //#region Relation

  const REQ_RELATION_CALL = async (data) => {
    let result;

    try {
      const resp = await get_relation(data);
      const resp_data = resp.data;

      result = resp_data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_RELATION_CALL ERROR", e.response);
      }
    }

    return result;
  };

  const REQ_RELATION_CALL_IMAGE = async (data) => {
    let result;

    try {
      const resp = await get_relation_image(data);
      const resp_data = resp.data;

      result = resp_data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_RELATION_CALL_IMAGE ERROR", e.response);
      }
    }

    return result;
  };

  const REQ_RELATION_PATCH = async (data) => {
    let result;

    try {
      const resp = await patch_relation(data);
      const resp_data = resp.data;

      result = resp_data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_RELATION_PATCH ERROR", e.response);
        let err = e.response;

        result = {
          status: err.status,
          text: err.statusText,
        };
      }
    }

    return result;
  };

  const REQ_RELATION_UPLOAD = async (data) => {
    let result;

    try {
      const resp = await post_upload_relation(data);
      const resp_data = resp.data;

      result = resp_data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_RELATION_UPLOAD ERROR", e.response);
      }
    }

    return result;
  };

  //#endregion

  //#region Simulation API

  const REQ_Simulation_GET = async (param) => {
    let result;

    try {
      const resp = await get_simulation(param);
      const resp_data = resp.data;

      result = resp_data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_Simulation_GET ERROR", e.response);
      }
    }

    return result;
  };

  const REQ_Simulation_DELETE = async (id, opid) => {
    let result;

    try {
      const resp = await delete_simulation(id, opid);
      const resp_data = resp.data;

      result = resp_data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_Simulation_DELETE ERROR", e.response);
      }
    }

    return result;
  };

  //#endregion

  //#region Instance API

  const REQ_Instance_GET = async (id) => {
    let result;

    try {
      const resp = await get_instance(id);
      const resp_data = resp.data;

      result = resp_data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_Instance_GET ERROR", e.response);
      }
    }

    return result;
  };

  const REQ_Instance_GET_ALL = async (refresh = false) => {
    let result;

    try {
      const resp = await get_instance_all();
      const resp_data = resp.data;

      result = resp_data;

      if (refresh) {
        dispatch(updateInstanceList(result));
      } else {
        dispatch(setInstanceList(result));
      }
    } catch (e) {
      if (e.response) {
        console.log("REQ_Instance_GET_ALL ERROR", e.response);
      }
    }

    return result;
  };

  const REQ_Instance_START = async (id) => {
    let result;

    try {
      const resp = await start_instance(id);
      const resp_data = resp.data;

      result = resp_data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_Instance_START ERROR", e.response);
      }
    }

    return result;
  };

  const REQ_Instance_STOP = async (id) => {
    let result;

    try {
      const resp = await stop_instance(id);
      const resp_data = resp.data;

      result = resp_data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_Instance_STOP ERROR", e.response);
      }
    }

    return result;
  };

  const REQ_Instance_ADD = async (formData) => {
    let result;

    try {
      const resp = await add_instance(formData);
      const resp_data = resp.data;

      result = resp_data;

      REQ_Instance_GET_ALL(true);
    } catch (e) {
      if (e.response) {
        console.log("REQ_Instance_ADD ERROR", e.response);
        const errorMessage =
          e.response.data?.message ||
          e.response.data?.error ||
          e.response.statusText ||
          "인스턴스 추가 중 오류가 발생했습니다.";
        throw new Error(errorMessage);
      }
      throw e;
    }

    return result;
  };

  const REQ_Instance_DELETE = async (id) => {
    let result;

    try {
      const resp = await delete_instance(id);
      const resp_data = resp.data;

      result = resp_data;

      REQ_Instance_GET_ALL(true);
    } catch (e) {
      if (e.response) {
        console.log("REQ_Instance_DELETE ERROR", e.response);
      }
    }

    return result;
  };

  const REQ_Instance_GET_Submodel_Descriptors = async (id) => {
    let result;

    try {
      const resp = await get_instance_submodel_descriptors(id);
      const resp_data = resp.data;

      result = resp_data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_Instance_GET_Submodel_Descriptors ERROR", e.response);
      }
    }

    return result;
  };

  const REQ_Instance_GET_Ass_Descriptor = async (id) => {
    let result;

    try {
      const resp = await get_instance_ass_descriptor(id);
      const resp_data = resp.data;

      result = resp_data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_Instance_GET_Ass_Descriptor ERROR", e.response);
      }
    }

    return result;
  };

  const REQ_Instance_GET_Stdout = async (id) => {
    let result;

    try {
      const resp = await get_instance_stdout(id);
      const resp_data = resp.data;

      result = resp_data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_Instance_GET_Stdout ERROR", e.response);
      }
    }

    return result;
  };

  const REQ_Instance_GET_Stderr = async (id) => {
    let result;

    try {
      const resp = await get_instance_stderr(id);
      const resp_data = resp.data;

      result = resp_data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_Instance_GET_Stderr ERROR", e.response);
      }
    }

    return result;
  };

  const REQ_Instance_Resolve_Reference_GET = async (path) => {
    let result;

    try {
      const ec_path = encodePath(path);
      const resp = await get_instance_resolve_reference(ec_path);
      const resp_data = resp.data;

      if (resp_data) {
        result = resp_data;
      }
    } catch (e) {
      if (e.response) {
        console.log("REQ_Instance_Resolve_Reference_GET ERROR", e.response);
      }
    }

    return result;
  };

  const REQ_Instance_Read_Reference_GET = async (path) => {
    let result;

    try {
      const ec_path = encodePath(path);
      const resp = await get_instance_read_reference(ec_path);
      const resp_data = resp.data;

      if (resp_data.Records) {
        result = resp_data.Records;
      }
    } catch (e) {
      if (e.response) {
        console.log("REQ_Instance_Read_Reference_GET ERROR", e.response);
      }
    }

    return result;
  };

  const REQ_Instance_SubModel_Elements_Tree = async (path) => {
    let result;

    try {
      const ec_path = encodePath(path);
      const resp = await get_instance_submodel_elements_tree(ec_path);
      const resp_data = resp.data;

      if (resp_data) {
        result = resp_data;
      }
    } catch (e) {
      if (e.response) {
        console.log("REQ_Instance_SubModel_Elements_Tree ERROR", e.response);
      }
    }

    return result;
  };

  const REQ_Instance_Read_SubModel_Elements_GET = async (path) => {
    let result;

    try {
      const ec_path = encodePath(path);
      const resp = await get_instance_read_submodel_elements(ec_path);
      const resp_data = resp.data;

      if (resp_data.Records) {
        result = resp_data.Records;
      }
    } catch (e) {
      if (e.response) {
        console.log(
          "REQ_Instance_Read_SubModel_Elements_GET ERROR",
          e.response
        );
      }
    }

    return result;
  };

  //#endregion

  const REQ_GET_Variables_JSON = async (name, expr, isvalue = true) => {
    let result;

    try {
      const ec_path = encodePath(expr);
      const resp = await get_variable_json(
        isvalue
          ? `value=${ec_path}&name=${name}`
          : `ref=${ec_path}&name=${name}`
      );
      const resp_data = resp.data;

      result = resp_data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_GET_Variables_JSON ERROR", e.response);
      }
    }

    return result;
  };

  const REQ_GET_Reference_JSON = async (expr) => {
    let result;

    try {
      const ec_path = encodePath(expr);
      const resp = await get_reference_json(ec_path);
      const resp_data = resp.data;

      result = resp_data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_GET_Reference_JSON ERROR", e.response);
      }
    }

    return result;
  };

  const REQ_GET_Instance_MDT_Model = async (mdtid) => {
    let result;

    try {
      const resp = await get_instance_mdt_model(mdtid);
      const resp_data = resp.data;

      result = resp_data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_GET_Instance_MDT_Model ERROR", e.response);
      }
    }

    return result;
  };

  //#region Workflow API

  const REQ_GET_Workflow_Model_ALL = async () => {
    let result;

    try {
      const resp = await get_workflow_all_model();
      const resp_data = resp.data;

      result = resp_data;

      dispatch(setWorkflowModelList(result));
    } catch (e) {
      if (e.response) {
        console.log("REQ_GET_Workflow_Model_ALL ERROR", e.response);
      }
    }

    return result;
  };

  const REQ_GET_Workflow_Model = async (id) => {
    let result;
    try {
      const resp = await get_workflow_model(id);
      result = resp.data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_GET_Workflow_Model ERROR", e.response);
      }
    }
    return result;
  };

  const REQ_GET_Workflow_Model_Script = async (id) => {
    let result;
    try {
      const resp = await get_workflow_model_script(id);
      result = resp.data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_GET_Workflow_Model_Script ERROR", e.response);
      }
    }
    return result;
  };

  const REQ_ADD_Workflow_Model = async (data) => {
    let result;
    try {
      const resp = await add_workflow_model(data);
      result = resp.data;

      REQ_GET_Workflow_Model_ALL();
    } catch (e) {
      if (e.response) {
        console.log("REQ_ADD_Workflow_Model ERROR", e.response);

        //ShowErrorAlert(e.response);
      }
    }
    return result;
  };

  const REQ_DELETE_Workflow_Model_ALL = async (name) => {
    let result;
    try {
      const resp = await delete_workflow_model_all(name);
      result = resp.data;

      REQ_GET_Workflow_Model_ALL();
    } catch (e) {
      if (e.response) {
        console.log("REQ_DELETE_Workflow_Model_ALL ERROR", e.response);

        //ShowErrorAlert(e.response);
      }
    }
    return result;
  };

  const REQ_DELETE_Workflow_Model = async (name) => {
    let result;
    try {
      const resp = await delete_workflow_model(name);
      result = resp.data;

      REQ_GET_Workflow_Model_ALL();
    } catch (e) {
      if (e.response) {
        console.log("REQ_DELETE_Workflow_Model ERROR", e.response);

        //ShowErrorAlert(e.response);
      }
    }
    return result;
  };

  const REQ_GET_Workflow_ALL = async () => {
    let result;
    try {
      const resp = await get_workflow_all();
      result = resp.data;

      dispatch(setWorkflowList(result));
    } catch (e) {
      if (e.response) {
        console.log("REQ_GET_Workflow_ALL ERROR", e.response);

        //ShowErrorAlert(e.response);
      }
    }
    return result;
  };

  const REQ_GET_Workflow = async (name) => {
    let result;
    try {
      const resp = await get_workflow(name);
      result = resp.data;

      if (result) {
        dispatch(setWorkflowList(result));
      }
    } catch (e) {
      if (e.response) {
        console.log("REQ_GET_Workflow ERROR", e.response);
      }
    }
    return result;
  };

  const REQ_GET_Workflow_LOG = async (name, podName) => {
    let result;
    try {
      const resp = await get_workflow_log(name, podName);
      result = resp.data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_GET_Workflow_LOG ERROR", e.response);
      }
    }
    return result;
  };

  const REQ_DELETE_Workflow = async (name) => {
    let result;
    try {
      const resp = await delete_workflow(name);
      result = resp.data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_DELETE_Workflow ERROR", e.response);
      }
    }
    return result;
  };

  const REQ_START_Workflow = async (id) => {
    let result;
    try {
      const resp = await start_workflow(id);
      result = resp.data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_START_Workflow ERROR", e.response);
      }
    }
    return result;
  };

  const REQ_STOP_Workflow = async (name) => {
    let result;
    try {
      const resp = await stop_workflow(name);
      result = resp.data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_STOP_Workflow ERROR", e.response);
      }
    }
    return result;
  };

  const REQ_SUSPEND_Workflow = async (name) => {
    let result;
    try {
      const resp = await suspend_workflow(name);
      result = resp.data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_SUSPEND_Workflow ERROR", e.response);
      }
    }
    return result;
  };

  const REQ_RESUME_Workflow = async (name) => {
    let result;
    try {
      const resp = await resume_workflow(name);
      result = resp.data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_RESUME_Workflow ERROR", e.response);
      }
    }
    return result;
  };

  const REQ_GET_EXECUTION_TIME = async (smref) => {
    let result;
    try {
      const resp = await get_task_execution_time(smref);
      result = resp.data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_GET_EXECUTION_TIME ERROR", e.response);
      }
    }
    return result;
  };

  //#endregion

  //#region Workflow API V1
  const REQ_Argo_Workflow_Create = async (data) => {
    let result;
    try {
      const resp = await argo_workflow_create(data);
      result = resp.data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_Argo_Workflow_Create ERROR", e.response);
        result = GET_RESULT(e.response);
      }
    }
    return result;
  };

  const REQ_Argo_Workflow_Delete = async (name, params) => {
    let result;
    try {
      const resp = await argo_workflow_delete(name, params);
      result = resp.data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_Argo_Workflow_Delete ERROR", e.response);
        result = GET_RESULT(e.response);
      }
    }
    return result;
  };

  const REQ_Argo_Workflow_Get = async (name, params) => {
    let result;
    try {
      const resp = await argo_workflow_get(name, params);
      result = resp.data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_Argo_Workflow_Get ERROR", e.response);
        result = GET_RESULT(e.response);
      }
    }
    return result;
  };

  const REQ_Argo_Workflow_Lint = async (data) => {
    let result;
    try {
      const resp = await argo_workflow_lint(data);
      result = resp.data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_Argo_Workflow_Lint ERROR", e.response);
        result = GET_RESULT(e.response);
      }
    }
    return result;
  };

  const REQ_Argo_Workflow_List = async (params) => {
    let result;
    try {
      const resp = await argo_workflow_list(params);
      result = resp.data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_Argo_Workflow_List ERROR", e.response);
        result = GET_RESULT(e.response);
      }
    }
    return result;
  };

  const REQ_Argo_Workflow_Pod_Logs = async (name, podName, params) => {
    let result;
    try {
      const resp = await argo_workflow_pod_logs(name, podName, params);
      result = resp.data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_Argo_Workflow_Pod_Logs ERROR", e.response);
        result = GET_RESULT(e.response);
      }
    }
    return result;
  };

  const REQ_Argo_Workflow_Resubmit = async (name, data) => {
    let result;
    try {
      const resp = await argo_workflow_resubmit(name, data);
      result = resp.data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_Argo_Workflow_Resubmit ERROR", e.response);
        result = GET_RESULT(e.response);
      }
    }
    return result;
  };

  const REQ_Argo_Workflow_Resume = async (name, data) => {
    let result;
    try {
      const resp = await argo_workflow_resume(name, data);
      result = resp.data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_Argo_Workflow_Resume ERROR", e.response);
        result = GET_RESULT(e.response);
      }
    }
    return result;
  };

  const REQ_Argo_Workflow_Retry = async (name, data) => {
    let result;
    try {
      const resp = await argo_workflow_retry(name, data);
      result = resp.data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_Argo_Workflow_Retry ERROR", e.response);
        result = GET_RESULT(e.response);
      }
    }
    return result;
  };

  const REQ_Argo_Workflow_Set = async (name, data) => {
    let result;
    try {
      const resp = await argo_workflow_set(name, data);
      result = resp.data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_Argo_Workflow_Set ERROR", e.response);
        result = GET_RESULT(e.response);
      }
    }
    return result;
  };

  const REQ_Argo_Workflow_Stop = async (name, data) => {
    let result;
    try {
      const resp = await argo_workflow_stop(name, data);
      result = resp.data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_Argo_Workflow_Stop ERROR", e.response);
        result = GET_RESULT(e.response);
      }
    }
    return result;
  };

  const REQ_Argo_Workflow_Submit = async (data) => {
    let result;
    try {
      const resp = await argo_workflow_submit(data);
      result = resp.data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_Argo_Workflow_Submit ERROR", e.response);
        result = GET_RESULT(e.response);
      }
    }
    return result;
  };

  const REQ_Argo_Workflow_Suspend = async (name, data) => {
    let result;
    try {
      const resp = await argo_workflow_suspend(name, data);
      result = resp.data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_Argo_Workflow_Suspend ERROR", e.response);
        result = GET_RESULT(e.response);
      }
    }
    return result;
  };

  const REQ_Argo_Workflow_Terminate = async (name, data) => {
    let result;
    try {
      const resp = await argo_workflow_terminate(name, data);
      result = resp.data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_Argo_Workflow_Terminate ERROR", e.response);
        result = GET_RESULT(e.response);
      }
    }
    return result;
  };

  const REQ_Argo_Watch_Events = async (params) => {
    let result;
    try {
      const resp = await argo_watch_events(params);
      result = resp.data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_Argo_Watch_Events ERROR", e.response);
        result = GET_RESULT(e.response);
      }
    }
    return result;
  };

  const REQ_Argo_Watch_Workflows = async (params) => {
    let result;
    try {
      const resp = await argo_watch_workflows(params);
      result = resp.data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_Argo_Watch_Workflows ERROR", e.response);
        result = GET_RESULT(e.response);
      }
    }
    return result;
  };

  const REQ_Argo_Workflow_Logs = async (name, params) => {
    let result;
    try {
      const resp = await argo_workflow_logs(name, params);
      result = resp.data;
    } catch (e) {
      if (e.response) {
        console.log("REQ_Argo_Workflow_Logs ERROR", e.response);
        result = GET_RESULT(e.response);
      }
    }
    return result;
  };

  //#endregion

  //---
  return {
    // Auth API
    REQ_LOGIN,

    // Users API
    REQ_GET_USERS_ALL,
    REQ_GET_USERS,
    REQ_POST_USERS,
    REQ_PUT_USERS,
    REQ_DELETE_USERS,

    REQ_AAS_GET,

    // 위젯 API
    REQ_Widget_List,
    REQ_Widget_Add,
    REQ_Widget_Update,
    REQ_Widget_Delete,
    REQ_Widget_Change_Order,

    // Instance API
    REQ_Instance_GET,
    REQ_Instance_GET_ALL,
    REQ_Instance_START,
    REQ_Instance_STOP,
    REQ_Instance_ADD,
    REQ_Instance_DELETE,
    REQ_Instance_GET_Ass_Descriptor,
    REQ_Instance_GET_Submodel_Descriptors,
    REQ_Instance_GET_Stdout,
    REQ_Instance_GET_Stderr,
    REQ_Simulation_DELETE,
    REQ_Simulation_GET,
    REQ_SubModel_GET,

    REQ_Instance_Resolve_Reference_GET,
    REQ_Instance_Read_Reference_GET,
    REQ_Instance_SubModel_Elements_Tree,
    REQ_Instance_Read_SubModel_Elements_GET,

    REQ_GET_Variables_JSON,
    REQ_GET_Reference_JSON,
    REQ_GET_Instance_MDT_Model,

    // SubModel Info API
    REQ_SUBMODEL_INFO_WITH_CONVERT,
    REQ_Node_SubModel_GET,

    REQ_RELATION_CALL,
    REQ_RELATION_CALL_IMAGE,
    REQ_RELATION_PATCH,
    REQ_RELATION_UPLOAD,

    // Workflow API
    REQ_GET_Workflow_Model_ALL,
    REQ_GET_Workflow_Model,
    REQ_GET_Workflow_Model_Script,
    REQ_ADD_Workflow_Model,
    REQ_DELETE_Workflow_Model_ALL,
    REQ_DELETE_Workflow_Model,
    REQ_GET_Workflow_ALL,
    REQ_GET_Workflow,
    REQ_GET_Workflow_LOG,
    REQ_DELETE_Workflow,
    REQ_START_Workflow,
    REQ_STOP_Workflow,
    REQ_SUSPEND_Workflow,
    REQ_RESUME_Workflow,

    REQ_GET_EXECUTION_TIME,

    // Workflow API V1
    REQ_Argo_Workflow_Create,
    REQ_Argo_Workflow_Delete,
    REQ_Argo_Workflow_Get,
    REQ_Argo_Workflow_Lint,
    REQ_Argo_Workflow_List,
    REQ_Argo_Workflow_Pod_Logs,
    REQ_Argo_Workflow_Resubmit,
    REQ_Argo_Workflow_Resume,
    REQ_Argo_Workflow_Retry,
    REQ_Argo_Workflow_Set,
    REQ_Argo_Workflow_Stop,
    REQ_Argo_Workflow_Submit,
    REQ_Argo_Workflow_Suspend,
    REQ_Argo_Workflow_Terminate,
    REQ_Argo_Watch_Events,
    REQ_Argo_Watch_Workflows,
    REQ_Argo_Workflow_Logs,
  };
};

export default useRequestManager;
