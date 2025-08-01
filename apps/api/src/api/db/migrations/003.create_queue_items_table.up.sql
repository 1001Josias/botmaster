-- Create queue_items table
CREATE TABLE IF NOT EXISTS queue_items (
    id SERIAL PRIMARY KEY,
    queue_id INTEGER NOT NULL REFERENCES queues(id) ON DELETE CASCADE,
    job_id VARCHAR(255) NOT NULL,
    job_name VARCHAR(255) NOT NULL,
    worker_id VARCHAR(255) NOT NULL,
    worker_name VARCHAR(255) NOT NULL,
    worker_version VARCHAR(50) DEFAULT '1.0.0',
    status VARCHAR(50) DEFAULT 'waiting' CHECK (status IN ('waiting', 'processing', 'completed', 'error', 'cancelled')),
    payload JSONB DEFAULT '{}',
    result JSONB,
    error_message TEXT,
    attempts INTEGER DEFAULT 0 CHECK (attempts >= 0),
    max_attempts INTEGER DEFAULT 3 CHECK (max_attempts >= 0),
    priority INTEGER DEFAULT 5 CHECK (priority >= 0 AND priority <= 10),
    tags TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    processing_time INTEGER, -- in milliseconds
    started_at TIMESTAMP WITH TIME ZONE,
    finished_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_queue_items_queue_id ON queue_items(queue_id);
CREATE INDEX idx_queue_items_job_id ON queue_items(job_id);
CREATE INDEX idx_queue_items_status ON queue_items(status);
CREATE INDEX idx_queue_items_worker_id ON queue_items(worker_id);
CREATE INDEX idx_queue_items_priority ON queue_items(priority);
CREATE INDEX idx_queue_items_created_at ON queue_items(created_at);
CREATE INDEX idx_queue_items_started_at ON queue_items(started_at);
CREATE INDEX idx_queue_items_finished_at ON queue_items(finished_at);

-- Create trigger for updated_at
CREATE TRIGGER update_queue_items_updated_at
    BEFORE UPDATE ON queue_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE queue_items IS 'Individual items/jobs in queues';
COMMENT ON COLUMN queue_items.job_id IS 'External job identifier';
COMMENT ON COLUMN queue_items.payload IS 'Job input data';
COMMENT ON COLUMN queue_items.result IS 'Job output data';
COMMENT ON COLUMN queue_items.processing_time IS 'Time taken to process in milliseconds';
COMMENT ON COLUMN queue_items.attempts IS 'Current number of attempts';
COMMENT ON COLUMN queue_items.max_attempts IS 'Maximum retry attempts allowed';