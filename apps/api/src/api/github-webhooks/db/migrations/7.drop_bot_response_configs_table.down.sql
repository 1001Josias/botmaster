-- Drop bot_response_configs table and its indexes
DROP INDEX IF EXISTS idx_bot_response_configs_composite;
DROP INDEX IF EXISTS idx_bot_response_configs_pattern;
DROP INDEX IF EXISTS idx_bot_response_configs_priority;
DROP INDEX IF EXISTS idx_bot_response_configs_enabled;
DROP TABLE IF EXISTS bot_response_configs;