import { useEffect } from "react";

const ELE_KeyValue = ({ item }) => {
  return item && Array.isArray(item) && item.length === 2 ? (
    <div className="view-item">
      <div className="row">
        <label className="col-form-label col-3">{item[0]}</label>
        <div className="col-9">
          <input
            type="text"
            className="form-control"
            value={item[1]}
            readOnly
          ></input>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default ELE_KeyValue;
