CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY NOT NULL,
    key UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    worker_key UUID NOT NULL, -- worker_key UUID REFERENCES workers(key) NOT NULL,
    flow_key UUID, -- flow_key UUID REFERENCES flows(key),
    description TEXT DEFAULT '',
    status VARCHAR(20) DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    parameters JSONB DEFAULT '{}' NOT NULL,
    result JSONB,
    progress INTEGER DEFAULT 0 NOT NULL CHECK (progress >= 0 AND progress <= 100),
    duration BIGINT, -- Duration in milliseconds
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    error TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by INT NOT NULL,    -- created_by INT REFERENCES users(id) NOT NULL,
    updated_by INT NOT NULL     -- updated_by INT REFERENCES users(id) NOT NULL
);

CREATE OR REPLACE TRIGGER trigger_jobs_set_updated_at
BEFORE UPDATE ON jobs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_jobs_key ON jobs(key);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_worker_key ON jobs(worker_key);
CREATE INDEX idx_jobs_flow_key ON jobs(flow_key);
CREATE INDEX idx_jobs_created_at ON jobs(created_at);
CREATE INDEX idx_jobs_updated_at ON jobs(updated_at);
CREATE INDEX idx_jobs_started_at ON jobs(started_at);
CREATE INDEX idx_jobs_completed_at ON jobs(completed_at);
CREATE INDEX idx_jobs_created_by ON jobs(created_by);
CREATE INDEX idx_jobs_updated_by ON jobs(updated_by);

-- Index for filtering by status and dates (for performance on stats queries)
CREATE INDEX idx_jobs_status_completed_at ON jobs(status, completed_at);
CREATE INDEX idx_jobs_duration ON jobs(duration) WHERE duration IS NOT NULL;