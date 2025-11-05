import React, { useEffect, useState } from "react";
import useDialog from "../modal/useDialog";

const ELE_KeyValueModify = ({ label, value, handleModify, onValueChange }) => {
  return (
    <div className="view-item">
      <div className="row">
        <label className="col-form-label col-3">{label}</label>
        <div className="col-9">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={value}
              onChange={(e) => onValueChange(e.target.value)}
            ></input>
            <button className="btn bg-indigo text-white" onClick={handleModify}>
              변경
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ELE_KeyValueModify);
