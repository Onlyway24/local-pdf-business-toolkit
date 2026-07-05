const { runScanCommand } = require("./commands/scanCommand");
const { runPlanCommand } = require("./commands/planCommand");

function printHelp() {
  console.log("Local PDF Business Toolkit");
  console.log("");
  console.log("Usage:");
  console.log("  node src/index.js scan <folder>");
  console.log("  node src/index.js plan <folder>");
  console.log("");
  console.log("Examples:");
  console.log("  npm run scan");
  console.log("  npm run demo");
  console.log("  node src/index.js scan input");
  console.log("  node src/index.js plan samples");
}

function printSuccess(title, result) {
  console.log("");
  console.log("--- " + title + " ---");
  console.log("Folder: " + result.folderPath);
  console.log("Files found: " + result.totalFiles);
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
