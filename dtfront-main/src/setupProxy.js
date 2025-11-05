const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  let path = process.env.REACT_RESTAPI_SERVER;
  let workflow = process.env.REACT_WORKFLOW_SERVER;
  let node_path = process.env.REACT_NODE_SERVER;

  app.use(
    "/proxy",
    createProxyMiddleware({
      target: path,
      changeOrigin: true,
    })
  );

  app.use(
    "/workflow",
    createProxyMiddleware({
      target: workflow,
      changeOrigin: true,
    })
  );

  app.use(
    "/node",
    createProxyMiddleware({
      target: node_path,
      changeOrigin: true,
    })
  );
};
