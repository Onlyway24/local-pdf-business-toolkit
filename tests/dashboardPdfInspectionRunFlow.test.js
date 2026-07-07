const assert = require('assert');
const fs = require('fs');

const app = fs.readFileSync('public/app.js', 'utf8');
const html = fs.readFileSync('public/index.html', 'utf8');

const functionStart = app.indexOf('async function runPdfInspectionFromDashboard()');
assert.notStrictEqual(
  functionStart,
  -1,
  'runPdfInspectionFromDashboard should exist'
);

const functionEnd = app.indexOf('\n}', functionStart);
assert.notStrictEqual(
  functionEnd,
  -1,
  'runPdfInspectionFromDashboard should have a closing brace'
);

const runFlow = app.slice(functionStart, functionStart + 1600);

assert.ok(
  runFlow.includes('const folderPath = getFolderPathInputValue();'),
  'Run flow should read the current folder path input'
);

assert.ok(
  runFlow.includes("fetch('/api/run'"),
  'Run flow should call the /api/run endpoint'
);

assert.ok(
  runFlow.includes("method: 'POST'"),
  'Run flow should use POST'
);

assert.ok(
  runFlow.includes("command: 'inspect-pdf-text'"),
  'Run flow should send the inspect-pdf-text command'
);

assert.ok(
  runFlow.includes('folderPath'),
  'Run flow should send folderPath'
);

assert.ok(
  runFlow.includes('PDF inspection complete. Dashboard refreshed.'),
  'Run flow should show success status mentioning dashboard refresh'
);

assert.ok(
  runFlow.includes('await loadLatestReport();'),
  'Run flow should refresh the Latest Report after success'
);

assert.ok(
  runFlow.includes('await loadRecentReports();'),
  'Run flow should refresh Recent Reports after success'
);

assert.ok(
  runFlow.includes('PDF inspection failed:'),
  'Run flow should show failure feedback'
);

assert.ok(
  html.includes('id="folder-path"'),
  'Dashboard should expose a folder path input'
);

assert.ok(
  html.includes('id="run-pdf-inspection"'),
  'Dashboard should expose a Run PDF Inspection button'
);

assert.ok(
  html.includes('id="pdf-inspection-status"'),
  'Dashboard should expose a PDF inspection status area'
);

console.log('dashboardPdfInspectionRunFlow.test.js passed');
