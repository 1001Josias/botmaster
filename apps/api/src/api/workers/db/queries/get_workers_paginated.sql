-- Get paginated workers with total count
WITH worker_count AS (
    SELECT COUNT(*) as total_count
    FROM worker
    WHERE 
        (scope = 'folder' AND scope_ref = current_setting('app.folder_key')::UUID) OR
        (scope = 'tenant' AND scope_ref = current_setting('app.tenant_key')::UUID) OR
        (scope = 'organization' AND scope_ref = current_setting('app.organization')::UUID) OR
        (scope = 'public')
)
SELECT 
    w.id,
    w.key,
    w.name,
    w.folder_key,
    w.description,
    w.created_by,
    w.updated_by,
    w.created_at,
    w.updated_at,
    w.status,
    w.tags,
    w.scope,
    w.scope_ref,
    wc.total_count
FROM worker w
CROSS JOIN worker_count wc
WHERE 
    (w.scope = 'folder' AND w.scope_ref = current_setting('app.folder_key')::UUID) OR
    (w.scope = 'tenant' AND w.scope_ref = current_setting('app.tenant_key')::UUID) OR
    (w.scope = 'organization' AND w.scope_ref = current_setting('app.organization')::UUID) OR
    (w.scope = 'public')
ORDER BY w.created_at DESC, w.id DESC
LIMIT $1 OFFSET $2;