INSERT INTO worker (
  name,
  description,
  status,
  tags,
  created_by,
  updated_by,
  scope,
  scope_ref,
  folder_key
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  $6,
  $7,
  $8,
  current_setting('app.folder_key')::uuid
) RETURNING *;