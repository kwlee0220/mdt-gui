import React, { useEffect, useState } from "react";
import useDialog from "../modal/useDialog";
import UtilManager from "apps/utils/util_manager";

const ELE_FileModify = ({ label, value, handleUploadImage }) => {
  const { IS_NULL } = UtilManager();

  const [error, setError] = useState(null);

  const [imageDataUrl, setImageDataUrl] = useState(null);
  const [contentType, setContentType] = useState();
  const [fileName, setFileName] = useState();
  const [file, setFile] = useState(null);

  const onClickImageUplode = () => {
    let result = {
      fileName: fileName,
      contentType: contentType,
      content: imageDataUrl,
      file: file,
    };

    if (IS_NULL(imageDataUrl)) {
      setError("업로드할 이미지를 선택해주세요.");
      return;
    }

    if (handleUploadImage) {
      handleUploadImage(result);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.onload = () => {
        setFileName(file.name);
        setContentType(file.type);
        setImageDataUrl(reader.result); // base64 포함한 data:image/... 형식
        setFile(file);
      };

      reader.readAsDataURL(file); // raw data를 base64로 읽음
    } else {
      setImageDataUrl(null);
      setFileName("");
      setContentType("");
      setFile(null);
    }
    setError(null);
  };

  return (
    <>
      <div className="view-item">
        <div className="row">
          <label className="col-form-label col-3">{label}</label>
          <div className="col-9">
            <input
              type="text"
              className="form-control"
              value={value}
              readOnly
            ></input>
          </div>
        </div>
      </div>
      {error && (
        <div className="alert alert-danger m-2" role="alert">
          {error}
        </div>
      )}
      <div className="view-item">
        <div className="row">
          <label className="col-form-label col-3">이미지 파일 선택</label>
          <div className="col-9">
            <div className="input-group">
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleFileChange}
              ></input>
              <button
                className="btn bg-indigo text-white"
                onClick={onClickImageUplode}
              >
                이미지 업로드
              </button>
            </div>
          </div>
        </div>
      </div>

      {imageDataUrl && (
        <div className="pnl-image-preview">
          {imageDataUrl && <img src={imageDataUrl} alt="Preview"></img>}
        </div>
      )}
    </>
  );
};

export default React.memo(ELE_FileModify);
