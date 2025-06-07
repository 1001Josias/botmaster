CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS worker (
    id SERIAL PRIMARY KEY NOT NULL,
    key UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    folder_key UUID NOT NULL, -- folder_key UUID REFERENCES folders(key) NOT NULL,
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
-- CREATE INDEX idx_workers_scope_ref ON worker(scope_ref);
-- CREATE INDEX idx_workers_scope ON worker(scope);

-- This index ensures that the combination of folder_key and name is unique
CREATE UNIQUE INDEX unique_worker_name_per_folder ON worker(folder_key, name);

-- Adiciona índice para workers públicos
CREATE UNIQUE INDEX unique_worker_name_public_scope ON worker(name) WHERE (scope = 'public');

-- Adiciona índice para workers com escopos não públicos
CREATE UNIQUE INDEX unique_worker_name_scope_ref ON worker(scope_ref, name) WHERE (scope != 'public');

-- Enable Row-Level Security (RLS) for the worker table
ALTER TABLE worker ENABLE ROW LEVEL SECURITY;

-- Create a policy for folder scope
CREATE POLICY folder_scope_policy ON worker
  USING (scope = 'folder' AND scope_ref = current_setting('app.current_folder_key')::UUID);

-- Create a policy for tenant scope
CREATE POLICY tenant_scope_policy ON worker
  USING (scope = 'tenant' AND scope_ref = current_setting('app.current_tenant_key')::UUID);

-- Create a policy for organization scope
CREATE POLICY organization_scope_policy ON worker
  USING (scope = 'organization' AND scope_ref = current_setting('app.current_organization_key')::UUID);

-- Create a policy for public scope
CREATE POLICY public_scope_policy ON worker
  USING (scope = 'public');
