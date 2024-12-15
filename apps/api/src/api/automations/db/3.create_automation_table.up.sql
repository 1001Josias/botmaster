CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS automation (
    id SERIAL PRIMARY KEY NOT NULL,
    automation_key UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    automation_name VARCHAR(255) UNIQUE NOT NULL,
    automation_description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by INT NOT NULL,
    updated_by INT NOT NULL
    -- created_by INT REFERENCES users(id) NOT NULL,
    -- updated_by INT REFERENCES users(id) NOT NULL,
);
