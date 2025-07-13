CREATE POLICY install_worker_in_folder_policy ON worker_installation
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM worker
      WHERE
        worker.key = worker_installation.worker_key
        AND worker.scope = 'folder'
        AND worker.scope_ref = worker_installation.folder_key
    )
  );
