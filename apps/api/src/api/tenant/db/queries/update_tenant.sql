UPDATE tenant 
SET 
  name = COALESCE($2, name),
  subdomain = COALESCE($3, subdomain),
  description = COALESCE($4, description),
  enabled = COALESCE($5, enabled),
  settings = COALESCE($6, settings),
  updated_by = $7,
  updated_at = NOW()
WHERE id = $1
RETURNING 
  id,
  key,
  name,
  subdomain,
  description,
  created_by,
  updated_by,
  created_at,
  updated_at,
  enabled,
  settings;