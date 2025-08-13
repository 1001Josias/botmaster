-- Drop queue_items table
DROP TRIGGER IF EXISTS update_queue_items_updated_at ON queue_items;
DROP INDEX IF EXISTS idx_queue_items_finished_at;
DROP INDEX IF EXISTS idx_queue_items_started_at;
DROP INDEX IF EXISTS idx_queue_items_created_at;
DROP INDEX IF EXISTS idx_queue_items_priority;
DROP INDEX IF EXISTS idx_queue_items_worker_id;
DROP INDEX IF EXISTS idx_queue_items_status;
DROP INDEX IF EXISTS idx_queue_items_job_id;
DROP INDEX IF EXISTS idx_queue_items_queue_id;
DROP TABLE IF EXISTS queue_items;