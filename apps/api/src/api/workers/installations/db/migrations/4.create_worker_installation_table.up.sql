CREATE TABLE IF NOT EXISTS worker_installation (
    id SERIAL PRIMARY KEY,
    worker_key INT NOT NULL REFERENCES worker(key),
    priority INT NOT NULL,
    folder_key UUID NOT NULL, -- folder_key UUID REFERENCES folders(key) NOT NULL,
    default_version VARCHAR(50) NOT NULL,
    installed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    installed_by INT NOT NULL, -- installed_by INT REFERENCES users(id) NOT NULL,
    default_properties JSONB NOT NULL,
);

CREATE INDEX idx_installed_worker_worker_key ON worker_installation(worker_key);
CREATE INDEX idx_installed_worker_folder_key ON worker_installation(folder_key);
CREATE INDEX idx_installed_worker_priority ON worker_installation(priority DESC);
CREATE INDEX idx_installed_worker_installed_at ON worker_installation(installed_at);
CREATE INDEX idx_installed_worker_installed_by ON worker_installation(installed_by);
