const { runScanCommand } = require("./commands/scanCommand");
const { runPlanCommand } = require("./commands/planCommand");
const { runPreviewCommand } = require("./commands/previewCommand");
const { runInspectCommand } = require("./commands/inspectCommand");

function printHelp() {
  console.log("Local PDF Business Toolkit");
  console.log("");
  console.log("Usage:");
  console.log("  node src/index.js scan <folder>");
  console.log("  node src/index.js plan <folder>");
  console.log("  node src/index.js preview <folder>");
  console.log("  node src/index.js inspect <folder>");
  console.log("");
  console.log("Examples:");
  console.log("  npm run scan");
  console.log("  npm run demo");
  console.log("  npm run demo:plan");
  console.log("  npm run demo:preview");
  console.log("  npm run demo:inspect");
  console.log("  node src/index.js inspect samples");
}

function printSuccess(title, result) {
  console.log("");
  console.log("--- " + title + " ---");
  console.log("Folder: " + result.folderPath);
  console.log("Files found: " + result.totalFiles);

  if (result.status) {
    console.log("Status: " + result.status);
    console.log("Readiness score: " + result.readinessScore + "%");
  }

  if (result.previewRoot) {
    console.log("Preview folder:");
    console.log(result.previewRoot);
  }

  console.log("Report saved:");
  console.log(result.savedPath);
}

function main() {
  const command = process.argv[2];
  const folder = process.argv[3];

  if (!command) {
    printHelp();
    return;
  }

  try {
    if (command === "scan") {
      const result = runScanCommand(folder);
      printSuccess("SCAN COMPLETE", result);
      return;
    }

    if (command === "plan") {
      const result = runPlanCommand(folder);
      printSuccess("PLAN COMPLETE", result);
      return;
    }

    if (command === "preview") {
      const result = runPreviewCommand(folder);
      printSuccess("PREVIEW COMPLETE", result);
      return;
    }

    if (command === "inspect") {
      const result = runInspectCommand(folder);
      printSuccess("INSPECTION COMPLETE", result);
      return;
    }

    console.log("Unknown command: " + command);
    printHelp();
    process.exitCode = 1;
  } catch (error) {
    console.log("");
    console.log("--- ERROR ---");
    console.log(error.message);
    process.exitCode = 1;
  }
}

main();
