import React, { useEffect, useState } from "react";
import clsx from "classnames";
import ELE_KeyValue from "./ELE_KeyValue";
import UtilManager from "apps/utils/util_manager";
import ELE_ValueList from "./ELE_ValueList";
import { TreeItemType } from "apps/datas/definedData";
import ELE_KeyValueModify from "./ELE_KeyValueModify";
import useDialog from "../modal/useDialog";
import useRequestManager from "apps/utils/request_manager";
import useModal from "../modal/useModal";
import AlertModal from "../modal/AlertModal";
import ConfirmModal from "../modal/ConfirmModal";
import ELE_FileModify from "./ELE_FileModify";
import ELE_Value from "./ELE_Value";

const baseData = {
  modelType: "",
  modelTypeShort: "",
  bg: "",
  idShort: "",
  id: "",
  idPath: "",
  value: "",
  valueType: "",
};

const ELE_View = ({ item, handleChange }) => {
  const { GET_TYPE_BG_CLASS, GET_PARSING_UPDATE_LINK, GET_PARSING_GET_LINK } =
    UtilManager();
  const { CloneDeep } = UtilManager();
  const { REQ_RELATION_PATCH, REQ_RELATION_UPLOAD } = useRequestManager();
  const { openDialog } = useDialog();

  const [dataInfo, setDataInfo] = useState(baseData);

  const convertData = (data) => {
    let bg = GET_TYPE_BG_CLASS(data.type);
    let info = CloneDeep(baseData);

    info.bg = bg.bg;
    info.modelTypeShort = bg.label;
    info.modelType = data.type;
    info.type = data.type;
    info.id = data.data.id;
    info.idShort = data.idShort;

    if (data.type === TreeItemType.MDT) {
    } else if (data.type === TreeItemType.SubModel) {
      info.idPath = data.idShort;
    } else {
      info.idPath = data.idPath;

      if (data.type !== TreeItemType.SMC && data.type !== TreeItemType.SML) {
        info.value = data.data.value ? data.data.value : "";
        info.valueType = data.data.valueType ? data.data.valueType : "";

        if (data.type === TreeItemType.File) {
          info.valueType = data.data.contentType ? data.data.contentType : "";
        }
      }
    }

    setDataInfo(info);
  };

  useEffect(() => {
    if (item) {
      convertData(item);
    }
  }, [item]);

  const onClickImageUpload = (info) => {
    openDialog({
      title: "이미지 업로드",
      message: "해당 이미지로 수정하시겠습니까?",
      type: "confirm",
      confirmHandler: () => {
        fetchUploadImage(info);
      },
    });
  };

  const onClickModify = () => {
    let val = dataInfo.value;

    if (dataInfo.valueType.includes("string")) {
      val = '"' + val + '"';
    }

    openDialog({
      title: "데이터변경",
      message: "해당 데이터를 수정하시겠습니까?",
      type: "confirm",
      confirmHandler: () => {
        fetchValueChanged(val);
      },
    });
  };

  const fetchUploadImage = async (info) => {
    let path = GET_PARSING_GET_LINK(item);
    path += "/attachment";

    const formData = new FormData();
    formData.append("url", path);
    formData.append("content", info.file);

    let result = await REQ_RELATION_UPLOAD(formData);

    if (result === "") {
      openDialog({
        title: "업로드완료",
        message: "이미지 업로드가 완료되었습니다.",
        type: "alert",
      });

      if (handleChange) {
        handleChange();
      }
    } else {
      let status = "";
      let text = "";

      if (result && result.status) {
        status = result.status;
        text = result.text;
      }

      openDialog({
        title: "업로드실패",
        message: `업로드요청 실패.<br/>${status ? status : ""} ${
          text ? text : ""
        }`,
        type: "alert",
      });
    }
  };

  const fetchValueChanged = async (val) => {
    let path = GET_PARSING_UPDATE_LINK(item);

    let result = await REQ_RELATION_PATCH({
      url: path,
      data: val,
    });

    if (result === "") {
      openDialog({
        title: "변경완료",
        message: "해당 데이터에 대한 변경요청이 완료되었습니다.",
        type: "alert",
      });

      if (handleChange) {
        handleChange();
      }
    } else {
      let status = "";
      let text = "";

      if (result && result.status) {
        status = result.status;
        text = result.text;
      }

      openDialog({
        title: "변경실패",
        message: `변경요청 실패.<br/>${status ? status : ""} ${
          text ? text : ""
        }`,
        type: "alert",
      });
    }
  };

  useEffect(() => {}, [dataInfo]);

  const onValueChange = (val) => {
    setDataInfo({
      ...dataInfo,
      value: val,
    });
  };

  return (
    <div
      className="view-wrapper"
      style={{ minHeight: "400px", overflowY: "auto" }}
    >
      {dataInfo && (
        <>
          <div className="view-item view-item-title">
            <span className={clsx("badge me-2", dataInfo.bg)}>
              {dataInfo.modelTypeShort}
            </span>
            {dataInfo.idShort}
            {dataInfo.modelType === TreeItemType.MDT ||
            dataInfo.modelType === TreeItemType.SubModel ? (
              <span className="ms-1 text-muted">{dataInfo.id}</span>
            ) : (
              ""
            )}
          </div>
          {dataInfo.idPath && (
            <div className="view-item">{`IdShortPath : ${dataInfo.idPath}`}</div>
          )}
          <hr />

          {dataInfo.idShort && (
            <>
              <ELE_KeyValue item={["IdShort", dataInfo.idShort]}></ELE_KeyValue>
              <hr />
            </>
          )}

          {dataInfo.id && (
            <>
              <ELE_KeyValue item={["Id", dataInfo.id]}></ELE_KeyValue>
              <hr />
            </>
          )}

          {dataInfo.modelType === TreeItemType.MDT ||
          dataInfo.modelType === TreeItemType.SubModel ? (
            <></>
          ) : dataInfo.modelType === TreeItemType.SMC ||
            dataInfo.modelType === TreeItemType.SML ? (
            <ELE_ValueList children={item.children}></ELE_ValueList>
          ) : dataInfo.modelType === "File" ||
            dataInfo.modelType === TreeItemType.Prop ? (
            <>
              <ELE_KeyValue
                item={["valueType", dataInfo.valueType]}
              ></ELE_KeyValue>
              {dataInfo.modelType === "File" ? (
                <ELE_FileModify
                  label="value"
                  value={dataInfo.value}
                  handleUploadImage={onClickImageUpload}
                ></ELE_FileModify>
              ) : dataInfo.modelType === "Property" ? (
                <ELE_KeyValueModify
                  label="value"
                  value={dataInfo.value}
                  handleModify={onClickModify}
                  onValueChange={onValueChange}
                ></ELE_KeyValueModify>
              ) : null}
            </>
          ) : (
            <ELE_Value
              value={
                Array.isArray(dataInfo.value)
                  ? JSON.stringify(dataInfo.value, null, 2)
                  : dataInfo.value
              }
            ></ELE_Value>
          )}
        </>
      )}
    </div>
  );
};

export default React.memo(ELE_View);
