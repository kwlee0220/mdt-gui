import AceEditor from "react-ace";
import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/worker-json"; // 추가된 부분
import "ace-builds/src-noconflict/theme-terminal"; // 터미널 스타일 테마
import "ace-builds/webpack-resolver";
import { useEffect, useState } from "react";

const SubModelTree = ({ data }) => {
  const [jsonData, setJsonData] = useState();

  useEffect(() => {
    if (data) {
      setJsonData(data);
    }
  }, [data]);

  const onChange = () => {};

  return (
    <AceEditor
      mode="json"
      theme="terminal"
      name="json-editor"
      fontSize={14}
      width="100%"
      height="400px"
      value={JSON.stringify(jsonData, null, 2)}
      onChange={onChange}
      readOnly={true}
      setOptions={{
        showLineNumbers: true,
        tabSize: 2,
        useWorker: false, // worker 비활성화
      }}
    />
  );
};

export default SubModelTree;
