INSERT INTO worker_installation (
  worker_key,
  priority,
  default_version,
  installed_by,
  default_properties,
  folder_key
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  current_setting('app.folder_key')::UUID
) RETURNING *;
