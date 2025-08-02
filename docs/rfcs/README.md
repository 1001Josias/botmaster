# Botmaster RFCs

This directory contains technical RFCs (Request for Comments) for the Botmaster ecosystem. All RFCs are written in English to ensure clarity and enable universal collaboration across the development team and community.

## What is an RFC?

A Request for Comments (RFC) is a formal document that describes a method, behavior, research, or innovation applicable to the Botmaster ecosystem. RFCs are used to propose major changes, new features, architectural decisions, and establish technical standards across the project.

## When to Write an RFC

You should write an RFC when you want to:

### Scope Criteria

- **Major architectural changes** - Significant modifications to system design or component interactions
- **New features** - Adding substantial functionality that affects multiple parts of the system
- **Breaking changes** - Any change that could break existing APIs, workflows, or user expectations
- **Cross-application impact** - Changes affecting multiple applications in the ecosystem
- **Performance-critical changes** - Modifications that could significantly impact system performance
- **Security implications** - Changes involving authentication, authorization, or data security
- **External dependencies** - Adding or changing external service integrations
- **Data model changes** - Modifications to database schemas or core data structures

### When RFC is NOT Required

- **Bug fixes** - Simple bug fixes that don't change behavior
- **Minor improvements** - Small enhancements within existing functionality
- **Documentation updates** - Non-technical documentation changes
- **Configuration changes** - Environment or deployment configuration adjustments
- **Dependency updates** - Routine dependency version updates without behavioral changes

## Applications Overview

The Botmaster ecosystem consists of several interconnected applications:

- **api** (`/apps/api/`) - Central backend API providing business logic, data persistence, and coordination services for the entire ecosystem
- **orchestrator** (`/apps/web/`) - Web-based orchestration interface for managing workers, workflows, and processes across the distributed system
- **jobmaster** - Agent application running on users' machines that executes workers and communicates with the central API
- **jobmaster-gui** (`/apps/jobmaster-gui/`) - Optional Electron-based GUI providing a user-friendly interface for the jobmaster agent
- **shared** - RFCs affecting multiple applications, shared libraries, or ecosystem-wide architectural decisions

## RFC Lifecycle

Every RFC goes through the following lifecycle stages:

### 1. Draft

- Initial version of the RFC
- Open for feedback and discussion
- Author actively incorporates feedback
- May undergo significant changes

### 2. Proposed

- RFC has reached stability
- Ready for implementation consideration
- Awaiting final approval from maintainers
- Only minor changes expected

### 3. Final

- Approved for implementation
- Serves as the authoritative specification
- Implementation may begin
- Changes require new RFC or amendment

### 4. Implemented

- Feature has been fully implemented
- RFC serves as historical documentation
- May reference implementation PRs/issues

### 5. Deprecated

- RFC is no longer valid
- Superseded by newer RFC or approach
- Kept for historical reference

## Directory Structure & Numbering

### Directory Organization

```
docs/rfcs/
├── README.md              # This file
├── rfc-template.md        # Template for new RFCs
├── api/                   # API-specific RFCs
├── orchestrator/          # Orchestrator web app RFCs
├── jobmaster/             # Jobmaster agent RFCs
├── jobmaster-gui/         # GUI application RFCs
└── shared/                # Cross-cutting RFCs
```

### Numbering System

- RFCs are numbered sequentially within each directory
- Format: `NNNN-descriptive-title.md` (e.g., `0001-user-authentication.md`)
- Start with `0001` for the first RFC in each directory
- Numbers are never reused, even if an RFC is deleted
- Find the next available number by checking existing files in the target directory

### File Naming Conventions

- Use lowercase letters and hyphens
- Keep titles concise but descriptive
- Avoid abbreviations unless commonly understood
- Examples:
  - ✅ `0001-worker-execution-model.md`
  - ✅ `0002-multi-tenant-api-design.md`
  - ❌ `0001-WEM.md`
  - ❌ `0002-Multi_Tenant_API_Design.md`

## RFC Process & Workflow

### How to Propose an RFC

1. **Copy the template**: Copy [`rfc-template.md`](./rfc-template.md) to the appropriate application folder based on the primary scope of your proposal.

2. **Name your RFC**: Use the format `NNNN-descriptive-title.md` where NNNN is the next available number (start with 0001).

3. **Fill out all sections**: Complete all sections in the template. Write in clear English and provide sufficient detail for reviewers to understand the proposal.

4. **Specify target applications**: Clearly indicate which applications are affected in the "Target Application(s)" field.

5. **Open a Pull Request**: Submit your RFC as a PR. Use the PR description to summarize the proposal and mention any relevant stakeholders.

6. **Iterate based on feedback**: Address comments and feedback from reviewers. Update the RFC document as needed.

7. **Mark as Final**: Once consensus is reached, update the status to "Final" and merge the PR.

8. **Implementation tracking**: Link the RFC to implementation issues/PRs and update the changelog for significant revisions.

### Detailed Workflow

#### Phase 1: Preparation

- [ ] Identify the problem or opportunity
- [ ] Research existing solutions and alternatives
- [ ] Determine which applications are affected
- [ ] Check for existing related RFCs
- [ ] Gather initial feedback informally

