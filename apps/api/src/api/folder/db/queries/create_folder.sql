INSERT INTO folder (name, tenant_key, description, created_by, updated_by, parent_folder_key, path, enabled, settings)
VALUES ($1, $2, $3, $4, $4, $5, $6, $7, $8)
RETURNING 
  id,
  key,
  name,
  tenant_key,
  description,
  created_by,
  updated_by,
  created_at,
  updated_at,
  parent_folder_key,
  path,
  enabled,
  settings;