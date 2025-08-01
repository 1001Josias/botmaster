-- Drop queues table
DROP TRIGGER IF EXISTS update_queues_updated_at ON queues;
DROP INDEX IF EXISTS idx_queues_created_at;
DROP INDEX IF EXISTS idx_queues_is_active;
DROP INDEX IF EXISTS idx_queues_status;
DROP INDEX IF EXISTS idx_queues_folder_key;
DROP INDEX IF EXISTS idx_queues_key;
DROP TABLE IF EXISTS queues;