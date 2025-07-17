# File Structure and Patterns for New Endpoints

This document presents an implementation guide for new resources in the BotMaster API.

## Layered Architecture

BotMaster uses a well-defined layered architecture, which should be followed when implementing new endpoints:

```
Controller → Service → Repository → Database
   ↑             ↑          ↑
   └─ Router     └── Model  └─ SQL Files
      OpenAPI
```

> **Note**: Each layer should be implemented independently, but interconnected, following the dependency injection pattern. This facilitates unit testing and code maintenance.
> See https://github.com/goldbergyoni/nodebestpractices

### Layer Responsibilities

- **Model:** Types/schemas. No dependencies on other layers.
- **Repository:** Data access. Depends only on Model.
- **Service:** Business logic. Depends on Repository and Model.
- **Controller:** Receives requests, validates, calls Service and returns response. Depends on Service.
- **Routes:** Defines endpoints and connects to Controller.
- **Config:** Centralizes module configurations.

### Import Flow

| File          | Imports from      | Imported by         |
| ------------- | ----------------- | ------------------- |
| model.ts      | -                 | repository, service |
| repository.ts | model             | service             |
| service.ts    | repository, model | controller          |
| controller.ts | service           | routes              |
| routes.ts     | controller        | main app            |
| config.ts     | -                 | all                 |

### Recommended Implementation Sequence

0. SQL schemas → 1. model → 2. repository → 3. service → 4. controller → 5. routes

Each resource in `src/api/` should contain the following components:

1. **Controller**: Handles HTTP requests and delegates to the service.
2. **Service**: Implements business logic and transforms results into ServiceResponse.
3. **Repository**: Accesses the database and maps results to DTOs.
4. **Model**: Defines Zod schemas for validation and TypeScript types.
5. **Router**: Defines HTTP endpoints and applies validation middlewares.
6. **OpenAPI**: Swagger documentation for endpoints.
7. **Interface (.d.ts)**: Contracts that define the methods to be implemented, following the layer-specific interfaces approach:
   - **IResourceBase**: Base interface with common methods.
   - **IResourceRepository**: Specific interface for Repository.
   - **IResourceService**: Specific interface for Service.
   - **IResourceController**: Specific interface for Controller.
8. **SQL Files**: SQL queries for database operations.
9. **Tests**: Unit and integration tests.

## Implementation Patterns and Best Practices

1. **Consistent Naming**: Use descriptive names for files (`exampleController.ts`, `exampleService.ts`).
2. **Validation with Zod**: Validate input data using Zod schemas in `exampleModel.ts`.
3. **Error Handling**: Use `BusinessError` and derivatives, returning responses via `ServiceResponse`.
4. **Swagger Documentation**: Use `zod-to-openapi` to generate documentation from schemas.
5. **SQL Files**: Organize SQL scripts in a `db/` directory with descriptive names.
   - Use `readSqlFile` utility to read SQL files.
   - Place migrations, seeds, and queries in their respective directories.
6. **Dependency Injection**: Use it to facilitate testing and decoupling.
7. **Common Utilities**: Reuse code from utilities in `src/common/`.
8. **Appropriate Logging**: Record relevant information in each layer.
9. **Unit Tests**: Test each layer in isolation.
10. **Strong Typing**: Use Zod schemas and TypeScript to ensure type safety.
11. **Consult the Workers Module**: Use `api/workers` as an implementation reference in case of doubt.
12. **Separation of Concerns**: Each layer should have a single responsibility.
13. **Rigorous Validation**: Validate data at multiple levels.
14. **Error Handling**: Use ServiceResponse for consistent responses.
15. **Adequate Logging**: Record relevant information in each layer.
16. **Complete Documentation**: Document endpoints and models with OpenAPI.
17. **Strong Typing**: Use Zod schemas and TypeScript for type safety.
18. **Testing**: Write unit and integration tests for each layer.
19. **Naming Consistency**: Follow established patterns throughout the project.
20. **Centralized Configuration**: Keep configurations in dedicated files and use environment variables.
21. **Business Logic Location**: Never implement business logic in controllers or repositories.
22. **Error Translation**: Translate technical errors to domain errors whenever possible.
23. **Documentation Proximity**: Document endpoints and business rules in markdown files close to the code.
24. **Critical Logging**: Use logs in all critical flows.
25. **Self-Contained Domains**: Keep each domain self-contained with its own controllers, services, repositories, models, and prompts.
26. **Use of Transactions**: Use the `transaction` method from `BaseRepository` to ensure consistency and atomicity in critical operations that involve multiple steps in the database.
27. **BaseRepository Methods**: Use the `BaseRepository` methods such as `query`, `transaction` and outhers to standardize database interactions, ensure consistency, and simplify error handling. These methods provide built-in error translation and transaction management.

