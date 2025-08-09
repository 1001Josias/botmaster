UPDATE queue_items 
SET status = 'waiting',
    attempts = 0,
    error_message = NULL,
    result = NULL,
    started_at = NULL,
    finished_at = NULL,
    processing_time = NULL,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;