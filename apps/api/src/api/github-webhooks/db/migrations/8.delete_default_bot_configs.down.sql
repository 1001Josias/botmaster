-- Remove default bot response configurations
DELETE FROM bot_response_configs WHERE repository_pattern IN ('1001Josias/*', '1001Josias/botmaster', '*');

-- Drop the JSON index
DROP INDEX IF EXISTS idx_bot_response_configs_keywords;