## File Structure and Implementation Examples

For a new resource called "example", create the following structure:

```
src/api/example/
├── example.d.ts             # Resource interface
├── exampleModel.ts          # Schemas and types
├── exampleRepository.ts     # Database access
├── exampleService.ts        # Business logic
├── exampleController.ts     # HTTP handling
├── exampleRoutes.ts         # Route definition
├── exampleOpenAPI.ts        # OpenAPI documentation
├── db/                      # Directory for SQL files
<!-- insira os paths migrations, seeds e queries -->
│   ├── migrations/
│   │   ├── 1.create_example_table.up.sql
│   │   ├── 1.drop_example_table.down.sql
│   │   └── ...
│   ├── seeds/
│   │   ├── example_seed.sql
│   │   └── ...
│   └── queries/
│       ├── insert_example.sql
│       └── ...
└── tests/                  # Unit tests
    ├── example.test.ts
    └── example.e2e.test.ts
```

### Interface (\*.d.ts)

To ensure better typing and data control in each application layer, use layer-specific interfaces:

Layer-specific interfaces offer several benefits:

1. **Type Safety**: Each layer has its own interface with specific types for its parameters and returns.
2. **Clarity**: Makes explicit what data enters and exits each layer.
3. **Maintenance**: Makes it easier to identify contract breaks during development.
4. **Documentation**: Serves as living documentation of what each layer expects and returns.
5. **Testability**: Facilitates the creation of mocks and stubs for testing.

```typescript
// Base interface with common methods
export interface IExampleBase {
  create: (...args: any[]) => Promise<any>
  getById: (...args: any[]) => Promise<any>
  getAll: (...args: any[]) => Promise<any>
  update: (...args: any[]) => Promise<any>
  delete: (...args: any[]) => Promise<any>
}

// Interface específica para o Repository
export interface IExampleRepository extends IExampleBase {
  create: (example: CreateExampleDto) => Promise<ExampleResponseDto>
  getById: (id: string) => Promise<ExampleResponseDto>
  getAll: () => Promise<ExampleResponseDto[]>
  update: (id: string, example: UpdateExampleDto) => Promise<ExampleResponseDto>
  delete: (id: string) => Promise<ExampleResponseDto>
}

// Interface específica para o Service
export interface IExampleService extends IExampleBase {
  create: (example: CreateExampleDto) => Promise<ServiceResponse<ExampleResponseDto | ServiceResponseObjectError | null>>
  getById: (id: string) => Promise<ServiceResponse<ExampleResponseDto | ServiceResponseObjectError | null>>
  getAll: () => Promise<ServiceResponse<ExampleResponseDto[] | ServiceResponseObjectError | null>>
  update: (id: string, example: UpdateExampleDto) => Promise<ServiceResponse<ExampleResponseDto | ServiceResponseObjectError | null>>
  delete: (id: string) => Promise<ServiceResponse<ExampleResponseDto | ServiceResponseObjectError | null>>
}

// Interface específica para o Controller
export interface IExampleController extends IExampleBase {
  create: (
    req: Request<CreateExampleDto>,
    res: ResponseCustom<ExampleResponseDto, CreateExampleDto>,
    next: NextFunction
  ) => Promise<void>
  getById: (
    req: Request<{ id: string }>,
    res: ResponseCustom<ExampleResponseDto, null>,
    next: NextFunction
  ) => Promise<void>
  getAll: (
    req: Request,
    res: ResponseCustom<ExampleResponseDto[], null>,
    next: NextFunction
  ) => Promise<void>
  update: (
    req: Request<{ id: string }, null, UpdateExampleDto>,
    res: ResponseCustom<ExampleResponseDto, UpdateExampleDto>,
    next: NextFunction
  ) => Promise<void>
  delete: (
    req: Request<{ id: string }>,
    res: ResponseCustom<null, null>,
    next: NextFunction
  ) => Promise<void>
}
```

