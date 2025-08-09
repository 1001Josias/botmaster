-- Create webhook_events table for storing GitHub webhook events
CREATE TABLE IF NOT EXISTS webhook_events (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    repository_full_name VARCHAR(255) NOT NULL,
    issue_number INTEGER,
    comment_id BIGINT,
    user_login VARCHAR(255) NOT NULL,
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    bot_mentioned BOOLEAN DEFAULT FALSE,
    response_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_webhook_events_repository ON webhook_events(repository_full_name);
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_type ON webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed ON webhook_events(processed);
CREATE INDEX IF NOT EXISTS idx_webhook_events_bot_mentioned ON webhook_events(bot_mentioned);
CREATE INDEX IF NOT EXISTS idx_webhook_events_created_at ON webhook_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_webhook_events_composite ON webhook_events(repository_full_name, event_type, created_at DESC);