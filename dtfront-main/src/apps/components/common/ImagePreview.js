import { useEffect, useState } from "react";

const ImagePreview = ({ handleChangeImage }) => {
  const [imageDataUrl, setImageDataUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.onload = () => {
        setImageDataUrl(reader.result); // base64 포함한 data:image/... 형식
      };

      reader.readAsDataURL(file); // raw data를 base64로 읽음
    } else {
      setImageDataUrl(null);
    }
  };

  useEffect(() => {
    if (handleChangeImage) {
      handleChangeImage(imageDataUrl);
    }
  }, [imageDataUrl]);

  useEffect(() => {
    setImageDataUrl(null);
  }, []);

  return (
    <div className="h-100">
      <div className="row mb-3">
        <div className="col-form-label col-3">이미지 파일</div>
        <div className="col-9">
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleFileChange}
          ></input>
        </div>
      </div>
      <div className="pnl-image-wrapper">
        {imageDataUrl && <img src={imageDataUrl} alt="Preview"></img>}
      </div>
    </div>
  );
};

export default ImagePreview;
