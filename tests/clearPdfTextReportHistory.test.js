const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { clearPdfTextReportHistory } = require('../src/core/clearPdfTextReportHistory');

function run() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'clear-report-history-'));
  const indexPath = path.join(tempRoot, 'index.json');
  const backupRoot = path.join(tempRoot, 'backups');

  fs.writeFileSync(indexPath, JSON.stringify({
    reports: [
      { generatedAt: '2026-01-01T00:00:00.000Z', status: 'PARTIAL' },
      { generatedAt: '2026-01-02T00:00:00.000Z', status: 'READY' }
    ]
  }, null, 2));

  const result = clearPdfTextReportHistory({
    indexPath,
    backupRoot
  });

  assert.strictEqual(result.indexPath, indexPath);
  assert.strictEqual(result.clearedReports, 2);
  assert.ok(result.backupPath);
  assert.ok(fs.existsSync(result.backupPath));

  const clearedIndex = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  assert.deepStrictEqual(clearedIndex, { reports: [] });

  const backupIndex = JSON.parse(fs.readFileSync(result.backupPath, 'utf8'));
  assert.strictEqual(backupIndex.reports.length, 2);
  assert.strictEqual(backupIndex.reports[0].status, 'PARTIAL');

  const missingIndexPath = path.join(tempRoot, 'missing', 'index.json');
  const missingResult = clearPdfTextReportHistory({
    indexPath: missingIndexPath,
    backupRoot
  });

  assert.strictEqual(missingResult.clearedReports, 0);
  assert.strictEqual(missingResult.backupPath, null);
  assert.deepStrictEqual(JSON.parse(fs.readFileSync(missingIndexPath, 'utf8')), { reports: [] });

  console.log('clearPdfTextReportHistory.test.js passed');
}

run();
