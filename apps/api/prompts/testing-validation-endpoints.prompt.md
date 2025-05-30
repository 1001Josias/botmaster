# Testing and Validation Guide for Endpoints

This document presents guidelines and patterns for testing and validating endpoints in the BotMaster API, based on existing practices.

## Input Validation

### Using Zod for Validation

BotMaster uses the Zod library for input data validation. Schemas are defined in `*Model.ts` files:

```typescript
import { z } from 'zod'
import { commonValidations } from '@/common/utils/commonValidation'

export const MyResourceSchema = z.object({
  name: z.string().min(3).max(100).describe('Resource name'),
  description: z.string().max(2000).optional(),
  status: z.enum(['active', 'inactive']).default('active'),
  priority: z.number().int().min(0).max(10).default(5),
  // Other fields...
})
```

### Validation Middleware

The `validateRequest` middleware automatically applies validation based on Zod schemas:

```typescript
import { validateRequest } from '@/common/utils/httpHandlers'

// In routes:
router.post('/', validateRequest(CreateMyResourceSchema, 'body'), controller.createMyResource)
router.get('/:id', validateRequest(MyResourceParamsSchema, 'params'), controller.getMyResource)
```

This middleware:

1. Validates data according to the specified schema
2. Rejects invalid requests with 400 response and detailed messages
3. Adds validated data to `req.validatedData` for use in controllers

## Testing Strategy

### Test Directory Structure

```
src/api/my-resource/
├── __tests__/                   # Test directory
│   ├── myResource.test.ts       # Unit tests
│   └── myResource.e2e.test.ts   # Integration/E2E tests
```

### Unit Tests

Unit tests should validate each layer in isolation:

```typescript
import { MyResourceService } from '../myResourceService'
import { MyResourceRepository } from '../myResourceRepository'

// Mock the repository
jest.mock('../myResourceRepository')
const mockRepository = MyResourceRepository as jest.MockedClass<typeof MyResourceRepository>

describe('MyResourceService', () => {
  beforeEach(() => {
    mockRepository.mockClear()
  })

  it('should create a resource successfully', async () => {
    // Set up mock
    const mockCreate = jest.fn().mockResolvedValue({
      id: '123',
      name: 'Test',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    mockRepository.prototype.createMyResource = mockCreate

    // Create service instance with mocked repository
    const service = new MyResourceService(new mockRepository())

    // Execute method
    const result = await service.createMyResource({
      name: 'Test',
    })

    // Verify result
    expect(result.success).toBe(true)
    expect(result.statusCode).toBe(201)
    expect(result.data).toBeDefined()
    expect(result.data?.name).toBe('Test')

    // Verify that repository was called correctly
    expect(mockCreate).toHaveBeenCalledWith({
      name: 'Test',
    })
  })

  it('should handle creation errors', async () => {
    // Set up mock to throw an error
    mockRepository.prototype.createMyResource = jest.fn().mockRejectedValue(new Error('Test error'))

    const service = new MyResourceService(new mockRepository())

    // Execute and verify that the error is handled
    await expect(service.createMyResource({ name: 'Test' })).rejects.toThrow()
  })
})
```

### Integration/E2E Tests

Integration tests validate the complete flow, including the database:

```typescript
import request from 'supertest'
import { app } from '@/server'
import { dbPool } from '@/common/utils/dbPool'

describe('MyResource API', () => {
  beforeAll(async () => {
    // Set up test database
    await dbPool.query('TRUNCATE TABLE my_resources RESTART IDENTITY CASCADE')
  })

  afterAll(async () => {
    // Clean up database after tests
    await dbPool.query('TRUNCATE TABLE my_resources RESTART IDENTITY CASCADE')
    await dbPool.end()
  })

  it('should create a new resource', async () => {
    const response = await request(app).post('/api/v1/my-resources').send({
      name: 'Test Resource',
      description: 'Test description',
      priority: 5,
    })

    expect(response.status).toBe(201)
    expect(response.body.success).toBe(true)
    expect(response.body.data).toHaveProperty('id')
    expect(response.body.data.name).toBe('Test Resource')
  })

  it('should return 400 error for invalid data', async () => {
    const response = await request(app).post('/api/v1/my-resources').send({
      // Name missing
      description: 'Test description',
      priority: 5,
    })

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.data).toHaveProperty('errors')
  })

  it('should get a resource by ID', async () => {
    // First create a resource
    const createResponse = await request(app).post('/api/v1/my-resources').send({
      name: 'Resource to Get',
      description: 'Description',
    })

    const id = createResponse.body.data.id

    // Then try to get the created resource
    const getResponse = await request(app).get(`/api/v1/my-resources/${id}`)

    expect(getResponse.status).toBe(200)
    expect(getResponse.body.success).toBe(true)
    expect(getResponse.body.data.id).toBe(id)
    expect(getResponse.body.data.name).toBe('Resource to Get')
  })
})
```

