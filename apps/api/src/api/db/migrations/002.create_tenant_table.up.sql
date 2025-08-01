CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS tenant (
    id SERIAL PRIMARY KEY NOT NULL,
    key UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    subdomain VARCHAR(50) UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by INT NOT NULL,    -- created_by INT REFERENCES users(id) NOT NULL,
    updated_by INT NOT NULL,    -- updated_by INT REFERENCES users(id) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT true,
    settings JSONB DEFAULT '{}' NOT NULL
);

CREATE OR REPLACE TRIGGER trigger_tenant_set_updated_at
BEFORE UPDATE ON tenant
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_tenant_name ON tenant(name);
CREATE INDEX idx_tenant_subdomain ON tenant(subdomain);
CREATE INDEX idx_tenant_created_at ON tenant(created_at);
CREATE INDEX idx_tenant_updated_at ON tenant(updated_at);
CREATE INDEX idx_tenant_enabled ON tenant(enabled);
CREATE INDEX idx_tenant_created_by ON tenant(created_by);
CREATE INDEX idx_tenant_updated_by ON tenant(updated_by);

ALTER TABLE tenant ENABLE ROW LEVEL SECURITY;

-- Basic policy to allow access based on tenant context
CREATE POLICY tenant_access_policy ON tenant
  FOR ALL
  USING (key = current_setting('app.tenant_key')::UUID);