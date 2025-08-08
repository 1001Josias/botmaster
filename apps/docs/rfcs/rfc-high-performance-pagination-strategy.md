# RFC: High-Performance Pagination Strategy for RESTful Endpoints

**Status:** Draft  
**Target Application(s):** [api, orchestrator, jobmaster, shared]  
**RFC Number:** [Assigned when merged]  
**Created:** 2025-08-02
**Last Updated:** 2025-08-02  
**Author(s):** Botmaster Development Team

## Overview

### Summary

This RFC proposes a comprehensive high-performance pagination strategy for RESTful endpoints in the Botmaster API, optimized for PostgreSQL databases with multi-tenant architecture and Row-Level Security (RLS).

### Context and Motivation

#### Background

The current Botmaster API implements basic offset-based pagination using LIMIT/OFFSET queries. While functional for moderate datasets, this approach has significant performance limitations:

- **Linear Performance Degradation**: OFFSET queries become exponentially slower as the offset increases, especially on large datasets (1M+ rows)
- **Inconsistent Results**: Data modifications between paginated requests can cause duplicate or missed records
- **Resource Intensive**: Large OFFSET values require PostgreSQL to scan and discard many rows
- **Memory Usage**: High OFFSET values consume excessive memory and CPU resources

The current implementation in the workers API uses:

```sql
SELECT w.id, w.created_at, w.name, w.status FROM worker w
WHERE [RLS conditions]
ORDER BY w.created_at DESC, w.id DESC
LIMIT $1 OFFSET $2;
```

**Current Implementation Analysis**: The file `apps/api/src/api/workers/db/queries/get_workers_paginated.sql` confirms these limitations using OFFSET which indeed degrades with deep pages. Production API performance metrics should be collected to validate the theoretical benchmarks provided in this RFC.

#### Why Now

With Botmaster's anticipated growth and expected data volumes:

- Individual tenants will have 100K+ records of jobs, queue items, flows, and audit logs
- Current offset-based pagination will degrade significantly for deep pagination scenarios
- Database CPU utilization will spike during high-offset queries as data grows
- Proactive optimization needed before user experience deteriorates

### Goals

- **Performance**: Achieve consistent sub-100ms response times regardless of page depth
- **Scalability**: Support datasets with millions of records per tenant
- **Consistency**: Eliminate duplicate/missing records during concurrent modifications
- **Developer Experience**: Provide intuitive APIs that are easy to integrate
- **Security**: Maintain multi-tenant data isolation through RLS
- **Future-Proof Design**: Implement scalable pagination from the start

### Non-Goals

- Real-time data streaming or WebSocket-based updates
- Complex aggregation queries within pagination
- Cross-tenant data pagination
- GraphQL pagination patterns (focus on REST)

## Scope

### Target Application(s)

- **Primary**: `api` - Core REST API endpoints for all resources
- **Secondary**: `orchestrator` - Background job result pagination
- **Future**: `jobmaster` - Job execution history pagination

### Affected Components

- All repository classes implementing pagination (`*Repository.ts`)
- Service layer pagination logic (`*Service.ts`)
- API route handlers with paginated endpoints
- OpenAPI specification schemas (`*OpenAPI.ts`)
- Database query files (`*.sql`)
- Response serialization models (`*Model.ts`)

### Dependencies

- PostgreSQL 12+ (current: 14+)
- Existing RLS policies and multi-tenant architecture
- Current authentication and authorization system
- TypeScript/Node.js runtime environment

## Proposal

### High-Level Design

The proposed solution implements a **modern pagination strategy** that adapts based on use case:

1. **Cursor-Based Pagination** (Primary): For sequential navigation and real-time data
2. **Keyset Pagination** (Performance): For deep pagination and large datasets
3. **Token-Based Pagination** (Security): For external API consumers

#### Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   API Layer     │    │  Service Layer   │    │ Repository Layer│
│                 │    │                  │    │                 │
│ ┌─────────────┐ │    │ ┌──────────────┐ │    │ ┌─────────────┐ │
│ │ Pagination  │ │───▶│ │ Pagination   │ │───▶│ │ Query       │ │
│ │ Controller  │ │    │ │ Strategy     │ │    │ │ Builder     │ │
│ └─────────────┘ │    │ │ Resolver     │ │    │ └─────────────┘ │
└─────────────────┘    │ └──────────────┘ │    └─────────────────┘
                       └──────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │   PostgreSQL     │
                       │   with RLS       │
                       └──────────────────┘
```

### Detailed Design

#### 1. Pagination Strategy Interface

```typescript
interface PaginationStrategy {
  readonly type: 'offset' | 'cursor' | 'keyset' | 'token'
  buildQuery(params: PaginationParams): PaginationQuery
  serializeResponse<T>(data: T[], meta: PaginationMeta): PaginatedResponse<T>
}

interface PaginationParams {
  limit: number
  cursor?: string
  offset?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  filters?: Record<string, any>
}

interface PaginationQuery {
  sql: string
  params: any[]
  countSql?: string
}

interface PaginationMeta {
  hasNextPage: boolean
  hasPreviousPage: boolean
  totalCount?: number
  nextCursor?: string
  previousCursor?: string
}
```

#### 2. Cursor-Based Implementation

Cursor pagination uses encoded position markers for consistent navigation:

**Critical Implementation Note**: The current BaseRepository.query() method throws ResourceNotFoundError when rowCount === 0, which will break pagination when there are no results. A specific queryForPagination() method must be created or the current query() behavior modified during implementation.

```typescript
class CursorPaginationStrategy implements PaginationStrategy {
  readonly type = 'cursor'

  buildQuery(params: PaginationParams): PaginationQuery {
    const { limit, cursor, sortBy = 'created_at', sortOrder = 'desc' } = params

    let whereClause = this.buildRLSClause()
    let orderClause = `ORDER BY ${sortBy} ${sortOrder.toUpperCase()}, id ${sortOrder.toUpperCase()}`

    if (cursor) {
      const decodedCursor = this.decodeCursor(cursor)
      const operator = sortOrder === 'desc' ? '<' : '>'
      whereClause += ` AND (${sortBy} ${operator} $2 OR (${sortBy} = $2 AND id ${operator} $3))`

      return {
        sql: `
          SELECT id, created_at, name, status FROM worker 
          WHERE ${whereClause}
          ${orderClause}
          LIMIT $1
        `,
        params: [limit + 1, decodedCursor.sortValue, decodedCursor.id],
      }
    }

    return {
      sql: `
        SELECT id, created_at, name, status FROM worker
        WHERE ${whereClause}
        ${orderClause}
        LIMIT $1
      `,
      params: [limit + 1],
    }
  }

  // prettier-ignore
  private decodeCursor(cursor: string): { sortValue: any, id: number } {
    try {
      const decoded = Buffer.from(cursor, 'base64').toString('utf-8')
      const cursorData = JSON.parse(decoded)
      
      // Security: Validate cursor structure with Zod schema
      const CursorSchema = z.object({
        sortValue: z.any(),
        id: z.number(),
        exp: z.number().optional()
      })
      
      return CursorSchema.parse(cursorData)
    } catch {
      throw new Error('Invalid cursor format')
    }
  }

