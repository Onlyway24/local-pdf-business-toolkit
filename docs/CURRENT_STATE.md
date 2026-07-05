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
