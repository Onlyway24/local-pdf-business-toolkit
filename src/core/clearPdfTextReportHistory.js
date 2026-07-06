const fs = require('fs');
const path = require('path');

function createTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function ensureEmptyIndex(indexPath) {
  fs.mkdirSync(path.dirname(indexPath), { recursive: true });
  fs.writeFileSync(indexPath, JSON.stringify({ reports: [] }, null, 2) + '\n');
}

function clearPdfTextReportHistory(options = {}) {
  const indexPath = options.indexPath || path.resolve('outputs', 'reports', 'index.json');
  const backupRoot = options.backupRoot || path.resolve('outputs', 'reports', 'backups');

  let clearedReports = 0;
  let backupPath = null;

  if (fs.existsSync(indexPath)) {
    const raw = fs.readFileSync(indexPath, 'utf8');

    try {
      const parsed = JSON.parse(raw);
      clearedReports = Array.isArray(parsed.reports) ? parsed.reports.length : 0;
    } catch {
      clearedReports = 0;
    }

    fs.mkdirSync(backupRoot, { recursive: true });
    backupPath = path.join(backupRoot, `report-index-backup-${createTimestamp()}.json`);
    fs.writeFileSync(backupPath, raw);
  }

  ensureEmptyIndex(indexPath);

  return {
    indexPath,
    backupPath,
    clearedReports
  };
}

module.exports = {
  clearPdfTextReportHistory
};
