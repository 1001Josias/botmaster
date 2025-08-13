CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS folder (
    id SERIAL PRIMARY KEY NOT NULL,
    key UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    tenant_key UUID NOT NULL, -- tenant_key UUID REFERENCES tenant(key) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by INT NOT NULL,    -- created_by INT REFERENCES users(id) NOT NULL,
    updated_by INT NOT NULL,    -- updated_by INT REFERENCES users(id) NOT NULL,
    parent_folder_key UUID,     -- parent_folder_key UUID REFERENCES folders(key),
    path VARCHAR(500) NOT NULL, -- Full path for hierarchical organization
    enabled BOOLEAN NOT NULL DEFAULT true,
    settings JSONB DEFAULT '{}' NOT NULL
);

CREATE OR REPLACE TRIGGER trigger_folder_set_updated_at
BEFORE UPDATE ON folder
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_folder_name ON folder(name);
CREATE INDEX idx_folder_tenant_key ON folder(tenant_key);
CREATE INDEX idx_folder_parent_folder_key ON folder(parent_folder_key);
CREATE INDEX idx_folder_path ON folder(path);
CREATE INDEX idx_folder_created_at ON folder(created_at);
CREATE INDEX idx_folder_updated_at ON folder(updated_at);
CREATE INDEX idx_folder_enabled ON folder(enabled);
CREATE INDEX idx_folder_created_by ON folder(created_by);
CREATE INDEX idx_folder_updated_by ON folder(updated_by);

ALTER TABLE folder ENABLE ROW LEVEL SECURITY;

-- Policy to allow access based on folder context
CREATE POLICY folder_access_policy ON folder
  FOR ALL
  USING (key = current_setting('app.folder_key')::UUID);

-- Policy to allow access based on tenant context  
CREATE POLICY folder_tenant_access_policy ON folder
  FOR ALL
  USING (tenant_key = current_setting('app.tenant_key')::UUID);