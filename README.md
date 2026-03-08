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
| JWT | Authentication (access tokens) |
| Redis 7 | Session store & token blocklist |
| ioredis | Redis client for Node.js |
| bcrypt | Password hashing |
| cookie-parser | HTTP-only cookie handling |
| Swagger | API documentation |
| Docker Compose | Local infrastructure containerization |

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
│   │   ├── auth/               # Authentication module (JWT + sessions)
│   │   ├── redis/              # Redis module (client, service, constants)
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
│   │   ├── features/           # Feature modules (login, topbar, etc.)
│   │   ├── components/         # Shared UI components
│   │   ├── utils/              # apiClient, axiosInterceptor, helpers
│   │   ├── App.tsx             # Router configuration
│   │   └── main.tsx            # Entry point (interceptors bootstrap)
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
- **redis** — Redis 7 (Alpine), exposed on **6379** — session store and token blocklist
- **redis-commander** — Web UI for Redis inspection, exposed on **8081**

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
| `PP_BE_SECRET` | JWT signing secret |
| `PP_BE_SALT` | Bcrypt salt |
| `PP_SALT_RNDS` | Bcrypt salt rounds |
| `PP_REDIS_HOST` | Redis host (`localhost` for local, `redis` in Docker) |
| `PP_REDIS_PORT` | Redis port (default `6379`) |
| `PP_REDIS_PASS` | Redis password |

---

## Authentication & Token Management

This section describes the full authentication flow: how JWT access tokens and refresh tokens are issued, cached in Redis, transported between frontend and backend, and invalidated on logout.

### Overview

The system uses a dual-token strategy:

| Token | Lifetime | Storage (client) | Storage (server) |
|---|---|---|---|
| **Access token** (JWT) | 15 minutes | Redux state + `localStorage` | Verified via signature; blocklisted in Redis on logout |
| **Refresh token** (opaque hex) | 7 days | HTTP-only cookie | Redis `session:${userId}` |

### Redis data structures

```
# Active session — created on login, deleted on logout
session:${userId}  →  { "refreshToken": "<64-char hex>", "payload": { ...jwtClaims } }
TTL: 7 days

# Blocklist — created on logout for the remaining lifetime of the access token
blockList:${jwtToken}  →  "1"
TTL: remaining seconds until token expiry (≤ 15 minutes)
```

Redis is configured with append-only persistence (`--appendonly yes`) and periodic snapshots so sessions survive container restarts.

### Backend modules

| File | Role |
|---|---|
| `be/src/redis/redis.module.ts` | Global NestJS module; creates the ioredis client from env vars and exposes `RedisService` |
| `be/src/redis/redis.service.ts` | Thin wrapper with `set(key, value, ttl?)`, `get(key)`, `del(key)` |
| `be/src/auth/auth.service.ts` | Business logic: login, refresh, logout |
| `be/src/auth/auth.controller.ts` | HTTP endpoints: `POST /api/auth/login`, `/refresh`, `/logout` |
| `be/src/auth/auth.guard.ts` | Global `APP_GUARD`; validates Bearer token and checks Redis blocklist on every request |

### Frontend modules

| File | Role |
|---|---|
| `fe/src/utils/apiClient.ts` | Axios instance with `baseURL` and `withCredentials: true` (enables automatic cookie transmission) |
| `fe/src/utils/axiosInterceptor.ts` | Request interceptor injects `Authorization: Bearer` header; response interceptor handles 401s |
| `fe/src/features/login/LoginSlice.ts` | Redux slice: `loginUser`, `logoutUser`, `refreshUser` thunks; token persisted in `localStorage` |
| `fe/src/features/login/LoginAPI.ts` | Raw API calls: `doLogin`, `doLogout`, `doRefreshToken`, `doSignup` |
| `fe/src/utils/utils.tsx` | `ProtectedRoute` component — validates JWT expiry and user permissions before rendering |

### Login flow

```
User submits email/password → Login.tsx
  ↓  dispatches loginUser()
LoginAPI.doLogin() → POST /api/auth/login
  ↓
Backend (AuthService.login):
  1. Validate credentials against DB (bcrypt compare)
  2. Build JWT payload: user_id, user_email, user_auth, user_data, available_components
  3. Sign JWT → access_token  (exp: 15 min)
  4. Generate refresh_token   (crypto.randomBytes(32).hex)
  5. Redis SET session:${userId} = { refreshToken, payload }  TTL 7 days
  6. Set refresh_token in HTTP-only cookie  (sameSite: strict, maxAge: 7 days)
  7. Return { access_token, refresh_token }
  ↓
Frontend (LoginSlice.fulfilled):
  1. Store access_token in Redux + localStorage
  2. Parse JWT claims → authLevel, userInfo, availableComponents
  ↓
Navigate to /dashboard
```

### Authenticated request flow

```
axios request interceptor
  → adds Authorization: Bearer ${accessToken} from Redux
  → cookie is sent automatically (withCredentials)
  ↓
Backend (AuthGuard):
  1. Skip if @SkipAuth() decorator present
  2. Extract Bearer token from Authorization header
  3. Check Redis: blockList:${token} → reject if found
  4. Verify JWT signature with PP_BE_SECRET
  5. Attach decoded payload to request['users']
  ↓
Route handler executes
```

### Token refresh flow (automatic on 401)

```
API request returns 401 (access token expired)
  ↓
axiosInterceptor response handler:
  1. Set _retry = true to prevent infinite loops
  2. If another refresh is already in-flight → queue this request
  3. Otherwise:
     a. dispatches refreshUser(userId)
        → LoginAPI.doRefreshToken(userId)
        → POST /api/auth/refresh { userId }
        → refresh_token read from HTTP-only cookie automatically
     b. Backend (AuthService.refresh):
          - GET session:${userId} from Redis
          - Compare provided refresh_token with stored value
          - Generate new refresh_token  (rotation)
          - Update Redis session with new token
          - Set new refresh_token cookie
          - Sign new JWT → return { access_token }
     c. LoginSlice.fulfilled → update Redux + localStorage
     d. Flush queue: retry all pending requests with new token
  4. Retry original request with new access_token
```

### Logout flow

```
User clicks logout → Topbar dispatches logoutUser()
  ↓
LoginAPI.doLogout({ token: accessToken })
  → POST /api/auth/logout { token }
  ↓
Backend (AuthService.logout):
  1. Decode token, validate user exists
  2. Calculate remaining TTL from token exp
  3. Redis SET blockList:${token} = "1"  TTL = remaining seconds
  4. Redis DEL session:${userId}
  5. Clear refresh_token cookie
  ↓
LoginSlice.fulfilled:
  1. Clear accessToken from Redux + localStorage
  2. Clear authLevel, userInfo, availableComponents
  ↓
Topbar watches logoutStatus → navigate to "/"
ProtectedRoute redirects unauthenticated users to "/"
```

### Security properties

- **Short-lived access tokens** — a stolen JWT is valid for at most 15 minutes.
- **HTTP-only refresh cookie** — the refresh token is inaccessible to JavaScript, mitigating XSS.
- **Server-side session** — logout is enforced server-side; the refresh token cannot be used after `DEL session:${userId}`.
- **Token blocklist** — a logged-out (or revoked) access token is immediately blocked in Redis for its remaining lifetime, preventing reuse.
- **Refresh token rotation** — every refresh issues a new token, limiting the window of a compromised refresh token.
- **CSRF protection** — the refresh cookie uses `sameSite: strict`; CORS is locked to `localhost:5173`.
- **Password hashing** — bcrypt with configurable salt rounds.
