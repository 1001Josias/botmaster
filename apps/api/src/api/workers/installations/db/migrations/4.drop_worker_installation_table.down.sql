ALTER TABLE IF EXISTS worker_installation DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS install_worker_in_folder_policy ON worker_installation;


DROP INDEX IF EXISTS idx_worker_installation_folder_key;
DROP INDEX IF EXISTS idx_worker_installation_worker_key;
DROP INDEX IF EXISTS idx_worker_installation_priority;
DROP INDEX IF EXISTS idx_worker_installation_installed_at;
DROP INDEX IF EXISTS idx_worker_installation_installed_by;
DROP TABLE IF EXISTS worker_installation;
