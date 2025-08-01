# Botmaster RFCs

This directory contains technical RFCs (Request for Comments) for the Botmaster ecosystem.

## Apps

- **botmaster-api:** Central backend for business logic
- **botmaster-orchestrator:** Web app for orchestrating workers, workflows, and processes
- **jobmaster:** Agent running on users’ machines, executes workers
- **jobmaster-gui:** Optional Electron GUI for jobmaster agent
- **shared:** RFCs affecting multiple apps or the whole ecosystem

## How to Propose an RFC

1. **Copy `rfc-template.md`** to the appropriate app folder (or `shared/`).
2. Name the file with a unique number and descriptive title: `0001-feature-title.md`
3. Fill out all sections. Keep everything in English.
4. Open a PR with the RFC. Use PR comments for discussion and feedback.
5. After consensus, mark RFC as `Final` and merge.
6. Update the changelog section for major edits.

## RFC Index

- [Template](./rfc-template.md)
- [API RFCs](./api/)
- [Orchestrator RFCs](./orchestrator/)
- [Jobmaster RFCs](./jobmaster/)
- [Jobmaster-GUI RFCs](./jobmaster-gui/)
- [Shared RFCs](./shared/)