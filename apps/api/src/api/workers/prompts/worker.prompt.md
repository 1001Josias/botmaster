# Documentation: Worker

## Definition

A **Worker** is an automation that performs specific tasks and can be developed according to user needs.
It can be written in any programming language and has the following characteristics:

- **Input Parameters**: Optional data that can be provided as input necessary for the Worker’s behavior. It is equivalent to function parameters.
- **Settings**: Optional configurations specific to each Worker.
- **JSON Schemas**: The schemas are divided into two types:
  - **Parameters Schema**: Defines the Worker’s input parameters.
  - **Settings Schema**: Defines the Worker’s specific configurations.

## Operation

- The Worker code is versioned in immutable releases along with the JSON schemas, allowing the Worker to be updated and modified as needed.
- Workers are automatically published to the marketplace and can be "installed" in specific folders.
- When the Worker’s scope is set to `public`, it is made available to the entire community in the marketplace, allowing all platform users to "install" it.
- When the Worker’s scope is set to `organization`, it is only available to the organization defined in scopeRef, meaning only members of that organization can "install" it.
- When the Worker’s scope is set to `tenant`, it is only available to the tenant defined in scopeRef, meaning only members of that tenant can "install" it.
- When the Worker’s scope is set to `folder`, it is automatically "installed" in the folder defined in scopeRef.
- Scopes can be changed at any time, as long as it follows the proper order of visibility: from `folder` to `tenant`, from `tenant` to `organization`, and from `organization` to `public`.
- Running a Worker creates a **Job**, which is an instance of the Worker with specific parameters.
- A Job can have the following statuses:
  - **Pending**: The Job was created but is waiting to be executed.
  - **Running**: The Job is being executed by the JobMaster.
  - **Completed**: The Job finished successfully.
  - **Canceled**: The Job was canceled before execution.
  - **Timeout**: The Job did not finish within the defined time limit.
  - **Failed**: The Job failed during execution, either due to an error in the Worker code or configuration problems.
- The JobMaster, a Node.js agent, retrieves a job with pending status and executes the Worker code in a child process,
  passing the parameters and configurations as command line arguments.
  > Installing a Worker means making it available to be used in a specific folder, allowing it to be run with the defined parameters and settings.

## Integration

- JSON schemas are used to validate parameters and configurations before running the Worker.
- These schemas are also used to generate forms on the frontend, enabling users to configure the Workers and provide parameters via a graphical interface.
- Workers automatically become nodes of an execution graph in the `workflows` and `processes` functionality, allowing them to be chained and reused in different contexts.
- Workers can also be used as `tools` provided by an MCP (Model Context Protocol) server
  so that LLMs (Large Language Models) can use these workers to perform specific tasks requested by the user.
- Workers can also be implemented as autonomous AI agents, which can be used to perform tasks independently or chained with other Workers,
  enabling the creation of complex workflows using RPA (Robotic Process Automation) and LLMs working together.

## Final Considerations

Workers are a fundamental part of the platform’s automation and integration architecture, allowing tasks to be performed efficiently and flexibly.
They provide a powerful way to extend system functionalities, allowing users and developers to create customized solutions to meet their specific needs. With the ability to be versioned, configured, and chained, Workers provide a solid foundation for building complex workflows and intelligent automations.