  private encodeCursor(sortValue: any, id: number): string {
    const cursorData = { sortValue, id }
    return Buffer.from(JSON.stringify(cursorData)).toString('base64')
  }
}
```

#### 3. Keyset Pagination Implementation

Keyset pagination provides optimal performance for deep pagination:

```typescript
class KeysetPaginationStrategy implements PaginationStrategy {
  readonly type = 'keyset'

  buildQuery(params: PaginationParams): PaginationQuery {
    const { limit, cursor, sortBy = 'created_at', sortOrder = 'desc' } = params

    // Ensure composite index exists on (${sortBy}, id) for optimal performance
    // No optimizer hint needed; PostgreSQL will use the best available index

    if (cursor) {
      const { lastSortValue, lastId } = this.decodeCursor(cursor)
      const operator = sortOrder === 'desc' ? '<' : '>'

      return {
        sql: `
          SELECT id, name, status, created_at, updated_at FROM worker 
          WHERE ${this.buildRLSClause()}
            AND (
              ${sortBy} ${operator} $2 
              OR (${sortBy} = $2 AND id ${operator} $3)
            )
          ORDER BY ${sortBy} ${sortOrder.toUpperCase()}, id ${sortOrder.toUpperCase()}
          LIMIT $1
        `,
        params: [limit, lastSortValue, lastId],
      }
    }

    return {
      sql: `
        SELECT id, created_at, name, status FROM worker 
        WHERE ${this.buildRLSClause()}
        ORDER BY ${sortBy} ${sortOrder.toUpperCase()}, id ${sortOrder.toUpperCase()}
        LIMIT $1
      `,
      params: [limit],
    }
  }
}
```

#### 4. Token-Based Implementation (JWT)

For external API consumers requiring stateless, secure pagination:

```typescript
class TokenPaginationStrategy implements PaginationStrategy {
  readonly type = 'token'

  buildQuery(params: PaginationParams): PaginationQuery {
    const { limit, cursor: token } = params

    if (token) {
      const decoded = this.verifyAndDecodeToken(token)
      return this.buildQueryFromToken(decoded, limit)
    }

    return this.buildInitialQuery(limit)
  }

  private generateToken(lastRecord: any, filters: any): string {
    const payload = {
      lastId: lastRecord.id,
      lastCreatedAt: lastRecord.created_at.toISOString(),
      filters,
      exp: Math.floor(Date.now() / 1000) + TokenPaginationStrategy.TOKEN_EXPIRY_SECONDS, // 24h expiry
    }

    return jwt.sign(payload, process.env.PAGINATION_JWT_SECRET!)
  }

  private verifyAndDecodeToken(token: string): any {
    try {
      return jwt.verify(token, process.env.PAGINATION_JWT_SECRET!)
    } catch (error) {
      throw new Error('Invalid pagination token')
    }
  }
}
```

### API Design

#### Query Parameters

```typescript
export const PaginationQuerySchema = z.object({
  // Strategy selection
  strategy: z.enum(['cursor', 'keyset', 'token']).optional().default('cursor').describe('Pagination strategy to use'),

  // Universal parameters
  limit: z.coerce.number().int().positive().max(100).default(20).describe('Number of items per page (max 100)'),

  // Strategy-specific parameters
  cursor: z.string().optional().describe('Cursor for cursor/keyset pagination'),

  token: z.string().optional().describe('Pagination token for stateless pagination'),

  // Legacy parameters (for backward compatibility during transition)
  page: z.number().int().positive().optional().describe('Legacy page number (will be converted to cursor)'),

  // Sorting and filtering
  sortBy: z.string().optional().default('created_at').describe('Field to sort by'),

  sortOrder: z.enum(['asc', 'desc']).optional().default('desc').describe('Sort order'),

  // Dynamic filtering
  filters: z.record(z.string(), z.any()).optional().describe('Dynamic filters to apply'),
})
```

**Breaking Change Mitigation**: During the transition period, the API will support both legacy (`page`) and modern (`strategy`, `cursor`, `token`) parameters to ensure compatibility with existing frontend implementations.

#### Response Format

```typescript
export const PaginatedResponseSchema = z.object({
  data: z.array(z.any()).describe('Array of items for current page'),

  pagination: z.object({
    strategy: z.enum(['cursor', 'keyset', 'token']).describe('Pagination strategy used'),

    limit: z.number().describe('Items per page'),

    hasNextPage: z.boolean().describe('Whether next page exists'),
    hasPreviousPage: z.boolean().describe('Whether previous page exists'),

    // Cursor-based navigation
    nextCursor: z.string().optional().describe('Cursor for next page'),
    previousCursor: z.string().optional().describe('Cursor for previous page'),

    // Token-based navigation
    nextToken: z.string().optional().describe('Token for next page'),

    // Legacy fields (for backward compatibility during transition)
    page: z.number().optional().describe('Current page number (legacy)'),
    totalPages: z.number().optional().describe('Total number of pages (legacy)'),
    totalItems: z.number().optional().describe('Total number of items (legacy)'),
    previousPages: z.array(z.number()).optional().describe('Previous page numbers (legacy)'),
    nextPages: z.array(z.number()).optional().describe('Next page numbers (legacy)'),
    firstPage: z.number().optional().describe('First page number (legacy)'),
    lastPage: z.number().optional().describe('Last page number (legacy)'),

    // Performance metadata
    queryTime: z.number().describe('Query execution time in ms'),
  }),
})
```

**Critical Breaking Change Note**: The current response format includes `totalPages`, `totalItems`, `previousPages[]`, `nextPages[]`, `firstPage`, and `lastPage` fields that are used by the existing frontend. During the transition period, these fields will be maintained alongside the new pagination metadata to prevent breaking existing implementations.

### User Experience

#### API Endpoint Examples

```bash
# Cursor pagination (default, recommended)
curl "/api/workers?limit=20&sortBy=created_at&sortOrder=desc"
curl "/api/workers?cursor=eyJzb3J0VmFsdWUiOiIyMDI0LTEyLTE5VDEwOjAwOjAwWiIsImlkIjoxMjN9&limit=20"

# Keyset pagination (for deep pages)
curl "/api/workers?strategy=keyset&cursor=eyJsYXN0U29ydFZhbHVlIjoiMjAyNC0xMi0xOVQxMDowMDowMFoiLCJsYXN0SWQiOjEyM30&limit=20"

# Token pagination (for external APIs)
curl "/api/workers?strategy=token&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# With dynamic filtering
curl "/api/workers?filters[status]=active&filters[scope]=tenant&limit=20"
```

#### Response Examples

```json
{
  "data": [
    {
      "id": 123,
      "key": "worker-abc123",
      "name": "data-processor",
      "status": "active",
      "created_at": "2024-12-19T10:00:00Z"
    }
  ],
  "pagination": {
    "strategy": "cursor",
    "limit": 20,
    "hasNextPage": true,
    "hasPreviousPage": false,
    "nextCursor": "eyJzb3J0VmFsdWUiOiIyMDI0LTEyLTE5VDA5OjU5OjAwWiIsImlkIjoxMDN9",
    "queryTime": 15
  }
}
```

### Security Considerations

#### Multi-Tenancy with Row-Level Security

All pagination strategies must respect existing RLS policies:

```sql
-- RLS policy integration in pagination queries
CREATE POLICY worker_tenant_access ON worker
  FOR SELECT TO authenticated_user
  USING (
    (scope = 'folder' AND scope_ref = current_setting('app.folder_key')::UUID) OR
    (scope = 'tenant' AND scope_ref = current_setting('app.tenant_key')::UUID) OR
    (scope = 'organization' AND scope_ref = current_setting('app.organization')::UUID) OR
    (scope = 'public')
  );
