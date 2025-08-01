// API base URL - should be configured based on environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'

// Types based on the API response structure
export interface Worker {
  id: number
  key: string
  name: string
  folderKey: string
  description: string
  status: 'active' | 'inactive' | 'archived'
  tags: string[]
  scope: 'folder' | 'tenant' | 'organization' | 'public'
  scopeRef: string | null
  createdBy: number
  updatedBy: number
  createdAt: string
  updatedAt: string
}

export interface CreateWorkerDto {
  name: string
  description?: string
  status?: 'active' | 'inactive' | 'archived'
  tags?: string[]
  scope?: 'folder' | 'tenant' | 'organization' | 'public'
  scopeRef?: string | null
}

export interface UpdateWorkerDto {
  name?: string
  description?: string
  status?: 'active' | 'inactive' | 'archived'
  tags?: string[]
}

export interface UpdateWorkerStatusDto {
  status: 'active' | 'inactive' | 'archived'
}

export interface GetWorkersParams {
  page?: number
  limit?: number
  search?: string
  status?: 'active' | 'inactive' | 'archived'
  scope?: 'folder' | 'tenant' | 'organization' | 'public'
  folderKey?: string
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'status'
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedWorkersResponse {
  workers: Worker[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Worker Installation types
export interface WorkerInstallation {
  workerKey: string
  folderKey: string
  priority: number
  defaultVersion: string
  installedBy: number
  installedAt: string
  defaultProperties: {
    settings: Record<string, any>
    parameters: Record<string, any>
    options: {
      maxConcurrent?: number
      retryPolicy?: {
        maxRetries: number
        retryDelay: number
        strategy: 'exponential' | 'linear'
      }
      timeout?: number
      processingMode?: 'single' | 'batch'
    }
  }
}

export interface CreateWorkerInstallationDto {
  workerKey: string
  priority?: number
  defaultVersion?: string
  installedBy: number
  defaultProperties?: {
    settings?: Record<string, any>
    parameters?: Record<string, any>
    options?: {
      maxConcurrent?: number
      retryPolicy?: {
        maxRetries: number
        retryDelay: number
        strategy: 'exponential' | 'linear'
      }
      timeout?: number
      processingMode?: 'single' | 'batch'
    }
  }
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

// Helper function to build query string
function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams()
  Object.keys(params).forEach(key => {
    const value = params[key]
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value.toString())
    }
  })
  return searchParams.toString()
}

// Helper function to handle API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network error' }))
    throw new Error(errorData.message || `HTTP ${response.status}`)
  }

  return response.json()
}

// Function to fetch all workers with filters and pagination
export async function fetchWorkers(params: GetWorkersParams = {}): Promise<PaginatedWorkersResponse> {
  const queryString = buildQueryString(params)
  const endpoint = `/workers${queryString ? `?${queryString}` : ''}`
  
  const response = await apiRequest<PaginatedWorkersResponse>(endpoint)
  return response.data
}

// Function to fetch a single worker by ID
export async function fetchWorkerById(id: number): Promise<Worker> {
  const response = await apiRequest<Worker>(`/workers/${id}`)
  return response.data
}

// Function to fetch a single worker by key
export async function fetchWorkerByKey(key: string): Promise<Worker> {
  const response = await apiRequest<Worker>(`/workers/${key}`)
  return response.data
}

// Function to create a new worker
export async function createWorker(workerData: CreateWorkerDto): Promise<Worker> {
  const response = await apiRequest<Worker>('/workers', {
    method: 'POST',
    body: JSON.stringify(workerData),
  })
  return response.data
}

// Function to update a worker
export async function updateWorker(id: number, workerData: UpdateWorkerDto): Promise<Worker> {
  const response = await apiRequest<Worker>(`/workers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(workerData),
  })
  return response.data
}

// Function to update worker status
export async function updateWorkerStatus(id: number, statusData: UpdateWorkerStatusDto): Promise<Worker> {
  const response = await apiRequest<Worker>(`/workers/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(statusData),
  })
  return response.data
}

// Function to delete a worker
export async function deleteWorker(id: number): Promise<Worker> {
  const response = await apiRequest<Worker>(`/workers/${id}`, {
    method: 'DELETE',
  })
  return response.data
}

// Worker Installation functions
export async function fetchWorkerInstallations(): Promise<WorkerInstallation[]> {
  const response = await apiRequest<WorkerInstallation[]>('/workers/installations')
  return response.data
}

export async function installWorker(installationData: CreateWorkerInstallationDto): Promise<WorkerInstallation> {
  const response = await apiRequest<WorkerInstallation>('/workers/installations', {
    method: 'POST',
    body: JSON.stringify(installationData),
  })
  return response.data
}

export async function uninstallWorker(workerKey: string): Promise<void> {
  await apiRequest<void>(`/workers/installations/${workerKey}`, {
    method: 'DELETE',
  })
}

// Mock data for fallback during development
const mockWorkers: Worker[] = [
  {
    id: 1,
    key: 'worker-1',
    name: 'CSV Reader',
    folderKey: 'folder-1',
    description: 'Reads data from CSV files',
    status: 'active',
    tags: ['data', 'csv'],
    scope: 'folder',
    scopeRef: 'folder-1',
    createdBy: 1,
    updatedBy: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    key: 'worker-2',
    name: 'Data Transformer',
    folderKey: 'folder-1',
    description: 'Transforms data using custom rules',
    status: 'active',
    tags: ['data', 'transform'],
    scope: 'folder',
    scopeRef: 'folder-1',
    createdBy: 1,
    updatedBy: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    key: 'worker-3',
    name: 'API Caller',
    folderKey: 'folder-1',
    description: 'Makes HTTP requests to external APIs',
    status: 'active',
    tags: ['api', 'http'],
    scope: 'folder',
    scopeRef: 'folder-1',
    createdBy: 1,
    updatedBy: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Function to use mock data (for development/fallback)
export async function fetchWorkersMock(params: GetWorkersParams = {}): Promise<PaginatedWorkersResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  let filteredWorkers = [...mockWorkers]
  
  // Apply filters
  if (params.search) {
    const searchLower = params.search.toLowerCase()
    filteredWorkers = filteredWorkers.filter(worker => 
      worker.name.toLowerCase().includes(searchLower) ||
      worker.description.toLowerCase().includes(searchLower)
    )
  }
  
  if (params.status) {
    filteredWorkers = filteredWorkers.filter(worker => worker.status === params.status)
  }
  
  if (params.scope) {
    filteredWorkers = filteredWorkers.filter(worker => worker.scope === params.scope)
  }
  
  // Apply sorting
  if (params.sortBy) {
    filteredWorkers.sort((a, b) => {
      const aValue = a[params.sortBy as keyof Worker]
      const bValue = b[params.sortBy as keyof Worker]
      
      if (params.sortOrder === 'desc') {
        return bValue > aValue ? 1 : -1
      } else {
        return aValue > bValue ? 1 : -1
      }
    })
  }
  
  // Apply pagination
  const page = params.page || 1
  const limit = params.limit || 20
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedWorkers = filteredWorkers.slice(startIndex, endIndex)
  
  return {
    workers: paginatedWorkers,
    pagination: {
      page,
      limit,
      total: filteredWorkers.length,
      totalPages: Math.ceil(filteredWorkers.length / limit),
    }
  }
}
