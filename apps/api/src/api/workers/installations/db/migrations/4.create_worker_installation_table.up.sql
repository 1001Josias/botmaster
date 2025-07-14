CREATE TABLE IF NOT EXISTS worker_installation (
    id SERIAL PRIMARY KEY,
    worker_key UUID NOT NULL REFERENCES worker(key),
    priority INT NOT NULL,
    folder_key UUID NOT NULL DEFAULT current_setting('app.folder_key')::UUID, -- folder_key UUID REFERENCES folders(key) NOT NULL,
    default_version VARCHAR(50) NOT NULL, -- default_version VARCHAR(50) NOT NULL REFERENCES worker_release(version),
    installed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    installed_by INT NOT NULL, -- installed_by INT REFERENCES users(id) NOT NULL,
    default_properties JSONB NOT NULL
);

ALTER TABLE worker_installation ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX idx_worker_installation_unique ON worker_installation(worker_key, folder_key);
CREATE INDEX idx_worker_installation_worker_key ON worker_installation(worker_key);
CREATE INDEX idx_worker_installation_folder_key ON worker_installation(folder_key);
CREATE INDEX idx_worker_installation_priority ON worker_installation(priority DESC);
CREATE INDEX idx_worker_installation_installed_at ON worker_installation(installed_at);
CREATE INDEX idx_worker_installation_installed_by ON worker_installation(installed_by);
