-- Create triggers table
CREATE TABLE IF NOT EXISTS triggers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL CHECK (type IN ('schedule', 'webhook', 'event', 'data')),
  target_type VARCHAR(50) NOT NULL CHECK (target_type IN ('workflow', 'worker')),
  workflow_id VARCHAR(100),
  worker_id VARCHAR(100),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Schedule-specific fields
  schedule_frequency VARCHAR(50),
  cron_expression VARCHAR(100),
  
  -- Webhook-specific fields
  webhook_endpoint VARCHAR(255),
  webhook_method VARCHAR(10) CHECK (webhook_method IN ('GET', 'POST', 'PUT', 'DELETE')),
  webhook_secret VARCHAR(255),
  
  -- Event-specific fields
  event_source VARCHAR(100),
  event_name VARCHAR(100),
  
  -- Data condition-specific fields
  data_source VARCHAR(100),
  data_condition TEXT,
  
  -- Execution tracking
  last_run_at TIMESTAMP,
  next_run_at TIMESTAMP,
  execution_count INTEGER NOT NULL DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by VARCHAR(100),
  updated_by VARCHAR(100)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_triggers_type ON triggers(type);
CREATE INDEX IF NOT EXISTS idx_triggers_status ON triggers(status);
CREATE INDEX IF NOT EXISTS idx_triggers_target_type ON triggers(target_type);
CREATE INDEX IF NOT EXISTS idx_triggers_workflow_id ON triggers(workflow_id);
CREATE INDEX IF NOT EXISTS idx_triggers_worker_id ON triggers(worker_id);
CREATE INDEX IF NOT EXISTS idx_triggers_next_run_at ON triggers(next_run_at);

-- Add trigger for updated_at
CREATE TRIGGER update_triggers_updated_at
  BEFORE UPDATE ON triggers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();