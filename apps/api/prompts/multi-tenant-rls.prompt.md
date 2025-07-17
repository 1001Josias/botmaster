# Prompt: Multi-Tenant with Row Level Security (RLS) in BotMaster

Use this prompt as a reference to implement, review, or validate secure multi-tenant isolation in BotMaster using PostgreSQL and Keycloak.

---

## Isolation Structure

- Organization: Client/company isolation (Keycloak Organizations)
- Tenant: Internal subunits (Keycloak Groups)
- Folder: Internal tenant structure (Keycloak Subgroups)
- Resources: Workers, queues, triggers, workflows, etc., always linked to a `folder_key`

---

## Database

- All sensitive entities must have the `folder_key` field (UUID).
- The relationship between folder, tenant, and organization is guaranteed via Keycloak and can be queried via join.
- Do not add `tenant_id` or `organization_id` directly to entities, except if query optimization is needed.

---

## Row Level Security (RLS)

- Enable RLS on all sensitive tables:
  ```sql
  ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
  CREATE POLICY folder_access_policy ON table_name
    USING (folder_key = current_setting('app.folder_key')::UUID);
  ```
- Each table needs its own policy.
- The context (`app.folder_key`) must be set in the database session before each operation.

---

## Session Context

- The backend must extract from the JWT/Keycloak token the folders allowed for the user.
- Before executing queries, the backend validates access and sets the context:
  ```sql
  SELECT set_config('app.folder_key', '<folder_key>', false);
  ```
- The user must never arbitrarily choose the `folder_key`.

---

## Authentication and Authorization

- Keycloak manages users, groups (tenants), and subgroups (folders).
- The link between folder and organization must be guaranteed via a custom attribute.
- The backend must always validate if the user has access to the requested folder.

---

## Auditing and Logs

- All operations must be audited, recording user, folder, operation, and timestamp.

---

## Isolation Tests

- Automated tests must ensure that a user from one folder cannot access data from another.
- Test all endpoints and critical operations.

---

## Example Flow

1. User logs in via Keycloak.
2. Backend obtains `folder_key` from the header and validates user access via Keycloak API.
3. Backend validates permission and sets `app.folder_key` in the session.
4. User makes a request for a resource within the folder.
5. Backend executes the query, with RLS ensuring data isolation based on `folder_key`.

---

## References

- [Logto Article: Implement Multi-Tenancy](https://blog.logto.io/implement-multi-tenancy)
- [Official Keycloak Documentation](https://www.keycloak.org/docs/latest/release_notes)
- [PostgreSQL Row Level Security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
