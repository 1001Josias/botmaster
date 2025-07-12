DROP POLICY IF EXISTS folder_scope_policy ON worker;
DROP POLICY IF EXISTS tenant_scope_policy ON worker;
DROP POLICY IF EXISTS organization_scope_policy ON worker;
DROP POLICY IF EXISTS public_scope_policy ON worker;

ALTER TABLE worker DISABLE ROW LEVEL SECURITY;

DROP TABLE IF EXISTS worker;
