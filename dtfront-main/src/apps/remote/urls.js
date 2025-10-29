import http from "./client";

const urls = {
  aas: "/proxy/shell-registry/shell-descriptors",
  submodel: "/proxy/submodel-registry/submodel-descriptors",
  simulation: "/proxy/api/v1/simulation",
  instance_manager: "/proxy/instance-manager",
  instance: "/proxy/instance-manager/instances",
  workflow: "/workflow/workflow-manager",
  workflow_models: "/workflow/workflow-manager/models",
  workflow_instance: "/workflow/workflow-manager/workflows",
  workflow_builtin: "/workflow/workflow-manager/builtin-tasks",
  relation: "/node/api/relation",
  node_submodel: "/node/api/relation",
  auth: "/node/api/auth",
  users: "/node/api/users",
  widgets: "/node/api/widget",
  argo_workflow_api: "/node/api/argo/workflows",
  argo_workflow_event_api: "/node/api/argo/workflow-events",
  argo_event_api: "/node/api/argo/stream/events",
};

export default urls;

export const get_test = () => http.get("/api/list/goods");

//#region Users API
export const req_login = (data) => http.post(`${urls.auth}/login`, data);
export const get_users_all = () => http.get(`${urls.users}`);
export const get_users = (userid) => http.get(`${urls.users}/${userid}`);
export const post_users = (data) => http.post(`${urls.auth}`, data);
export const put_users = (userid, data) =>
  http.put(`${urls.users}/${userid}`, data);
export const delete_users = (userid) => http.delete(`${urls.users}/${userid}`);
//#endregion

//#region 위젯 API
export const get_widget_list = (userid) =>
  http.get(`${urls.widgets}/${userid}`);
export const add_widget = (data) => http.post(`${urls.widgets}`, data);
export const update_widget = (no, data) =>
  http.put(`${urls.widgets}/${no}`, data);
export const delete_widget = (no) => http.delete(`${urls.widgets}/${no}`);
export const change_order_widget = (data) =>
  http.post(`${urls.widgets}/changeorder`, data);

//#endregion

/**
 * AAS API
 */
export const get_aas_all = () => http.get(`${urls.aas}`);
export const get_aas = (shortId) => http.get(`${urls.ass}/?idShort=${shortId}`);

/**
 * SubModel API
 */
export const get_submodel_all = () => http.get(`${urls.submodel}`);
export const get_submodel = (shortId) =>
  http.get(`${urls.submodel}?idShort=${shortId}`);

export const get_node_relation_submodel = (data) =>
  http.post(`${urls.node_submodel}`, data);

export const get_relation = (data) => http.post(`${urls.relation}`, data);
export const get_relation_image = (data) =>
  http.post(`${urls.relation}/image`, data, {
    responseType: "blob",
  });