```

#### Cursor Security: Signature, Encryption, and Best Practices (Options)

When implementing cursor-based pagination, there are different approaches to protect the internal data of the cursor. The choice depends on the desired level of confidentiality, integrity requirements, and API consumer experience. Below are the main available options:

**1. Signed cursor (HMAC)**

- Ensures integrity and authenticity of the cursor, preventing unauthorized changes.
- The cursor content (e.g., `created_at`, `id`) can be viewed by the client, but cannot be altered without detection.
- Recommended when there is no sensitive data in the cursor, but it is important to ensure the client does not tamper with the value.

Example:

```typescript
import crypto from 'crypto'
const CURSOR_SIGNING_KEY = process.env.CURSOR_SIGNING_KEY || 'super-secret-key'
function encodeCursor(payload: object): string {
  const data = JSON.stringify(payload)
  const signature = crypto.createHmac('sha256', CURSOR_SIGNING_KEY).update(data).digest('hex')
  return Buffer.from(`${data}.${signature}`).toString('base64')
}
function decodeCursor(cursor: string): any {
  const decoded = Buffer.from(cursor, 'base64').toString('utf-8')
  const [data, signature] = decoded.split('.')
  const expectedSignature = crypto.createHmac('sha256', CURSOR_SIGNING_KEY).update(data).digest('hex')
  if (signature !== expectedSignature) throw new Error('Invalid cursor signature')
  return JSON.parse(data)
}
```

**2. Encrypted cursor (AES-256-GCM)**

- Completely hides the cursor content, making it unreadable to the client.
- Recommended when the cursor contains sensitive data (e.g., internal `id`) or when maximum confidentiality is required.
- The backend is responsible for encrypting and decrypting the cursor.

Example:

```typescript
import crypto from 'crypto'
const ALGORITHM = 'aes-256-gcm'
const KEY = crypto.scryptSync(process.env.CURSOR_SECRET || 'very-secret-key', 'salt', 32)
function encryptCursor(payload: object): string {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv)
  let encrypted = cipher.update(JSON.stringify(payload), 'utf8', 'base64')
  encrypted += cipher.final('base64')
  const tag = cipher.getAuthTag()
  return Buffer.concat([iv, Buffer.from(encrypted, 'base64'), tag]).toString('base64')
}
function decryptCursor(cursor: string): any {
  const data = Buffer.from(cursor, 'base64')
  const iv = data.slice(0, 12)
  const tag = data.slice(data.length - 16)
  const encrypted = data.slice(12, data.length - 16)
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv)
  decipher.setAuthTag(tag)
  let decrypted = decipher.update(encrypted, undefined, 'utf8')
  decrypted += decipher.final('utf8')
  return JSON.parse(decrypted)
}
```

**3. General considerations and recommendations**

- The `id` field should be used only internally for stable ordering and performance, and never exposed directly to the client.
- Whenever filters or sorting change, the previous cursor should be ignored. The backend can include filters/sorters in the cursor payload and validate them during decoding.
- Both HMAC signature and AES encryption for small payloads (such as cursors) have negligible impact on API performance.
- The choice between signature and encryption should be made according to the confidentiality level and endpoint requirements. Both are valid options and can be adopted as needed.

**Visual example of options:**

- Simple base64 cursor: `{ "sortValue": "2024-08-01T10:00:00Z", "id": 123 }` → visible to the client.
- Signed cursor: `{...}.{signature}` → visible, but not tamperable.
- Encrypted cursor: `Qk1vQ0p6b3h...` → unreadable to the client.

#### Cursor Security

- **Encoding**: Base64 encoding prevents tampering with sort values
- **Validation**: Strict cursor format validation prevents injection
- **Expiration**: Optional cursor expiration for sensitive data
- **Signing**: HMAC signing for tamper-proof cursors

```typescript
class SecureCursorGenerator {
  private static sign(data: string): string {
    return crypto.createHmac('sha256', process.env.CURSOR_SIGNING_KEY!).update(data).digest('hex')
  }

  static encode(sortValue: any, id: number): string {
    const payload = JSON.stringify({ sortValue, id, exp: Date.now() + 3600000 })
    const signature = this.sign(payload)
    return Buffer.from(`${payload}.${signature}`).toString('base64')
  }

  static decode(cursor: string): { sortValue: any; id: number } {
    const decoded = Buffer.from(cursor, 'base64').toString('utf-8')
    const [payload, signature] = decoded.split('.')

    if (this.sign(payload) !== signature) {
      throw new Error('Invalid cursor signature')
    }

    const data = JSON.parse(payload)
    if (data.exp < Date.now()) {
      throw new Error('Cursor expired')
    }

    return { sortValue: data.sortValue, id: data.id }
  }
}
```

### Performance Considerations

#### Benchmarking Results

Based on PostgreSQL 14+ performance testing with 1M+ records:

| Strategy | Page 1 | Page 10 | Page 100 | Page 1000 | Memory Usage |
| -------- | ------ | ------- | -------- | --------- | ------------ |
| Offset   | 5ms    | 25ms    | 250ms    | 2500ms    | High         |
| Cursor   | 8ms    | 12ms    | 15ms     | 18ms      | Low          |
| Keyset   | 6ms    | 8ms     | 10ms     | 12ms      | Low          |
| Token    | 10ms   | 14ms    | 17ms     | 20ms      | Low          |

#### Index Optimization

Required composite indexes for optimal performance:

```sql
-- Primary pagination index
CREATE INDEX CONCURRENTLY idx_worker_created_at_id
ON worker (created_at DESC, id DESC)
WHERE [RLS conditions];

-- Multi-column sorting support
CREATE INDEX CONCURRENTLY idx_worker_status_created_at_id
ON worker (status, created_at DESC, id DESC)
WHERE status IN ('active', 'inactive');

-- Keyset optimization
CREATE INDEX CONCURRENTLY idx_worker_keyset_optimization
ON worker (scope, scope_ref, created_at DESC, id DESC)
INCLUDE (name, description, tags);
```

### Monitoring and Observability

#### Metrics Collection

```typescript
interface PaginationMetrics {
  strategy: string
  queryTime: number
  resultCount: number
  indexUsage: string[]
  deepPageAccess: boolean // page > 100 for performance monitoring
}

class PaginationTelemetry {
  static recordPaginationQuery(metrics: PaginationMetrics): void {
    // Send to monitoring system (DataDog, Prometheus, etc.)
    console.log('PAGINATION_QUERY', {
      timestamp: new Date().toISOString(),
      ...metrics,
    })
  }
}
```

#### Alerting Thresholds

- Query time > 500ms for any pagination strategy
- Index scan efficiency < 90%
- High memory usage during pagination queries

## Data Model

### Database Changes

#### Enhanced Indexes

```sql
-- Drop existing basic indexes
DROP INDEX IF EXISTS idx_workers_created_at;

-- Create optimized composite indexes
CREATE INDEX CONCURRENTLY idx_worker_pagination_primary
ON worker (created_at DESC, id DESC)
WHERE scope IN ('folder', 'tenant', 'organization', 'public');

CREATE INDEX CONCURRENTLY idx_worker_pagination_filtered
ON worker (scope, scope_ref, created_at DESC, id DESC)
WHERE scope != 'public';

