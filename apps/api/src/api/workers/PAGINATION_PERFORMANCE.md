# Pagination Performance Notes

## Query Optimization

The paginated query in `get_workers_paginated.sql` uses:

1. **CTE (Common Table Expression)** for counting total records
2. **CROSS JOIN** to avoid running the count query multiple times
3. **LIMIT/OFFSET** for pagination as requested
4. **ORDER BY created_at DESC, id DESC** for consistent ordering

## Index Usage

The query benefits from existing indexes:
- `idx_workers_scope` and `idx_workers_scope_ref` for WHERE conditions
- `idx_workers_created_at` for ORDER BY performance
- RLS (Row Level Security) policies automatically filter data by context

## Performance Recommendations

1. For very large datasets (>1M records), consider cursor-based pagination
2. The current OFFSET approach is acceptable for moderate datasets
3. Indexes on (scope, scope_ref, created_at) composite would further optimize
4. Consider materialized views for frequently accessed aggregations

## Multi-tenancy

The query respects all scope levels:
- `folder`: Limited to specific folder context
- `tenant`: Limited to specific tenant context  
- `organization`: Limited to specific organization context
- `public`: Available to all contexts

Row Level Security policies ensure proper data isolation.