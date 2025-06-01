INSERT INTO worker (
  name,
  description,
  status,
  priority,
  allowed_machines,
  tags,
  properties,
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
  $9,
  $10,
  $11
) RETURNING *;