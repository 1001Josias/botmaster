-- Drop triggers table and related objects
DROP TRIGGER IF EXISTS update_triggers_updated_at ON triggers;
DROP INDEX IF EXISTS idx_triggers_type;
DROP INDEX IF EXISTS idx_triggers_status;
DROP INDEX IF EXISTS idx_triggers_target_type;
DROP INDEX IF EXISTS idx_triggers_workflow_id;
DROP INDEX IF EXISTS idx_triggers_worker_id;
DROP INDEX IF EXISTS idx_triggers_next_run_at;
DROP TABLE IF EXISTS triggers;