import AceEditor from "react-ace";
import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/mode-text"; // 일반 텍스트 모드
import "ace-builds/src-noconflict/theme-terminal"; // 터미널 스타일 테마
import "ace-builds/webpack-resolver";
import { useEffect, useState } from "react";

const JsonView = ({ data }) => {
  const [logs, setLogs] = useState("");

  useEffect(() => {
    if (data) {
      setLogs(data);
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
      height="600px"
      value={logs}
      readOnly={true} // 편집 불가
      setOptions={{
        showLineNumbers: true,
        tabSize: 2,
        useWorker: false,
      }}
    />
  );
};

export default JsonView;
