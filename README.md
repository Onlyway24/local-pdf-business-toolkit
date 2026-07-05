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
