const { AppError } = require('../errors/AppError');
const { runScanCommand } = require('./scanCommand');
const { runPlanCommand } = require('./planCommand');
const { runPreviewCommand } = require('./previewCommand');
const { runInspectCommand } = require('./inspectCommand');
const { runClientPackCommand } = require('./clientPackCommand');
const { runZipClientPackCommand } = require('./zipClientPackCommand');
const { runFullDemoCommand } = require('./fullDemoCommand');
const { runInspectPdfTextCommand } = require('./inspectPdfTextCommand');

const COMMANDS = {
  scan: {
    name: 'scan',
    description: 'Scan a folder and list files.',
    usage: 'node src/index.js scan <folder>',
    successTitle: 'SCAN COMPLETE',
    run: runScanCommand,
  },

  plan: {
    name: 'plan',
    description: 'Create an organization plan for a folder.',
    usage: 'node src/index.js plan <folder>',
    successTitle: 'PLAN COMPLETE',
    run: runPlanCommand,
  },

  preview: {
    name: 'preview',
    description: 'Create a preview pack report.',
    usage: 'node src/index.js preview <folder>',
    successTitle: 'PREVIEW COMPLETE',
    run: runPreviewCommand,
  },

  inspect: {
    name: 'inspect',
    description: 'Inspect a folder and report readiness.',
    usage: 'node src/index.js inspect <folder>',
    successTitle: 'INSPECTION COMPLETE',
    run: runInspectCommand,
  },

  'inspect-pdf-text': {
    name: 'inspect-pdf-text',
    description: 'Inspect a folder and extract readable PDF text locally.',
    usage: 'node src/index.js inspect-pdf-text <folder>',
    successTitle: 'PDF TEXT INSPECTION COMPLETE',
    run: runInspectPdfTextCommand,
  },

  'client-pack': {
    name: 'client-pack',
    description: 'Create a client-ready document pack.',
    usage: 'node src/index.js client-pack <folder>',
    successTitle: 'CLIENT PACK COMPLETE',
    run: runClientPackCommand,
  },

  'zip-client-pack': {
    name: 'zip-client-pack',
    description: 'Create a ZIP archive from a client pack folder.',
    usage: 'node src/index.js zip-client-pack <client-pack-folder>',
    successTitle: 'ZIP CLIENT PACK COMPLETE',
    run: runZipClientPackCommand,
  },

  'full-demo': {
    name: 'full-demo',
    description: 'Create a client pack and ZIP in one command.',
    usage: 'node src/index.js full-demo <folder> <client-name>',
    successTitle: 'FULL DEMO COMPLETE',
    run: runFullDemoCommand,
  },
};

function getCommand(commandName) {
  return COMMANDS[commandName] || null;
}

function getCommands() {
  return Object.values(COMMANDS);
}

async function runCommand(commandName, folderPath, extraArgs = []) {
  const command = getCommand(commandName);

  if (!command) {
    throw new AppError('Unknown command: ' + commandName, 'UNKNOWN_COMMAND');
  }

  const result = await command.run(folderPath, ...extraArgs);

  return {
    title: command.successTitle,
    result,
  };
}

module.exports = {
  getCommand,
  getCommands,
  runCommand,
};
