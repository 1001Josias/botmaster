# 🚀 Express TypeScript Boilerplate 2024

[![Build](https://github.com/edwinhern/express-typescript-2024/actions/workflows/build.yml/badge.svg)](https://github.com/edwinhern/express-typescript-2024/actions/workflows/build.yml)
[![Test](https://github.com/edwinhern/express-typescript-2024/actions/workflows/test.yml/badge.svg)](https://github.com/edwinhern/express-typescript-2024/actions/workflows/test.yml)
[![Code Quality](https://github.com/edwinhern/express-typescript-2024/actions/workflows/code-quality.yml/badge.svg)](https://github.com/edwinhern/express-typescript-2024/actions/workflows/code-quality.yml)
[![Docker Image CI](https://github.com/edwinhern/express-typescript-2024/actions/workflows/docker-image.yml/badge.svg)](https://github.com/edwinhern/express-typescript-2024/actions/workflows/docker-image.yml)

```code
Hey There! 🙌
🤾 that ⭐️ button if you like this boilerplate.
```

## 🌟 Introduction

Welcome to the Express TypeScript Boilerplate 2024 – a streamlined, efficient, and scalable foundation for building powerful backend services with modern tools and practices in Express.js and TypeScript.

## 💡 Motivation

This boilerplate aims to:

- ✨ Reduce setup time for new projects
- 📊 Ensure code consistency and quality
- ⚡ Facilitate rapid development
- 🛡️ Encourage best practices in security, testing, and performance

## 🚀 Features

- 📁 Modular Structure: Organized by feature for easy navigation and scalability
- 💨 Faster Execution with tsx: Rapid TypeScript execution with `tsx` and type checking with `tsc`
- 🌐 Stable Node Environment: Latest LTS Node version in `.nvmrc`
- 🔧 Simplified Environment Variables: Managed with Envalid
- 🔗 Path Aliases: Cleaner code with shortcut imports
- 🔄 Renovate Integration: Automatic updates for dependencies
- 🔒 Security: Helmet for HTTP header security and CORS setup
- 📊 Logging: Efficient logging with `pino-http`
- 🧪 Comprehensive Testing: Setup with Vitest and Supertest
- 🔑 Code Quality Assurance: Husky and lint-staged for consistent quality
- ✅ Unified Code Style: `Biomejs` for consistent coding standards
- 📃 API Response Standardization: `ServiceResponse` class for consistent API responses
- 🐳 Docker Support: Ready for containerization and deployment
- 📝 Input Validation with Zod: Strongly typed request validation using `Zod`
- 🧩 Swagger UI: Interactive API documentation generated from Zod schemas

## 🛠️ Getting Started

### Video Demo

For a visual guide, watch the [video demo](https://github.com/user-attachments/assets/b1698dac-d582-45a0-8d61-31131732b74e) to see the setup and running of the project.

### Step-by-Step Guide

#### Step 1: 🚀 Initial Setup

- Clone the repository: `git clone https://github.com/edwinhern/express-typescript-2024.git`
- Navigate: `cd express-typescript-2024`
- Install dependencies: `npm ci`

#### Step 2: ⚙️ Environment Configuration

- Create `.env`: Copy `.env.template` to `.env`
- Update `.env`: Fill in necessary environment variables

#### Step 3: 🏃‍♂️ Running the Project

- Development Mode: `npm run dev`
- Building: `npm run build`
- Production Mode: Set `.env` to `NODE_ENV="production"` then `npm run build && npm run start`

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
- **`<direction>`**: Use `up` for migrations that apply changes and `down` for reverting those changes.

**Examples**:

```
01.create_users_table.up.sql
01.create_users_table.down.sql
02.add_email_column.up.sql
02.add_email_column.down.sql
```

### Running Migrations

To apply or revert migrations, use the provided scripts with the `pnpm migrations` command.

1. **Apply Migrations**: To run the `up` migrations and apply changes to the database, use:

   ```bash
   pnpm migrations up
   ```

2. **Revert Migrations**: To run the `down` migrations and undo changes, use:

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

Yes, using a table format makes the documentation more organized and easier to read, especially when it comes to commands. Here’s the version with the commands in a table:

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
