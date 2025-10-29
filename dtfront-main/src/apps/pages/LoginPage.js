import { login } from "apps/store/reducers/auth";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import logo_login from "assets/images/logo/logo_login.png";
import useRequestManager from "apps/utils/request_manager";
import UtilManager from "apps/utils/util_manager";
import useDialog from "apps/components/modal/useDialog";

const LoginPage = ({}) => {
  const [userid, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { IS_NULL } = UtilManager();
  const { openDialog } = useDialog();

  //#region REQUEST 관련
  const { REQ_LOGIN } = useRequestManager();

  const handleLogin = async () => {
    if (IS_NULL(userid) || IS_NULL(password)) {
      openDialog({
        title: "로그인",
        message: "아이디와 비밀번호를 입력해주세요.",
        type: "alert",
      });

      return;
    }

    const result = await REQ_LOGIN({
      userid: userid,
      password: password,
    });

    if (result.error) {
      let msg = "로그인에 실패했습니다.";

      if (result.data) {
        msg = result.data.error;
      }

      openDialog({
        title: "로그인 실패",
        message: msg,
        type: "alert",
      });
    } else {
      dispatch(login(result));
      navigate("/");
    }
  };

  //#endregion

  const handleRegister = () => {
    navigate("/register");
  };

  const activeEnter = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="page-content">
      <div className="content-wrapper">
        <div className="content-inner">
          <div className="content container-login">
            <img src={logo_login}></img>
            <div className="card pnl-login">
              <div className="card-body">
                <div className="my-4">
                  <h1 className="mb-0">회원 로그인</h1>
                  <span className="d-block text-muted">
                    아이디와 비밀번호를 입력하시고 로그인해주세요.
                  </span>
                </div>
                <div className="mb-3">
                  <label className="form-label">아이디</label>
                  <div className="form-control-feedback form-control-feedback-start">
                    <input
                      type="text"
                      className="form-control"
                      value={userid}
                      onChange={(e) => setUserId(e.target.value)}
                      placeholder="아이디를 입력하세요"
                    ></input>
                    <div className="form-control-feedback-icon">
                      <i className="ph-user-circle text-muted"></i>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">비밀번호</label>
                  <div className="form-control-feedback form-control-feedback-start">
                    <input
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => activeEnter(e)}
                      placeholder="•••••••••••"
                    ></input>
                    <div className="form-control-feedback-icon">
                      <i className="ph-lock text-muted"></i>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-default w-100 mb-3"
                  onClick={handleLogin}
                >
                  로그인
                </button>
                <button
                  type="button"
                  className="btn btn btn-outline-secondary border-0 w-100 mb-3"
                  onClick={handleRegister}
                >
                  회원가입
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
