# OpenAPI/Swagger Integration Guide

This document provides detailed guidance on how to properly document endpoints using OpenAPI/Swagger in the BotMaster project, following established conventions and patterns.

## Overview

BotMaster uses the `@asteasolutions/zod-to-openapi` library to automatically generate OpenAPI documentation from Zod schemas and route configurations. This ensures documentation is always synchronized with the code.

## Basic Structure

Each API module should have its own `*OpenAPI.ts` file that configures:

1. An OpenAPI registry (`OpenAPIRegistry`)
2. Schemas and types
3. Response definitions
4. Path/endpoint configurations

## Steps to Document a New Endpoint

### 1. Create the OpenAPI Registry

```typescript
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'

export const myModuleRegistryV1 = new OpenAPIRegistry()
```

### 2. Define Response Schemas

Use the `createOpenApiResponse` utility to define standardized responses:

```typescript
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'
import { createOpenApiResponse, OpenApiResponseConfig } from '@/api-docs/openAPIResponseBuilders'
import { MyModelResponseSchema, MyModelResponseDto } from './myModelModel'

// Success response
const myModelResponseSuccess: OpenApiResponseConfig<MyModelResponseDto> = {
  success: true,
  description: 'Operation completed successfully',
  dataSchema: MyModelResponseSchema as z.ZodType,
  statusCode: StatusCodes.OK, // or CREATED, etc.
}

// Specific error response (e.g., conflict)
const myModelResponseConflict: OpenApiResponseConfig<null> = {
  success: false,
  description: 'Conflict - resource already exists',
  dataSchema: z.null().openapi({ example: 'null' as unknown as null }),
  statusCode: StatusCodes.CONFLICT,
}

// Other responses as needed...
```

### 3. Register Schemas

Register all schemas used in the API:

```typescript
// Register schemas
myModuleRegistryV1.register('MyModel', MyModelResponseSchema)
myModuleRegistryV1.register('CreateMyModel', CreateMyModelSchema)
myModuleRegistryV1.register('UpdateMyModel', UpdateMyModelSchema)

// Register parameter schemas
myModuleRegistryV1.register('MyModelParams', z.object({ params: z.object({ id: z.string().uuid() }) }))

// Register query schemas
myModuleRegistryV1.register(
  'ListMyModelQuery',
  z.object({
    query: z.object({
      page: z.number().int().positive(),
      limit: z.number().int().positive(),
      // other parameters...
    }),
  })
)
```

### 4. Register Paths (Endpoints)

Register each endpoint with method, path, tags, parameters, request body, and responses:

```typescript
// POST endpoint (creation)
myModuleRegistryV1.registerPath({
  method: 'post',
  path: '/my-module',
  tags: ['My Module'], // Category in Swagger UI
  summary: 'Create new item', // Short title
  description: 'Creates a new item with the provided data', // More detailed description
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateMyModelSchema,
        },
      },
    },
  },
  responses: createOpenApiResponse([myModelResponseSuccess, myModelResponseConflict]),
})

// GET endpoint (get by ID)
myModuleRegistryV1.registerPath({
  method: 'get',
  path: '/my-module/{id}',
  tags: ['My Module'],
  summary: 'Get item by ID',
  description: 'Retrieves a specific item by its ID',
  request: {
    params: z.object({ id: z.string().uuid() }),
  },
  responses: createOpenApiResponse([myModelResponseSuccess]),
})

// PUT endpoint (update)
myModuleRegistryV1.registerPath({
  method: 'put',
  path: '/my-module/{id}',
  tags: ['My Module'],
  summary: 'Update item',
  description: 'Updates an existing item with the provided data',
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: {
        'application/json': {
          schema: UpdateMyModelSchema,
        },
      },
    },
  },
  responses: createOpenApiResponse([myModelResponseSuccess]),
})

// DELETE endpoint
myModuleRegistryV1.registerPath({
  method: 'delete',
  path: '/my-module/{id}',
  tags: ['My Module'],
  summary: 'Delete item',
  description: 'Removes an existing item by its ID',
  request: {
    params: z.object({ id: z.string().uuid() }),
  },
  responses: createOpenApiResponse([
    {
      success: true,
      description: 'Item successfully deleted',
      dataSchema: z.null(),
      statusCode: StatusCodes.NO_CONTENT,
    },
  ]),
})

// GET endpoint (list/search)
myModuleRegistryV1.registerPath({
  method: 'get',
  path: '/my-module',
  tags: ['My Module'],
  summary: 'List items',
  description: 'Retrieves a paginated list of items, with filter options',
  request: {
    query: z.object({
      page: z.number().int().positive().optional().describe('Page number'),
      limit: z.number().int().positive().optional().describe('Items per page'),
      status: z.enum(['active', 'inactive']).optional().describe('Filter by status'),
      // other query parameters...
    }),
  },
  responses: createOpenApiResponse([
    {
      success: true,
      description: 'Item list successfully retrieved',
      dataSchema: z.array(MyModelResponseSchema),
      statusCode: StatusCodes.OK,
    },
  ]),
})
```