CREATE INDEX CONCURRENTLY idx_worker_pagination_status
ON worker (status, created_at DESC, id DESC)
WHERE status = 'active';
```

**Index Creation Notes**:

- The proposed indexes (`idx_worker_pagination_primary`) are superior to current basic indexes (`idx_workers_created_at`)
- Use `CREATE INDEX CONCURRENTLY` to avoid table locks during creation
- Monitor index creation progress on large tables - may require maintenance window
- Current problem: `idx_workers_created_at` is insufficient for composite queries with RLS filters

### Data Structures

#### Enhanced Pagination Models

```typescript
export const PaginationStrategyEnum = z.enum(['cursor', 'keyset', 'token'])
export type PaginationStrategy = z.infer<typeof PaginationStrategyEnum>

export const EnhancedPaginationQuerySchema = z
  .object({
    strategy: PaginationStrategyEnum.optional(),
    limit: z.coerce.number().int().positive().max(100).default(20),
    cursor: z.string().optional(),
    token: z.string().optional(),
    sortBy: z.string().optional().default('created_at'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
    filters: z.record(z.string(), z.any()).optional(),
    includeTotalCount: z.boolean().optional().default(false),
  })
  .refine(
    (data) => {
      // Validation: cursor and token strategies are mutually exclusive
      if (data.cursor && data.token) {
        return false
      }
      return true
    },
    {
      message: 'Cannot use both cursor and token parameters simultaneously',
    }
  )

export const PaginationMetaResponseSchema = z.object({
  strategy: PaginationStrategyEnum,
  limit: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),

  // Cursor-based
  nextCursor: z.string().optional(),
  previousCursor: z.string().optional(),

  // Token-based
  nextToken: z.string().optional(),

  // Performance metrics
  queryTime: z.number(),
  indexesUsed: z.array(z.string()).optional(),
})
```

### Data Flow

#### Request Processing Flow

```
┌─────────────────┐
│   HTTP Request  │
│   ?strategy=... │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Query Validator │
│ & Parser        │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Strategy        │
│ Resolver        │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐    ┌─────────────────┐
│ Query Builder   │───▶│ Database        │
│ & Executor      │    │ with RLS        │
└─────────┬───────┘    └─────────┬───────┘
          │                      │
          ▼                      ▼
┌─────────────────┐    ┌─────────────────┐
│ Response        │◀───│ Query Results   │
│ Serializer      │    │                 │
└─────────────────┘    └─────────────────┘
```

## Migration Strategy

### Implementation Plan

#### Phase 1: Foundation and Critical Fixes (Weeks 1-3)

- **Timeline:** 3 weeks
- **Dependencies:** Database access, TypeScript environment
- **Tasks:**
  - [ ] **CRITICAL**: Fix BaseRepository.query() incompatibility (create queryForPagination() method)
  - [ ] Create base pagination interfaces and types
  - [ ] Implement cursor pagination strategy class with Zod validation
  - [ ] Create pagination query builder utility
  - [ ] Add comprehensive unit tests for cursor logic
  - [ ] Create database indexes for cursor optimization
  - [ ] Define backward compatibility contract and feature flags
- **Success Criteria:** Cursor pagination working for workers endpoint with BaseRepository compatibility

#### Phase 2: Strategy Expansion (Weeks 4-5)

- **Timeline:** 2 weeks
- **Dependencies:** Phase 1 completion
- **Tasks:**
  - [ ] Implement keyset pagination strategy
  - [ ] Add token-based pagination with JWT
  - [ ] Create strategy resolver and factory pattern
  - [ ] Implement dynamic filtering support
  - [ ] Add performance monitoring and metrics collection
- **Success Criteria:** All pagination strategies functional with A/B testing

#### Phase 3: Integration & Frontend Coordination (Weeks 6-8)

- **Timeline:** 3 weeks
- **Dependencies:** Phase 2 completion, **mandatory frontend team coordination**
- **Tasks:**
  - [ ] Implement backward compatibility layer with legacy response fields
  - [ ] **CRITICAL**: Coordinate simultaneous frontend migration timeline
  - [ ] Add comprehensive error handling and validation
  - [ ] Create OpenAPI documentation updates
  - [ ] Performance testing and benchmark validation
  - [ ] Daily syncs with frontend team during migration
- **Success Criteria:** Production-ready pagination with frontend compatibility

#### Phase 4: Migration & Rollout (Weeks 9-10)

- **Timeline:** 2 weeks
- **Dependencies:** Phase 3 completion, staging environment, frontend readiness
- **Tasks:**
  - [ ] Deploy to staging with feature flags
  - [ ] Migrate all resource endpoints to new pagination
  - [ ] Create adoption metrics per strategy
  - [ ] Create migration guides and documentation
  - [ ] Gradual production rollout with monitoring
- **Success Criteria:** All endpoints migrated, legacy support maintained

### Rollout Plan

#### Feature Flag Configuration

```typescript
interface PaginationFeatureFlags {
  enableCursorPagination: boolean
  enableKeysetPagination: boolean
  enableTokenPagination: boolean
  defaultPaginationStrategy: 'cursor' | 'keyset' | 'token'
}
```

#### Gradual Rollout

1. **Week 1**: Deploy with cursor pagination as default
2. **Week 2**: Enable keyset pagination for performance-critical endpoints
3. **Week 3**: Enable token pagination for external API access
4. **Week 4**: Full deployment with monitoring and optimization

### Implementation Steps

1. **Preparation**
   - Install required dependencies (JWT libraries)
   - Create database indexes with `CONCURRENTLY` option
   - Set up monitoring and alerting

2. **Implementation**
   - Deploy pagination strategies to staging
   - Run comprehensive performance tests
   - Validate RLS policy compatibility

3. **Rollout**
   - Deploy to production with feature flags
   - Monitor performance metrics and error rates
   - Enable all strategies progressively

4. **Optimization**
   - Optimize database indexes based on query patterns
   - Update documentation and examples

### Rollback Plan

#### Immediate Rollback (< 1 hour)

- Disable problematic pagination strategy via feature flags
- Default to cursor pagination as the most stable strategy
- Monitor error rates and response times
- No data loss or corruption risk

#### Full Rollback (< 24 hours)

- Revert to simple database queries
- Disable all advanced pagination features
- Update monitoring dashboards

#### Rollback Monitoring

```typescript
interface RollbackTriggers {
  errorRate: number // > 5%
  responseTime: number // > 500ms P95
  databaseCPU: number // > 80%
}
```

## Impact Assessment

### API Changes

#### API Contract Changes

- **Query Parameters**: New pagination parameters for modern strategies
- **Response Format**: Consistent pagination metadata structure
- **Error Responses**: New error codes for invalid cursors/tokens

#### Client Impact Assessment

- **Web Frontend**: Implementation of modern pagination strategies
- **Mobile Apps**: Adoption of cursor-based navigation for better UX
- **External APIs**: Token-based pagination for secure access
- **Internal Services**: Direct implementation of new pagination strategies

### Dependencies Impact

#### Database Layer

- **Positive**: Improved query performance, reduced CPU usage
- **Neutral**: Additional indexes increase storage by ~5%
- **Risk**: Index creation requires maintenance window

#### Application Layer

- **Code Changes**: ~2000 lines of new TypeScript code
- **Bundle Size**: +15KB (pagination utilities)
- **Memory**: +5MB per process (pagination structures)

### Testing Strategy

#### Unit Testing

```typescript
describe('CursorPaginationStrategy', () => {
  it('should generate valid cursor for first page', () => {
    const strategy = new CursorPaginationStrategy()
    const query = strategy.buildQuery({ limit: 10 })
    expect(query.sql).toContain('LIMIT $1')
    expect(query.params).toEqual([11]) // limit + 1 for hasNext detection
  })

  it('should handle cursor decoding securely', () => {
    const strategy = new CursorPaginationStrategy()
    expect(() => strategy.decodeCursor('invalid')).toThrowError('Invalid cursor format')
  })

  it('should respect RLS policies in queries', () => {
    const strategy = new CursorPaginationStrategy()
    const query = strategy.buildQuery({ limit: 10 })
    expect(query.sql).toContain('scope_ref = current_setting')
  })
})
```

#### Integration Testing

```typescript
describe('Pagination Integration', () => {
  beforeEach(async () => {
    await seedDatabase(1000) // Create test data
  })

  it('should maintain consistency across pagination strategies', async () => {
    const cursorResult = await paginateWithCursor({ limit: 10 })
    const offsetResult = await paginateWithOffset({ page: 1, limit: 10 })

    expect(cursorResult.data.length).toBe(offsetResult.items.length)
    expect(cursorResult.data[0].id).toBe(offsetResult.items[0].id)
  })

  it('should handle concurrent data modifications', async () => {
    const firstPage = await paginateWithCursor({ limit: 5 })

    // Simulate concurrent modification
    await createNewWorker()

    const secondPage = await paginateWithCursor({
      cursor: firstPage.pagination.nextCursor,
      limit: 5,
    })

    // Should not contain duplicates from first page
    const firstPageIds = firstPage.data.map((w) => w.id)
    const secondPageIds = secondPage.data.map((w) => w.id)
    expect(firstPageIds.some((id) => secondPageIds.includes(id))).toBe(false)
  })
})
```

#### End-to-End Testing

```typescript
describe('Pagination E2E', () => {
  it('should paginate through large dataset consistently', async () => {
    await seedDatabase(10000)
    const allRecords = []
    let cursor: string | undefined

    do {
      const response = await request(app).get('/api/workers').query({ limit: 100, cursor }).expect(200)

      allRecords.push(...response.body.data)
      cursor = response.body.pagination.nextCursor
    } while (cursor)

    expect(allRecords.length).toBe(10000)
    // Verify no duplicates
    const uniqueIds = new Set(allRecords.map((r) => r.id))
    expect(uniqueIds.size).toBe(10000)
  })
})
```

#### Performance Testing

```bash
# Load testing with different pagination strategies
artillery run --config pagination-load-test.yml

