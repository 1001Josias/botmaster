UPDATE queue_items 
SET status = COALESCE($2, status),
    result = COALESCE($3, result),
    error_message = COALESCE($4, error_message),
    attempts = COALESCE($5, attempts),
    processing_time = COALESCE($6, processing_time),
    started_at = COALESCE($7, started_at),
    finished_at = COALESCE($8, finished_at),
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;