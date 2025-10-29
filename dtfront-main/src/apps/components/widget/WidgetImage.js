import { useEffect, useRef, useState } from "react";
import clsx from "classnames";
import EmptyImage from "../EmptyImage";
import UtilManager from "apps/utils/util_manager";
import useRequestManager from "apps/utils/request_manager";
import axios from "axios";

const WidgetImage = ({ item }) => {
  const intervalRef = useRef(null);

  const { IS_NULL } = UtilManager();
  const { REQ_RELATION_CALL_IMAGE } = useRequestManager();

  const [col, setCol] = useState("col-12");
  const [link, setLink] = useState("");
  const [src, setSrc] = useState();
  const [time, setTime] = useState();
  const [pause, setPause] = useState(false);

  const initData = (data) => {
    const params = JSON.parse(data.params);

    const link = params.link;
    setLink(link);
    setSrc(link);
  };

  //#region 실시간 수집데이터

  const fetchGetValue = async () => {
    const cacheBuster = `?t=${Date.now()}`;
    let result = await REQ_RELATION_CALL_IMAGE({
      url: `${link}/attachment${cacheBuster}`,
    });

    if (result) {
      try {
        const imageBlob = result;
        const imageObjectURL = URL.createObjectURL(imageBlob); // blob을 브라우저에서 쓸 수 있는 URL로 변환
        setSrc(imageObjectURL);
      } catch (err) {
        console.log(err);
        setSrc(null);
      }
    }
  };

  useEffect(() => {
    if (IS_NULL(link)) return;

    if (pause) {
      clearInterval(intervalRef.current);
    }

    fetchGetValue();

    intervalRef.current = setInterval(() => {
      if (pause) return;

      fetchGetValue();
    }, item.interval * 1000);

    return () => clearInterval(intervalRef.current);
  }, [link, pause]);

  /*
  const updateImage = () => {
    const cacheBuster = `?t=${Date.now()}`;
    setSrc(`${link}${cacheBuster}`);
  };

  useEffect(() => {
    if (IS_NULL(link)) return;

    if (pause) {
      clearInterval(intervalRef.current);
    }

    updateImage();

    intervalRef.current = setInterval(() => {
      if (pause) return;

      updateImage();
    }, item.interval * 1000);

    return () => clearInterval(intervalRef.current);
  }, [link, pause]);
  */

  //#endregion

  useEffect(() => {
    if (item) {
      initData(item);
    }
  }, [item]);

  return (
    <div className="value-wrapper">
      <div className="btn-wrapper">
        <button
          type="button"
          className="btn btn-primary btn-icon rounded-pill"
          onClick={() => setPause(!pause)}
        >
          {pause ? <i className="ph-play"></i> : <i className="ph-pause"></i>}
        </button>
      </div>
      <div className="p-3">
        {src && src.length > 0 ? (
          <img src={src} style={{ width: "100%" }}></img>
        ) : (
          <EmptyImage />
        )}
      </div>
    </div>
  );
};

export default WidgetImage;
