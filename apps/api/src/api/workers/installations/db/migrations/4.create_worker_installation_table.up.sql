CREATE TABLE IF NOT EXISTS worker_installation (
    id SERIAL PRIMARY KEY
    worker_id INT NOT NULL REFERENCES worker(id),
    priority INT DEFAULT 0 NOT NULL,
    status VARCHAR(50) DEFAULT 'active' NOT NULL,
    folder_key UUID NOT NULL, -- folder_key UUID REFERENCES folders(key) NOT NULL,
    default_version VARCHAR(50) NOT NULL,
    installed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    installed_by INT NOT NULL, -- installed_by INT REFERENCES users(id) NOT NULL,
    default_properties JSONB,
);

CREATE INDEX idx_installed_worker_worker_id ON installed_worker(worker_id);
CREATE INDEX idx_installed_worker_folder_key ON installed_worker(folder_key);
CREATE INDEX idx_installed_worker_status ON installed_worker(status);
CREATE INDEX idx_installed_worker_priority ON installed_worker(priority DESC);
CREATE INDEX idx_installed_worker_installed_at ON installed_worker(installed_at);
CREATE INDEX idx_installed_worker_installed_by ON installed_worker(installed_by);
