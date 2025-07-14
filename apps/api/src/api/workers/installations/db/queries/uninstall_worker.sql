DELETE FROM worker_installation WHERE worker_key = $1
RETURNING *;
