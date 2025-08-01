SELECT 
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
  settings
FROM tenant
WHERE id = $1;