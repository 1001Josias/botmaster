# Botmaster RFCs (Request for Comments)

This directory contains the RFC (Request for Comments) process for proposing, discussing, and documenting significant technical changes to the Botmaster ecosystem. All RFCs are written in English to ensure clarity and enable universal collaboration across the development team and community.

## What is an RFC?

An RFC is a design document that describes a new feature, process, or significant change to the Botmaster ecosystem. RFCs provide a structured way to propose ideas, gather feedback, and build consensus before implementing major changes.

RFCs are particularly valuable for:

- New features that affect multiple applications in the ecosystem
- Architectural changes that impact system design
- Breaking changes that affect backward compatibility
- Process changes that affect how the team works
- Major refactoring efforts
- Performance or security improvements

## The Botmaster Ecosystem

The Botmaster ecosystem consists of multiple interconnected applications:

- **api** (`/apps/api/`) - Backend service containing all business logic
- **web** (`/apps/web/`) - Web application for orchestrating workers, workflows, processes, queues and others resources available
- **jobmaster** - Background agent responsible for executing worker code on target machines
- **jobmaster-gui** (`/apps/jobmaster-gui/`) - Optional Electron application providing UI for jobmaster status and configuration
- **packages** (`/packages/`) - Common libraries and utilities used across applications

## When to Write an RFC

Consider writing an RFC when:

- **Cross-application impact**: The change affects multiple applications in the ecosystem
- **Architectural significance**: The change involves significant architectural decisions
- **Breaking changes**: The change will break existing APIs or workflows
- **Complex implementation**: The change requires coordination across teams or extended development time
- **Resource requirements**: The change requires significant infrastructure or development resources
- **Community impact**: The change affects how users interact with the system

## RFC Workflow

### 1. Proposing an RFC

1. **Copy the template**: Use [`rfc-template.md`](./rfc-template.md) as the starting point
2. **Create a new file**: Place it in the appropriate application's `docs/rfcs/` directory (or `shared/` for cross-cutting concerns) and name it `XXXX-brief-title.md` where `XXXX` is the next available RFC number (start with `0001`)
3. **Fill out the template**: Complete all relevant sections
4. **Submit as Draft**: Create a Pull Request with the status set to "Draft"

**Example RFC placement**: 
- Application-specific RFC: `apps/api/docs/rfcs/0001-user-authentication-system.md`
- Cross-application RFC: `apps/docs/rfcs/shared/0001-unified-logging-strategy.md`

### 2. Discussion Phase

1. **Open Pull Request**: Submit your RFC as a PR to the main branch
2. **Label the PR**: Add the `rfc` label to the pull request
3. **Share widely**: Notify relevant team members and stakeholders
4. **Engage in discussion**: Respond to comments and questions on the PR
5. **Iterate**: Update the RFC based on feedback by pushing new commits to the PR

**Discussion Guidelines**:

- Keep discussions technical and constructive
- Focus on the proposal's merits and potential issues
- Consider alternative approaches and trade-offs
- Document major decisions in the "Discussion History" section

### 3. Review Process

The RFC goes through several review stages:

#### Technical Review

- **Architecture review**: Ensure the proposal aligns with system architecture
- **Security review**: Assess security implications
- **Performance review**: Evaluate performance impact
- **Testing strategy review**: Validate testing approach

#### Stakeholder Review

- **Product review**: Ensure alignment with product goals
- **Operations review**: Consider deployment and maintenance implications
- **Documentation review**: Verify documentation requirements

### 4. Decision Making

RFCs can have the following outcomes:

- **Accepted**: The RFC is approved for implementation and merged
- **Rejected**: The RFC PR is closed without merging (with reasons documented in PR comments)
- **Deferred**: The RFC is postponed for future consideration and merged with "Deferred" status
- **Superseded**: The RFC is replaced by a newer RFC

### 5. Implementation Phase

Once accepted:

1. **Update status**: Change RFC status field in the document to "Accepted"
2. **Create implementation tasks**: Break down the RFC into actionable tasks
3. **Track progress**: Update the RFC with implementation progress
4. **Update status**: Change status field to "Implemented" when complete

### 6. Post-Implementation

- **Retrospective**: Document lessons learned
- **Update documentation**: Ensure all documentation reflects the changes
- **Monitor metrics**: Track success metrics defined in the RFC

## RFC Lifecycle

```
Draft → In Review → [Accepted|Deferred] → Implemented
                      ↓         ↓
                  Superseded   Rejected (PR closed)
```

## RFC Status Definitions

Each RFC progresses through clearly defined statuses:

- **Draft**: Initial RFC proposal submitted as a Pull Request, open for discussion and iteration
- **In Review**: RFC is undergoing formal technical and stakeholder review process
- **Accepted**: RFC has been approved for implementation after review process
- **Rejected**: RFC PR is closed without merging (reasons documented in PR discussion)
- **Deferred**: RFC is postponed for future consideration and merged with this status
- **Implemented**: Accepted RFC has been fully implemented and deployed
- **Superseded**: RFC has been replaced by a newer, more comprehensive RFC

**Note**: Rejected RFCs are handled by closing the Pull Request rather than merging. This keeps RFC directories clean while preserving the discussion history in the closed PR.

