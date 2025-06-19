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
    tags TEXT[] DEFAULT '{}' NOT NULL,
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

CREATE INDEX idx_workers_name ON workers(name);
CREATE INDEX idx_workers_folder_key ON workers(folder_key);
CREATE INDEX idx_workers_tags ON workers USING GIN(tags);
CREATE INDEX idx_workers_created_at ON workers(created_at);
CREATE INDEX idx_workers_updated_at ON workers(updated_at);
CREATE INDEX idx_workers_scope_ref ON worker(scope_ref);
CREATE INDEX idx_workers_scope ON worker(scope);
CREATE INDEX idx_worker_created_by ON worker(created_by);
CREATE INDEX idx_worker_updated_by ON worker(updated_by);
CREATE INDEX idx_worker_status ON worker(status);

ALTER TABLE worker ENABLE ROW LEVEL SECURITY;

CREATE POLICY folder_access_policy ON worker
  FOR INSERT, UPDATE, DELETE
  USING (folder_key = current_setting('app.current_folder_key')::UUID);

CREATE POLICY folder_scope_policy ON worker
  FOR SELECT 
  USING (scope = 'folder' AND scope_ref = current_setting('app.current_folder_key')::UUID);

CREATE POLICY tenant_scope_policy ON worker
  FOR SELECT 
  USING (scope = 'tenant' AND scope_ref = current_setting('app.current_tenant_key')::UUID);

CREATE POLICY organization_scope_policy ON worker
  FOR SELECT 
  USING (scope = 'organization' AND scope_ref = current_setting('app.current_organization_key')::UUID);

CREATE POLICY public_scope_policy ON worker
  FOR SELECT 
  USING (scope = 'public');
