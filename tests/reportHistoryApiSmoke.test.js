const assert = require('assert');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();

  assert.ok(response.ok, `Expected ${url} to return ok, got ${response.status}: ${text}`);

  return JSON.parse(text);
}

async function run() {
  const indexPath = path.resolve('outputs', 'reports', 'index.json');
  fs.mkdirSync(path.dirname(indexPath), { recursive: true });

  fs.writeFileSync(indexPath, JSON.stringify({
    reports: [
      {
        generatedAt: '2026-01-01T00:00:00.000Z',
        folderPath: 'samples',
        totalFiles: 4,
        pdfFiles: 3,
        nonPdfFiles: 1,
        status: 'PARTIAL',
        readinessScore: 60,
        actionSummary: 'Review 2 failed PDF file(s) before delivery.',
        pdfHealth: {
          attempted: 3,
          succeeded: 1,
          failed: 2
        },
        deliveryDecision: {
          decision: 'REVIEW BEFORE DELIVERY',
          reason: 'Test report needs review.',
          requiredAction: 'Review test report.'
        },
        reportPaths: {
          markdownReportPath: path.resolve('outputs', 'reports', 'test.md'),
          htmlReportPath: path.resolve('outputs', 'reports', 'test.html'),
          jsonReportPath: path.resolve('outputs', 'reports', 'test.json')
        }
      }
    ]
  }, null, 2));

  const port = 3999;
  const server = spawn(process.execPath, ['src/server.js'], {
    env: {
      ...process.env,
      PORT: String(port)
    },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  try {
    await wait(800);

    const before = await requestJson(`http://localhost:${port}/api/reports`);
    assert.strictEqual(before.stats.totalReports, 1);
    assert.strictEqual(before.reports.length, 1);

    const clearResult = await requestJson(`http://localhost:${port}/api/reports/history`, {
      method: 'DELETE'
    });

    assert.strictEqual(clearResult.success, true);
    assert.strictEqual(clearResult.clearedReports, 1);
    assert.ok(clearResult.backupPath);
    assert.ok(fs.existsSync(clearResult.backupPath));

    const after = await requestJson(`http://localhost:${port}/api/reports`);
    assert.strictEqual(after.stats.totalReports, 0);
    assert.deepStrictEqual(after.reports, []);

    const latest = await requestJson(`http://localhost:${port}/api/reports/latest`);
    assert.strictEqual(latest.report, null);
  } finally {
    server.kill('SIGTERM');
  }

  console.log('reportHistoryApiSmoke.test.js passed');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
