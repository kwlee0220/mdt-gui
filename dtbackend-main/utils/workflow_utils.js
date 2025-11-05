// 설정값을 담은 객체
require('dotenv').config();

const wf_props = {
  apiVersion: process.env.ARGO_API_VERSION || 'argoproj.io/v1alpha1',
  mdtClientImage: process.env.MDT_CLIENT_IMAGE || 'kwlee0220/mdt-client',
  mdtClientJar: process.env.MDT_CLIENT_JAR || 'mdt-client-all.jar',
  mdtEndpoint: process.env.MDT_ENDPOINT || 'http://129.254.91.134:12985',
  mdtServerEndpoint: process.env.MDT_SERVER_ENDPOINT || 'http://129.254.91.134:12987',
  defaultTimeout: process.env.ARGO_DEFAULT_TIMEOUT || '1m',
  defaultLogger: process.env.ARGO_DEFAULT_LOGGER || 'info'
};

function convertToArgoWorkflow(inputJson) {
  // 기본 워크플로우 구조 생성
  const workflow = {
    apiVersion: wf_props.apiVersion,
    kind: 'Workflow',
    metadata: {
      generateName: `${inputJson.id}-`
    },
    spec: {
      entrypoint: 'dag',
      templates: [
        {
          name: 'dag',
          dag: {
            tasks: []
          }
        }
      ]
    }
  };

  // DAG 태스크 및 템플릿 생성
  inputJson.tasks.forEach(task => {
    const taskName = task.id;
    const templateName = `${taskName}-template`;

    // DAG 태스크 추가
    const dagTask = {
      name: taskName,
      template: templateName
    };

    if (task.dependencies && task.dependencies.length > 0) {
      dagTask.dependencies = task.dependencies;
    }

    workflow.spec.templates[0].dag.tasks.push(dagTask);

    // 태스크 템플릿 생성
    const taskTemplate = createTaskTemplate(task, templateName);
    workflow.spec.templates.push(taskTemplate);
  });

  return workflow;
}

function createTaskTemplate(task, templateName) {
  const template = {
    name: templateName,
    container: {
      image: wf_props.mdtClientImage,
      command: ['java'],
      args: ['-cp', wf_props.mdtClientJar],
      env: [{
        name: 'MDT_ENDPOINT',
        value: wf_props.mdtEndpoint
      }]
    }
  };

  switch (task.type) {
    case 'mdt.task.builtin.CopyTask':
      template.container.args.push('mdt.task.builtin.CopyTaskCommand');
      if (task.variables && task.variables.length >= 2) {
        const fromPath = createValuePath(task.variables.find(v => v.name === 'from').valueReference);
        const toPath = createValuePath(task.variables.find(v => v.name === 'to').valueReference);
        template.container.args.push(fromPath);
        template.container.args.push(toPath);
      }
      break;

    case 'mdt.task.builtin.HttpTask':
      template.container.args.push('mdt.task.builtin.HttpTaskCommand');
      template.container.args.push('--server');
      template.container.args.push(wf_props.mdtServerEndpoint);

      const options = task.options || [];
      const timeout = options.find(opt => opt.name === 'timeout')?.value || wf_props.defaultTimeout;
      const logger = options.find(opt => opt.name === 'logger')?.value || wf_props.defaultLogger;

      template.container.args.push('--timeout', timeout);
      template.container.args.push('--logger', logger);

      if (task.variables) {
        task.variables.forEach(variable => {
          const path = createValuePath(variable.valueReference);
          template.container.args.push(`--${variable.kind.toLowerCase()}.${variable.name}`);
          template.container.args.push(path);
        });
      }
      break;
  }

  return template;
}

function createValuePath(valueRef) {
  return `${valueRef.twinId}/${valueRef.submodelIdShort}/${valueRef.idShortPath}`;
}

// 사용 예시:
// const inputJson = require('./workflow.json');
// const argoWorkflow = convertToArgoWorkflow(inputJson);
// console.log(argoWorkflow);

module.exports = {
  convertToArgoWorkflow,
};