## Test Configuration and Tools

### Jest

Jest is the main testing tool. Configure it in `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "preset": "ts-jest",
    "testEnvironment": "node",
    "moduleNameMapper": {
      "^@/(.*)$": "<rootDir>/src/$1"
    },
    "testMatch": ["**/__tests__/**/*.test.ts"]
  }
}
```

### Supertest

Supertest is used to test HTTP endpoints:

```typescript
import request from 'supertest'
import { app } from '@/server'

const response = await request(app)
  .get('/api/v1/endpoint')
  .set('Authorization', `Bearer ${token}`)
  .send({ key: 'value' })
```

## TypeScript Type Checking

Use TypeScript for compile-time type validation:

```typescript
// Ensure types are correct
function processResource(resource: ResourceResponseDto): void {
  // Safe property access
  console.log(resource.id, resource.name)
}
```

## Mocking

### Repository Mocking

```typescript
jest.mock('../myResourceRepository')

// For specific methods
myResourceRepository.getMyResource = jest.fn().mockResolvedValue({
  id: '123',
  name: 'Test',
})
```

### Service Mocking

```typescript
jest.mock('../myResourceService')

// For specific methods
myResourceService.createMyResource = jest
  .fn()
  .mockResolvedValue(ServiceResponse.success('Successfully created', { id: '123', name: 'Test' }, 201))
```

## Logging and Monitoring

BotMaster uses Pino for structured logging:

```typescript
import { logger } from '@/server'

// In tests and implementations
logger.info('Operation performed', { resourceId: '123', user: 'admin' })
logger.warn('Warning', { details: 'additional information' })
logger.error('Error encountered', { error: err.message, stack: err.stack })
```

## Output Validation

Just as you validate input, it's important to validate output:

```typescript
// Output validation with Zod
const result = await myResourceService.getMyResource('123')
const validated = MyResourceResponseSchema.parse(result.data)
```

## Test Coverage

Configure Jest to generate coverage reports:

```json
{
  "jest": {
    "collectCoverageFrom": ["src/**/*.ts", "!src/**/*.d.ts", "!src/**/__tests__/**"],
    "coverageThreshold": {
      "global": {
        "statements": 80,
        "branches": 70,
        "functions": 80,
        "lines": 80
      }
    }
  }
}
```

## Recommended Test Scenarios

For each endpoint, test at least:

1. **Success case**: Valid data produces expected result
2. **Input validation**: Invalid data is appropriately rejected
3. **Error handling**: Errors are gracefully handled
4. **Edge cases**: Extreme or special values are handled correctly
5. **Concurrency**: Simultaneous operations work as expected (when applicable)
6. **Permissions**: Authorization check works (when applicable)

## Best Practices

1. **Isolation**: Each test should be independent of others.

2. **Clarity**: Name tests descriptively and use clear messages.

3. **Arrange-Act-Assert**: Structure tests in three clear parts.

4. **Test Data**: Use factories or fixtures for consistent test data.

5. **Cleanup**: Clean up resources after tests (connections, temporary files).

6. **CI/CD**: Run tests automatically in continuous integration workflows.

7. **Maintenance**: Keep tests updated when implementation changes.

## Complete Example

See examples of tests in existing modules, such as the workers module, for a complete implementation of unit and integration tests.
