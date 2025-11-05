const EmptyImage = ({ classdata = "", userstyle = {} }) => {
  return (
    <div className="flex-center">
      <div className={"item-empty-image " + classdata} style={userstyle}>
        <i className="ph-image ph-2x text-muted"></i>
        <div className="txt-muted">No Image</div>
      </div>
    </div>
  );
};

export default EmptyImage;
