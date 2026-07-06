const assert = require('assert');
const { execFileSync } = require('child_process');

function run() {
  const output = execFileSync(
    process.execPath,
    ['src/index.js', 'inspect-pdf-text', 'samples'],
    {
      encoding: 'utf8'
    }
  );

  assert.ok(output.includes('--- PDF TEXT INSPECTION COMPLETE ---'));
  assert.ok(output.includes('Report saved:'));
  assert.ok(output.includes('.md'));
  assert.ok(output.includes('HTML report:'));
  assert.ok(output.includes('.html'));
  assert.ok(output.includes('JSON report:'));
  assert.ok(output.includes('.json'));

  console.log('inspectPdfTextCliOutput.test.js passed');
}

run();
