INSERT INTO worker (
  name,
  folder_key,
  description,
  status,
  priority,
  allowed_machines,
  tags,
  properties,
  created_by,
  updated_by
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  $6,
  $7,
  $8,
  $9,
  $10
) RETURNING *;