### Model

```typescript
import { z } from 'zod'
import { commonValidations } from '@/common/utils/commonValidation'

// Base schema
export const ExampleBaseSchema = z.object({
  name: z.string().describe('Example name'),
  description: z.string().max(2000).optional(),
  // Other fields...
})

// Response schema with IDs, timestamps and other fields
export const ExampleResponseSchema = ExampleBaseSchema.extend({
  id: commonValidations.id,
  createdAt: commonValidations.timestamp,
  updatedAt: commonValidations.timestamp,
})
export type ExampleResponseDto = z.infer<typeof ExampleResponseSchema>

// Schemas for creation and update
export const CreateExampleSchema = ExampleBaseSchema
export type CreateExampleDto = z.infer<typeof CreateExampleSchema>

export const UpdateExampleSchema = ExampleBaseSchema.partial()
export type UpdateExampleDto = z.infer<typeof UpdateExampleSchema>

// Schema for route parameters
export const ExampleRouteParamsSchema = z.object({
  params: z.object({ id: commonValidations.id }),
})
```

#### Advanced Model Example with Complex Schemas

For more complex resources, you might need nested objects, enums, and default values:

```typescript
import { z } from 'zod'
import { commonValidations } from '@/common/utils/commonValidation'

// Define constants for enums
export const examplePriority = {
  low: 0,
  medium: 5,
  high: 10,
} as const

export type ExamplePriority = (typeof examplePriority)[keyof typeof examplePriority]

// Define nested schemas
const optionsSchema = z.object({
  maxRetries: z.number().int().min(0).max(10).describe('Maximum number of retries').default(3),
  timeout: z.number().int().positive().describe('Timeout in seconds').default(60),
  processingMode: z.enum(['sequential', 'parallel']).describe('Processing mode').default('sequential'),
})

const metadataSchema = z.object({
  tags: z.array(z.string()).describe('Associated tags').default([]),
  labels: z.record(z.string()).describe('Key-value labels for the resource').optional().default({}),
})

// Main schema with nested objects
export const AdvancedExampleSchema = z.object({
  name: z.string().min(3).max(100).describe('Resource name'),
  description: z.string().max(2500).describe('Resource description').optional().default(''),
  status: z.enum(['draft', 'active', 'archived']).describe('Current status').default('draft'),
  priority: z.nativeEnum(examplePriority).describe('Priority level (0-10)').default(examplePriority.medium),
  options: optionsSchema.describe('Configuration options').default({}),
  metadata: metadataSchema.describe('Additional metadata').default({}),
  dependencies: z.array(z.string().uuid()).describe('IDs of dependent resources').default([]),
})

// Response schema with all fields
export const AdvancedExampleResponseSchema = AdvancedExampleSchema.extend({
  id: commonValidations.id,
  createdAt: commonValidations.timestamp,
  updatedAt: commonValidations.timestamp,
  createdBy: z.string().uuid().describe('User ID who created this resource'),
  version: z.number().int().positive().describe('Resource version'),
})

export type AdvancedExampleResponseDto = z.infer<typeof AdvancedExampleResponseSchema>
```

### Repository

