# BotMaster API

## 🛠️ Getting Started

### Step-by-Step Guide

#### Step 1: 🚀 Initial Setup

- Clone the repository: `git clone git@github.com:1001Josias/botmaster.git`
- Navigate até a api: `cd apps/api`
- Install dependencies: `pnpm i`

#### Step 2: ⚙️ Environment Configuration

- Create `.env`: Copy `.env.template` to `.env`
- Update `.env`: Fill in necessary environment variables

#### Step 3: 🏃‍♂️ Running the Project

- Development Mode: `pnpm dev`
- Building: `pnpm build`
- Production Mode: Set `.env` to `NODE_ENV="production"` then `pnpm build && pnpm start`

---

## Managing Migrations

BotMaster uses SQL scripts to manage database migrations, allowing precise control over schema changes in an incremental and reversible way.

### Migration File Structure

Migration SQL files should follow a numerical naming convention to ensure the correct execution order. Use the following naming format for the files:

```
<number>.<description>.<direction>.sql
```

- **`<number>`**: Identifies the execution order. Example: `01`, `02`.
- **`<description>`**: A brief description of the migration.
- **`<direction>`**: Use `up` for migrations that apply changes and `down` for reverting those changes in dev environment.

**Examples**:

```
01.create_users_table.up.sql
01.drop_users_table.down.sql
```

### Running Migrations

To apply/revert migrations, use the provided scripts with the `pnpm migrations` command.

1. **Apply Migrations**: To run the `up` migrations and apply changes to the database, use:

   ```bash
   pnpm migrations up
   ```

   > To revert migration in production environment update the `up` sql file with the change to undo.

2. **Revert Migrations (to use only in dev environment)**: To run the `down` migrations and undo changes, use:

   ```bash
   pnpm migrations down
   ```

### Environment Variables

The migration script reads database connection variables from the `.env` file. Make sure your `.env` contains the following variables configured correctly:

```plaintext
DB_USER=<your_user>
DB_PASSWORD=<your_password>
DB_HOST=<your_host>
DB_PORT=<your_port>
DB_NAME=<your_database>
```

### Migration Commands

The table below describes all the available commands for managing migrations:

| **Command**                 | **Description**                                                                                                                                       |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm migrations`           | Makes the migration script executable and runs it. This command applies or reverts migrations depending on the provided argument (`up` or `down`).    |
| `pnpm migrations:up`        | Applies **up** migrations (forward migrations), running the `.up.sql` files in numerical order. You can also use `pnpm migrations up`.                |
| `pnpm migrations:down`      | Reverts **down** migrations (backward migrations), running the `.down.sql` files in reverse numerical order. You can also use `pnpm migrations down`. |
| `pnpm migrations:list`      | Lists all available **up** and **down** migration files, separated by type.                                                                           |
| `pnpm migrations:list:up`   | Lists all available `.up.sql` files, ordered numerically.                                                                                             |
| `pnpm migrations:list:down` | Lists all available `.down.sql` files, ordered numerically.                                                                                           |

These commands simplify the migration process and help keep the database schema consistent and traceable.

---

## 🤝 Feedback and Contributions

We'd love to hear your feedback and suggestions for further improvements. Feel free to contribute and join us in making backend development cleaner and faster!

🎉 Happy coding!
