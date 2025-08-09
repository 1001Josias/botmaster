UPDATE folder 
SET 
  name = COALESCE($2, name),
  tenant_key = COALESCE($3, tenant_key),
  description = COALESCE($4, description),
  parent_folder_key = COALESCE($5, parent_folder_key),
  path = COALESCE($6, path),
  enabled = COALESCE($7, enabled),
  settings = COALESCE($8, settings),
  updated_by = $9,
  updated_at = NOW()
WHERE id = $1
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