```typescript
import { readSqlFile } from '@/common/utils/sqlReader'
import { CreateExampleDto, ExampleResponseDto } from './exampleModel'
import { BaseRepository } from '@/common/repositories/baseRepository'
import { IExample } from './example'

const createExamploQuerySql = readSqlFile(`${__dirname}/db/create_example.sql`)

export class ExampleRepository
  extends BaseRepository
  implements IExample<[CreateExampleDto], Promise<ExampleResponseDto>>
{
  async create(example: CreateExampleDto): Promise<ExampleResponseDto> {
    const values = [
      example.name,
      example.description || '',
      // Other values...
    ]

    const rows = await this.query<ExampleResponseDto>(createExamploQuerySql, values)
    const row = rows[0]

    return {
      id: row.id,
      name: row.name,
      description: row.description,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      // Other fields...
    }
  }
}
```

### Service

```typescript
import { StatusCodes } from 'http-status-codes'
import { ExampleRepository } from './exampleRepository'
import { ServiceResponse } from '@/common/models/serviceResponse'
import { IExample } from './example'
import { CreateExampleDto, ExampleResponseDto } from './exampleModel'
import { BusinessError } from '@/common/utils/errorHandlers'
import { logger } from '@/server'

export class ExampleService
  implements IExample<[CreateExampleDto], Promise<ServiceResponse<ExampleResponseDto | null>>>
{
  private exampleRepository: ExampleRepository

  constructor(repository: ExampleRepository = new ExampleRepository()) {
    this.exampleRepository = repository
  }

  async create(example: CreateExampleDto): Promise<ServiceResponse<ExampleResponseDto | null>> {
    try {
      const createdExample = await this.exampleRepository.create(example)
      return ServiceResponse.success('Example successfully created', createdExample, StatusCodes.CREATED)
    } catch (err) {
      if (err instanceof BusinessError) {
        logger.warn(`${err.name}: ${err.message}`)
        return ServiceResponse.failure(err.message, null, err.status)
      }
      throw err
    }
  }
}
```

### Controller

```typescript
import { Response, NextFunction } from 'express'
import { handleServiceResponse } from '@/common/utils/httpHandlers'
import { ExampleService } from './exampleService'
import { IExample } from './example'
import { ExampleResponseDto } from './exampleModel'
import { RequestWithValidatedData } from '@/common/utils/httpHandlers'

export class ExampleController implements IExample<[RequestWithValidatedData<any>, Response, NextFunction]> {
  private exampleService: ExampleService

  constructor(service: ExampleService = new ExampleService()) {
    this.exampleService = service
  }

  public create = async (req: RequestWithValidatedData<ExampleResponseDto>, res: Response, next: NextFunction) => {
    try {
      const serviceResponse = await this.exampleService.create(req.validatedData)
      return handleServiceResponse(serviceResponse, res)
    } catch (err) {
      next(err)
    }
  }
}

export const exampleController = new ExampleController()
```

### Routes

```typescript
import express, { type Router } from 'express'
import { exampleController } from './exampleController'
import { CreateExampleSchema, UpdateExampleSchema, ExampleRouteParamsSchema } from './exampleModel'
import { validateRequest } from '@/common/utils/httpHandlers'

export const examplesRouterV1: Router = express.Router()

// Create example
examplesRouterV1.post('/', validateRequest(CreateExampleSchema, 'body'), exampleController.create)

// Get example by ID
examplesRouterV1.get('/:id', validateRequest(ExampleRouteParamsSchema, 'params'), exampleController.getExample)

// Update example
examplesRouterV1.put(
  '/:id',
  validateRequest(ExampleRouteParamsSchema, 'params'),
  validateRequest(UpdateExampleSchema, 'body'),
  exampleController.updateExample
)

// Delete example
examplesRouterV1.delete('/:id', validateRequest(ExampleRouteParamsSchema, 'params'), exampleController.deleteExample)

// List examples
examplesRouterV1.get('/', exampleController.listExamples)
```

#### Nested Resources and Sub-routes

For resources that have sub-resources or hierarchical relationships, you can structure the routes as follows:

