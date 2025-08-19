-- Create queues table
CREATE TABLE IF NOT EXISTS queues (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    folder_key VARCHAR(255) NOT NULL,
    description TEXT DEFAULT '',
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'error')),
    concurrency INTEGER DEFAULT 1 CHECK (concurrency > 0),
    retry_limit INTEGER DEFAULT 3 CHECK (retry_limit >= 0),
    retry_delay INTEGER DEFAULT 60000 CHECK (retry_delay >= 0), -- in milliseconds
    priority INTEGER DEFAULT 5 CHECK (priority >= 0 AND priority <= 10),
    is_active BOOLEAN DEFAULT true,
    tags TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_by INTEGER NOT NULL,
    updated_by INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_queues_key ON queues(key);
CREATE INDEX idx_queues_folder_key ON queues(folder_key);
CREATE INDEX idx_queues_status ON queues(status);
CREATE INDEX idx_queues_is_active ON queues(is_active);
CREATE INDEX idx_queues_created_at ON queues(created_at);

-- Create trigger for updated_at
CREATE TRIGGER update_queues_updated_at
    BEFORE UPDATE ON queues
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE queues IS 'Queue definitions for processing jobs';
COMMENT ON COLUMN queues.key IS 'Unique identifier for the queue';
COMMENT ON COLUMN queues.concurrency IS 'Maximum number of concurrent jobs';
COMMENT ON COLUMN queues.retry_limit IS 'Maximum number of retry attempts';
COMMENT ON COLUMN queues.retry_delay IS 'Delay between retries in milliseconds';
COMMENT ON COLUMN queues.priority IS 'Queue priority (0-10, higher is more important)';