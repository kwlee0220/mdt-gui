import usePollingRequest from "apps/hooks/usePollingRequest";
import useRequestManager from "apps/utils/request_manager";

const InstanceUpdater = () => {
  const { REQ_Instance_GET_ALL } = useRequestManager();

  const fetchInstances = async () => {
    REQ_Instance_GET_ALL(true);
  };

  // 5초마다 실행
  usePollingRequest(fetchInstances, 30000);

  return null; // UI 없이 동작만 하는 컴포넌트
};

export default InstanceUpdater;
