import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

const ModalMDTInstance = ({ open, closeModal, handleAddInstance }) => {
  const [inputData, setInputData] = useState({});
  const [error, setError] = useState(null);

  const handleAdd = () => {
    try {
      if (!inputData.id) {
        setError("ID를 입력해주세요.");
        return;
      }
      if (!inputData.bundle) {
        setError("번들파일을 선택해주세요.");
        return;
      }
      
      const formData = new FormData();
      formData.append("id", inputData.id);
      formData.append("port", inputData.port || -1);
      formData.append("bundle", inputData.bundle);
      
      // 오류 처리는 MDITable.js의 fetchAdd 함수에서 처리
      handleAddInstance(formData, "add");
      
    } catch (err) {
      setError(err.message || "등록 중 오류가 발생했습니다.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({
      ...inputData,
      [name]: value
    });
    setError(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.name.endsWith('.zip')) {
        setInputData({
          ...inputData,
          bundle: file
        });
        setError(null);
      } else {
        setError("번들파일은 .zip 형식만 가능합니다.");
        e.target.value = null;
      }
    }
  };

  useEffect(() => {
    if (open) {
      setInputData({});
      setError(null);
    }

    return () => {
      setInputData({});
      setError(null);
    };
  }, [open]);

  return (
    <Modal show={open} centered animation={false}>
      <Modal.Header>
        <div className="header-icon">
          <i className="ph-app-window"></i>
        </div>
        <div className="modal-title">MDT 인스턴스 추가</div>
        <button
          type="button"
          className="btn btn-link ms-auto"
          onClick={closeModal}
        >
          <i className="ph-x"></i>
        </button>
      </Modal.Header>
      <div>
        <table className="table table-border">
          <tbody>
            <tr>
              <td>ID</td>
              <td>
                <input 
                  type="text" 
                  className="form-control" 
                  name="id"
                  value={inputData.id || ''}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <td>Port</td>
              <td>
                <input 
                  type="number" 
                  className="form-control" 
                  name="port"
                  value={inputData.port || ''}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <td>번들파일</td>
              <td>
                <input 
                  type="file" 
                  className="form-control" 
                  accept=".zip"
                  onChange={handleFileChange}
                />
              </td>
            </tr>
          </tbody>
        </table>
        {error && (
          <div className="alert alert-danger m-3" role="alert">
            {error}
          </div>
        )}
      </div>
      <Modal.Footer>
        <button className="btn btn-success" onClick={handleAdd}>
          등록
        </button>
        <button className="btn btn-link" onClick={closeModal}>
          닫기
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalMDTInstance;
