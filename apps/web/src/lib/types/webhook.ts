export type WebhookEventType =
  | "queue.item.added"
  | "queue.item.processed"
  | "worker.started"
  | "worker.completed"
  | "worker.failed"
  | "workflow.started"
  | "workflow.completed"
  | "workflow.failed"
  | "process.started"
  | "process.completed"
  | "process.failed"
  | "job.created"
  | "job.started"
  | "job.completed"
  | "job.failed"
  | "flow.started"
  | "flow.completed"
  | "flow.failed"

export type WebhookHeader = {
  key: string
  value: string
}

export type WebhookStatus = "active" | "inactive" | "failed"

export type WebhookDeliveryStatus = "success" | "failed" | "pending" | "retrying"

export type WebhookDelivery = {
  id: string
  timestamp: string
  status: WebhookDeliveryStatus
  responseCode?: number
  responseBody?: string
  requestBody: string
  attempt: number
  maxAttempts: number
}

export type Webhook = {
  id: string
  name: string
  url: string
  events: WebhookEventType[]
  headers: WebhookHeader[]
  status: WebhookStatus
  createdAt: string
  updatedAt: string
  secret?: string
  retryCount: number
  retryInterval: number // in seconds
  deliveries: WebhookDelivery[]
}

