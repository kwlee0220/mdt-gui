const fs = require('fs');
const { convertToArgoWorkflow } = require("./utils/workflow_utils");

// JSON 파일 읽기
const inputJson = JSON.parse(fs.readFileSync('./docs/workflow_thickness_inspection.json', 'utf8'));

// 변환
const argoWorkflow = convertToArgoWorkflow(inputJson);

// 결과 저장
fs.writeFileSync('workflow.yaml', argoWorkflow);