### Status Tracking

RFC statuses are maintained directly within each RFC document:

- Each RFC file contains a **Status** field at the top of the document
- When an RFC's status changes, this field is updated and the change is committed to the repository
- Status updates are tracked through Git history, providing a complete audit trail
- The status field should be updated whenever the RFC progresses through its lifecycle

## Directory Structure

The RFC structure is **decentralized** - each application maintains its own RFCs in their respective `docs/rfcs` directories:

```
botmaster/
├── apps/
│   ├── docs/rfcs/              # Central documentation and shared resources
│   │   ├── README.md           # This file (process documentation)
│   │   ├── rfc-template.md     # RFC template for all apps
│   │   └── shared/             # Cross-cutting concerns and ecosystem-wide RFCs
│   ├── api/docs/rfcs/          # Backend API and services RFCs
│   ├── web/docs/rfcs/          # Web orchestration interface RFCs
│   ├── jobmaster/docs/rfcs/    # Agent application RFCs
│   └── jobmaster-gui/docs/rfcs/ # Desktop GUI application RFCs
└── packages/                   # Common libraries (no RFCs - use shared/ instead)
```

## RFC Numbering

- RFCs are numbered sequentially starting from `0001`
- Use zero-padded 4-digit numbers (e.g., `0001`, `0042`, `0123`)  
- Numbers are assigned when the RFC PR is created
- Only merged RFCs (Accepted, Deferred, Implemented, Superseded) consume numbers
- Rejected RFCs don't consume numbers as they are closed without merging

## Writing Guidelines

### Structure

- Follow the template structure closely
- Use clear, concise language
- Include concrete examples where helpful
- Reference other RFCs when relevant

### Technical Details

- Provide sufficient technical detail for implementation
- Include data models, API specifications, and configuration changes
- Consider migration paths for existing systems
- Address security and performance implications

### Scope

- Keep RFCs focused on a single major change or feature
- Break large proposals into multiple RFCs if necessary
- Clearly define what is and isn't included in the scope

## Best Practices

### For Authors

- **Start with a problem statement**: Clearly articulate the problem you're solving
- **Consider alternatives**: Document why other approaches weren't chosen
- **Think about edge cases**: Consider how the proposal handles unusual scenarios
- **Plan for rollback**: Consider how to undo changes if needed
- **Engage early**: Share drafts informally before submitting formal PRs

### For Reviewers

- **Be constructive**: Provide specific, actionable feedback
- **Ask questions**: Help clarify unclear aspects
- **Consider broader impact**: Think about ecosystem-wide implications
- **Suggest alternatives**: Propose different approaches when appropriate
- **Review thoroughly**: Consider all aspects - technical, security, performance, usability

### For Everyone

- **Stay focused**: Keep discussions on-topic and relevant
- **Be respectful**: Maintain professional and collaborative tone
- **Document decisions**: Capture important decisions in the RFC
- **Follow up**: Ensure implementation matches the accepted RFC

## RFC Index

Browse RFCs by application:

- [**RFC Template**](./rfc-template.md) - Use this template for creating new RFCs
- [**API RFCs**](../../api/docs/rfcs/) - Backend API and services
- [**Web RFCs**](../../web/docs/rfcs/) - Web orchestration interface
- [**Jobmaster RFCs**](./jobmaster/) - Agent application
- [**Jobmaster-GUI RFCs**](./jobmaster-gui/) - Desktop GUI application
- [**Shared RFCs**](./shared/) - Cross-cutting concerns and ecosystem-wide changes

## Getting Started

1. **Identify the scope**: Determine which application(s) your proposal primarily affects
2. **Review existing RFCs**: Check the relevant application folder(s) for related proposals
3. **Use the template**: Copy `rfc-template.md` and fill out all sections thoroughly
4. **Engage early**: Consider opening a draft PR or discussion issue before finalizing your RFC
5. **Follow up**: Track implementation progress and update the RFC as needed

## FAQ

### Q: Do all changes need an RFC?

A: No. RFCs are for significant changes. Bug fixes, small features, and routine maintenance typically don't need RFCs.

### Q: Can I update an implemented RFC?

A: Yes, but prefer creating a new RFC for major changes. Minor updates (clarifications, links) can be made directly.

### Q: What if my RFC is rejected?

A: The RFC PR will be closed without merging, with detailed feedback provided in the PR discussion. The conversation history is preserved, and you can create a new RFC addressing the concerns later if desired.

### Q: How long should the review process take?

A: It depends on complexity, but aim for 1-2 weeks for most RFCs. Complex RFCs may take longer.

### Q: Can I implement before the RFC is accepted?

A: Generally no. Wait for acceptance, but prototyping to validate assumptions is okay if clearly marked as experimental.

## Resources

- [RFC Template](./rfc-template.md) - Use this as your starting point
- [GitHub PR Labels](../../../labels) - Use the `rfc` label for RFC pull requests

## Examples

As RFCs are created and implemented, this section will link to good examples of:

- Well-structured RFCs
- RFCs with good discussion threads
- RFCs showing effective iteration based on feedback

---

For questions about the RFC process, please open an issue or discussion in this repository.
