# LOCAL PDF BUSINESS TOOLKIT - CURRENT STATE

## Purpose

This document records the verified current state of the project.

It must be updated after meaningful milestones so the project can be continued without relying on chat history.

---

## Project

Local PDF Business Toolkit

Location:

Only-Way-Laboratory/projects/003-local-pdf-business-toolkit

Goal:

Build a local-first terminal toolkit for scanning, organizing, classifying and reporting business document folders without paid API tokens.

---

## Current Architecture

Current structure:

src/
  index.js

  commands/
    scanCommand.js

  core/
    classifyDocument.js
    createReport.js
    scanFolder.js

  errors/
    AppError.js

  output/
    saveReport.js

  validation/
    validateFolderPath.js

tests/
  classifyDocument.test.js
  scanFolder.test.js

samples/
  cliente-contratto.pdf
  documento-identita.txt
  fattura-gennaio.pdf

input/
  user-provided local documents

outputs/
  generated reports ignored by Git

---

## Implemented Capabilities

The tool can currently:

1. Run from terminal.
2. Scan a local folder.
3. Validate that the folder exists.
4. Validate that the path is a folder.
5. Read files in the selected folder.
6. Collect basic file metadata:
   - file name
   - extension
   - size
   - modified date
7. Classify documents by filename.
8. Generate a Markdown report.
9. Save the report into outputs/.
10. Run demo and scan commands through npm scripts.
11. Run automatic tests without external libraries.

---

## Available Commands

Start help:

npm start

Scan input folder:

npm run scan

Scan sample folder:

npm run demo

Direct command:

node src/index.js scan samples

---

## Current Document Classification

The project currently classifies documents into:

- Contract
- Invoice
- Identity Document
- Quote or Proposal
- CV or Resume
- Unknown

Classification is currently based on filename keywords.

No PDF text extraction exists yet.

No OCR exists yet.

No AI model is used yet.

---

## Tests

Current test command:

npm test

Current tests:

- classifyDocument.test.js
- scanFolder.test.js

The tests verify:

- document classification rules
- scanning the sample folder
- expected file count
- expected demo filenames
- document type assignment

---

## Design Rules

The project follows this structure:

index.js
  -> command
    -> validation
    -> core logic
    -> report generation
    -> output writer

Rules:

- index.js must stay thin
- commands coordinate work
- core modules contain pure or focused logic
- validation is separated
- output writing is separated
- original input files must not be modified by scan commands
- outputs must go into outputs/
- generated outputs must stay ignored by Git
- no paid API requirement
- no MV-AI-OS dependency

---

## Current Limitations

The tool does not yet:

- scan nested folders
- extract PDF text
- rename files
- create client folders
- copy files into organized packs
- detect missing documents
- generate CSV reports
- generate JSON reports
- support real OCR
- use local AI models
- support drag-and-drop or GUI

---

## Next Recommended Milestone

Add a safe file planning command.

The command should not rename files immediately.

It should only generate a proposed organization plan.

Possible command:

node src/index.js plan samples

The plan should suggest:

- clean filename
- detected document type
- target folder
- whether the file is already clean
- whether manual review is needed

This keeps the project safe and professional.


---

# Update - Safe Organization Plan Command

## Added Capability

The project now includes a safe planning command:

node src/index.js plan <folder>

Available npm command:

npm run demo:plan

## What The Plan Command Does

The plan command:

1. validates the selected folder
2. scans the folder
3. classifies each document
4. generates a clean proposed filename
5. suggests a target folder
6. creates a proposed path
7. marks whether the file is already clean
8. marks whether manual review is needed
9. saves an organization plan report in outputs/

## Safety Rule

The plan command does not rename, move, copy, delete, or modify original files.

It only produces a proposed organization report.

This makes it safe to run on real client folders.

## New Core Files

- src/core/createCleanFileName.js
- src/core/getTargetFolder.js
- src/core/createOrganizationPlan.js
- src/core/createPlanReport.js

## New Command File

- src/commands/planCommand.js

## Updated Files

- src/index.js
- src/output/saveReport.js
- package.json

## New Tests

- tests/createCleanFileName.test.js
- tests/createOrganizationPlan.test.js

## Important Bug Fixed

A filename cleaning bug was found by tests.

Problem:

Contratto Cliente Finale.PDF became:

contratto-cliente-finale-pdf.pdf

Cause:

Uppercase extension handling was incorrect.

Fix:

The original extension is now used to remove the extension from the basename, while the final extension is normalized to lowercase.

## Quality Rule Added

Before committing any feature, run:

npm test

A feature is not complete if tests fail.

---

# Update - Preview Pack Command

## Added Capability

The project now includes a preview pack command:

node src/index.js preview <folder>

Available npm commands:

npm run preview
npm run demo:preview

## What The Preview Command Does

The preview command:

1. validates the selected folder
2. scans the folder
3. classifies each document
4. creates an organization plan
5. creates a copied preview pack inside outputs/preview-pack/
6. organizes copied files into target folders
7. saves a preview report inside outputs/

Example output structure:

outputs/preview-pack/
  contracts/
    cliente-contratto.pdf

  invoices/
    fattura-gennaio.pdf

  identity-documents/
    documento-identita.txt

## Safety Rule

The preview command does not modify original files.

It only copies files into outputs/preview-pack/.

This makes it safe to run before any real rename, move, or destructive operation.

## New Files

