const assert = require("assert");
const { getCommand, getCommands, runCommand } = require("../src/commands/commandRouter");

function run() {
  const commands = getCommands();

  assert.ok(commands.length >= 4);

  assert.strictEqual(getCommand("scan").name, "scan");
  assert.strictEqual(getCommand("plan").name, "plan");
  assert.strictEqual(getCommand("preview").name, "preview");
  assert.strictEqual(getCommand("inspect").name, "inspect");
  assert.strictEqual(getCommand("missing"), null);

  assert.throws(
    () => runCommand("missing", "samples"),
    /Unknown command/
  );

  console.log("commandRouter.test.js passed");
}

run();
