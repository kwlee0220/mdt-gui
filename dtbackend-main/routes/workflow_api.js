const express = require("express");
const router = express.Router();
const axios = require("axios");
const https = require("https");
const argo = require("../argo");
const { convertToArgoWorkflow } = require("../utils/workflow_utils");
const yaml = require("js-yaml");
const authenticateToken = require("../middleware/auth");

//router.use(authenticateToken);

const ARGO_NAMESPACE = process.env.ARGO_NAMESPACE;

const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // self-signed 인증서 무시
});

//--- argo_workflow_create
router.post("/", async (req, res) => {
  const json = req.body;
  console.log("[workflow create] :", JSON.stringify(json, null, 2));

  if (!json) {
    console.log("no json");
    return res.status(400).json({ message: "Workflow json is required" });
  }

  try {
    console.log("[workflow create] json: ", convertToArgoWorkflow);
    const argoWorkflow = convertToArgoWorkflow(json);
    const yamlWorkflow = yaml.dump(argoWorkflow);
    const jsonWorkflow = JSON.stringify(argoWorkflow, null, 2);
    console.log("[workflow create]  yaml:", yamlWorkflow);
    console.log("[workflow create]  json:", jsonWorkflow);

    const workflowService = new argo.WorkflowServiceApi();
    const namespace = ARGO_NAMESPACE;
    const req =
      argo.IoArgoprojWorkflowV1alpha1WorkflowCreateRequest.constructFromObject({
        namespace: namespace,
        workflow: argoWorkflow,
      });

    // Promise로 감싸서 async/await 사용 가능하도록 수정
    const requestPromise = () => {
      return new Promise((resolve, reject) => {
        workflowService.workflowServiceCreateWorkflow(
          req,
          namespace,
          (error, data, response) => {
            if (error) {
              reject(error);
            } else {
              resolve(data);
            }
          }
        );
      });
    };

    console.log("workflowSubmit call ---------------");
    const result = await requestPromise();
    console.log("workflowSubmit result:", result);

    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(error.response?.status || 500)
      .json({ message: error.message });
  }
});

//--- argo_workflow_submit
router.post("/submit", async (req, res) => {
  const json = req.body;
  console.log("[workflow submit] body=", JSON.stringify(json, null, 2));

  if (!json) {
    console.log("no json");
    return res.status(400).json({ message: "Workflow json is required" });
  }

  try {
    const workflowService = new argo.WorkflowServiceApi();
    const namespace = ARGO_NAMESPACE;

    let body = yaml.dump(json);
    body = {
      namespace,
      ...body,
    };

    const req =
      argo.IoArgoprojWorkflowV1alpha1WorkflowSubmitRequest.constructFromObject(
        body
      );
    let submitData = {
      namespace,
      resourceKind: "",
      resourceName: "",
      submitOptions: {},
    };

    const argoSubmitReq =
      argo.IoArgoprojWorkflowV1alpha1WorkflowSubmitRequest.constructFromObject(
        submitData
      );

    // Promise로 감싸서 async/await 사용 가능하도록 수정
    const requestPromise = () => {
      return new Promise((resolve, reject) => {
        workflowService.workflowServiceSubmitWorkflow(
          body,
          namespace,
          (error, data, response) => {
            if (error) {
              reject(error);
            } else {
              resolve(data);
            }
          }
        );
      });
    };

    console.log("workflowSubmit call ---------------");
    const result = await requestPromise();
    console.log("workflowSubmit result:", result);

    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(error.response?.status || 500)
      .json({ message: error.message });
  }
});

//--- argo_workflow_get
router.get("/:namespace/:name", async (req, res) => {
  try {
    const workflowService = new argo.WorkflowServiceApi();
    const { namespace, name } = req.params;

    const requestPromise = () => {
      return new Promise((resolve, reject) => {
        workflowService.workflowServiceGetWorkflow(
          name,
          namespace,
          (error, data, response) => {
            if (error) {
              reject(error);
            } else {
              resolve(data);
            }
          }
        );
      });
    };

    const response = await requestPromise();
    console.log("list response:", response);

    return res.status(response.status).json(response.data);
  } catch (error) {
    return res
      .status(error.response?.status || 500)
      .json({ message: error.message });
  }
});

module.exports = router;