export const patch_relation = (data) => http.patch(`${urls.relation}`, data);
export const post_upload_relation = (data) =>
  http.post(`${urls.relation}/upload`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

/**
 * Simulation API
 */
export const get_simulation = (param) => http.get(`${urls.simulation}${param}`);
export const delete_simulation = (id, opid) =>
  http.delete(`${urls.simulation}?id=${id}&opId=${opid}`);

/**
 * Instance API
 */
export const get_instance_all = () => http.get(`${urls.instance}/model`);
export const get_instance = (id) => http.get(`${urls.instance}/${id}`);
export const add_instance = (data) => http.post(`${urls.instance}`, data);
export const delete_instance_all = () => http.delete(`${urls.instance}`);
export const delete_instance = (id) => http.delete(`${urls.instance}/${id}`);
export const start_instance = (id) => http.put(`${urls.instance}/${id}/start`);
export const stop_instance = (id) => http.put(`${urls.instance}/${id}/stop`);

export const get_instance_submodel_descriptors = (id) =>
  http.get(`${urls.instance}/${id}/submodel_descriptors`);
export const get_instance_ass_descriptor = (id) =>
  http.get(`${urls.instance}/${id}/ass_descriptor`);
export const get_instance_stdout = (id) =>
  http.get(`${urls.instance}/${id}/log`);
export const get_instance_stderr = (id) =>
  http.get(`${urls.instance}/${id}/stderr`);

export const get_start_instance = (id) =>
  http.get(`${urls.instance}/${id}/start`);
export const get_stop_instance = (id) =>
  http.get(`${urls.instance}/${id}/stop`);

export const get_instance_resolve_reference = (path) =>
  http.get(`${urls.instance_manager}/references/$url?ref=${path}`);

export const get_instance_read_reference = (path) =>
  http.get(`${urls.instance_manager}/references/$value?ref=${path}`);

export const get_instance_submodel_elements_tree = (path) =>
  http.get(`${urls.instance_manager}/submodel-element?ref=${path}`);

export const get_instance_read_submodel_elements = (path) =>
  http.get(`${urls.instance_manager}/submodel-element/$value?ref=${path}`);

export const get_reference_json = (expr) =>
  http.get(`${urls.instance_manager}/references/$json?ref=${expr}`);

export const get_variable_json = (expr) =>
  http.get(`${urls.instance_manager}/variables/$json?${expr}`);

export const get_instance_mdt_model = (id) =>
  http.get(`${urls.instance}/${id}/model`);

/**
 * Workflow API
 */
export const get_workflow_all_model = () => http.get(`${urls.workflow_models}`);
export const get_workflow_model = (id) =>
  http.get(`${urls.workflow_models}/${id}`);
export const get_workflow_model_script = (id) =>
  http.get(`${urls.workflow_models}/${id}/script`);
export const add_workflow_model = (data) =>
  http.post(`${urls.workflow_models}?updateIfExists=true`, data);
export const delete_workflow_model_all = () =>
  http.delete(`${urls.workflow_models}`);
export const delete_workflow_model = (id) =>
  http.delete(`${urls.workflow_models}/${id}`);

export const get_workflow_all = () => http.get(`${urls.workflow_instance}`);
export const get_workflow = (name) =>
  http.get(`${urls.workflow_instance}/${name}`);
export const get_workflow_log = (name, podName) =>
  http.get(`${urls.workflow_instance}/${name}/log/${podName}`);
export const delete_workflow = (name) =>
  http.delete(`${urls.workflow_instance}/${name}`);

export const start_workflow = (id) =>
  http.post(`${urls.workflow_models}/${id}/start`);
export const stop_workflow = (name) =>
  http.put(`${urls.workflow_instance}/${name}/stop`);
export const suspend_workflow = (name) =>
  http.put(`${urls.workflow_instance}/${name}/suspend`);
export const resume_workflow = (name) =>
  http.put(`${urls.workflow_instance}/${name}/resume`);

export const get_workflow_built_in_all = () =>
  http.get(`${urls.workflow_builtin}`);
export const get_workflow_built_in = (id) =>
  http.get(`${urls.workflow_builtin}/${id}`);

export const get_task_execution_time = (smref) =>
  http.post(`${urls.workflow}/execution-times/${smref}`);

//########## ARGO Workflow API V1
//
//
export const argo_workflow_create = (data) =>
  http.post(`${urls.argo_workflow_api}`, data);
export const argo_workflow_delete = (name, params) =>
  http.delete(`${urls.argo_workflow_api}/${name}`, params ? { params } : {});
export const argo_workflow_get = (name, params) =>
  http.get(`${urls.argo_workflow_api}/${name}`, params ? { params } : {});
export const argo_workflow_lint = (data) =>
  http.post(`${urls.argo_workflow_api}/lint`, data);
export const argo_workflow_list = (params) =>
  http.get(`${urls.argo_workflow_api}`, params ? { params } : {});
export const argo_workflow_pod_logs = (name, podName, params) =>
  http.get(
    `${urls.argo_workflow_api}/${name}/${podName}/log`,
    params ? { params } : {}
  );
export const argo_workflow_resubmit = (name, data) =>
  http.put(`${urls.argo_workflow_api}/${name}/resubmit`, data);
export const argo_workflow_resume = (name, data) =>
  http.put(`${urls.argo_workflow_api}/${name}/resume`, data);
export const argo_workflow_retry = (name, data) =>
  http.put(`${urls.argo_workflow_api}/${name}/retry`, data);
export const argo_workflow_set = (name, data) =>
  http.put(`${urls.argo_workflow_api}/${name}/set`, data);
export const argo_workflow_stop = (name, data) =>
  http.put(`${urls.argo_workflow_api}/${name}/stop`, data);
export const argo_workflow_submit = (data) =>
  http.post(`${urls.argo_workflow_api}/submit`, data);
export const argo_workflow_suspend = (name, data) =>
  http.put(`${urls.argo_workflow_api}/${name}/suspend`, data);
export const argo_workflow_terminate = (name, data) =>
  http.put(`${urls.argo_workflow_api}/${name}/terminate`, data);
export const argo_watch_events = (params) =>
  http.get(`${urls.argo_event_api}`, params ? { params } : {});
export const argo_watch_workflows = (params) =>
  http.get(`${urls.argo_workflow_event_api}`, params ? { params } : {});
export const argo_workflow_logs = (name, params) =>
  http.get(`${urls.argo_workflow_api}/${name}/log`, params ? { params } : {});

//##### endregion
