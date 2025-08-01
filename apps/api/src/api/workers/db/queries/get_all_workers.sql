SELECT 
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
    scope_ref,
    COUNT(*) OVER() as total_count
FROM worker
WHERE 1=1
    AND ($1::text IS NULL OR (name ILIKE '%' || $1 || '%' OR description ILIKE '%' || $1 || '%'))
    AND ($2::text IS NULL OR status = $2)
    AND ($3::text IS NULL OR scope = $3)
    AND ($4::uuid IS NULL OR folder_key = $4)
ORDER BY 
    CASE WHEN $5 = 'name' AND $6 = 'asc' THEN name END ASC,
    CASE WHEN $5 = 'name' AND $6 = 'desc' THEN name END DESC,
    CASE WHEN $5 = 'createdAt' AND $6 = 'asc' THEN created_at END ASC,
    CASE WHEN $5 = 'createdAt' AND $6 = 'desc' THEN created_at END DESC,
    CASE WHEN $5 = 'updatedAt' AND $6 = 'asc' THEN updated_at END ASC,
    CASE WHEN $5 = 'updatedAt' AND $6 = 'desc' THEN updated_at END DESC,
    CASE WHEN $5 = 'status' AND $6 = 'asc' THEN status END ASC,
    CASE WHEN $5 = 'status' AND $6 = 'desc' THEN status END DESC,
    created_at DESC
LIMIT $7 OFFSET $8;