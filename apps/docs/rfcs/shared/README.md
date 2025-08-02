# Shared RFCs

This directory contains RFCs that affect multiple applications, shared libraries, or ecosystem-wide architectural decisions.

## When to Use This Directory

Use this directory for RFCs that:

- Affect multiple applications simultaneously
- Introduce shared libraries or packages
- Define ecosystem-wide standards or conventions
- Establish cross-cutting architectural patterns
- Modify shared infrastructure or deployment processes

## How to Create a New RFC

1. Copy the central template from [`../rfc-template.md`](../rfc-template.md)
2. Place it in this directory with the format `NNNN-descriptive-title.md`
3. Fill out all sections, ensuring "Target Application(s)" lists all affected apps
4. Follow the RFC process outlined in [`../README.md`](../README.md)

## Application-Specific RFCs

For RFCs that primarily affect a single application, place them in the respective app's `docs/rfcs/` directory instead.
