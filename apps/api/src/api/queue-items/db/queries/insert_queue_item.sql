INSERT INTO queue_items (
    queue_id, job_id, job_name, worker_id, worker_name, worker_version,
    payload, max_attempts, priority, tags, metadata
) VALUES (
    $1, $2, $3, $4, $5, $6,
    $7, $8, $9, $10, $11
) RETURNING *;