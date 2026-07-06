# Local PDF Business Toolkit

Local PDF Business Toolkit is a local-first document organization tool.

It takes a messy folder of client documents and generates a clean, reviewed, client-ready delivery pack.

The toolkit can:

- scan folders
- scan nested folders
- classify documents by filename
- detect duplicate file names
- detect duplicate file contents
- create folder inspections
- generate organization plans
- create client-ready packs
- generate professional README files
- create ZIP archives
- run a full demo flow in one command

## Why This Exists

Many people and small businesses have messy document folders.

Examples:

- freelancers
- consultants
- agencies
- accountants
- students
- small offices
- real estate operators
- local businesses

This tool helps transform messy document folders into organized, reviewable and deliverable client packs.

## Example Use Case

Input folder:

    client-folder/
      backup/
        contratto.pdf
      contracts/
        contratto.pdf
      fattura.pdf

Generated output:

    outputs/client-packs/cliente-duplicati-<timestamp>/
      README.md
      documents/
        contracts/
          contratto.pdf
          contratto-2.pdf
        invoices/
          fattura.pdf
      reports/
        inspection.md
        organization-plan.md

Generated ZIP:

    outputs/client-packs/cliente-duplicati-<timestamp>.zip

## Core Commands

Run tests:

    npm test

Inspect a folder:

    node src/index.js inspect samples

Inspect a folder with local PDF text extraction:

    node src/index.js inspect-pdf-text samples

Or run the shortcut:

    npm run inspect:pdf-text

The command saves Markdown and HTML reports under outputs/reports/.
Unreadable or invalid PDF files are handled safely and reported as extraction failures.

Create a client pack:

    node src/index.js client-pack samples "Mario Rossi"

Create a ZIP from the latest client pack:

    npm run zip:latest

Run the full demo:

    npm run demo:full

Run the duplicate warning demo:

    npm run demo:full:review

## Full Demo

The full demo command creates a complete deliverable in one flow:

    npm run demo:full

It creates:

- a client pack folder
- README.md
- inspection report
- organization plan
- ZIP archive
- full demo report

## Duplicate Detection

The toolkit detects:

- duplicate file names
- duplicate file contents

If duplicates are found, the status becomes:

    NEEDS REVIEW

This prevents risky client delivery.

## Delivery Status

Generated client pack README files include:

- generated timestamp
- client name
- source folder
- delivery status
- readiness score
- delivery recommendation
- duplicate warnings when needed
- included files with actual copied paths

Example ready status:

    Status: READY
    Readiness score: 100%
    Delivery recommendation: ready to deliver.

Example review status:

    Status: NEEDS REVIEW
    Readiness score: 100%
    Delivery recommendation: review before delivery.

## Project Philosophy

This project is local-first.

It does not modify the original source folder.

Generated outputs are saved under:

    outputs/

The source documents remain untouched.

## Current Status

The project currently supports a working end-to-end flow:

    messy folder -> scan -> inspect -> organize -> client pack -> ZIP

## Business Use Cases

This toolkit can support services such as:

- organizing client onboarding documents
- preparing accountant document packs
- cleaning folders before delivery
- checking duplicate contracts or invoices
- preparing real estate document bundles
- organizing student or office archives
- creating reviewable client folders before sending them
- generating ZIP archives for delivery

## Example Service Offer

A simple service based on this tool could be:

"I organize your messy document folder into a clean client-ready ZIP with reports, duplicate checks and a delivery README."

## What The Client Receives

The client can receive:

- a cleaned document folder
- organized document categories
- duplicate warnings if needed
- inspection report
- organization report
- README summary
- final ZIP archive

## Local-First Advantage

The tool runs locally.

That means source documents do not need to be uploaded to third-party services during processing.

This is useful when working with sensitive files such as:

- contracts
- invoices
- identity documents
- business documents
- private archives

## Local Web UI

Run the local web interface:

    npm run ui

Then open:

    http://localhost:3000

The web UI lets you run the available local commands from the browser.

Recommended PDF text workflow:

1. Enter a folder path, for example `samples`.
2. Select `Ispeziona Testo PDF (PDF Text)`.
3. Run the analysis.
4. Open the generated HTML report from the result card.

Everything runs locally. Files are not uploaded to a cloud service.

## PDF Text Inspection Reports

Run PDF text inspection from the CLI:

    npm run inspect:pdf-text

Run the sample PDF report demo:

    npm run demo:pdf-report

This demo command runs PDF text inspection on the included `samples` folder and generates Markdown and HTML reports under `outputs/reports/`.

The command scans the selected folder, attempts local PDF text extraction, and saves reports under:

    outputs/reports/

For every run, the toolkit creates:

- a Markdown report
- an HTML report

The HTML report includes:

- Executive Summary
- recommended action
- folder summary
- PDF extraction summary
- per-file PDF status
- page count
- text preview when available
- extraction errors when a PDF cannot be read

The Executive Summary is written in client-facing language. It explains whether the folder is ready, partially ready, or needs review.

## Known Limitations

- Classification is currently filename-based.
- The demo PDFs in `samples/` are placeholder files, so extraction failure is expected for them.
- Scanned PDFs may require OCR, which is not currently implemented.
- Human review is still required before sending real client deliverables.
- The local web UI is intended for local use, not public deployment.
