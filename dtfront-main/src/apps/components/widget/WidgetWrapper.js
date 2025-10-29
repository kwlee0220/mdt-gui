import { useEffect, useState } from "react";
import clsx from "classnames";
import useModal from "../modal/useModal";
import useDialog from "../modal/useDialog";
import useRequestManager from "apps/utils/request_manager";
import WidgetChart from "./WidgetChart";
import WidgetImage from "./WidgetImage";
import WidgetTable from "./WidgetTable";
import WidgetTree from "./WidgetTree";
import ModalAddWidget from "../modal/modal_add_widget";
import WidgetValue from "./WidgetValue";

const WidgetWrapper = ({ item }) => {
  const modalUpdateWidget = useModal();
  const { openDialog } = useDialog();

  const { REQ_Widget_Delete, REQ_Widget_Update } = useRequestManager();

  const clickDelete = () => {
    openDialog({
      title: "위젯 삭제",
      message: "해당 위젯을 삭제하시겠습니까?",
      type: "confirm",
      confirmHandler: () => {
        REQ_Widget_Delete(item.no);
      },
    });
  };

  const clickUpdate = (data) => {
    openDialog({
      title: "위젯 변경",
      message: "해당 위젯 정보를 변경하시겠습니까?",
      type: "confirm",
      confirmHandler: () => {
        let updateInfo = {
          name: data.name,
          type: data.type,
          size: data.size,
          link: data.link,
          interval: data.interval,
          params: data.params,
          etc: data.etc,
          widget: JSON.stringify(data),
        };
        REQ_Widget_Update(item.no, updateInfo);

        modalUpdateWidget.toggleModal();
      },
    });
  };

  useEffect(() => {}, [item]);

  return (
    <>
      {item.type === "chart" ? (
        <WidgetChart
          item={item}
          handleDelete={clickDelete}
          handleUpdate={modalUpdateWidget.toggleModal}
        ></WidgetChart>
      ) : item.type === "image" ? (
        <WidgetImage
          item={item}
          handleDelete={clickDelete}
          handleUpdate={modalUpdateWidget.toggleModal}
        ></WidgetImage>
      ) : item.type === "table" ? (
        <WidgetTable
          item={item}
          handleDelete={clickDelete}
          handleUpdate={modalUpdateWidget.toggleModal}
        ></WidgetTable>
      ) : item.type === "tree" ? (
        <WidgetTree
          item={item}
          handleDelete={clickDelete}
          handleUpdate={modalUpdateWidget.toggleModal}
        ></WidgetTree>
      ) : item.type === "value" ? (
        <WidgetValue
          item={item}
          handleDelete={clickDelete}
          handleUpdate={modalUpdateWidget.toggleModal}
        ></WidgetValue>
      ) : null}

      <ModalAddWidget
        widget={item}
        open={modalUpdateWidget.open}
        closeModal={modalUpdateWidget.toggleModal}
        handleUpdateWidget={clickUpdate}
      ></ModalAddWidget>
    </>
  );
};

export default WidgetWrapper;
