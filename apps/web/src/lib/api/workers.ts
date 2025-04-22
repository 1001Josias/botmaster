// Mock data for workers
const mockWorkers = [
  {
    id: 'worker-1',
    name: 'CSV Reader',
    description: 'Reads data from CSV files',
    type: 'data',
    inputs: [
      { name: 'filePath', type: 'string', required: true },
      { name: 'hasHeader', type: 'boolean', required: false },
    ],
    outputs: [{ name: 'data', type: 'array' }],
  },
  {
    id: 'worker-2',
    name: 'Data Transformer',
    description: 'Transforms data using custom rules',
    type: 'process',
    inputs: [
      { name: 'data', type: 'array', required: true },
      { name: 'transformationRules', type: 'object', required: true },
    ],
    outputs: [{ name: 'transformedData', type: 'array' }],
  },
  {
    id: 'worker-3',
    name: 'API Caller',
    description: 'Makes HTTP requests to external APIs',
    type: 'api',
    inputs: [
      { name: 'url', type: 'string', required: true },
      { name: 'method', type: 'string', required: true },
      { name: 'headers', type: 'object', required: false },
      { name: 'body', type: 'object', required: false },
    ],
    outputs: [
      { name: 'response', type: 'object' },
      { name: 'statusCode', type: 'number' },
    ],
  },
  {
    id: 'worker-4',
    name: 'Database Query',
    description: 'Executes SQL queries on databases',
    type: 'data',
    inputs: [
      { name: 'connectionString', type: 'string', required: true },
      { name: 'query', type: 'string', required: true },
      { name: 'parameters', type: 'object', required: false },
    ],
    outputs: [
      { name: 'results', type: 'array' },
      { name: 'rowCount', type: 'number' },
    ],
  },
  {
    id: 'worker-5',
    name: 'Email Sender',
    description: 'Sends emails using SMTP',
    type: 'api',
    inputs: [
      { name: 'to', type: 'string', required: true },
      { name: 'subject', type: 'string', required: true },
      { name: 'body', type: 'string', required: true },
      { name: 'from', type: 'string', required: false },
    ],
    outputs: [
      { name: 'success', type: 'boolean' },
      { name: 'messageId', type: 'string' },
    ],
  },
  {
    id: 'worker-6',
    name: 'Data Filter',
    description: 'Filters data based on conditions',
    type: 'process',
    inputs: [
      { name: 'data', type: 'array', required: true },
      { name: 'conditions', type: 'object', required: true },
    ],
    outputs: [
      { name: 'filteredData', type: 'array' },
      { name: 'count', type: 'number' },
    ],
  },
  {
    id: 'worker-7',
    name: 'File Writer',
    description: 'Writes data to files',
    type: 'data',
    inputs: [
      { name: 'filePath', type: 'string', required: true },
      { name: 'data', type: 'any', required: true },
      { name: 'format', type: 'string', required: false },
    ],
    outputs: [
      { name: 'success', type: 'boolean' },
      { name: 'bytesWritten', type: 'number' },
    ],
  },
  {
    id: 'worker-8',
    name: 'Data Aggregator',
    description: 'Aggregates data using functions like sum, avg, etc.',
    type: 'process',
    inputs: [
      { name: 'data', type: 'array', required: true },
      { name: 'groupBy', type: 'string', required: false },
      { name: 'aggregations', type: 'object', required: true },
    ],
    outputs: [{ name: 'aggregatedData', type: 'array' }],
  },
  {
    id: 'worker-9',
    name: 'Notification Sender',
    description: 'Sends notifications to various channels',
    type: 'api',
    inputs: [
      { name: 'channel', type: 'string', required: true },
      { name: 'message', type: 'string', required: true },
      { name: 'recipients', type: 'array', required: true },
    ],
    outputs: [
      { name: 'success', type: 'boolean' },
      { name: 'deliveredCount', type: 'number' },
    ],
  },
  {
    id: 'worker-10',
    name: 'Scheduler',
    description: 'Schedules tasks for future execution',
    type: 'system',
    inputs: [
      { name: 'taskId', type: 'string', required: true },
      { name: 'schedule', type: 'string', required: true },
      { name: 'payload', type: 'object', required: false },
    ],
    outputs: [
      { name: 'scheduled', type: 'boolean' },
      { name: 'nextExecutionTime', type: 'string' },
    ],
  },
]

// Function to fetch workers
export async function fetchWorkers() {
  // In a real application, this would be an API call
  return new Promise<any[]>((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      resolve(mockWorkers)
    }, 800)
  })
}
