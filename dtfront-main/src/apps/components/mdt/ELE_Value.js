import { useEffect } from "react";

const ELE_Value = ({ value }) => {
  return (
    <div className="view-item">
      <div className="row">
        <label className="col-form-label col-3">value</label>
        <div className="col-9">
          <pre className="text-muted">{value}</pre>
        </div>
      </div>
    </div>
  );
};

export default ELE_Value;
