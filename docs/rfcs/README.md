# Botmaster RFCs

This directory contains technical RFCs (Request for Comments) for the Botmaster ecosystem. All RFCs are written in English to ensure clarity and enable universal collaboration across the development team and community.

## Applications Overview

The Botmaster ecosystem consists of several interconnected applications:

- **api** (`/apps/api/`) - Central backend API providing business logic, data persistence, and coordination services for the entire ecosystem
- **orchestrator** (`/apps/web/`) - Web-based orchestration interface for managing workers, workflows, and processes across the distributed system
- **jobmaster** - Agent application running on users' machines that executes workers and communicates with the central API
- **jobmaster-gui** (`/apps/jobmaster-gui/`) - Optional Electron-based GUI providing a user-friendly interface for the jobmaster agent
- **shared** - RFCs affecting multiple applications, shared libraries, or ecosystem-wide architectural decisions

## RFC Process

### How to Propose an RFC

1. **Copy the template**: Copy [`rfc-template.md`](./rfc-template.md) to the appropriate application folder based on the primary scope of your proposal.

2. **Name your RFC**: Use the format `NNNN-descriptive-title.md` where NNNN is the next available number (start with 0001).

3. **Fill out all sections**: Complete all sections in the template. Write in clear English and provide sufficient detail for reviewers to understand the proposal.

4. **Specify target applications**: Clearly indicate which applications are affected in the "Target Application(s)" field.

5. **Open a Pull Request**: Submit your RFC as a PR. Use the PR description to summarize the proposal and mention any relevant stakeholders.

6. **Iterate based on feedback**: Address comments and feedback from reviewers. Update the RFC document as needed.

7. **Mark as Final**: Once consensus is reached, update the status to "Final" and merge the PR.

8. **Implementation tracking**: Link the RFC to implementation issues/PRs and update the changelog for significant revisions.

### RFC Guidelines

- **Write in English**: All RFCs must be written in English for universal accessibility and collaboration
- **Be thorough**: Include detailed technical specifications, examples, and migration strategies
- **Consider impact**: Address security, performance, and compatibility implications
- **Provide alternatives**: Discuss alternative approaches and explain why the proposed solution is preferred
- **Plan for migration**: Include rollout strategies and backward compatibility considerations

## RFC Index

Browse RFCs by application:

- [**RFC Template**](./rfc-template.md) - Use this template for creating new RFCs
- [**API RFCs**](./api/) - Backend API and services
- [**Orchestrator RFCs**](./orchestrator/) - Web orchestration interface
- [**Jobmaster RFCs**](./jobmaster/) - Agent application
- [**Jobmaster-GUI RFCs**](./jobmaster-gui/) - Desktop GUI application
- [**Shared RFCs**](./shared/) - Cross-cutting concerns and ecosystem-wide changes

## Getting Started

1. **Identify the scope**: Determine which application(s) your proposal primarily affects
2. **Review existing RFCs**: Check the relevant application folder(s) for related proposals
3. **Use the template**: Copy `rfc-template.md` and fill out all sections thoroughly
4. **Engage early**: Consider opening a draft PR or discussion issue before finalizing your RFC
5. **Follow up**: Track implementation progress and update the RFC as needed

For questions about the RFC process, please open an issue or discussion in this repository.