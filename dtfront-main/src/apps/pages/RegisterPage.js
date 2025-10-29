import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UtilManager from "apps/utils/util_manager";
import useRequestManager from "apps/utils/request_manager";
import useDialog from "apps/components/modal/useDialog";
import logo_login from "assets/images/logo/logo_login.png";

const RegisterPage = () => {
  const navigate = useNavigate();

  const { IS_NULL } = UtilManager();
  const { openDialog } = useDialog();

  //#region REQUEST 관련
  const { REQ_POST_USERS } = useRequestManager();
  const [userinfo, setUserInfo] = useState({
    userid: "",
    password: "",
    repassword: "",
    name: "",
    grade: 0,
    description: "",
    email: "",
  });

  const handleRegister = async () => {
    if (
      IS_NULL(userinfo.userid) ||
      IS_NULL(userinfo.password) ||
      IS_NULL(userinfo.repassword) ||
      IS_NULL(userinfo.name)
    ) {
      openDialog({
        title: "회원가입",
        message: "아이디, 비밀번호, 이름을 입력해주세요.",
        type: "alert",
      });

      return;
    }

    if (userinfo.password !== userinfo.repassword) {
      openDialog({
        title: "회원가입",
        message: "비밀번호가 일치하지 않습니다.",
        type: "alert",
      });

      return;
    }

    let data = { ...userinfo };

    delete data.repassword;

    const result = await REQ_POST_USERS(data);

    if (result.error) {
      let msg = "회원가입에 실패했습니다.";

      if (result.data) {
        msg = result.data.error;
      }

      openDialog({
        title: "회원가입 실패",
        message: msg,
        type: "alert",
      });

      return;
    }

    openDialog({
      title: "회원가입 완료",
      message: "회원가입이 완료되었습니다.",
      type: "alert",
    });
  };

  //#endregion

  useEffect(() => {}, []);

  const handleChanged = (e) => {
    const { name, value } = e.target;

    setUserInfo({
      ...userinfo,
      [name]: value,
    });
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="page-content">
      <div className="content-wrapper">
        <div className="content-inner">
          <div className="content container-register">
            <img src={logo_login}></img>
            <div className="card pnl-register">
              <div className="card-body">
                <div className="my-4">
                  <h1 className="mb-0">회원 정보 입력</h1>
                  <span className="d-block text-muted">
                    등록을 위한 회원정보를 입력해주세요.
                  </span>
                </div>
                <div className="row mb-3">
                  <label className="col-form-label col-3">아이디</label>
                  <div className="col-9">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="아이디를 입력하세요"
                      name="userid"
                      value={userinfo && userinfo.userid}
                      onChange={handleChanged}
                    ></input>
                  </div>
                </div>
                <div className="row mb-3">
                  <label className="col-form-label col-3">비밀번호</label>
                  <div className="col-9">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="비밀번호를 입력하세요"
                      name="password"
                      value={userinfo && userinfo.password}
                      onChange={handleChanged}
                    ></input>
                  </div>
                </div>
                <div className="row mb-3">
                  <label className="col-form-label col-3">비밀번호 확인</label>
                  <div className="col-9">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="확인용 비밀번호를 입력하세요"
                      name="repassword"
                      value={userinfo && userinfo.repassword}
                      onChange={handleChanged}
                    ></input>
                  </div>
                </div>
                <div className="row mb-3">
                  <label className="col-form-label col-3">이름</label>
                  <div className="col-9">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="이름을 입력하세요"
                      name="name"
                      value={userinfo && userinfo.name}
                      onChange={handleChanged}
                    ></input>
                  </div>
                </div>
                <div className="row mb-3">
                  <label className="col-form-label col-3">이메일</label>
                  <div className="col-9">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="이메일을 입력하세요"
                      name="email"
                      value={userinfo && userinfo.email}
                      onChange={handleChanged}
                    ></input>
                  </div>
                </div>
                <div className="row mb-3">
                  <label className="col-form-label col-3">기타</label>
                  <div className="col-9">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="기타정보를 입력하세요"
                      name="description"
                      value={userinfo && userinfo.description}
                      onChange={handleChanged}
                    ></input>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-default w-100 mb-3"
                  onClick={handleRegister}
                >
                  회원가입
                </button>
                <button
                  type="button"
                  className="btn btn btn-outline-secondary border-0 w-100 mb-3"
                  onClick={handleLogin}
                >
                  로그인 페이지로 돌아가기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
