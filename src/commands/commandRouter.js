const { AppError } = require("../errors/AppError");
const { runScanCommand } = require("./scanCommand");
const { runPlanCommand } = require("./planCommand");
const { runPreviewCommand } = require("./previewCommand");
const { runInspectCommand } = require("./inspectCommand");
const { runClientPackCommand } = require("./clientPackCommand");
const { runZipClientPackCommand } = require("./zipClientPackCommand");

const COMMANDS = {
  scan: {
    name: "scan",
    description: "Scan a folder and generate a file report.",
    usage: "node src/index.js scan <folder>",
    successTitle: "SCAN COMPLETE",
    run: runScanCommand,
  },

  plan: {
    name: "plan",
    description: "Create a safe organization plan.",
    usage: "node src/index.js plan <folder>",
    successTitle: "PLAN COMPLETE",
    run: runPlanCommand,
  },

  preview: {
    name: "preview",
    description: "Create a copied preview pack without modifying originals.",
    usage: "node src/index.js preview <folder>",
    successTitle: "PREVIEW COMPLETE",
    run: runPreviewCommand,
  },

  inspect: {
    name: "inspect",
    description: "Inspect folder readiness and business quality.",
    usage: "node src/index.js inspect <folder>",
    successTitle: "INSPECTION COMPLETE",
    run: runInspectCommand,
  },

  "client-pack": {
    name: "client-pack",
    description: "Create a client-ready document pack.",
    usage: "node src/index.js client-pack <folder>",
    successTitle: "CLIENT PACK COMPLETE",
    run: runClientPackCommand,
  },

  "zip-client-pack": {
    name: "zip-client-pack",
    description: "Create a ZIP archive from a client pack folder.",
    usage: "node src/index.js zip-client-pack <client-pack-folder>",
    successTitle: "ZIP CLIENT PACK COMPLETE",
    run: runZipClientPackCommand,
  },
};

function getCommand(commandName) {
  return COMMANDS[commandName] || null;
}

function getCommands() {
  return Object.values(COMMANDS);
}

function runCommand(commandName, folderPath, extraArgs = []) {
  const command = getCommand(commandName);

  if (!command) {
    throw new AppError("Unknown command: " + commandName, "UNKNOWN_COMMAND");
  }

  const result = command.run(folderPath, ...extraArgs);

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
