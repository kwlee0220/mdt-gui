import useCommon from "apps/hooks/useCommon";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { current_IsLogin } = useCommon();

  if (!current_IsLogin) {
    return <Navigate to="/login" replace />;
  }

  console.log("PrivateRoute change");

  return children;
};

export default PrivateRoute;
