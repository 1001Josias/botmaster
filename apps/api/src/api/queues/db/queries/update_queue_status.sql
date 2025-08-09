UPDATE queues 
SET status = $2, updated_by = $3, updated_at = CURRENT_TIMESTAMP 
WHERE id = $1
RETURNING *;