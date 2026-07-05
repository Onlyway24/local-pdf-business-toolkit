const assert = require("assert");
const fs = require("fs");
const { runFullDemoCommand } = require("../src/commands/fullDemoCommand");

function run() {
  const result = runFullDemoCommand("samples", "Mario Rossi");

  assert.strictEqual(result.totalFiles, 3);
  assert.strictEqual(result.status, "READY");
  assert.ok(fs.existsSync(result.clientPackRoot));
  assert.ok(fs.existsSync(result.zipPath));
  assert.ok(result.zipPath.endsWith(".zip"));

  console.log("fullDemoCommand.test.js passed");
}

run();
