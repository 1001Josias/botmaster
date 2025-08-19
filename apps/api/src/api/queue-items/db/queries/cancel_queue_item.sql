UPDATE queue_items 
SET status = 'cancelled',
    finished_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1 AND status IN ('waiting', 'processing')
RETURNING *;