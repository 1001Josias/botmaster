CREATE POLICY delete_worker_policy
ON worker_installation
FOR DELETE
USING (
  folder_key = current_setting('app.folder_key')::UUID
);