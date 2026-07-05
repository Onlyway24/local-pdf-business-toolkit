# Release Notes

## v0.1.0 - Local PDF Business Toolkit

First stable working version of the Local PDF Business Toolkit.

This release provides a local-first workflow for scanning, organizing, inspecting and packaging business document folders.

## Included Features

- Local CLI interface
- Folder scanning
- Nested folder scanning
- Filename-based document classification
- Organization plan generation
- Folder inspection reports
- Preview pack reports
- Client-ready pack generation
- Client README generation
- Duplicate file name detection
- Duplicate file content detection
- READY and NEEDS REVIEW status support
- ZIP export for client packs
- Full demo command
- Duplicate review demo command
- GitHub Actions test workflow
- Public GitHub repository
- Collaboration guide
- Issue templates
- Early local web interface draft
- Local PDF text extraction command
- Saved Markdown reports for PDF text inspection
- HTML reports for PDF text inspection

## Main Commands

Run all tests:

    npm test

Run full demo:

    npm run demo:full

Run duplicate review demo:

    npm run demo:full:review

Run local web interface:

    npm run ui

Create client pack:

    node src/index.js client-pack samples "Mario Rossi"

Inspect folder:

    node src/index.js inspect samples

Create ZIP from latest client pack:

    npm run zip:latest

## Local Web Interface

The project includes an early local web interface.

Start it with:

    npm run ui

Then open:

    http://localhost:3000

The web interface is an early draft and should remain local-first.

## Safety Notes

- Original source folders are not modified.
- Generated outputs go under outputs/.
- Real client documents must not be committed.
- Human review is still required before real delivery.

## Known Limitations

- Classification is currently filename-based.
- PDF text extraction is available through a dedicated local inspection command.
- Categories are not configurable yet.
- HTML report export is not implemented yet.
- The web interface is still an early draft.

## Next Improvements

- Integrate PDF text previews into reports
- Add configurable categories
- Add HTML report export
- Improve the local web interface
- Improve duplicate warning display in the UI
