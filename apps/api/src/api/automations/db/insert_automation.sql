INSERT INTO automation (
  name,
  description,
  created_by,
  updated_by
) VALUES (
  $1,
  $2,
  $3,
  $4
) RETURNING *;