```typescript
// Main resource routes
export const examplesRouterV1: Router = express.Router()

// Basic CRUD routes for the main resource
examplesRouterV1.post('/', validateRequest(CreateExampleSchema, 'body'), exampleController.create)
examplesRouterV1.get('/:id', validateRequest(ExampleRouteParamsSchema, 'params'), exampleController.getExample)
// ... other main resource routes

// Sub-resource routes (e.g., items belonging to an example)
import { itemsController } from '../items/itemsController'
import { CreateItemSchema, ItemRouteParamsSchema } from '../items/itemModel'

// Get all items for a specific example
examplesRouterV1.get(
  '/:id/items',
  validateRequest(ExampleRouteParamsSchema, 'params'),
  itemsController.getItemsByExampleId
)

// Create an item for a specific example
examplesRouterV1.post(
  '/:id/items',
  validateRequest(ExampleRouteParamsSchema, 'params'),
  validateRequest(CreateItemSchema, 'body'),
  itemsController.createItemForExample
)

// Alternative: Use a dedicated router for sub-resources and mount it
import itemsSubRoutes from '../items/itemsSubRoutes'
examplesRouterV1.use('/:exampleId/items', itemsSubRoutes)

// In itemsSubRoutes.ts:
const itemsSubRoutes: Router = express.Router({ mergeParams: true }) // mergeParams: true to access parent params
itemsSubRoutes.get('/', itemsController.getItemsByExampleId)
itemsSubRoutes.post('/', validateRequest(CreateItemSchema, 'body'), itemsController.createItemForExample)
itemsSubRoutes.get('/:itemId', itemsController.getItemById)
```

### OpenAPI

```typescript
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'
import { StatusCodes } from 'http-status-codes'
import { CreateExampleSchema, ExampleResponseSchema, ExampleResponseDto } from './exampleModel'
import { createOpenApiResponse, OpenApiResponseConfig } from '@/api-docs/openAPIResponseBuilders'

export const exampleRegistryV1 = new OpenAPIRegistry()

const examplePath = '/examples'

// Response configuration
const exampleResponseSuccess: OpenApiResponseConfig<ExampleResponseDto> = {
  success: true,
  description: 'Success',
  dataSchema: ExampleResponseSchema as z.ZodType,
  statusCode: StatusCodes.CREATED,
}

// Schema registration
exampleRegistryV1.register('Example', ExampleResponseSchema)
exampleRegistryV1.register('CreateExample', CreateExampleSchema)

// Endpoint registration
exampleRegistryV1.registerPath({
  method: 'post',
  path: examplePath,
  tags: ['Examples'],
  summary: 'Create new example',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateExampleSchema,
        },
      },
    },
  },
  responses: createOpenApiResponse([exampleResponseSuccess]),
})
```

### SQL Files

The SQL files should be organized in a structured way under the resource's directory:

```
src/api/example/
└── db/
    ├── queries/           # SQL queries for CRUD operations
    │   ├── insert_example.sql
    │   ├── select_example.sql
    │   ├── select_example_by_id.sql
    │   ├── update_example.sql
    │   └── delete_example.sql
    ├── migrations/        # Database migrations for the resource
    │   ├── 001.create_example_table.up.sql
    │   ├── 001.drop_example_table.down.sql
    └── seeds/             # Seed data for development/testing
        └── example_seeds.sql
```

**queries/insert_example.sql**:

```sql
INSERT INTO examples (
  name,
  description,
  created_at,
  updated_at
)
VALUES (
  $1, $2, NOW(), NOW()
)
RETURNING
  id,
  name,
  description,
  created_at,
  updated_at;
```

**queries/select_example_by_id.sql**:

```sql
SELECT
  id,
  name,
  description,
  created_at,
  updated_at
FROM
  examples
WHERE
  id = $1;
```

**migrations/001.create_example_table.up.sql**:

```sql
CREATE TABLE IF NOT EXISTS examples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS examples_name_idx ON examples(name);
```

**migrations/001.drop_example_table.down.sql**:

```sql
DROP TABLE IF EXISTS examples;
```

## System Integration

### Register Routes in the Server

In `src/server.ts`:

