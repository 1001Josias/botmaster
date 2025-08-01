INSERT INTO tenant (name, subdomain, description, created_by, updated_by, enabled, settings)
VALUES ($1, $2, $3, $4, $4, $5, $6)
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