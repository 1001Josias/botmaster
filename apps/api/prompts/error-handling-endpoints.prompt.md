# Error Handling Patterns for Endpoints

This guide describes the recommended patterns for consistent error handling in BotMaster API endpoints, based on existing implementation.

## Error Response Structure

All error responses should follow the standard `ServiceResponse` format, which has a consistent structure:

```json
{
  "success": false,
  "message": "Error description",
  "data": null or { error details },
  "statusCode": 400-500
}
```

## Error Types

BotMaster implements several error types that can be used in different situations:

### 1. Business Errors (BusinessError)

Base for errors related to business rules.

```typescript
import { BusinessError, NotFoundError, ConflictError } from '@/common/utils/errorHandlers'

// Usage in a service
if (condition) {
  throw new BusinessError('Descriptive error message', StatusCodes.BAD_REQUEST)
}
```

### 2. Specific Errors

- **NotFoundError**: When a resource is not found

  ```typescript
  throw new NotFoundError(`Resource with ID ${id} not found`)
  ```

- **ConflictError**: When there's a conflict with existing resources

  ```typescript
  throw new ConflictError('A resource with this name already exists')
  ```

- **ValidationError**: For validation errors

  ```typescript
  throw new ValidationError('Field X must have at least Y characters')
  ```

- **UnauthorizedError**: For authentication errors

  ```typescript
  throw new UnauthorizedError('Invalid or expired token')
  ```

- **ForbiddenError**: For authorization errors
  ```typescript
  throw new ForbiddenError('No permission to access this resource')
  ```

### 3. Database Errors

For PostgreSQL-specific errors:

```typescript
import { PostgresError } from '@/common/utils/errorHandlers'

try {
  // Database operation
} catch (err) {
  if (err instanceof DatabaseError) {
    throw PostgresError.toBusinessError(err) // Converts to an appropriate business error
  }
  throw err // Re-throws other errors
}
```

## Layered Error Handling Pattern

### 1. Repository Layer

In the repository layer, capture specific database errors and convert them to business errors:

```typescript
async createResource(resource: CreateResourceDto): Promise<ResourceResponseDto> {
  try {
    const { rows } = await dbPool.query(querySql, values)
    // Normal processing...
  } catch (err) {
    if (err instanceof DatabaseError) {
      // Convert database errors to business errors
      throw PostgresError.toBusinessError(err)
    }
    throw err // Re-throw other errors
  }
}
```

### 2. Service Layer

In the service layer, capture business errors and return appropriate responses:

```typescript
async createResource(resource: CreateResourceDto): Promise<ServiceResponse<ResourceResponseDto | null>> {
  try {
    // Business logic
    const createdResource = await this.resourceRepository.createResource(resource)
    return ServiceResponse.success('Resource created successfully', createdResource, StatusCodes.CREATED)
  } catch (err) {
    if (err instanceof BusinessError) {
      // Log the error
      logger.warn(`${err.name}: ${err.message}`)

      // Return a structured error response
      return ServiceResponse.failure(err.message, null, err.status)
    }

    // Re-throw unhandled errors to be caught by the error middleware
    throw err
  }
}
```

### 3. Controller Layer

In the controller layer, forward unhandled errors to the error middleware:

```typescript
public createResource = async (
  req: RequestWithValidatedData<ResourceResponseDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const serviceResponse = await this.resourceService.createResource(req.validatedData)
    return handleServiceResponse(serviceResponse, res)
  } catch (err) {
    // Pass the error to the global error handling middleware
    next(err)
  }
}
```

## Input Validation

Use the `validateRequest` middleware for automatic validation based on Zod schemas:

```typescript
import { validateRequest } from '@/common/utils/httpHandlers'
import { CreateResourceSchema } from './resourceModel'

// In route configuration
router.post('/', validateRequest(CreateResourceSchema, 'body'), controller.createResource)
```

This middleware will automatically validate input data and reject invalid requests with appropriate messages.

## Response Centralization

Use the `handleServiceResponse` utility to process service responses consistently:

```typescript
import { handleServiceResponse } from '@/common/utils/httpHandlers'

// In the controller
const serviceResponse = await this.resourceService.createResource(req.validatedData)
return handleServiceResponse(serviceResponse, res)
```

## Global Error Middleware

The global error middleware catches unhandled exceptions and provides consistent responses:

```typescript
// Already configured in server.ts
app.use(errorHandler())
```

## Error Logging

Use the logger to record important information about errors:

```typescript
import { logger } from '@/server'

// For errors that don't interrupt the flow
logger.warn(`${err.name}: ${err.message}`)

// For critical errors
logger.error(`Critical error: ${err.message}`, { stack: err.stack })
```

## HTTP Status Codes

Use constants from `http-status-codes` for consistent values:

```typescript
import { StatusCodes } from 'http-status-codes'

// Examples of usage
StatusCodes.BAD_REQUEST // 400
StatusCodes.UNAUTHORIZED // 401
StatusCodes.FORBIDDEN // 403
StatusCodes.NOT_FOUND // 404
StatusCodes.CONFLICT // 409
StatusCodes.INTERNAL_SERVER_ERROR // 500
```

## Asynchronous Error Handling

For asynchronous routes, always use try/catch or an error handling wrapper:

```typescript
// With explicit try/catch
public async method(req, res, next) {
  try {
    // asynchronous code
  } catch (err) {
    next(err)
  }
}
```

## Best Practices

1. **Be Specific**: Use the most specific error type applicable to the situation.

2. **Clear Messages**: Provide descriptive and actionable error messages.

3. **Don't Leak Details**: Don't expose internal details, stacktraces, or sensitive information in responses.

4. **Consistency**: Maintain the same error handling pattern throughout the application.

5. **Early Validation**: Validate inputs as early as possible in the request flow.

6. **Appropriate Logging**: Log errors with the appropriate severity level and sufficient context.

7. **Centralization**: Use centralized error handling utilities whenever possible.
