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

  console.log("Report saved:");
  console.log(result.savedPath);
}

function main() {
  const commandName = process.argv[2];
  const folderPath = process.argv[3];

  if (!commandName) {
    printHelp();
    return;
  }

  try {
    const execution = runCommand(commandName, folderPath);
    printSuccess(execution.title, execution.result);
  } catch (error) {
    console.log("");
    console.log("--- ERROR ---");
    console.log(error.message);
    printHelp();
    process.exitCode = 1;
  }
}

main();
