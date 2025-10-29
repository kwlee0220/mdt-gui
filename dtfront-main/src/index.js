import React from "react";
import ReactDOM from "react-dom/client";

import "@xyflow/react/dist/style.css";
import "./assets/css/all.min.css";
import "./assets/css/icons/icomoon/styles.min.css";
import "./assets/css/icons/phosphor/styles.min.css";
import "./assets/css/flex.css";
import "./index.scss";
import "./assets/css/dashboard.scss";
import "./assets/css/instance.scss";
import "./assets/css/workflow.scss";

import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { store } from "./apps/store/store";
import AppRoutes from "./apps/routing/AppRoutes";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <AppRoutes />
  </Provider>
);

/*
  <Provider store={store}>
    <React.StrictMode>
      <AppRoutes />
    </React.StrictMode>
  </Provider>
    */

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
