-- Reverte a criação da tabela worker e seus índices, triggers e políticas

-- Remove as políticas de Row-Level Security (RLS)
DROP POLICY IF EXISTS folder_scope_policy ON worker;
DROP POLICY IF EXISTS tenant_scope_policy ON worker;
DROP POLICY IF EXISTS organization_scope_policy ON worker;
DROP POLICY IF EXISTS public_scope_policy ON worker;

-- Desabilita Row-Level Security (RLS)
ALTER TABLE worker DISABLE ROW LEVEL SECURITY;

-- Remove os índices criados
DROP INDEX IF EXISTS unique_worker_name_scope_ref;
DROP INDEX IF EXISTS unique_worker_name_public_scope;
DROP INDEX IF EXISTS unique_worker_name_per_folder;

-- Remove a tabela worker
DROP TABLE IF EXISTS worker;
