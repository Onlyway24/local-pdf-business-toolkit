const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { runClientPackCommand } = require("../src/commands/clientPackCommand");

function run() {
  const nestedPath = path.resolve("tests/fixtures/nested-client-folder");
  const result = runClientPackCommand(nestedPath);

  assert.strictEqual(result.totalFiles, 3);
  assert.strictEqual(result.status, "READY");
  assert.ok(fs.existsSync(result.clientPackRoot));

  assert.ok(
    fs.existsSync(
      path.join(result.clientPackRoot, "documents", "contracts", "contratto-servizio.pdf")
    )
  );

  assert.ok(
    fs.existsSync(
      path.join(result.clientPackRoot, "documents", "invoices", "fattura-febbraio.pdf")
    )
  );

  assert.ok(
    fs.existsSync(
      path.join(result.clientPackRoot, "documents", "identity-documents", "documento-identita.txt")
    )
  );

  console.log("nestedClientPack.test.js passed");
}

run();
