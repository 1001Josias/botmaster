UPDATE worker 
SET 
    name = COALESCE($2, name),
    description = COALESCE($3, description),
    status = COALESCE($4, status),
    tags = COALESCE($5, tags),
    updated_by = $6,
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