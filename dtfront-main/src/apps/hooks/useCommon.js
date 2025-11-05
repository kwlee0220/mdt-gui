import { useSelector } from "react-redux";

const useCommon = () => {
  const listWidget = useSelector((state) => state.common.listWidget);
  const current_workflow = useSelector((state) => state.common.workflow);
  const pauseInstance = useSelector((state) => state.common.pauseInstance);

  const current_IsLogin = useSelector((state) => state.auth.isAuthenticated);
  const current_UserID = useSelector((state) =>
    state.auth.user ? state.auth.user.userid : ""
  );
  const current_UserInfo = useSelector((state) => state.auth.user);

  const instanceList = useSelector((state) => state.datalist.instanceList);
  const dashboardList = useSelector((state) => state.datalist.dashboardList);
  const workflowList = useSelector((state) => state.datalist.workflowList);
  const workflowModelList = useSelector(
    (state) => state.datalist.workflowModelList
  );

  const expandRealTimePanel = useSelector(
    (state) => state.common.expandRealTimePanel
  );

  return {
    listWidget,
    current_workflow,
    current_IsLogin,
    current_UserID,
    current_UserInfo,
    instanceList,
    dashboardList,
    workflowList,
    workflowModelList,
    pauseInstance,
    expandRealTimePanel,
  };
};

export default useCommon;
