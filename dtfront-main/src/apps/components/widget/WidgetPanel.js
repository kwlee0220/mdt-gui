import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ModalAddWidget from "../modal/modal_add_widget";
import useModal from "../modal/useModal";
import useDialog from "../modal/useDialog";
import useRequestManager from "apps/utils/request_manager";
import WidgetChart from "./WidgetChart";
import WidgetImage from "./WidgetImage";
import WidgetTable from "./WidgetTable";
import WidgetTree from "./WidgetTree";
import WidgetValue from "./WidgetValue";

const WidgetPanel = ({ list }) => {
  const modalUpdateWidget = useModal();
  const { openDialog } = useDialog();

  const { REQ_Widget_Delete, REQ_Widget_Update, REQ_Widget_Change_Order } =
    useRequestManager();

  const onClickDelete = (item) => {
    openDialog({
      title: "위젯 삭제",
      message: "해당 위젯을 삭제하시겠습니까?",
      type: "confirm",
      confirmHandler: () => {
        REQ_Widget_Delete(item.no);
      },
    });
  };

  const onClickUpdate = (no, data) => {
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
        REQ_Widget_Update(no, updateInfo);

        modalUpdateWidget.toggleModal();
      },
    });
  };

  const [widgetlist, setWidgetList] = useState([]);
  const [selectedWidget, setSelectedWidget] = useState();

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(widgetlist);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setWidgetList(reordered);

    let orderlist = reordered.map((widget, index) => {
      return {
        no: widget.no,
        prenum: index,
      };
    });

    REQ_Widget_Change_Order(orderlist);
  };

  const convertData = (list) => {
    setWidgetList(list);
  };

  useEffect(() => {
    if (list) {
      convertData(list);
    }
  }, [list]);

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="cardGrid" direction="horizontal">
          {(provided) => (
            <div
              className="row"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {widgetlist.map((item, index) => (
                <Draggable
                  key={item.no + ""}
                  draggableId={item.no + ""}
                  index={index}
                >
                  {(prov) => (
                    <div
                      className={`mb-2 ${item.size}`}
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      {...prov.dragHandleProps}
                    >
                      <div className="card card-widget">
                        <div className="card-header bg-dark text-white d-flex justify-content-between">
                          <h6 className="fw-semibold mb-0">
                            {item ? item.name : ""}
                          </h6>
                          <div className="ms-auto flex-ycenter">
                            <div
                              className="text-body btn-icon-link"
                              onClick={() => onClickDelete(item)}
                            >
                              <i className="ph-trash"></i>
                            </div>
                          </div>
                        </div>
                        {item.type === "chart" ? (
                          <WidgetChart
                            item={item}
                            handleUpdate={modalUpdateWidget.toggleModal}
                          ></WidgetChart>
                        ) : item.type === "image" ? (
                          <WidgetImage
                            item={item}
                            handleUpdate={modalUpdateWidget.toggleModal}
                          ></WidgetImage>
                        ) : item.type === "table" ? (
                          <WidgetTable
                            item={item}
                            handleUpdate={modalUpdateWidget.toggleModal}
                          ></WidgetTable>
                        ) : item.type === "tree" ? (
                          <WidgetTree
                            item={item}
                            handleUpdate={modalUpdateWidget.toggleModal}
                          ></WidgetTree>
                        ) : item.type === "value" ? (
                          <WidgetValue
                            item={item}
                            handleUpdate={modalUpdateWidget.toggleModal}
                          ></WidgetValue>
                        ) : null}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <ModalAddWidget
        widget={selectedWidget}
        open={modalUpdateWidget.open}
        closeModal={modalUpdateWidget.toggleModal}
        handleUpdateWidget={onClickUpdate}
      ></ModalAddWidget>
    </>
  );
};

export default WidgetPanel;
