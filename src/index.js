const { getCommands, runCommand } = require("./commands/commandRouter");

function printHelp() {
  console.log("Local PDF Business Toolkit");
  console.log("");
  console.log("Usage:");

  for (const command of getCommands()) {
    console.log("  " + command.usage);
  }

  console.log("");
  console.log("Examples:");
  console.log("  npm run demo");
  console.log("  npm run demo:plan");
  console.log("  npm run demo:preview");
  console.log("  npm run demo:inspect");
  console.log("  npm run demo:client-pack");
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

  if (result.clientPackRoot) {
    console.log("Client pack folder:");
    console.log(result.clientPackRoot);
  }

  if (result.zipPath) {
    console.log("ZIP file:");
    console.log(result.zipPath);
  }

  if (result.savedPath) {
    console.log("Report saved:");
    console.log(result.savedPath);
  }

  if (result.htmlReportPath) {
    console.log("HTML report:");
    console.log(result.htmlReportPath);
  }

  if (result.jsonReportPath) {
    console.log("JSON report:");
    console.log(result.jsonReportPath);
  }
}

async function main() {
  const commandName = process.argv[2];
  const folderPath = process.argv[3];
  const extraArgs = process.argv.slice(4);

  if (!commandName) {
    printHelp();
    return;
  }

  try {
    const execution = await runCommand(commandName, folderPath, extraArgs);
    printSuccess(execution.title, execution.result);
  } catch (error) {
    console.log("");
    console.log("--- ERROR ---");
    console.log(error.message);
    printHelp();
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.log("");
  console.log("--- ERROR ---");
  console.log(error.message);
  process.exitCode = 1;
});
