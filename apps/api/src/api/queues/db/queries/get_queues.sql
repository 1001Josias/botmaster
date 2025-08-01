SELECT q.*, 
       COUNT(qi.id) FILTER (WHERE qi.status = 'waiting') as pending_count,
       COUNT(qi.id) FILTER (WHERE qi.status = 'processing') as processing_count,
       COUNT(qi.id) FILTER (WHERE qi.status = 'completed') as completed_count,
       COUNT(qi.id) FILTER (WHERE qi.status = 'error') as failed_count
FROM queues q
LEFT JOIN queue_items qi ON q.id = qi.queue_id
WHERE ($1::varchar IS NULL OR q.status = $1)
  AND ($2::varchar IS NULL OR q.folder_key = $2)
  AND ($3::varchar IS NULL OR (q.name ILIKE '%' || $3 || '%' OR q.description ILIKE '%' || $3 || '%'))
GROUP BY q.id
ORDER BY q.created_at DESC
LIMIT $4 OFFSET $5;