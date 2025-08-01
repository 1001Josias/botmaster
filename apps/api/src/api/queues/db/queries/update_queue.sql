UPDATE queues 
SET name = COALESCE($2, name),
    description = COALESCE($3, description),
    concurrency = COALESCE($4, concurrency),
    retry_limit = COALESCE($5, retry_limit),
    retry_delay = COALESCE($6, retry_delay),
    priority = COALESCE($7, priority),
    is_active = COALESCE($8, is_active),
    tags = COALESCE($9, tags),
    metadata = COALESCE($10, metadata),
    updated_by = $11,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;