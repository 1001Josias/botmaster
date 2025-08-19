SELECT qi.*, q.name as queue_name 
FROM queue_items qi
JOIN queues q ON qi.queue_id = q.id
WHERE qi.id = $1;