- src/commands/previewCommand.js
- src/core/createPreviewPackReport.js
- src/output/createPreviewPack.js
- tests/createPreviewPack.test.js

## Updated Files

- src/index.js
- package.json

## Tests

The test suite now includes:

- classifyDocument.test.js
- scanFolder.test.js
- createCleanFileName.test.js
- createOrganizationPlan.test.js
- createPreviewPack.test.js

Current required verification:

npm test

## Current Product Level

The project is no longer just a scanner.

It can now:

- scan folders
- classify documents
- generate reports
- propose organization plans
- create safe copied preview packs

This is the first operational feature that can be demonstrated as a real local document organization service.

---

# Update - Folder Inspection Command

## Added Capability

The project now includes a folder inspection command:

node src/index.js inspect <folder>

Available npm commands:

npm run inspect
npm run demo:inspect

## What The Inspect Command Does

The inspect command:

1. validates the selected folder
2. scans the folder
3. classifies documents
4. counts PDF and non-PDF files
5. counts known and unknown documents
6. calculates a readiness score
7. assigns a business status
8. saves a folder inspection report in outputs/

## Current Inspection Statuses

Possible statuses:

- EMPTY
- READY
- PARTIAL
- NEEDS REVIEW

## Example Result

For the sample folder:

Status: READY
Readiness score: 100%
Total files: 3
PDF files: 2
Non-PDF files: 1
Known documents: 3
Needs review: 0

## New Files

- src/commands/inspectCommand.js
- src/core/inspectFolder.js
- src/core/createInspectionReport.js
- tests/inspectFolder.test.js

## Updated Files

- src/index.js
- package.json

## Product Value

The tool can now diagnose whether a document folder is ready to be organized or delivered.

This moves the project from simple file processing toward business-ready document operations.

---

# Update - Client Pack Command

## Added Capability

The project now includes a client pack command:

node src/index.js client-pack <folder>

Available npm commands:

npm run client-pack
npm run demo:client-pack

## What The Client Pack Command Does

The client-pack command:

1. validates the selected folder
2. scans the folder
3. classifies all documents
4. inspects folder readiness
5. creates an organization plan
6. creates a client-ready folder inside outputs/client-pack/
7. copies organized documents into typed folders
8. generates a README.md for the pack
9. generates inspection and organization reports
10. saves a summary report inside outputs/

## Output Structure

Example output:

outputs/client-pack/
  README.md
  documents/
    contracts/
      cliente-contratto.pdf
    invoices/
      fattura-gennaio.pdf
    identity-documents/
      documento-identita.txt
  reports/
    inspection.md
    organization-plan.md

## Safety Rule

The client-pack command does not modify original files.

It only creates a copied deliverable pack inside outputs/client-pack/.

## New Files

- src/commands/clientPackCommand.js
- src/core/createClientPackReadme.js
- src/output/createClientPack.js
- tests/createClientPack.test.js

## Updated Files

- src/commands/commandRouter.js
- src/index.js
- package.json

## Product Value

This is the first clearly sellable feature of the project.

The tool can now take a document folder and generate a clean, organized, client-ready pack with documentation and reports.

This can be presented as a local document organization service for freelancers, consultants, small offices, accountants, agencies, or anyone who handles messy client folders.

## Current Quality Status

Current required verification:

npm test

Current tested features:

- document classification
- folder scanning
- filename cleaning
- organization planning
- preview pack creation
- folder inspection
- command routing
- client pack creation

---

# Update - Timestamped Client Packs

## Improvement

Client packs are now timestamped.

Before:

outputs/client-pack/

Now:

outputs/client-packs/client-pack-<timestamp>/

## Why This Matters

The previous implementation reused the same output folder every time.

That was acceptable for demos, but not safe enough for real client work because a new execution could overwrite the previous generated pack.

The new implementation creates a separate client pack folder for every run.

## Example

outputs/client-packs/client-pack-2026-07-05T16-39-12-724Z/

## Safety Improvement

This makes the client-pack command safer for repeated real-world use.

Each generated pack remains preserved unless the user manually deletes it.

## Updated Files

- src/output/createClientPack.js
- tests/createClientPack.test.js

## Verification

The test suite verifies that generated client packs are stored under:

outputs/client-packs/client-pack-*

---

# Update - ZIP Export For Client Packs

## Added Capability

The project now includes a ZIP export command:

node src/index.js zip-client-pack <client-pack-folder>

Available npm command:

npm run zip:latest

## What The ZIP Export Does

The ZIP export command:

1. validates that the selected client pack folder exists
2. validates that the selected path is a folder
3. creates a .zip archive next to the client pack folder
4. saves a ZIP export report inside outputs/

## Example

Input folder:

outputs/client-packs/client-pack-2026-07-05T16-44-33-500Z/

Generated ZIP:

outputs/client-packs/client-pack-2026-07-05T16-44-33-500Z.zip

## Product Value

This makes the client pack easier to deliver.

Instead of sending a folder manually, the user can now send one ZIP file to a client.

This moves the tool closer to a real paid workflow.

## New Files

- src/commands/zipClientPackCommand.js
- src/output/createZipFromFolder.js
- tests/createZipFromFolder.test.js

## Updated Files

- src/commands/commandRouter.js
- src/index.js
- package.json

## Current Tested Features

The test suite now covers:

- document classification
- folder scanning
- filename cleaning
- organization planning
- preview pack creation
- folder inspection
- command routing
- client pack creation
- ZIP export
