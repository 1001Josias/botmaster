SELECT 
    COUNT(qi.id) FILTER (WHERE qi.status = 'waiting') as total_pending,
    COUNT(qi.id) FILTER (WHERE qi.status = 'processing') as total_processing,
    COUNT(qi.id) FILTER (WHERE qi.status = 'completed') as total_completed,
    COUNT(qi.id) FILTER (WHERE qi.status = 'error') as total_failed,
    COALESCE(AVG(qi.processing_time) FILTER (WHERE qi.processing_time IS NOT NULL), 0) as avg_processing_time
FROM queue_items qi
JOIN queues q ON qi.queue_id = q.id
WHERE q.id = $1;