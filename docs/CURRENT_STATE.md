# Current State

## Project

Local PDF Business Toolkit

## Version

Current released tag:

    v0.1.0

Latest main branch includes:

- public GitHub repository
- active collaborator with write access
- contribution guidelines
- Italian collaboration guide
- GitHub issue templates
- release notes document
- GitHub Actions test workflow
- local web interface draft
- working CLI
- local tests passing
- online tests passing

## Repository

Public repository:

    https://github.com/Onlyway24/local-pdf-business-toolkit

## Purpose

This project is a local-first document organization toolkit.

It helps turn messy local folders into clean, reviewable, client-ready delivery packs.

## Current Capabilities

The toolkit can:

- scan local folders
- scan nested folders recursively
- classify documents by filename
- create organization plans
- inspect folders
- create preview pack reports
- create client-ready packs
- generate README files for client packs
- detect duplicate file names
- detect duplicate file contents
- mark risky folders as NEEDS REVIEW
- create ZIP archives
- run full demo flows

## Main Commands

Run tests:

    npm test

Run full ready demo:

    npm run demo:full

Run duplicate review demo:

    npm run demo:full:review

Create a client pack:

    node src/index.js client-pack samples "Mario Rossi"

Inspect a folder:

    node src/index.js inspect samples

Create ZIP from latest client pack:

    npm run zip:latest

## Current Safety Rules

- Original source folders are not modified.
- Generated files go under outputs/.
- Real client documents must not be committed.
- Tests must pass before commit or push.

## Collaboration Rules

Main branch is the stable branch.

Before changing code:

1. Pull latest main.
2. Read README.md.
3. Read CONTRIBUTING.md.
4. Read this file.
5. Make a small change.
6. Run npm test.
7. Commit.
8. Push.

## Known Limitations

- Classification is currently filename-based.
- PDF text content is not extracted yet.
- Web interface exists as an early local draft.
- Human review is still required before sending real client deliverables.
- Categories are not configurable yet.

## Next Recommended Improvements

1. Add PDF text extraction.
2. Add configurable document categories.
3. Add HTML report export.
4. Improve local web interface.
