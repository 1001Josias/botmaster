-- Create bot_response_configs table for configuring bot responses to mentions
CREATE TABLE IF NOT EXISTS bot_response_configs (
    id SERIAL PRIMARY KEY,
    repository_pattern VARCHAR(255) NOT NULL,
    mention_keywords JSONB NOT NULL DEFAULT '[]',
    response_template TEXT NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    priority INTEGER DEFAULT 5 CHECK (priority >= 0 AND priority <= 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bot_response_configs_enabled ON bot_response_configs(enabled);
CREATE INDEX IF NOT EXISTS idx_bot_response_configs_priority ON bot_response_configs(priority DESC);
CREATE INDEX IF NOT EXISTS idx_bot_response_configs_pattern ON bot_response_configs(repository_pattern);
CREATE INDEX IF NOT EXISTS idx_bot_response_configs_composite ON bot_response_configs(enabled, priority DESC, created_at ASC);