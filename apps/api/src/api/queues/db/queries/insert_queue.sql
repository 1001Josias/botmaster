INSERT INTO queues (
    key, name, folder_key, description, status, concurrency, 
    retry_limit, retry_delay, priority, is_active, tags, 
    metadata, created_by, updated_by
) VALUES (
    gen_random_uuid()::text, $1, 'default_folder', $2, 'active', $3, 
    $4, $5, $6, $7, $8, 
    $9, $10, $11
) RETURNING *;