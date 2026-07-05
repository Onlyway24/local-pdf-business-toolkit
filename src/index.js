const { runScanCommand } = require("./commands/scanCommand");

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

  try {
    const result = runScanCommand(folder);

    console.log("");
    console.log("--- SCAN COMPLETE ---");
    console.log("Folder: " + result.folderPath);
    console.log("Files found: " + result.totalFiles);
    console.log("Report saved:");
    console.log(result.savedPath);
  } catch (error) {
    console.log("");
    console.log("--- ERROR ---");
    console.log(error.message);
    process.exitCode = 1;
  }
}

main();
