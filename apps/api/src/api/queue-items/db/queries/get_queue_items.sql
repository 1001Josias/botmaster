SELECT qi.*, q.name as queue_name 
FROM queue_items qi
JOIN queues q ON qi.queue_id = q.id
WHERE ($1::int IS NULL OR qi.queue_id = $1)
  AND ($2::varchar IS NULL OR qi.worker_id = $2)
  AND ($3::varchar IS NULL OR qi.job_id = $3)
  AND ($4::timestamp IS NULL OR qi.created_at >= $4)
  AND ($5::timestamp IS NULL OR qi.created_at <= $5)
  AND ($6::varchar IS NULL OR (qi.job_name ILIKE '%' || $6 || '%' OR qi.worker_name ILIKE '%' || $6 || '%'))
  AND ($7::varchar[] IS NULL OR qi.status = ANY($7))
ORDER BY qi.priority DESC, qi.created_at DESC
LIMIT $8 OFFSET $9;