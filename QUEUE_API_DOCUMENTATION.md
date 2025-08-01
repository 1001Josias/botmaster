# Queue Management API Documentation

This document describes the queue management API implementation for the BotMaster application.

## Overview

The queue API provides comprehensive functionality for managing queues and queue items in the BotMaster system. It follows RESTful principles and includes proper validation, error handling, and pagination.

## API Base URL

```
http://localhost:3001/api/v1
```

## Authentication

All API requests require the following headers:
- `x-folder-key`: The folder context (e.g., "default_folder")
- `Content-Type`: application/json

## Queue Management

### List Queues
```http
GET /queues?page=1&limit=20&status=active&search=email
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `status` (optional): Filter by status (`active`, `paused`, `error`)
- `folderKey` (optional): Filter by folder
- `search` (optional): Search in name or description

**Response:**
```json
{
  "queues": [
    {
      "id": 1,
      "key": "queue-uuid",
      "name": "Email Processing Queue",
      "folderKey": "default_folder",
      "description": "Processes incoming emails",
      "status": "active",
      "concurrency": 5,
      "retryLimit": 3,
      "retryDelay": 60000,
      "priority": 5,
      "isActive": true,
      "tags": ["email", "processing"],
      "metadata": {},
      "createdBy": 123,
      "updatedBy": 123,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 1
}
```

### Create Queue
```http
POST /queues
```

**Request Body:**
```json
{
  "name": "New Processing Queue",
  "description": "Queue for processing new data",
  "concurrency": 10,
  "retryLimit": 5,
  "retryDelay": 30000,
  "priority": 7,
  "isActive": true,
  "tags": ["processing", "data"],
  "metadata": {"source": "api"}
}
```

### Get Queue by ID
```http
GET /queues/{id}
```

### Get Queue by Key
```http
GET /queues/key/{key}
```

### Update Queue
```http
PUT /queues/{id}
```

### Delete Queue
```http
DELETE /queues/{id}
```

### Pause Queue
```http
POST /queues/{id}/pause
```

### Resume Queue
```http
POST /queues/{id}/resume
```

### Get Queue Statistics
```http
GET /queues/{id}/stats
```

**Response:**
```json
{
  "totalPending": 25,
  "totalProcessing": 3,
  "totalCompleted": 1250,
  "totalFailed": 8,
  "avgProcessingTime": 5500
}
```

## Queue Items Management

### List Queue Items
```http
GET /queue-items?page=1&pageSize=20&status=waiting,processing&queueId=1
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 20, max: 100)
- `status` (optional): Filter by status array
- `queueId` (optional): Filter by queue ID
- `workerId` (optional): Filter by worker ID
- `jobId` (optional): Filter by job ID
- `dateFrom` (optional): Filter items created after date (ISO 8601)
- `dateTo` (optional): Filter items created before date (ISO 8601)
- `searchTerm` (optional): Search in job name or worker name

**Response:**
```json
{
  "items": [
    {
      "id": 1,
      "queueId": 1,
      "jobId": "job-123",
      "jobName": "Process Email",
      "workerId": "email-worker",
      "workerName": "Email Worker",
      "workerVersion": "1.0.0",
      "status": "waiting",
      "payload": {"email": "user@example.com"},
      "result": null,
      "errorMessage": null,
      "attempts": 0,
      "maxAttempts": 3,
      "priority": 5,
      "tags": ["email"],
      "metadata": {},
      "processingTime": null,
      "startedAt": null,
      "finishedAt": null,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 20,
  "totalPages": 1
}
```

### Add Item to Queue
```http
POST /queue-items
```

**Request Body:**
```json
{
  "queueId": 1,
  "jobId": "unique-job-id",
  "jobName": "Process User Data",
  "workerId": "data-worker",
  "workerName": "Data Processing Worker",
  "workerVersion": "1.2.0",
  "payload": {"userId": 123, "action": "process"},
  "maxAttempts": 3,
  "priority": 5,
  "tags": ["user", "data"],
  "metadata": {"source": "web"}
}
```

### Get Queue Item
```http
GET /queue-items/{id}
```

### Update Queue Item
```http
PUT /queue-items/{id}
```

### Delete Queue Item
```http
DELETE /queue-items/{id}
```

### Retry Failed Item
```http
POST /queue-items/{id}/retry
```

### Cancel Pending/Processing Item
```http
POST /queue-items/{id}/cancel
```

### Export Queue Items
```http
POST /queue-items/export
```

**Request Body:**
```json
{
  "format": "csv",
  "fields": ["id", "jobName", "status", "createdAt"],
  "compress": true,
  "selectedIds": [1, 2, 3],
  "filters": {
    "status": ["completed"],
    "dateFrom": "2024-01-01T00:00:00Z"
  }
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `409` - Conflict (duplicate)
- `500` - Internal Server Error

## Error Response Format

```json
{
  "message": "Validation error",
  "responseObject": {
    "field": "name",
    "error": "Name is required"
  }
}
```

## Database Schema

### Queues Table
- `id` (SERIAL PRIMARY KEY)
- `key` (VARCHAR UNIQUE) - Auto-generated UUID
- `name` (VARCHAR) - Human-readable name
- `folder_key` (VARCHAR) - Folder context
- `description` (TEXT) - Optional description
- `status` (VARCHAR) - active/paused/error
- `concurrency` (INTEGER) - Max concurrent jobs
- `retry_limit` (INTEGER) - Max retry attempts
- `retry_delay` (INTEGER) - Delay between retries (ms)
- `priority` (INTEGER) - Queue priority (0-10)
- `is_active` (BOOLEAN) - Active flag
- `tags` (TEXT[]) - Array of tags
- `metadata` (JSONB) - Additional metadata
- `created_by`/`updated_by` (INTEGER) - User IDs
- `created_at`/`updated_at` (TIMESTAMP) - Timestamps

### Queue Items Table
- `id` (SERIAL PRIMARY KEY)
- `queue_id` (INTEGER) - Foreign key to queues
- `job_id` (VARCHAR) - External job identifier
- `job_name` (VARCHAR) - Human-readable job name
- `worker_id`/`worker_name`/`worker_version` - Worker info
- `status` (VARCHAR) - waiting/processing/completed/error/cancelled
- `payload` (JSONB) - Input data
- `result` (JSONB) - Output data
- `error_message` (TEXT) - Error details
- `attempts`/`max_attempts` (INTEGER) - Retry tracking
- `priority` (INTEGER) - Item priority
- `tags` (TEXT[]) - Array of tags
- `metadata` (JSONB) - Additional metadata
- `processing_time` (INTEGER) - Duration in milliseconds
- `started_at`/`finished_at` (TIMESTAMP) - Processing timestamps
- `created_at`/`updated_at` (TIMESTAMP) - Record timestamps

## Usage Examples

### Create a Queue and Add Items

```javascript
// Create queue
const queue = await fetch('/api/v1/queues', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-folder-key': 'default_folder'
  },
  body: JSON.stringify({
    name: 'Email Processing',
    description: 'Process incoming emails',
    concurrency: 5
  })
});

// Add item to queue
const item = await fetch('/api/v1/queue-items', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-folder-key': 'default_folder'
  },
  body: JSON.stringify({
    queueId: queue.id,
    jobId: 'email-001',
    jobName: 'Process Welcome Email',
    workerId: 'email-worker',
    workerName: 'Email Worker',
    payload: { to: 'user@example.com', template: 'welcome' }
  })
});
```

This API provides a complete queue management solution with proper validation, error handling, and scalability considerations.