const assert = require('assert');
const fs = require('fs');

const app = fs.readFileSync('public/app.js', 'utf8');
const css = fs.readFileSync('public/style.css', 'utf8');

const start = app.indexOf('function renderLatestReport(report)');
const end = app.indexOf('function renderFailedPdfFiles', start);

assert.notStrictEqual(start, -1, 'renderLatestReport should exist');
assert.notStrictEqual(end, -1, 'renderFailedPdfFiles should exist after renderLatestReport');

const latestReport = app.slice(start, end);

assert.ok(
  latestReport.includes('const actionSummary ='),
  'Latest Report should define an actionSummary fallback'
);

assert.ok(
  latestReport.includes('latest-action-summary'),
  'Latest Report should render the action summary block'
);

assert.ok(
  latestReport.includes('<strong>${actionSummary}</strong>'),
  'Latest Report should visually emphasize actionSummary'
);

assert.ok(
  latestReport.includes('latest-report-grid'),
  'Latest Report should render the metrics grid'
);

assert.ok(
  latestReport.includes('${renderFailedPdfFiles(report)}'),
  'Latest Report should render failed PDF files when present'
);

assert.ok(
  latestReport.includes('report-links latest-actions'),
  'Latest Report should keep report links accessible'
);

const actionSummaryIndex = latestReport.indexOf('latest-action-summary');
const gridIndex = latestReport.indexOf('latest-report-grid');
const failedQueueIndex = latestReport.indexOf('${renderFailedPdfFiles(report)}');
const linksIndex = latestReport.indexOf('report-links latest-actions');

assert.ok(
  actionSummaryIndex < gridIndex,
  'actionSummary should appear before report metrics'
);

assert.ok(
  gridIndex < failedQueueIndex,
  'failed PDF queue should appear after report metrics'
);

assert.ok(
  failedQueueIndex < linksIndex,
  'failed PDF queue should appear before report links'
);

assert.ok(
  css.includes('.latest-action-summary strong'),
  'latest-action-summary emphasized styling should exist'
);

assert.ok(
  css.includes('.failed-pdf-queue'),
  'failed PDF queue styling should exist'
);

console.log('latestReportUiStructure.test.js passed');
