INSERT INTO worker (
  name,
  description,
  created_by,
  updated_by,
  folder_key,
  tenant_key
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  $6
) RETURNING *;