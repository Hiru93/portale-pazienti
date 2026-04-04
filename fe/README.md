# Portale Pazienti - Frontend

React 19 + Vite frontend for the Portale Pazienti project.

## Prerequisites

- Node.js 20+
- npm
- Backend running on `http://localhost:3000` (see `be/README.md`)

## Setup

```bash
npm install
npm run dev
```

The dev server starts at **http://localhost:5173**.

## Available commands

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build locally |
| `npm run start` | Alias for `dev` |
| `npm run test` | Run tests with Vitest |
| `npm run type-check` | TypeScript type checking only |
| `npm run lint` | Lint the codebase |
| `npm run lint:fix` | Lint and auto-fix |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting without writing |

## Project structure

```
fe/src/
├── app/                # Redux store, typed hooks, shared types
├── features/           # Feature modules (login, topbar, find-specialist, ...)
├── components/         # Shared UI components
├── utils/
│   ├── apiClient.ts        # Axios instance (baseURL, withCredentials)
│   ├── axiosInterceptor.ts # Auth header injection + 401 / token refresh handling
│   └── utils.tsx           # ProtectedRoute and other helpers
├── App.tsx             # Router configuration
└── main.tsx            # Entry point — bootstraps interceptors
```

## API communication

All requests go through the Axios instance in `src/utils/apiClient.ts` (`baseURL: http://localhost:3000`, `withCredentials: true`).

The interceptor in `src/utils/axiosInterceptor.ts` automatically:
- Injects the `Authorization: Bearer` header from the Redux store
- Handles `401` responses by attempting a silent token refresh before retrying the original request
