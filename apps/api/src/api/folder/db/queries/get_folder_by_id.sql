SELECT 
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
  settings
FROM folder
WHERE id = $1;