const assert = require("assert");
const { createSafeClientName } = require("../src/core/createSafeClientName");

function run() {
  assert.strictEqual(createSafeClientName("Mario Rossi"), "mario-rossi");
  assert.strictEqual(createSafeClientName("Azienda S.r.l."), "azienda-s-r-l");
  assert.strictEqual(createSafeClientName("Cliente Èlite 24"), "cliente-elite-24");
  assert.strictEqual(createSafeClientName(""), "client");
  assert.strictEqual(createSafeClientName(null), "client");

  console.log("createSafeClientName.test.js passed");
}

run();