### 5. Document Schemas with Descriptions and Examples

Enrich your schemas with descriptions and examples:

```typescript
const MyModelSchema = z.object({
  name: z.string().describe('Name of the item').openapi({
    example: 'Example item',
  }),
  description: z.string().max(2500).describe('Detailed description of the item').optional().openapi({
    example: 'This is an example description for the item',
  }),
  status: z.enum(['active', 'inactive']).describe('Current status of the item').openapi({
    example: 'active',
  }),
  priority: z.number().int().min(1).max(10).describe('Priority level of the item (1-10)').openapi({
    example: 5,
  }),
  tags: z
    .array(z.string())
    .describe('Tags associated with the item')
    .openapi({
      example: ['tag1', 'tag2'],
    }),
  // other fields...
})
```

### 6. Integrate with the OpenAPI Document Generator

Register your module in the documentation generator in `src/api-docs/openAPIDocumentGenerator.ts`:

```typescript
import { myModuleRegistryV1 } from '@/api/my-module/myModelOpenAPI'

export function generateOpenAPIDocumentV1() {
  const registryV1 = new OpenAPIRegistry([
    // other registries...
    myModuleRegistryV1,
  ])

  // rest of the function...
}
```

## Standardized Responses

The system already includes some standard responses automatically:

1. **Internal error (500)**: For unexpected server errors
2. **Not found (404)**: For resources not found
3. **Bad request (400)**: For validation errors

You don't need to add these responses manually, as the `createOpenApiResponse` utility already includes them.

## Advanced Configuration Examples

### Header Parameters

```typescript
request: {
  headers: z.object({
    'X-API-Key': z.string().describe('API key for authentication'),
  }),
  // other parameters...
},
```

### Different Content Types

```typescript
request: {
  body: {
    content: {
      'application/json': {
        schema: MyModelJsonSchema,
      },
      'multipart/form-data': {
        schema: MyModelFormSchema,
      },
    },
  },
},
```

### Complex Query Parameters

```typescript
request: {
  query: z.object({
    search: z.string().optional().describe('Search term'),
    dateRange: z.object({
      start: z.string().datetime().describe('Start date'),
      end: z.string().datetime().describe('End date'),
    }).optional(),
    sort: z.enum(['asc', 'desc']).optional().describe('Sort order'),
    fields: z.array(z.string()).optional().describe('Fields to include'),
  }),
},
```

## Best Practices

1. **Consistency**: Keep names, descriptions, and examples consistent throughout the API.

2. **Clear Descriptions**: Provide helpful descriptions for all fields and endpoints.

3. **Realistic Examples**: Use examples that represent real and useful data.

4. **Organization by Tags**: Group related endpoints using the same tags.

5. **API Versioning**: Keep documentation updated when the API changes.

6. **Test Documentation**: Verify that the generated documentation is correct and usable.

7. **Reusable Schemas**: Register common components that can be reused.

## Reference

For more details on available options, consult:

- [zod-to-openapi documentation](https://github.com/asteasolutions/zod-to-openapi)
- [OpenAPI 3.0 Specification](https://swagger.io/specification/)

## Complete Example

See existing files in `src/api/workers/workerOpenAPI.ts` as a reference for complete implementations.
