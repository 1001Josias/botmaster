# Implementation of Paginated Endpoints with Encrypted Cursor

## 1. Overview

To ensure the performance, data consistency, and scalability of our API, the implementation of pagination in all RESTful endpoints that return lists must **exclusively** follow the `cursor-based pagination` strategy with an encrypted cursor, as defined in the pagination RFC.

The goal is to provide consistent and fast responses (under 100ms) and to protect the implementation through opaque, encrypted cursors using **AES-256-GCM**.

---

## 2. Implementation Requirements

### 2.1. API Parameters (Query Parameters)

Paginated endpoints must accept the following parameters, with strict validation via a Zod schema:

- `limit`: `number` (optional, default: `20`, max: `100`) - Defines the maximum number of items per page.
- `cursor`: `string` (optional) - Opaque and encrypted cursor representing the position to fetch the next or previous page.
- `sortBy`: `string` (optional, default: `'created_at'`) - Field used for sorting the results.
- `sortOrder`: `string` (optional, enum: `['asc', 'desc']`, default: `'desc'`) - The direction of the sort.
- `filters`: `Record<string, any>` (optional) - Object for dynamic filters. Ex: `filters[status]=active`.

### 2.2. API Response Format

The response must be standardized, containing a `data` array with the page's items and a `pagination` object with pagination metadata.

**Response Structure:**

```json
{
  "data": [
    {
      "id": 123,
      "name": "Sample Item 1",
      "created_at": "2024-08-12T10:00:00Z"
    }
  ],
  "pagination": {
    "limit": 20,
    "hasNextPage": true,
    "hasPreviousPage": false,
    "nextCursor": "OPAQUE_AND_ENCRYPTED_CURSOR_FOR_NEXT_PAGE",
    "previousCursor": "OPAQUE_AND_ENCRYPTED_CURSOR_FOR_PREVIOUS_PAGE",
    "queryTime": 15
  }
}
```

### 2.3. Query Logic (SQL)

- **Stable Sorting:** The `ORDER BY` clause must **always** include a unique and sequential field (usually `id`) as a tie-breaker to ensure consistent ordering and prevent data skipping.

  ```sql
  ORDER BY created_at DESC, id DESC
  ```

- **Cursor Logic:** The `WHERE` clause must use the values from the last item of the previous page (extracted from the decrypted cursor) to fetch the next set of data.

  ```sql
  -- Example for sortOrder = 'desc'
  WHERE tenant_id = $1 AND (created_at < $2 OR (created_at = $2 AND id < $3))
  ```

- **`hasNextPage` Optimization:** To efficiently determine if a next page exists, the query should request `limit + 1` records. If `limit + 1` items are returned, `hasNextPage` is `true`. The extra item **must not** be included in the final response.

### 2.4. Cursor Security

- **Mandatory Encryption (AES-256-GCM):** The cursor must be a completely opaque value to the client. Its payload **must** be encrypted using **AES-256-GCM**. The payload must contain, at a minimum, the value of the sorting field and the ID of the last item.
  ```json
  // Cursor payload (before encryption)
  {
    "sortValue": "2024-08-12T10:00:00Z",
    "id": 123
  }
  ```
- **Cursor Validation:** The cursor received in the request must be decrypted and its payload validated (using Zod) before being used in the query. Invalid, malformed, or incorrectly signed cursors must result in a `400 Bad Request` error.

- **Multi-Tenancy (RLS):** All queries must be compatible with existing Row-Level Security (RLS) policies, ensuring that one tenant cannot access another's data. The `tenant_id` must be part of the `WHERE` clause.

### 2.5. Performance and Indexing

- **Composite Indexes:** It is **mandatory** to create composite indexes in the database that match the sorting and filtering criteria to ensure query performance.
  ```sql
  -- Example index for the default sort order
  CREATE INDEX CONCURRENTLY idx_[table_name]_pagination_main
  ON [table_name] (tenant_id, created_at DESC, id DESC);
  ```
- **Query Analysis:** Use `EXPLAIN (ANALYZE, BUFFERS)` to validate the query execution plan and ensure that the correct indexes are being used, avoiding `Seq Scan`.

---

## 3. Best Practices and Considerations

- **Cursor Invalidation:** The client must discard the current cursor if any of the `sortBy`, `sortOrder`, or `filters` parameters are changed. A new search should be initiated without the `cursor` parameter.
- **Error Handling:** Implement specific error handling for invalid or expired cursors.
- **Compatibility with `BaseRepository`:** The `BaseRepository.query()` method currently throws an error if `rowCount === 0`. This is incompatible with pagination logic, which can legitimately return zero results. Create a specific method, such as `queryForPagination()`, or adjust the behavior of the existing method to handle this case.
- **Documentation (OpenAPI):** The API documentation (Swagger/OpenAPI) must be updated to reflect the pagination parameters and response format.

---

## 4. Acceptance Criteria

- [ ] All new endpoints that return lists implement encrypted cursor-based pagination.
- [ ] API parameters (`limit`, `cursor`, `sortBy`, etc.) are validated via Zod.
- [ ] The API response strictly follows the defined format, including the `pagination` object.
- [ ] The cursor is opaque to the client, with its payload encrypted using AES-256-GCM.
- [ ] SQL queries are optimized and use composite indexes.
- [ ] RLS policies for multi-tenancy are respected.
- [ ] The `limit + 1` optimization is used to determine `hasNextPage`.
- [ ] The endpoint's OpenAPI documentation is updated.
- [ ] The issue with `BaseRepository.query()` is resolved.
