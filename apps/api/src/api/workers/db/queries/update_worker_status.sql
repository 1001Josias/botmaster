UPDATE worker 
SET 
    status = $2,
    updated_by = $3,
    updated_at = NOW()
WHERE id = $1
RETURNING 
    id,
    key,
    name,
    folder_key,
    description,
    created_by,
    updated_by,
    created_at,
    updated_at,
    status,
    tags,
    scope,
    scope_ref;