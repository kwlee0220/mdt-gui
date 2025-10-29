import { useEffect, useRef, useState } from "react";

const ButtonWithPopup = () => {
  const [showPanel, setShowPanel] = useState(false);
  const buttonRef = useRef(null);
  const panelRef = useRef(null);
  const [panelStyle, setPanelStyle] = useState({});

  const togglePanel = () => {
    setShowPanel(!showPanel);
  };

  useEffect(() => {
    if (showPanel && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

      setPanelStyle({
        position: "absolute",
        top: rect.bottom + scrollTop + 8, // 8px 아래
        left: rect.left + scrollLeft,
        zIndex: 1000,
        width: "200px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "16px",
      });
    }
  }, [showPanel]);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        ref={buttonRef}
        className="btn btn-icon btn-primary"
        onClick={togglePanel}
      >
        <i className="ph-plus"></i>
      </button>

      {showPanel && (
        <div ref={panelRef} style={panelStyle}>
          <strong>카드 패널</strong>
          <p>여기에 원하는 내용을 넣을 수 있습니다.</p>
        </div>
      )}
    </div>
  );
};

export default ButtonWithPopup;
