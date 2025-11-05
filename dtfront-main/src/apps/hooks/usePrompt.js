import { useContext, useEffect } from "react";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";

const usePrompt = (
  when,
  message = "페이지를 이탈하시겠습니까? 변경사항이 저장되지 않을 수 있습니다."
) => {
  useEffect(() => {
    if (!when) return;

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [when, message]);
};

export default usePrompt;
