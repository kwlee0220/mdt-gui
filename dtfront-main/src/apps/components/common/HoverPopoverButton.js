import { OverlayTrigger, Popover } from "react-bootstrap";

const HoverPopoverButton = ({ title = "조회 링크", link, ispre = false }) => {
  const popover = (
    <Popover id="popover-hover">
      <Popover.Header as="h3">{title}</Popover.Header>
      <Popover.Body>
        {ispre ? <pre>{link || "없음"}</pre> : link || "없음"}
      </Popover.Body>
    </Popover>
  );

  return (
    <OverlayTrigger
      trigger={["hover", "focus"]}
      placement="left"
      rootClose
      overlay={popover}
    >
      <button className="btn btn-light btn-icon">
        <i className="ph-link-simple"></i>
      </button>
    </OverlayTrigger>
  );
};

export default HoverPopoverButton;