```typescript
import { examplesRouterV1 } from './api/example/exampleRoutes'

apiRouterV1.use('/examples', examplesRouterV1)
```

### Register in OpenAPI Documentation

In `src/api-docs/openAPIDocumentGenerator.ts`:

```typescript
import { exampleRegistryV1 } from './api/example/exampleOpenAPI'

export function generateOpenAPIDocumentV1() {
  const registryV1 = new OpenAPIRegistry([
    // other registries...
    exampleRegistryV1,
  ])
  // rest of the function...
}
```

### Module Integration Patterns

When building features that span multiple modules, follow these patterns:

#### 1. Direct Service Dependency

For simple integrations, import and use another module's service directly:

```typescript
// In exampleService.ts
import { OtherService } from '@/api/other/otherService'

export class ExampleService {
  private otherService: OtherService

  constructor(
    repository: ExampleRepository = new ExampleRepository(),
    otherService: OtherService = new OtherService()
  ) {
    this.exampleRepository = repository
    this.otherService = otherService
  }

  async createExampleWithRelatedResource(data: CreateExampleDto): Promise<ServiceResponse<ExampleResponseDto | null>> {
    try {
      // Create the main resource
      const example = await this.exampleRepository.create(data)

      // Create a related resource in another module
      await this.otherService.createRelatedResource({
        exampleId: example.id,
        name: `Related to ${example.name}`,
      })

      return ServiceResponse.success('Example with related resource created', example, StatusCodes.CREATED)
    } catch (err) {
      // Error handling
    }
  }
}
```

#### 2. Event-Based Communication

For looser coupling, use an event-based approach:

```typescript
// In exampleService.ts
import { EventEmitter } from '@/common/utils/eventEmitter'

export class ExampleService {
  async createExample(data: CreateExampleDto): Promise<ServiceResponse<ExampleResponseDto | null>> {
    try {
      // Create the main resource
      const example = await this.exampleRepository.create(data)

      // Emit an event that other modules can listen to
      EventEmitter.emit('example.created', example)

      return ServiceResponse.success('Example created', example, StatusCodes.CREATED)
    } catch (err) {
      // Error handling
    }
  }
}

// In otherService.ts (another module)
import { EventEmitter } from '@/common/utils/eventEmitter'

// Set up listener when service is initialized
EventEmitter.on('example.created', async (example) => {
  try {
    // React to the event by creating a related resource
    await otherRepository.createRelatedResource({
      exampleId: example.id,
      name: `Related to ${example.name}`,
    })
    logger.info(`Created related resource for example ${example.id}`)
  } catch (err) {
    logger.error(`Failed to create related resource: ${err.message}`)
  }
})
```

#### 3. Shared Utilities and Constants

Place shared code in the common directory:

```typescript
// In src/common/constants/resourceTypes.ts
export const ResourceTypes = {
  EXAMPLE: 'example',
  OTHER: 'other',
  // ...other resource types
} as const

// In exampleService.ts
import { ResourceTypes } from '@/common/constants/resourceTypes'

// Use the shared constants
const resourceType = ResourceTypes.EXAMPLE
```

## Data Flow and Utilities

### Request Processing Flow

1. **Request** → Router → Validation → Controller → Service → Repository → Database
2. **Response** ← Controller ← Service (ServiceResponse) ← Repository ← Database

### Main Utilities

- `validateRequest`: Middleware for input validation
- `handleServiceResponse`: Standardizes HTTP responses
- `ServiceResponse`: Structures consistent responses
- `readSqlFile`: Loads SQL files
- `dbPool`: PostgreSQL connection pool
- `BusinessError`: Classes for error handling
- `createOpenApiResponse`: Configures OpenAPI documentation

### Logging Practices

- Use appropriate levels: debug, info, warn, error
- Log important events, failures, and critical flows in all layers

### Validation Approach

- Use Zod to validate inputs in the controller
- Ensure only trusted data reaches lower layers

### Testing Strategy

- Implement unit, integration, and end-to-end tests for all layers
- Use mocks for external dependencies in unit tests
