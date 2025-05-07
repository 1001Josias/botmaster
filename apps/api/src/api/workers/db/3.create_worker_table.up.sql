CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS worker (
    id SERIAL PRIMARY KEY NOT NULL,
    key UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by INT NOT NULL,    -- created_by INT REFERENCES users(id) NOT NULL,
    updated_by INT NOT NULL,    -- updated_by INT REFERENCES users(id) NOT NULL,
    folder_key UUID NOT NULL,
    tenant_key UUID NOT NULL,
    timeout INT DEFAULT 0 NOT NULL,
    priority INT DEFAULT 0 NOT NULL,
    tags TEXT[],
    properties JSONB,
    properties_schema JSONB,
    allowed_machines TEXT[], -- Replace by FK machines
    max_retries INT DEFAULT 0 NOT NULL,
    retry_delay BIGINT DEFAULT 0 NOT NULL,
    default_version VARCHAR(50) DEFAULT 'latest',
    status VARCHAR(50) DEFAULT 'development' NOT NULL, -- ['active', 'inactive', 'development', 'archived']
    language VARCHAR(50), -- ['python', 'javascript', 'java', 'csharp', 'go', 'ruby', 'php', 'shell', ...]
    mode VARCHAR(50) DEFAULT 'single' NOT NULL, -- ['single', 'batch']
    input_schema JSONB,
    output_schema JSONB,
);

-- CREATE INDEX idx_workers_name ON workers(name);
-- CREATE INDEX idx_workers_folder_key ON workers(folder_key);
-- CREATE INDEX idx_workers_tenant_key ON workers(tenant_key);
-- CREATE INDEX idx_workers_tags ON workers USING GIN(tags);
-- CREATE INDEX idx_workers_created_at ON workers(created_at DESC);
-- CREATE INDEX idx_workers_updated_at ON workers(updated_at DESC);
