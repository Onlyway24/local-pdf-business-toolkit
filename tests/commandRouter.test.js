const assert = require("assert");
const { getCommand, getCommands, runCommand } = require("../src/commands/commandRouter");

async function run() {
  const commands = getCommands();

  assert.ok(commands.length >= 4);

  assert.strictEqual(getCommand("scan").name, "scan");
  assert.strictEqual(getCommand("plan").name, "plan");
  assert.strictEqual(getCommand("preview").name, "preview");
  assert.strictEqual(getCommand("inspect").name, "inspect");
  assert.strictEqual(getCommand("missing"), null);

  await assert.rejects(
    () => runCommand("missing", "samples"),
    /Unknown command/
  );

  const execution = await runCommand("inspect", "samples");

  assert.strictEqual(execution.title, "INSPECTION COMPLETE");
  assert.strictEqual(execution.result.totalFiles, 4);

  console.log("commandRouter.test.js passed");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