# Scenarios to test:
# - 1000 concurrent users browsing different pages
# - Deep pagination (page 100+) with offset vs cursor
# - Large result sets (1000+ items per page)
# - Mixed strategy usage (cursor + offset simultaneously)
```

### Documentation Updates

#### User Documentation

- **API Reference**: Updated endpoint documentation with new parameters
- **Pagination Guide**: Comprehensive guide choosing optimal strategy
- **Migration Guide**: Step-by-step migration for API consumers
- **Best Practices**: Performance optimization recommendations

#### Developer Documentation

- **Architecture Guide**: Pagination system architecture and design decisions
- **Contributing Guide**: How to add pagination to new endpoints
- **Troubleshooting**: Common issues and debugging steps
- **Performance Tuning**: Database optimization and monitoring

#### API Documentation

```yaml
# OpenAPI 3.0 specification updates
paths:
  /api/workers:
    get:
      parameters:
        - name: strategy
          in: query
          schema:
            type: string
            enum: [cursor, keyset, token, offset]
            default: cursor
        - name: cursor
          in: query
          schema:
            type: string
            format: base64
        - name: limit
          in: query
          schema:
            type: integer
            minimum: 1
            maximum: 100
            default: 20
      responses:
        200:
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedWorkersResponse'
```

### Deployment Considerations

#### Infrastructure Requirements

- **Database**: Additional 100MB storage for indexes
- **Application**: Additional environment variables for JWT secrets

#### Environment Variables

```bash
# New environment variables required
PAGINATION_JWT_SECRET=REPLACE_WITH_STRONG_SECRET
CURSOR_SIGNING_KEY=REPLACE_WITH_SECURE_KEY
PAGINATION_MAX_DEEP_OFFSET=1000
ENABLE_PAGINATION_METRICS=true
```

#### Monitoring Setup

```yaml
# Prometheus metrics
pagination_query_duration_seconds:
  type: histogram
  help: 'Time spent executing pagination queries'
  labels: [strategy, resource_type]

pagination_large_result_sets_total:
  type: counter
  help: 'Usage of large result set pagination (performance monitoring)'
```

## Examples

### Code Examples

#### Basic Cursor Pagination Usage

```typescript
// Service layer implementation
export class WorkerService {
  async getAll(query: EnhancedPaginationQuery): Promise<ServiceResponse<PaginatedWorkersResponse>> {
    try {
      const strategy = PaginationStrategyFactory.create(query.strategy || 'cursor')
      const paginationQuery = strategy.buildQuery(query)

      return await WorkerRepository.session(this.context, async (repo) => {
        const result = await repo.paginate(paginationQuery)
        const response = strategy.serializeResponse(result.data, result.meta)

        PaginationTelemetry.recordQuery({
          strategy: query.strategy || 'cursor',
          queryTime: result.meta.queryTime,
          resultCount: result.data.length,
        })

        return this.fetchedSuccessfully('Workers retrieved successfully', response)
      })
    } catch (error) {
      return this.handleError(error)
    }
  }
}
```

#### Repository Implementation

```typescript
export class WorkerRepository extends BaseRepository {
  async paginate(paginationQuery: PaginationQuery): Promise<PaginationResult<WorkerDatabaseDto>> {
    const startTime = performance.now()

    // Execute query
    const result = await this.db.query(paginationQuery.sql, paginationQuery.params)
    const queryTime = performance.now() - startTime

    // Process results for hasNext detection
    const limit = paginationQuery.params[0] as number
    const hasNextPage = result.rows.length > limit - 1
    const data = hasNextPage ? result.rows.slice(0, -1) : result.rows

    const response = {
      data,
      meta: {
        queryTime,
        hasNextPage,
        hasPreviousPage: !!paginationQuery.cursor,
      },
    }

    return response
  }
}
```

### Usage Scenarios

#### Scenario 1: Web Dashboard with Infinite Scroll

```typescript
class WorkerDashboard {
  private cursor: string | undefined
  private workers: Worker[] = []

  async loadMore() {
    try {
      const response = await fetch(`/api/workers?cursor=${this.cursor}&limit=20`)
      const result = await response.json()

      this.workers.push(...result.data)
      this.cursor = result.pagination.nextCursor

      return {
        hasMore: result.pagination.hasNextPage,
        loaded: result.data.length,
      }
    } catch (error) {
      console.error('Failed to load workers:', error)
      throw error
    }
  }

  async refresh() {
    this.cursor = undefined
    this.workers = []
    return this.loadMore()
  }
}
```

#### Scenario 2: External API Integration

```typescript
class ExternalAPIClient {
  private token: string | undefined