#### Phase 2: Drafting

- [ ] Copy the RFC template to appropriate directory
- [ ] Choose next available RFC number
- [ ] Complete all template sections thoroughly
- [ ] Include code examples and diagrams where helpful
- [ ] Review for clarity and completeness

#### Phase 3: Review Process

- [ ] Open Pull Request with RFC
- [ ] Tag relevant maintainers and stakeholders
- [ ] Address feedback and questions promptly
- [ ] Update RFC based on discussions
- [ ] Reach consensus on approach

#### Phase 4: Finalization

- [ ] Update status to "Final" when approved
- [ ] Merge the RFC PR
- [ ] Create implementation tracking issues
- [ ] Communicate approval to relevant teams

#### Phase 5: Implementation

- [ ] Reference RFC in implementation PRs
- [ ] Update RFC if implementation reveals issues
- [ ] Mark as "Implemented" when complete
- [ ] Update any related documentation

## Writing Guidelines

### Language and Style

- **Write in English**: All RFCs must be written in English for universal accessibility and collaboration
- **Use clear, concise language**: Avoid jargon and explain technical terms
- **Be objective**: Present facts and reasoning, avoid emotional language
- **Use active voice**: "The API will validate requests" vs "Requests will be validated"
- **Write for your audience**: Consider both technical and non-technical stakeholders

### Content Requirements

- **Be thorough**: Include detailed technical specifications, examples, and migration strategies
- **Provide context**: Explain the problem and why it needs solving
- **Consider impact**: Address security, performance, and compatibility implications
- **Include examples**: Code samples, configuration examples, usage scenarios
- **Plan for migration**: Include rollout strategies and backward compatibility considerations
- **Discuss alternatives**: Present other approaches and explain why the proposed solution is preferred

### Technical Specifications

- **Use diagrams**: Include architecture diagrams, flowcharts, or mockups where helpful
- **Provide APIs**: Define new interfaces, endpoints, or data structures clearly
- **Include error handling**: Describe failure modes and error responses
- **Consider edge cases**: Address unusual but possible scenarios
- **Specify testing**: Outline how the feature will be tested

### Documentation Structure

- **Follow the template**: Use all sections of the RFC template
- **Use consistent formatting**: Follow markdown conventions
- **Link to references**: Include links to related RFCs, issues, and external resources
- **Maintain changelog**: Track significant revisions with dates and descriptions

## Best Practices

### Before Writing

- **Start with a problem statement**: Clearly articulate what needs to be solved
- **Research thoroughly**: Understand existing solutions and prior art
- **Validate the need**: Ensure the RFC addresses a real problem
- **Consider timing**: Is this the right time for this change?
- **Identify stakeholders**: Who needs to review and approve this?

### During Writing

- **Start simple**: Begin with the core concept, add complexity gradually
- **Use examples liberally**: Show don't just tell
- **Think about edge cases**: What could go wrong?
- **Plan for the future**: How might this evolve over time?
- **Consider all users**: How does this affect different user types?

### Review Process

- **Be responsive**: Address feedback promptly and thoughtfully
- **Stay open-minded**: Be willing to change your approach
- **Document decisions**: Explain why certain feedback was or wasn't incorporated
- **Build consensus**: Work toward agreement rather than trying to "win"
- **Know when to stop**: Don't let perfect be the enemy of good

### Implementation

- **Reference the RFC**: Link to the RFC in all implementation PRs
- **Follow the spec**: Implement exactly what the RFC describes
- **Update the RFC**: If implementation reveals issues, update the RFC
- **Measure success**: Collect metrics to validate the RFC's assumptions

## RFC Index

Browse RFCs by application:

- [**RFC Template**](./rfc-template.md) - Use this template for creating new RFCs
- [**API RFCs**](./api/) - Backend API and services
- [**Orchestrator RFCs**](./orchestrator/) - Web orchestration interface
- [**Jobmaster RFCs**](./jobmaster/) - Agent application
- [**Jobmaster-GUI RFCs**](./jobmaster-gui/) - Desktop GUI application
- [**Shared RFCs**](./shared/) - Cross-cutting concerns and ecosystem-wide changes

### By Status

To find RFCs by their current status, search for the status field at the top of each RFC file:

- **Draft** - Currently being refined, open for feedback
- **Proposed** - Ready for implementation consideration
- **Final** - Approved and serving as specification
- **Implemented** - Feature has been implemented
- **Deprecated** - No longer valid or superseded

## Examples

### Example RFC Scenarios

#### Scenario 1: Adding User Authentication

**Scope**: API + Orchestrator + Jobmaster  
**Directory**: `shared/` (affects multiple apps)  
**Number**: `0001-user-authentication.md`  
**Key Sections**: API design, security considerations, migration strategy

#### Scenario 2: New Worker Type

**Scope**: API + Jobmaster  
**Directory**: `api/` (API is primary)  
**Number**: `0003-python-worker-type.md`  
**Key Sections**: Data model, worker execution, examples

#### Scenario 3: GUI Dashboard Enhancement

