import AceEditor from "react-ace";
import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/mode-text"; // 일반 텍스트 모드
import "ace-builds/src-noconflict/theme-terminal"; // 터미널 스타일 테마
import "ace-builds/webpack-resolver";
import { useEffect, useState } from "react";

const LogView = ({ data, height = "400px" }) => {
  const [logs, setLogs] = useState("");

  useEffect(() => {
    if (data) {
      setLogs(data);
    }
  }, [data]);

  const onChange = () => {};

  return (
    <AceEditor
      mode="text"
      theme="terminal"
      name="json-editor"
      fontSize={14}
      width="100%"
      height={height}
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

export default LogView;