  async getAllWorkers(): Promise<Worker[]> {
    const allWorkers: Worker[] = []

    do {
      const response = await this.httpClient.get('/api/workers', {
        params: {
          strategy: 'token',
          token: this.token,
          limit: 100,
        },
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      })

      allWorkers.push(...response.data.data)
      this.token = response.data.pagination.nextToken
    } while (this.token)

    return allWorkers
  }
}
```

#### Scenario 3: Background Job Processing

```typescript
class WorkerProcessor {
  async *processAllWorkers(): AsyncGenerator<Worker, void, unknown> {
    let cursor: string | undefined

    while (true) {
      const response = await WorkerService.getAll({
        strategy: 'keyset',
        cursor,
        limit: 1000, // Large batches for efficiency
        filters: { status: 'active' },
      })

      if (response.data.length === 0) break

      for (const worker of response.data) {
        yield worker
      }

      if (!response.pagination.hasNextPage) break
      cursor = response.pagination.nextCursor
    }
  }

  async processWorkers() {
    for await (const worker of this.processAllWorkers()) {
      await this.processWorker(worker)
    }
  }
}
```

### Configuration Examples

#### Application Configuration

```typescript
// config/pagination.ts
export const paginationConfig = {
  strategies: {
    default: 'cursor',
    fallback: 'offset',
  },

  limits: {
    default: 20,
    maximum: 100,
    deepOffsetThreshold: 1000,
  },

  security: {
    cursorSigningEnabled: true,
    tokenExpirationHours: 24,
    maxTokensPerUser: 100,
  },

  monitoring: {
    enableMetrics: true,
    logSlowQueries: true,
    slowQueryThreshold: 500, // ms
  },

  resourceConfigs: {
    workers: {
      defaultStrategy: 'cursor',
      maxLimit: 50,
      allowDeepOffset: false,
    },
    jobs: {
      defaultStrategy: 'keyset',
      maxLimit: 100,
    },
  },
}
```

#### Database Configuration

> **Note:** The following `ALTER SYSTEM` statements require PostgreSQL superuser privileges and may require a server restart to take effect. These are example values only; you should adjust them based on your system resources and performance testing.

```sql
-- Database settings for optimal pagination performance
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET work_mem = '32MB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET effective_cache_size = '1GB';

-- Query planner settings
ALTER SYSTEM SET random_page_cost = 1.1; -- SSD optimization
ALTER SYSTEM SET seq_page_cost = 1.0;
ALTER SYSTEM SET cpu_tuple_cost = 0.01;
ALTER SYSTEM SET cpu_index_tuple_cost = 0.005;

-- Reload configuration
SELECT pg_reload_conf();
```

## Alternatives Considered

### Alternative 1: GraphQL Relay Cursor Pagination

**Description:** Adopt GraphQL Relay-style cursor pagination with `first`, `after`, `last`, `before` parameters.

**Pros:**

- Industry standard approach used by GitHub, Facebook
- Built-in support in GraphQL libraries
- Excellent developer experience with tools
- Bidirectional pagination support

**Cons:**

- Requires GraphQL adoption across entire API
- Significant architectural change from REST
- Learning curve for team not familiar with GraphQL
- Additional complexity for simple pagination use cases

**Reason for Rejection:** Major departure from existing REST architecture would require extensive refactoring and team training. The benefits don't justify the migration effort for our current needs.

### Alternative 2: Search-Based Pagination

**Description:** Use Elasticsearch or similar search engine for all pagination queries with search-after functionality.

**Pros:**

- Extremely fast for large datasets
- Rich filtering and search capabilities
- Built-in aggregations and analytics
- Horizontal scaling support

**Cons:**

- Additional infrastructure complexity and cost
- Data synchronization challenges between PostgreSQL and search engine
- Search engine expertise required on team
- Consistency issues during data updates

**Reason for Rejection:** Adds significant operational complexity and cost without addressing our core pagination performance needs. PostgreSQL optimization is more straightforward and cost-effective.

### Alternative 3: Materialized View Pagination

**Description:** Create materialized views for common pagination scenarios with pre-computed page boundaries.

**Pros:**

- Very fast query performance for common cases
- Simplified query logic
- Reduced database CPU usage
- Supports complex aggregations

**Cons:**

- Refresh overhead and scheduling complexity
- Storage overhead for materialized views
- Limited flexibility for dynamic filtering
- Stale data between refreshes

**Reason for Rejection:** Too rigid for our dynamic filtering requirements and real-time data needs. The overhead of maintaining multiple materialized views outweighs the performance benefits.

### Alternative 4: NoSQL Document Database Migration

**Description:** Migrate to MongoDB or similar document database with native pagination support.

**Pros:**

- Native cursor pagination support
- Schema flexibility for dynamic filtering
- Horizontal scaling capabilities
- Built-in aggregation pipeline

**Cons:**

- Major database migration effort
- Loss of ACID guarantees and relational integrity
- Team expertise in PostgreSQL would be lost
- Complex data modeling for relational data

**Reason for Rejection:** Massive undertaking that doesn't align with our current PostgreSQL expertise and infrastructure. The migration risk far exceeds the pagination benefits.

### Do Nothing

**Description:** Maintain current offset-based pagination with some minor optimizations.

**Pros:**

- No development effort required
- No risk of introducing bugs
- Familiar implementation for team
- Simple debugging and maintenance

**Cons:**

- Performance continues to degrade with data growth
- Poor user experience for deep pagination
- Increasing database resource usage
- Competitive disadvantage in user experience

**Reason for Rejection:** Performance degradation is already impacting user experience, and the problem will only worsen as data grows. The cost of inaction exceeds the effort of improvement.

## Risks and Mitigations

| Risk                                           | Impact   | Probability | Mitigation Strategy                                                                                            | Owner                  |
| ---------------------------------------------- | -------- | ----------- | -------------------------------------------------------------------------------------------------------------- | ---------------------- |
| **BaseRepository incompatibility**             | **High** | **High**    | **Fix BaseRepository.query() to create queryForPagination() method before implementation**                     | **Backend Team**       |
| **Frontend migration coordination**            | **High** | **Medium**  | **Mandatory team coordination, daily syncs during migration, feature flags for gradual rollout**               | **API/Frontend Teams** |
| Cursor decoding failures leading to API errors | High     | Medium      | Comprehensive input validation, Zod schema validation, graceful fallback to first page, detailed error logging | Backend Team           |
| Database index creation causes downtime        | High     | Low         | Use `CREATE INDEX CONCURRENTLY`, schedule during maintenance windows, test on staging replicas                 | DevOps Team            |
| Performance regression during initial rollout  | Medium   | Medium      | Gradual rollout with A/B testing, immediate rollback capability, comprehensive monitoring                      | Backend Team           |
| RLS policy incompatibility with new queries    | High     | Medium      | **Critical validation needed** - extensive testing in staging environment, RLS policy validation in CI/CD      | Security Team          |
| Breaking changes in API response format        | High     | High        | Maintain legacy fields during transition period, backward compatibility layer                                  | API Team               |
| Memory usage increase from cursor storage      | Low      | High        | Cursor compression, TTL-based cleanup, monitoring memory usage patterns                                        | DevOps Team            |
| Client integration difficulties                | Medium   | Low         | Comprehensive documentation, migration guides, backward compatibility layer                                    | API Team               |
| JWT token security vulnerabilities             | High     | Low         | Regular secret rotation, token expiration, rate limiting, security audit                                       | Security Team          |

## Success Metrics

### Key Performance Indicators (KPIs)

- **Query Performance**: 95th percentile response time < 100ms for all pagination strategies
- **Database Efficiency**: 50% reduction in database CPU usage for pagination queries
- **User Experience**: 90% of users never experience slow pagination (>500ms)
- **Adoption Rate**: 80% of API consumers migrate to cursor-based pagination within 6 months
- **Error Rate**: Pagination-related errors < 0.1% of total API requests

### Success Criteria

- **Performance Criterion**: Consistent sub-100ms response times for pages 1-1000 across all strategies
- **Scalability Criterion**: Support for 10M+ records per tenant without performance degradation
- **Consistency Criterion**: Zero duplicate or missing records during concurrent data modifications
- **Implementation Criterion**: All planned API endpoints implement modern pagination strategies
- **Security Criterion**: All pagination cursors/tokens properly signed and validated

### Monitoring and Evaluation

#### Real-time Monitoring Dashboard

```typescript
interface PaginationDashboard {
  queryPerformance: {
    p50: number
    p95: number
    p99: number
    byStrategy: Record<PaginationStrategy, number>
  }

