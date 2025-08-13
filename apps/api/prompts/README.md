# Endpoint Implementation Prompt List

This directory contains prompts that can be used as guides for implementing new endpoints in the BotMaster API.

## Available Prompts

- [Endpoint Architecture](./endpoint-architecture.prompt.md): Comprehensive guide covering file structure, implementation patterns, and best practices
  - **Enhanced Features**: Now includes SQL organization, complex models, sub-resource handling, and module integration patterns
- [OpenAPI Documentation](./openapi-documentation.prompt.md): How to document endpoints using OpenAPI/Swagger
- [Error Handling for Endpoints](./error-handling-endpoints.prompt.md): Patterns for error handling
- [Testing and Validation of Endpoints](./testing-validation-endpoints.prompt.md): Strategies for testing and validating endpoints
- [Paginated Endpoints](./paginated-endpoints.prompt.md): Patterns, parameters, response, SQL, security, and best practices for implementing paginated endpoints in the API.

## How to Use the Prompts

These prompts serve as reference and guidance for consistent implementation of endpoints in the API. They are based on existing implementations and follow the project's architectural patterns.

To implement a new endpoint, we recommend first consulting the Endpoint Architecture prompt to understand the general structure, then reviewing the other prompts for specific aspects like documentation, error handling, and testing.

The Workers module (`src/api/workers/`) is a good real-world example that implements these patterns and can be referenced when in doubt.

## Additional Module Prompts

These prompts explain the features of each resource according to their particularities. They serve as a guide to understand how each resource should behave and interact within the system.

- [Folders](../src/api/folders/prompts/folders.prompt.md): Organize resources and data hierarchically.
- [Flows](../src/api/flows/prompts/flows.prompt.md): Automate processes and connect resources.
- [Processes](../src/api/processes/prompts/processes.prompt.md): Define workflows and tasks.
- [Audit Logs](../src/api/audit/prompts/audit-logs.prompt.md): Monitor and audit system events.
- [Webhooks](../src/api/webhooks/prompts/webhooks.prompt.md): Configure external notifications.
- [Workers](../src/api/workers/prompts/workers.prompt.md): Automate tasks with bots.
- [Jobs](../src/api/jobs/prompts/job.prompt.md): Manage worker executions.
- [Users](../src/api/user/prompts/users.prompt.md): Handle user authentication and profiles.
- [Machines](../src/api/machines/prompts/machines.prompt.md): Manage physical or virtual instances.
- [Workflows](../src/api/workflows/prompts/workflows.prompt.md): Connect actions and resources logically.

## Updating the Prompts

If you need to update the prompts with new patterns or corrections, edit the corresponding .md files.
