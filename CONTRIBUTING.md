# Contributing

This project is a local-first document organization toolkit.

## Before Changing Code

Read these files first:

- README.md
- docs/CURRENT_STATE.md

## Main Rule

Before committing or pushing changes, always run:

    npm test

Do not push if tests fail.

## Workflow

Recommended workflow:

1. Pull latest changes:

       git pull origin main

2. Create or edit files.

3. Run tests:

       npm test

4. Commit changes:

       git add .
       git commit -m "Describe the change"

5. Push:

       git push origin main

## Project Safety

Do not commit real client documents.

Do not commit:

- real identity documents
- private contracts
- real invoices
- sensitive business files
- generated outputs

Generated files should stay inside:

    outputs/

## Collaboration Notes

Keep changes small and clear.

Prefer one feature per commit.

If unsure, open an issue or ask before changing core architecture.
