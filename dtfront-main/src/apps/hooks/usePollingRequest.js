import { useEffect, useRef } from "react";

const usePollingRequest = (callback, interval, isActive = true) => {
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isActive) {
      clearInterval(intervalRef.current);
      return;
    }

    const run = async () => {
      try {
        await callback(); // 사용자 정의 요청
      } catch (error) {
        console.error("Polling request failed:", error);
      }
    };

    run(); // 최초 1회 호출

    intervalRef.current = setInterval(run, interval);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [interval, isActive, callback]); // 의존성 주의
};

export default usePollingRequest;
