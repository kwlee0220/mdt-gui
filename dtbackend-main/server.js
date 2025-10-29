const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 10100;

//--- argo 설정
const argo = require("./argo");
const argoClient = new argo.ApiClient();
argoClient.basePath = process.env.ARGO_BASE_URL || "http://localhost:2746";
argoClient.setVerifyingSsl(false);
argo.ApiClient.instance = argoClient;
//---
const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next(); // 다음 미들웨어로 넘기기
});

const authRoutes = require("./routes/auth_api");
const userRoutes = require("./routes/user_api");
const relationRoutes = require("./routes/relation_api");
const workflowRoutes = require("./routes/workflow_api");
const widgetRoutes = require("./routes/widget_api");

app.use("/api/auth", authRoutes);
app.use("/api/relation", relationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/argo/workflows", workflowRoutes);
app.use("/api/widget", widgetRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
