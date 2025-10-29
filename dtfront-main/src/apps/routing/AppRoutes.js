import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import App from "../../App";
import LoginPage from "../pages/LoginPage";
import { useState } from "react";
import DashboardPage from "../pages/DashboardPage";
import MDTInstancePage from "apps/pages/MDTInstancePage";
import { useDispatch } from "react-redux";
import { login } from "apps/store/reducers/auth";
import PrivateRoute from "./PrivateRoute";
import MenuTitle from "apps/components/MenuTitle";
import RegisterPage from "apps/pages/RegisterPage";
import useCommon from "apps/hooks/useCommon";
import WorkflowManagerPage from "apps/pages/WorkflowManagerPage";
import InstanceUpdater from "apps/components/InstanceUpdater";

/*
const MainLayout = () => {
  return (
    <PrivateRoute>
      <div style={{ flex: 1 }}>
        <MenuTitle></MenuTitle>
        <Outlet></Outlet>
      </div>
    </PrivateRoute>
  );
};
*/
const MainLayout = () => {
  return (
    <div style={{ flex: 1 }}>
      <MenuTitle></MenuTitle>
      <Outlet></Outlet>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/*" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<DashboardPage></DashboardPage>} />
            <Route path="instance" element={<MDTInstancePage />} />
            <Route path="flow" element={<WorkflowManagerPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
