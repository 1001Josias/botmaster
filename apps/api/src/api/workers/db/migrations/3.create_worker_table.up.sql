CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS worker (
    id SERIAL PRIMARY KEY NOT NULL,
    key UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by INT NOT NULL,    -- created_by INT REFERENCES users(id) NOT NULL,
    updated_by INT NOT NULL,    -- updated_by INT REFERENCES users(id) NOT NULL,
    priority INT DEFAULT 0 NOT NULL,
    tags TEXT[],
    properties JSONB,
    allowed_machines TEXT[], -- Replace by FK machines
    status VARCHAR(50) DEFAULT 'active' NOT NULL,
    scope VARCHAR(20) NOT NULL,
    scope_ref UUID,
    CONSTRAINT scope_ref_constraint CHECK (
        (scope = 'folder' AND scope_ref IS NOT NULL) OR
        (scope = 'tenant' AND scope_ref IS NOT NULL) OR
        (scope = 'organization' AND scope_ref IS NOT NULL) OR
        (scope = 'public' AND scope_ref IS NULL)
    )
);

CREATE OR REPLACE TRIGGER trigger_set_updated_at
BEFORE UPDATE ON worker
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- CREATE INDEX idx_workers_name ON workers(name);
-- CREATE INDEX idx_workers_folder_key ON workers(folder_key);
-- CREATE INDEX idx_workers_tags ON workers USING GIN(tags);
-- CREATE INDEX idx_workers_created_at ON workers(created_at DESC);
-- CREATE INDEX idx_workers_updated_at ON workers(updated_at DESC);
