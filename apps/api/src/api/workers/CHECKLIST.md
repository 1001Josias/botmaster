# Workers API Checklist

Checklist for the implementation of the Workers domain endpoints and features.

> See the prompts for the full list of requirements and features.

## POST `/workers` - Create a new Worker

- [x] Define `WorkerModel` Zod schema
- [x] SQL migrations for `worker` (up and down)
- [x] SQL query for worker creation
- [x] Create the `workers` module (service, repository, controller, routes)
- [x] Implement method `create` in service
- [x] Implement method `create` in repository
- [x] Implement method `create` in controller
- [x] Implement route `/workers` for worker creation
- [x] OpenAPI documentation
- [ ] SQL seeds for worker table population
- [ ] Unit and integration tests for worker creation

## GET `/workers` - List Workers with pagination and filters

- [ ] SQL query for listing workers (with support for filters via query params)
- [ ] Implement method `getAll` in service (supporting filters: folderKey, status, name, etc.)
- [ ] Implement method `getAll` in repository (supporting filters)
- [ ] Implement method `getAll` in controller (parsing query params)
- [ ] Implement route `/workers` for listing with filters
- [ ] OpenAPI documentation (detail the filters availables via query params)
- [ ] Unit and integration tests for listing and filters
- [ ] Implement pagination in the listing (using `limit` and `offset` query params)
- [ ] Implement sorting in the listing (using `sortBy` and `sortOrder` query params)
- [ ] Implement search functionality in the listing (using `search` query param)

## GET `/workers/:id` - Get Worker by ID

- [ ] SQL query for search by ID
- [ ] Implement method `getById` in service
- [ ] Implement method `getById` in repository
- [ ] Implement method `getById` in controller
- [ ] Implement route `/workers/:id`
- [ ] OpenAPI documentation
- [ ] Unit and integration tests for get by ID

## PUT `/workers/:id` - Update Worker

- [ ] SQL query for update
- [ ] Implement method `update` in service
- [ ] Implement method `update` in repository
- [ ] Implement method `update` in controller
- [ ] Implement route `/workers/:id`
- [ ] OpenAPI documentation
- [ ] Unit and integration tests for update

## DELETE `/workers/:id` - Delete Worker

- [ ] SQL query for delete
- [ ] Implement method `delete` in service
- [ ] Implement method `delete` in repository
- [ ] Implement method `delete` in controller
- [ ] Implement route `/workers/:id`
- [ ] OpenAPI documentation
- [ ] Unit and integration tests for delete

## PATCH `/workers/:id` - Partial Update Worker (PATCH)

- [ ] SQL query for partial update
- [ ] Implement method `patch` in service
- [ ] Implement method `patch` in repository
- [ ] Implement method `patch` in controller
- [ ] Implement route `/workers/:id` (PATCH)
- [ ] OpenAPI documentation
- [ ] Unit and integration tests for partial update

## PATCH `/workers/:id/status` - Update Worker status

- [ ] SQL query for status update
- [ ] Implement method `updateStatus` in service
- [ ] Implement method `updateStatus` in repository
- [ ] Implement method `updateStatus` in controller
- [ ] Implement route `/workers/:id/status`
- [ ] OpenAPI documentation
- [ ] Unit and integration tests for status

## POST `/workers/:id/deploy` - Deploy Worker

- [ ] SQL query for deploy registration
- [ ] Implement method `deploy` in service
- [ ] Implement method `deploy` in repository
- [ ] Implement method `deploy` in controller
- [ ] Implement route `/workers/:id/deploy`
- [ ] OpenAPI documentation
- [ ] Unit and integration tests for deploy

## GET `/workers/:id/logs` - Get Worker logs (with filters)

- [ ] SQL query for logs (support filters via query params: level, date, etc.)
- [ ] Implement method `getLogs` in service (support filters)
- [ ] Implement method `getLogs` in repository (support filters)
- [ ] Implement method `getLogs` in controller (parse query params)
- [ ] Implement route `/workers/:id/logs` (with filters)
- [ ] OpenAPI documentation (document available filters)
- [ ] Unit and integration tests for logs and filters

## GET `/workers/:id/metrics` - Get Worker metrics (with filters)

- [ ] SQL query for metrics (support filters via query params: period, type, etc.)
- [ ] Implement method `getMetrics` in service (support filters)
- [ ] Implement method `getMetrics` in repository (support filters)
- [ ] Implement method `getMetrics` in controller (parse query params)
- [ ] Implement route `/workers/:id/metrics` (with filters)
- [ ] OpenAPI documentation (document available filters)
- [ ] Unit and integration tests for metrics and filters

## Subdomain: Releases

- [x] Implement subdomain `releases` for versioning
- [x] Integrate with routes `/workers/:workerId/releases`
- [ ] Complete implementation of releases lifecycle

## POST `/workers/install` - Install Worker

- [ ] Create the `install` module (service, repository, controller, routes)
- [ ] Define `InstallWorkerModel` Zod schema
- [ ] SQL migrations for `installed_worker` (up and down)
- [ ] SQL query for worker installation
- [ ] Implement method `installWorker` in service
- [ ] Implement method `installWorker` in repository
- [ ] Implement method `install` in controller
- [ ] Implement route `/workers/install` for installation
- [ ] OpenAPI documentation
- [ ] Unit and integration tests for installation
