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
7. **Interface (.d.ts)**: Contracts that define the methods to be implemented.
8. **SQL Files**: SQL queries for database operations.
9. **Tests**: Unit and integration tests.

## Implementation Patterns and Best Practices

1. **Consistent Naming**: Use descriptive names for files (`exampleController.ts`, `exampleService.ts`).
2. **Validation with Zod**: Validate input data using Zod schemas in `exampleModel.ts`.
3. **Error Handling**: Use `BusinessError` and derivatives, returning responses via `ServiceResponse`.
4. **Swagger Documentation**: Use `zod-to-openapi` to generate documentation from schemas.
5. **SQL Files**: Organize SQL scripts in a `db/` directory with descriptive names.
6. **Dependency Injection**: Use it to facilitate testing and decoupling.
7. **Common Utilities**: Reuse code from utilities in `src/common/`.
8. **Appropriate Logging**: Record relevant information in each layer.
9. **Unit Tests**: Test each layer in isolation.
10. **Strong Typing**: Use Zod schemas and TypeScript to ensure type safety.
11. **Consult the Workers Module**: Use `api/workers` as an implementation reference in case of doubt.

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
│   ├── create_example.sql
│   ├── get_example.sql
│   └── ...
└── tests/                  # Unit tests
    ├── example.test.ts
    └── example.e2e.test.ts
```

### Interface (\*.d.ts)

```typescript
export interface IExample<I extends unknown[] = unknown[], O = unknown> {
  create: (...args: I) => O
  // Other methods as needed
}
```

#### Comprehensive Interface Example

For a more complete resource with multiple operations:

```typescript
export interface IExample<I extends unknown[] = unknown[], O = unknown> {
  // Create operations
  create: (...args: I) => O
  createBatch?: (...args: I) => O

  // Read operations
  getById: (...args: I) => O
  getAll: (...args: I) => O
  getByFilter?: (...args: I) => O

  // Update operations
  update: (...args: I) => O
  updatePartial?: (...args: I) => O
  updateStatus?: (...args: I) => O

  // Delete operations
  delete: (...args: I) => O
  softDelete?: (...args: I) => O

  // Specialized operations
  clone?: (...args: I) => O
  archive?: (...args: I) => O
  restore?: (...args: I) => O

  // Relationship operations
  addRelation?: (...args: I) => O
  removeRelation?: (...args: I) => O
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
import { DatabaseError } from 'pg'
import { logger } from '@/server'
import { PostgresError } from '@/common/utils/errorHandlers'
import { readSqlFile } from '@/common/utils/sqlReader'
import { dbPool } from '@/common/utils/dbPool'
import { CreateExampleDto, ExampleResponseDto } from './exampleModel'
import { IExample } from './example'

export class ExampleRepository implements IExample<[CreateExampleDto], Promise<ExampleResponseDto>> {
  async create(example: CreateExampleDto): Promise<ExampleResponseDto> {
    const values = [
      example.name,
      example.description || '',
      // Other values...
    ]

    const querySql = readSqlFile(`${__dirname}/db/create_example.sql`)

    try {
      const { rows } = await dbPool.query(querySql, values)
      const row = rows[0]

      return {
        id: row.id,
        name: row.name,
        description: row.description,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        // Other fields...
      }
    } catch (err) {
      if (err instanceof DatabaseError) {
        throw PostgresError.toBusinessError(err)
      }
      throw err
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

## Best Practices

1. **Separation of Concerns**: Each layer should have a single responsibility.
2. **Rigorous Validation**: Validate data at multiple levels.
3. **Error Handling**: Use ServiceResponse for consistent responses.
4. **Adequate Logging**: Record relevant information in each layer.
5. **Complete Documentation**: Document endpoints and models with OpenAPI.
6. **Strong Typing**: Use Zod schemas and TypeScript for type safety.
7. **Testing**: Write unit and integration tests for each layer.
8. **Naming Consistency**: Follow established patterns throughout the project.
9. **Centralized Configuration**: Keep configurations in dedicated files and use environment variables.
10. **Business Logic Location**: Never implement business logic in controllers or repositories.
11. **Error Translation**: Translate technical errors to domain errors whenever possible.
12. **Documentation Proximity**: Document endpoints and business rules in markdown files close to the code.
13. **Critical Logging**: Use logs in all critical flows.
14. **Self-Contained Domains**: Keep each domain self-contained with its own controllers, services, repositories, models, and prompts.
