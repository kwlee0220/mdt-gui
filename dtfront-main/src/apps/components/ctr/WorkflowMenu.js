import { useEffect, useState } from "react";
import { ChromePicker } from "react-color";

import "assets/css/workflow/menu.scss";

const WorkflowMenu = ({
  addNode,
  alignVertical,
  alignHorizontal,
  changeColor,
  handleUndo,
  handleRedo,
  handleStart,
  handleStop,
  handleClear,
}) => {
  const [color, setColor] = useState("#9b9b9b");
  const [showPicker, setShowPicker] = useState(false);

  const [input, setInput] = useState({
    input: "1",
    output: "1",
    type: "",
  });

  const handleChangeInput = (e) => {
    const { name, value } = e.target;

    setInput({
      ...input,
      [name]: value,
    });
  };

  const onClickAdd = () => {
    if (addNode) {
      addNode(input.input, input.output, input.type);
    }
  };

  //#region 정렬관련 함수

  const onClickAlignVertical = (type) => {
    if (alignVertical) {
      alignVertical(type);
    }
  };

  const onClickAlignHorizotal = (type) => {
    if (alignHorizontal) {
      alignHorizontal(type);
    }
  };

  //#endregion

  const handleColorChange = (e) => {
    const { value } = e.target;

    setColor(value);

    if (changeColor) {
      changeColor(value);
    }
  };

  const onClickUndo = () => {
    if (handleUndo) {
      handleUndo();
    }
  };

  const onClickRedo = () => {
    if (handleRedo) {
      handleRedo();
    }
  };

  const onClickStart = () => {
    if (handleStart) {
      handleStart();
    }
  };

  const onClickStop = () => {
    if (handleStop) {
      handleStop();
    }
  };

  const onClickClear = () => {
    if (handleClear) {
      handleClear();
    }
  };

  useEffect(() => {}, [color]);

  return (
    <div className="pnl-workflow-menu">
      <button
        className="btn btn-sm btn-icon btn-outline-primary border-transparent mx-1"
        onClick={() => onClickAlignHorizotal("left")}
      >
        <i className="ph-align-left"></i>
      </button>
      <button
        className="btn btn-sm btn-icon btn-outline-primary border-transparent mx-1"
        onClick={() => onClickAlignHorizotal("center")}
      >
        <i className="ph-align-center-horizontal"></i>
      </button>
      <button
        className="btn btn-sm btn-icon btn-outline-primary border-transparent mx-1"
        onClick={() => onClickAlignHorizotal("right")}
      >
        <i className="ph-align-right"></i>
      </button>
      <div className="divider"></div>
      <button
        className="btn btn-sm btn-icon btn-outline-primary border-transparent mx-1"
        onClick={() => onClickAlignVertical("top")}
      >
        <i className="ph-align-top"></i>
      </button>
      <button
        className="btn btn-sm btn-icon btn-outline-primary border-transparent mx-1"
        onClick={() => onClickAlignVertical("center")}
      >
        <i className="ph-align-center-vertical"></i>
      </button>
      <button
        className="btn btn-sm btn-icon btn-outline-primary border-transparent mx-1"
        onClick={() => onClickAlignVertical("bottom")}
      >
        <i className="ph-align-bottom"></i>
      </button>
      <div className="divider"></div>
      <button
        className="btn btn-sm btn-icon btn-outline-primary border-transparent mx-1"
        onClick={onClickUndo}
      >
        <i className="ph-arrow-left"></i>
      </button>
      <button
        className="btn btn-sm btn-icon btn-outline-primary border-transparent mx-1"
        onClick={onClickRedo}
      >
        <i className="ph-arrow-right"></i>
      </button>
      <div className="divider"></div>
      <div
        style={{
          flexDirection: "row",
          display: "flex",
          marginLeft: "16px",
          alignItems: "center",
        }}
      >
        <span>배경색 선택 : </span>

        <input
          type="color"
          className="ms-2"
          value={color}
          onChange={handleColorChange}
        ></input>
      </div>
      <div className="divider"></div>
      <button
        className="btn btn-sm btn-icon btn-outline-white border-transparent mx-1"
        onClick={onClickClear}
      >
        <i className="ph-eraser me-2"></i>
        Clear
      </button>

      <div className="divider"></div>
      <div className="ms-auto flex-group d-none">
        <button
          className="btn btn-sm btn-icon btn-outline-yellow border-transparent mx-1"
          onClick={onClickStart}
        >
          <i className="ph-play me-2"></i>
          Start
        </button>
        <button
          className="btn btn-sm btn-icon btn-outline-danger border-transparent mx-1"
          onClick={onClickStop}
        >
          <i className="ph-stop me-2"></i>
          Stop
        </button>
      </div>
    </div>
  );
};

export default WorkflowMenu;