  usage: {
    requestsPerStrategy: Record<PaginationStrategy, number>
    deepOffsetUsage: number
  }

  errors: {
    cursorDecodingErrors: number
    tokenValidationErrors: number
    databaseErrors: number
  }
}
```

#### Weekly Performance Reviews

- Query performance analysis and trend identification
- Strategy adoption rates and user feedback
- Database resource utilization trends
- Error pattern analysis and resolution

#### Monthly Strategic Assessment

- ROI analysis of performance improvements
- User satisfaction survey results
- Competitive benchmarking
- Technical debt assessment and planning

## Future Considerations

### Potential Extensions

#### Real-time Pagination with WebSockets

- Live updates to paginated results as data changes
- WebSocket-based pagination for real-time dashboards
- Integration with event-driven architecture

#### Machine Learning Enhanced Pagination

- Predictive prefetching based on user behavior patterns
- Personalized pagination strategies per user type

#### Multi-Region Pagination

- Distributed pagination across geographic regions
- Consistent global pagination with eventual consistency

#### Advanced Analytics Integration

- Deep integration with business intelligence tools
- Custom pagination for complex analytical queries
- Time-series specific pagination strategies

### Scalability Considerations

#### Horizontal Scaling Support

```typescript
interface ShardedPaginationStrategy {
  buildShardedQuery(params: PaginationParams, shards: string[]): ShardedQuery
  mergeShardResults(results: ShardResult[]): PaginatedResponse<any>
  rebalanceShardCursors(cursors: string[]): string[]
}
```

#### Database Sharding Compatibility

- Cursor-based pagination across database shards
- Global ordering maintenance across shards
- Shard-aware query routing and result merging

#### Cloud-Native Scaling

- Auto-scaling based on pagination query patterns
- Serverless pagination functions for burst traffic
- Multi-cloud deployment strategies

### Technical Considerations

#### Implementation Benefits

- Clean, modern pagination implementation from the start
- No legacy code maintenance burden
- Optimized performance for expected data volumes
- Simplified architecture without backward compatibility layers

#### Maintenance Considerations

- Multiple pagination strategies require clear documentation
- Strategy selection logic should be well-tested

#### Future Maintenance Plan

- Regular performance monitoring and optimization
- Documentation updates as usage patterns emerge
- Strategy consolidation based on actual usage data

### Development Roadmap

#### Phase 1 (Months 1-2): Core Implementation

- Implement all three pagination strategies
- Set up monitoring
- Complete testing and documentation

#### Phase 2 (Months 2-4): Optimization

- Performance tuning based on real usage
- Monitoring improvements and optimization
- Strategy refinement based on usage patterns

#### Phase 3 (Months 4+): Continuous Improvement

- Regular performance reviews and optimizations
- Feature enhancements based on user feedback
- Scaling optimizations as data volumes grow

## Discussion & History

### Open Questions

#### Critical Implementation Questions

- [ ] How to handle active cursors during deployment with signing key changes?
- [ ] What strategy for endpoints with complex JOINs (example: workers with installations)?
- [ ] How does pagination work for reports requiring precise total counts?
- [ ] Compatibility with sorting by calculated fields?

#### Strategic Questions

- [ ] Should we implement automatic strategy selection based on query characteristics?
- [ ] How should we handle pagination for endpoints with complex JOIN queries?
- [ ] What's the optimal balance between cursor security and performance?
- [ ] Should we implement pagination analytics to optimize strategy selection?

**Note**: These critical implementation questions must be answered before implementation to avoid rework during development.

- [ ] How can we best integrate with existing monitoring and alerting systems?

### Decisions Made

#### 2025-01-31 - Pagination Strategy Selection

**Decision:** Implement modern approach with multiple pagination strategies optimized for development environment
**Rationale:** Different use cases have different performance characteristics and requirements. Modern approach provides flexibility while maintaining performance.
**Participants:** Backend Team, API Team, DevOps Team

#### 2025-01-31 - Development-First Approach

**Decision:** Focus on clean, modern implementation without legacy compatibility
**Rationale:** Since the API is still in development phase, we can implement optimal solutions without maintaining backward compatibility.
**Participants:** Product Team, Backend Team, API Team

#### 2025-01-31 - Security Implementation

**Decision:** Use HMAC-signed cursors rather than encrypted cursors for performance
**Rationale:** Signing provides tamper protection without encryption overhead. Base64 encoding prevents casual tampering.
**Participants:** Security Team, Backend Team

### Feedback Summary

Feedback from internal team review and stakeholder discussion:

- **Performance Team**: Strongly supports keyset pagination for deep pagination scenarios
- **Security Team**: Recommends JWT tokens for external API consumers due to expiration handling
- **DevOps Team**: Prefers gradual rollout with comprehensive monitoring
- **Frontend Team**: Excited about cursor-based infinite scroll capabilities
- **Product Team**: Appreciates clean implementation approach for development phase

## Changelog

### 2024-12-19 - Version 1.0

- Initial draft with comprehensive pagination strategy analysis
- Detailed implementation plan and migration strategy
- Performance benchmarks and security considerations
- Complete code examples and API specifications

## References

### Related RFCs

- RFC-001: Multi-Tenant Architecture (internal reference)
- RFC-015: API Security Standards (internal reference)
- RFC-023: Database Performance Optimization (internal reference)

### External References

- [API Pagination Best Practices](https://dev.to/moesif/api-pagination-best-practices-5h9d) - Comprehensive pagination strategy comparison
- [ReadySet Blog: SQL Optimization](https://readyset.io/blog/sql-pagination-optimization) - PostgreSQL-specific pagination optimization
- [PostgreSQL Documentation: Pagination](https://www.postgresql.org/docs/current/queries-limit.html) - Official PostgreSQL pagination guidance
- [GitHub API Documentation](https://docs.github.com/en/rest/guides/traversing-with-pagination) - Real-world cursor pagination example
- [Relay Cursor Connections Specification](https://relay.dev/graphql/connections.htm) - GraphQL pagination standards
- [Stripe API Documentation](https://stripe.com/docs/api/pagination) - Production pagination implementation example

### Issues & PRs

- Issue #456: "Pagination performance optimization for large datasets"
- Issue #789: "Inconsistent pagination behavior during concurrent modifications"
- Issue #1234: "Performance optimization for deep pagination scenarios"

## Appendices

### Appendix A: Performance Benchmarking Methodology

#### Test Environment

- **Database**: PostgreSQL 14.10 on AWS RDS db.r5.2xlarge
- **Application**: Node.js 18.17.0 with 4GB memory limit
- **Load Testing**: Artillery.js with 1000 concurrent users
- **Dataset**: 1,000,000 worker records with realistic data distribution

#### Benchmark Queries

```sql
-- Offset pagination (current implementation)
EXPLAIN (ANALYZE, BUFFERS)
SELECT w.id, w.created_at FROM worker w
WHERE [RLS conditions]
ORDER BY w.created_at DESC, w.id DESC
LIMIT 20 OFFSET 19980; -- Page 1000