**Scope**: Jobmaster-GUI only  
**Directory**: `jobmaster-gui/`  
**Number**: `0001-dashboard-widgets.md`  
**Key Sections**: User experience, mockups, implementation

### Sample RFC Structure

```markdown
# RFC 0001: User Authentication System

**Status:** Final
**Target Application(s):** api, orchestrator, jobmaster
**RFC Number:** 0001
**Created:** 2024-01-15
**Author(s):** Jane Doe (@janedoe)

## Overview

### Summary

Implement JWT-based authentication across all Botmaster applications.

### Motivation

Currently, the system lacks proper user authentication...
[continues with full RFC content]
```

## Frequently Asked Questions

### General Questions

**Q: Who can write an RFC?**  
A: Anyone can propose an RFC. Community members, contributors, and maintainers are all encouraged to submit RFCs for changes they believe would benefit the project.

**Q: How long should an RFC be?**  
A: As long as necessary to clearly communicate the proposal. Simple changes might be 2-3 pages, while complex architectural changes could be 10+ pages.

**Q: What if my RFC is rejected?**  
A: Rejection means the specific approach isn't suitable, not that the problem isn't worth solving. Consider alternative approaches or gather more support for the idea.

**Q: Can I implement before the RFC is approved?**  
A: For draft RFCs, you can create proof-of-concept implementations to validate the approach, but production implementation should wait for approval.

### Process Questions

**Q: How do I choose which directory to put my RFC in?**  
A: Choose based on the primary application affected. If multiple applications are equally affected, use the `shared/` directory.

**Q: What if I need to change an approved RFC?**  
A: Minor changes can be made directly. Major changes should be proposed as amendments in new RFCs that reference the original.

**Q: How long does the RFC process take?**  
A: It varies. Simple RFCs might be approved in days, while complex ones could take weeks or months. The timeline depends on complexity and community feedback.

**Q: Who approves RFCs?**  
A: Project maintainers have final approval authority, but community consensus is important and valued in the decision-making process.

### Technical Questions

**Q: Should I include code in my RFC?**  
A: Yes, include code examples, API definitions, and configuration samples to illustrate your proposal clearly.

**Q: What level of detail is needed for implementation?**  
A: Enough detail that someone else could implement the feature based solely on the RFC. Include data structures, algorithms, and interfaces.

**Q: How do I handle breaking changes?**  
A: Document all breaking changes clearly, provide migration paths, and consider backwards compatibility options. Breaking changes require extra scrutiny.

## Resources

### Templates and Tools

- [RFC Template](./rfc-template.md) - Official template for new RFCs
- [Markdown Guide](https://www.markdownguide.org/) - Formatting reference
- [Mermaid Diagrams](https://mermaid.js.org/) - For creating diagrams in markdown

### Writing Resources

- [Technical Writing Course](https://developers.google.com/tech-writing) - Google's technical writing guide
- [API Design Guide](https://cloud.google.com/apis/design) - Best practices for API design
- [Architecture Decision Records](https://adr.github.io/) - Related concept for documenting decisions

### Botmaster Specific Resources

- [Project README](../../README.md) - Main project documentation
- [Architecture Diagrams](../../) - System architecture overview
- [API Documentation](../../apps/api/) - Current API documentation

### External References

- [IETF RFC Process](https://www.rfc-editor.org/rfc/rfc2026.html) - Original RFC process
- [Rust RFC Process](https://github.com/rust-lang/rfcs) - Example of RFC process in open source
- [Python PEP Process](https://peps.python.org/pep-0001/) - Python Enhancement Proposals

## Getting Started

### For First-Time RFC Authors

1. **Identify the scope**: Determine which application(s) your proposal primarily affects
2. **Review existing RFCs**: Check the relevant application folder(s) for related proposals
3. **Understand the problem**: Clearly articulate what needs to be solved and why
4. **Research alternatives**: Look at how similar problems have been solved elsewhere
5. **Use the template**: Copy `rfc-template.md` and fill out all sections thoroughly
6. **Get early feedback**: Consider opening a draft PR or discussion issue before finalizing your RFC
7. **Follow up**: Track implementation progress and update the RFC as needed

### Quick Checklist for New RFCs

Before submitting your RFC, ensure you have:

- [ ] Used the official RFC template
- [ ] Chosen the correct directory based on primary scope
- [ ] Selected the next available RFC number
- [ ] Filled out all sections completely
- [ ] Included concrete examples and code samples
- [ ] Addressed security and performance implications
- [ ] Considered migration and backwards compatibility
- [ ] Listed alternative approaches
- [ ] Proofread for clarity and grammar

### Common Mistakes to Avoid

- **Vague problem statements** - Be specific about what needs to be solved
- **Missing alternatives** - Always discuss other approaches you considered
- **Insufficient examples** - Show concrete usage scenarios
- **Ignoring migration** - Don't forget about existing users and systems
- **Scope creep** - Keep focused on the core problem
- **Implementation details in wrong sections** - Follow the template structure

---

For questions about the RFC process, please open an issue or discussion in this repository.

**Last Updated**: 2024-08-02  
**Version**: 2.0 - Comprehensive documentation update
