const { scanFolder } = require("./core/scanFolder");
const { createReport } = require("./core/createReport");
const { saveReport } = require("./core/saveReport");

function printHelp() {
  console.log("Local PDF Business Toolkit");
  console.log("");
  console.log("Usage:");
  console.log("  node src/index.js scan <folder>");
  console.log("");
  console.log("Examples:");
  console.log("  npm run scan");
  console.log("  npm run demo");
  console.log("  node src/index.js scan input");
}

function main() {
  const command = process.argv[2];
  const folder = process.argv[3];

  if (!command) {
    printHelp();
    return;
  }

  if (command !== "scan") {
    console.log("Unknown command: " + command);
    printHelp();
    process.exitCode = 1;
    return;
  }

  if (!folder) {
    console.log("Missing folder path.");
    printHelp();
    process.exitCode = 1;
    return;
  }

  try {
    const scanResult = scanFolder(folder);
    const report = createReport(scanResult);
    const savedPath = saveReport(report);

    console.log("");
    console.log("--- SCAN COMPLETE ---");
    console.log("Folder: " + scanResult.folderPath);
    console.log("Files found: " + scanResult.totalFiles);
    console.log("Report saved:");
    console.log(savedPath);
  } catch (error) {
    console.log("");
    console.log("--- ERROR ---");
    console.log(error.message);
    process.exitCode = 1;
  }
}

main();