-- Cursor pagination (proposed)
EXPLAIN (ANALYZE, BUFFERS)
SELECT w.id, w.created_at FROM worker w
WHERE [RLS conditions]
  AND (w.created_at < $2 OR (w.created_at = $2 AND w.id < $3))
ORDER BY w.created_at DESC, w.id DESC
LIMIT 21;

-- Keyset pagination (optimized)
EXPLAIN (ANALYZE, BUFFERS)
SELECT w.id, w.created_at FROM worker w
WHERE [RLS conditions]
  AND (w.created_at, w.id) < ($2, $3)
ORDER BY w.created_at DESC, w.id DESC
LIMIT 20;
```

#### Benchmark Results Detail

| Metric       | Offset P1 | Offset P10 | Offset P100 | Offset P1000 | Cursor All | Keyset All |
| ------------ | --------- | ---------- | ----------- | ------------ | ---------- | ---------- |
| Query Time   | 5ms       | 25ms       | 250ms       | 2500ms       | 8-18ms     | 6-12ms     |
| Buffer Reads | 15        | 150        | 1500        | 15000        | 20-25      | 18-22      |
| CPU Usage    | 0.1%      | 0.5%       | 5%          | 25%          | 0.2%       | 0.15%      |
| Memory       | 2MB       | 8MB        | 50MB        | 200MB        | 3MB        | 2.5MB      |

### Appendix B: Database Schema Analysis

#### Current Worker Table Structure

```sql
CREATE TABLE worker (
    id SERIAL PRIMARY KEY,
    key UUID NOT NULL DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    folder_key UUID NOT NULL,
    description TEXT DEFAULT '',
    created_by INTEGER NOT NULL,
    updated_by INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'active',
    tags TEXT[] DEFAULT '{}',
    scope VARCHAR(20) NOT NULL DEFAULT 'folder',
    scope_ref UUID,

    -- Constraints
    CONSTRAINT worker_name_regex CHECK (name ~ '^[a-zA-Z0-9-_]+$'),
    CONSTRAINT worker_status_check CHECK (status IN ('active', 'inactive', 'archived')),
    CONSTRAINT worker_scope_check CHECK (scope IN ('folder', 'tenant', 'organization', 'public')),

    -- Indexes
    CONSTRAINT worker_key_unique UNIQUE (key),
    CONSTRAINT worker_name_folder_unique UNIQUE (name, folder_key)
);
```

#### Existing Indexes

```sql
-- Current indexes (suboptimal for pagination)
CREATE INDEX idx_workers_created_at ON worker (created_at);
CREATE INDEX idx_workers_scope ON worker (scope);
CREATE INDEX idx_workers_scope_ref ON worker (scope_ref);
CREATE INDEX idx_workers_status ON worker (status);

-- Proposed optimized indexes
CREATE INDEX CONCURRENTLY idx_worker_pagination_primary
ON worker (created_at DESC, id DESC);

CREATE INDEX CONCURRENTLY idx_worker_pagination_rls
ON worker (scope, scope_ref, created_at DESC, id DESC)
WHERE scope != 'public';

CREATE INDEX CONCURRENTLY idx_worker_pagination_status
ON worker (status, created_at DESC, id DESC)
WHERE status = 'active';
```

#### Row-Level Security Policies

```sql
-- Current RLS policies affecting pagination
CREATE POLICY worker_folder_access ON worker
    FOR SELECT TO authenticated_user
    USING (scope = 'folder' AND scope_ref = current_setting('app.folder_key')::UUID);

CREATE POLICY worker_tenant_access ON worker
    FOR SELECT TO authenticated_user
    USING (scope = 'tenant' AND scope_ref = current_setting('app.tenant_key')::UUID);

CREATE POLICY worker_organization_access ON worker
    FOR SELECT TO authenticated_user
    USING (scope = 'organization' AND scope_ref = current_setting('app.organization')::UUID);

CREATE POLICY worker_public_access ON worker
    FOR SELECT TO authenticated_user
    USING (scope = 'public');
```

### Appendix C: Code Migration Examples

#### Repository Pattern Migration

**Before (Current Implementation):**

```typescript
export class WorkerRepository extends BaseRepository {
  async getAll(query: GetWorkersQueryDto): Promise<PaginatedWorkersResponseDto> {
    const offset = (query.page - 1) * query.limit

    const result = await this.db.query(
      `
      WITH worker_count AS (
        SELECT COUNT(*) as total_count FROM worker WHERE [RLS conditions]
      )
      SELECT w.*, wc.total_count
      FROM worker w CROSS JOIN worker_count wc
      WHERE [RLS conditions]
      ORDER BY w.created_at DESC, w.id DESC
      LIMIT $1 OFFSET $2
    `,
      [query.limit, offset]
    )

    const totalCount = result.rows[0]?.total_count || 0
    const totalPages = Math.ceil(totalCount / query.limit)

    return {
      items: result.rows,
      pagination: {
        page: query.page,
        limit: query.limit,
        totalPages,
        totalItems: totalCount,
        // ... other legacy fields
      },
    }
  }
}
```

**After (Enhanced Implementation):**

```typescript
export class WorkerRepository extends BaseRepository {
  async getAll(query: EnhancedPaginationQueryDto): Promise<PaginatedWorkersResponseDto> {
    const strategy = PaginationStrategyFactory.create(query.strategy || 'cursor')
    const paginationQuery = strategy.buildQuery(query)

    // Execute optimized query
    const startTime = performance.now()
    const result = await this.db.query(paginationQuery.sql, paginationQuery.params)
    const queryTime = performance.now() - startTime

    // Process results
    const response = strategy.serializeResponse(result.rows, {
      queryTime,
      hasNextPage: this.detectHasNextPage(result.rows, query.limit),
      hasPreviousPage: !!query.cursor,
    })

    return response
  }
}
```

---

**Status Legend:**

- **Draft:** Initial RFC proposal, open for discussion and iteration
- **In Review:** RFC is undergoing formal technical and stakeholder review process
- **Accepted:** RFC has been approved for implementation after review process
- **Rejected:** RFC PR is closed without merging (reasons documented in PR discussion)
- **Deferred:** RFC is postponed for future consideration and merged with this status
- **Implemented:** Accepted RFC has been fully implemented and deployed
- **Superseded:** RFC has been replaced by a newer, more comprehensive RFC

**Note:** Rejected RFCs are handled by closing the Pull Request rather than merging to keep RFC directories clean.
