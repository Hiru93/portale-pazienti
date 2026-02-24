# Portale Pazienti

## Background & Project Overview

This project originates from a drafted initiative I took part in during my experience at one of the companies I worked with. What follows is a personal reimplementation and evolution of that original concept.

The core idea is a **free-to-use portal aimed at patients in need of dental care**, connecting them with a network of dentists who voluntarily join the initiative. The platform serves three distinct groups of users, each with their own dedicated experience:

- **Patients** — can browse the available dentists and book a dental visit, entirely free of charge.
- **Dentists** — upon signing up to the initiative, each dentist gains access to a personal schedule view. Day by day, they can review incoming booking requests and choose to accept or decline each one. Once a visit has taken place, the dentist can submit a reimbursement request for that appointment.
- **Operators** — a back-office role responsible for handling the reimbursement flow. Operators review all incoming reimbursement requests submitted by dentists and mark each one as either resolved or pending.

The project as a whole revolves around the idea of making dental care more accessible: a no-cost entry point for patients, a streamlined scheduling and billing tool for participating dentists, and an administrative interface for the operators managing the financial side of the initiative.

---

## Architecture

The project is a monorepo with two main directories:

- **`be/`** — Backend API built with [NestJS](https://nestjs.com/) (Node 20, TypeScript)
- **`fe/`** — Frontend SPA built with [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) (TypeScript)

### Backend stack

| Technology | Purpose |
|---|---|
| NestJS 11 | REST API framework |
| PostgreSQL 14 | Database |
| Knex | Query builder & migrations |
| JWT | Authentication |
| bcrypt | Password hashing |
| Swagger | API documentation |
| Docker Compose | Local database & backend containerization |

### Frontend stack

| Technology | Purpose |
|---|---|
| React 19 | UI library |
| Vite 6 | Dev server & bundler |
| Redux Toolkit | State management |
| Chakra UI 3 | Component library |
| React Router 7 | Routing |
| Axios | HTTP client |
| Vitest | Testing |

## Project structure

```
portale-pazienti/
├── be/                         # Backend
│   ├── db/                     # Database Docker image & init SQL
│   │   ├── Dockerfile          # PostgreSQL 14.17 image
│   │   └── 01-init.sql         # Initial schema (22 tables)
│   ├── migrations/             # Knex database migrations
│   ├── scripts/
│   │   └── db-start.sh         # Start DB + run migrations
│   ├── src/
│   │   ├── auth/               # Authentication module (JWT)
│   │   ├── users/              # User management module
│   │   ├── commons/            # Shared module
│   │   ├── dtos/               # Data transfer objects
│   │   ├── utils/              # Utility functions
│   │   ├── constants/          # App constants
│   │   ├── app.module.ts       # Root module
│   │   └── main.ts             # Entry point (port 3000)
│   ├── docker-compose.yaml     # DB + BE services
│   ├── knexfile.ts             # Knex configuration
│   ├── Dockerfile              # Backend container image
│   └── .env                    # Environment variables
├── fe/                         # Frontend
│   ├── src/
│   │   ├── app/                # Redux store, hooks, types
│   │   ├── features/           # Feature modules (login, etc.)
│   │   ├── components/         # Shared UI components
│   │   ├── utils/              # Utilities & constants
│   │   ├── App.tsx             # Router configuration
│   │   └── main.tsx            # Entry point
│   ├── index.html              # HTML template
│   └── vite.config.ts          # Vite configuration
└── .gitignore
```

## Prerequisites

- **Node.js** >= 20
- **npm**
- **Docker** & **Docker Compose**

## Getting started

### 1. Database setup

From the `be/` directory, start the PostgreSQL container and run migrations:

```bash
cd be
npm run db-start
```

This will:
- Build and start the PostgreSQL container (exposed on port **5433**)
- Wait for the database to be ready
- Run all pending Knex migrations

To stop and remove the database container:

```bash
cd be
npm run db-stop
```

### 2. Backend

```bash
cd be
npm install
npm run start:dev
```

The API server starts on **http://localhost:3000** with Swagger docs available at the root.

### 3. Frontend

```bash
cd fe
npm install
npm run dev
```

The Vite dev server starts and opens the app in your browser (default **http://localhost:5173**).

## Available commands

### Backend (`be/`)

| Command | Description |
|---|---|
| `npm run start` | Start the server |
| `npm run start:dev` | Start with hot-reload (watch mode) |
| `npm run start:debug` | Start with debugger attached |
| `npm run start:prod` | Start production build |
| `npm run build` | Build the project |
| `npm run db-start` | Start DB container + run migrations |
| `npm run db-stop` | Stop and remove DB container |
| `npm run migration:generate <name>` | Create a new migration file |
| `npm run migration:status` | Show migration status |
| `npm run migration:migrate` | Run pending migrations |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:cov` | Run tests with coverage |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run lint` | Lint and auto-fix |
| `npm run format` | Format code with Prettier |

### Frontend (`fe/`)

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build |
| `npm run start` | Alias for dev server |
| `npm run test` | Run tests with Vitest |
| `npm run type-check` | TypeScript type checking |
| `npm run lint` | Lint the codebase |
| `npm run lint:fix` | Lint and auto-fix |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting |

## Docker (full stack)

To run the entire backend stack (database + API) via Docker Compose:

```bash
cd be
docker-compose up --build
```

Services:
- **db** — PostgreSQL 14, internal port 5432, exposed on **5433**
- **be** — NestJS API, exposed on **3000**

## Environment variables

The backend uses a `.env` file in `be/` with the following variables:

| Variable | Description |
|---|---|
| `PP_LOADED_ENV` | Environment name (e.g. `Development`) |
| `PP_PG_DB` | PostgreSQL database name |
| `PP_PG_USER` | PostgreSQL user |
| `PP_PG_PASS` | PostgreSQL password |
| `PP_PG_HOST` | PostgreSQL host (`localhost` for local, `db` in Docker) |
| `PP_PG_PORT` | PostgreSQL port (`5433` local, `5432` in Docker) |
| `PP_BE_SECRET` | JWT secret |
| `PP_BE_SALT` | Bcrypt salt |
| `PP_SALT_RNDS` | Bcrypt salt rounds |
