INSERT INTO worker (
  name,
  folder_key,
  description,
  status,
  tags,
  created_by,
  updated_by,
  scope,
  scope_ref
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  $6,
  $7,
  $8,
  $9
) RETURNING *;