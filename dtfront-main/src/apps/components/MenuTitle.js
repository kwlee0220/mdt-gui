import { Link, useLocation, useNavigate } from "react-router-dom";
import clsx from "classnames";
import logo from "assets/images/logo/logo_title.png";
import React, { useEffect, useRef, useState } from "react";
import useDetectDropDown from "apps/hooks/useDetectDropDown";
import icon_user from "assets/images/icons/user_icon.png";
import { useDispatch } from "react-redux";
import { logout } from "apps/store/reducers/auth";
import useCommon from "apps/hooks/useCommon";
import useRequestManager from "apps/utils/request_manager";
import { setInstancePause } from "apps/store/reducers/common";

const MenuTitle = () => {
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split("/");
  const { current_UserID, pauseInstance } = useCommon();
  const [pause, setPause] = useState(false);

  const dispatch = useDispatch();

  const { REQ_Instance_GET_ALL } = useRequestManager();

  const pauseInstanceRef = useRef(pauseInstance);

  useEffect(() => {
    pauseInstanceRef.current = pauseInstance;
    setPause(pauseInstance);
  }, [pauseInstance]);

  const handleLogout = () => {
    dispatch(logout());

    navigate("/login");
  };

  const handlePauseInstance = () => {
    let status = false;

    if (pauseInstance) {
      status = false;
    } else {
      status = true;
    }
    dispatch(setInstancePause(status));
  };

  useEffect(() => {
    REQ_Instance_GET_ALL();

    intervalRef.current = setInterval(() => {
      if (pauseInstanceRef.current) return;

      REQ_Instance_GET_ALL(true);
    }, 3 * 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (!current_UserID || current_UserID === "") {
      navigate("/login");
    }
  }, [current_UserID]);

  return (
    <div className="navbar navbar-dark navbar-expand p-0">
      <div className="container-fluid">
        <div
          className="navbar-brand"
          style={{ width: "600px", marginLeft: "60px", padding: "0px" }}
        >
          <a href="index.html" className="d-inline-flex align-items-center">
            <img src={logo} alt="" style={{ height: "50px" }}></img>
          </a>
        </div>

        <div className="navbar-collapse collapse" id="navbar-navigation2">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link
                to="/dashboard"
                className={clsx(
                  "navbar-nav-link rounded",
                  !splitLocation.includes("instance") &&
                    !splitLocation.includes("flow")
                    ? "active"
                    : ""
                )}
              >
                DASHBOARD
                <div className="div-line"></div>
              </Link>
            </li>
            <li className="nav-item mx-3">
              <Link
                to="/instance"
                className={clsx(
                  "navbar-nav-link rounded",
                  splitLocation.includes("instance") ? "active" : ""
                )}
              >
                MDT INSTANCE
                <div className="div-line"></div>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/flow"
                className={clsx(
                  "navbar-nav-link rounded",
                  splitLocation.includes("flow") ? "active" : ""
                )}
              >
                WORKFLOW
                <div className="div-line"></div>
              </Link>
            </li>
          </ul>

          <ul className="navbar-nav flex-ycenter ms-auto">
            <li className="nav-item">
              <div
                className="navbar-nav-link navbar-nav-link-icon rounded-pill"
                style={{ width: "50px", height: "50px" }}
                onClick={handlePauseInstance}
              >
                {pause ? (
                  <i className="ph-play"></i>
                ) : (
                  <i className="ph-pause"></i>
                )}
              </div>
            </li>
            <li className="nav-item">
              <div
                className="navbar-nav-link me-3"
                onClick={() => REQ_Instance_GET_ALL(true)}
              >
                <div className="flex-ycenter">
                  <img src={icon_user}></img>
                  <div className="ms-3 fw-bold">
                    <div className="text-default">{current_UserID}</div>
                  </div>
                </div>
              </div>
            </li>
            <li className="nav-item">
              <div className="navbar-nav-link" onClick={handleLogout}>
                <i className="ph-sign-out"></i>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MenuTitle);
