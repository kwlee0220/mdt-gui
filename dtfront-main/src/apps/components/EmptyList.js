const EmptyList = ({ message, style = {} }) => {
    return (
      <div className="item-empty-list" style={style}>
        <div className="txt-info">{message}</div>
      </div>
    );
  };
  
  export default EmptyList;
  