-- Drop webhook_events table and its indexes
DROP INDEX IF EXISTS idx_webhook_events_composite;
DROP INDEX IF EXISTS idx_webhook_events_created_at;
DROP INDEX IF EXISTS idx_webhook_events_bot_mentioned;
DROP INDEX IF EXISTS idx_webhook_events_processed;
DROP INDEX IF EXISTS idx_webhook_events_event_type;
DROP INDEX IF EXISTS idx_webhook_events_repository;
DROP TABLE IF EXISTS webhook_events;