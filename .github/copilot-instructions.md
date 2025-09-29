# Copilot Instructions for AI Coding Agents

## Project Overview
This project is a Vite + React + TypeScript web application using Tailwind CSS and shadcn-ui. It integrates with Firebase (including Data Connect) and leverages code generation for data access. The codebase is structured for modularity, with clear separation between UI, data, and service logic.

## Key Directories & Files
- `src/` — Main React app source code
  - `components/` — UI components (including shadcn-ui patterns)
  - `contexts/` — React context providers (e.g., Auth, Service)
  - `pages/` — Top-level route components
  - `lib/` — Utility and helper functions
  - `dataconnect-generated/` — Auto-generated SDKs for Firebase Data Connect (do not edit manually)
- `functions/` — Cloud Functions (TypeScript, for backend logic)
- `dataconnect/` — Data Connect schema, seed data, and connector configs
- `firebasecodebase/` — Firebase-specific code and configs

## Data & API Patterns
- Use the generated SDK in `src/dataconnect-generated/` for all Data Connect queries/mutations. Do not hand-craft GraphQL or REST calls for these endpoints.
- For React, prefer the hooks from `dataconnect-generated/react` (see its README for usage).
- Data Connect configuration and schema live in `dataconnect/`.

## State & Context
- Global state (auth, service data) is managed via React Contexts in `src/contexts/`.
- Use context hooks (e.g., `useContext(AuthContext)`) for cross-component state.

## UI & Styling
- UI components follow shadcn-ui conventions (see `src/components/ui/`).
- Tailwind CSS is used for styling; utility classes are preferred over custom CSS.

## Developer Workflows
- **Start dev server:** `npm run dev`
- **Install dependencies:** `npm install`
- **Deploy:** Use the Lovable web UI (see main README) — code pushes are reflected in Lovable.
- **Data Connect SDKs:** Regenerate via Lovable or Firebase tooling; do not edit generated files by hand.

## Conventions & Patterns
- Do not edit files in `src/dataconnect-generated/` directly.
- Use TypeScript throughout; avoid using `any` unless unavoidable.
- Keep business logic out of UI components; use helpers or context.
- Prefer functional React components and hooks.

## Integration Points
- Firebase is used for authentication and backend (see `src/firebase.ts`).
- Data Connect is the primary data layer; see `dataconnect/` and generated SDKs.
- Cloud Functions are in `functions/` and use TypeScript.

## References
- Main project README: [`README.md`](../README.md)
- Data Connect SDK usage: [`src/dataconnect-generated/README.md`](../src/dataconnect-generated/README.md)
- React SDK usage: [`src/dataconnect-generated/react/README.md`](../src/dataconnect-generated/react/README.md)

---

For questions about project structure or workflows, see the main README or the Lovable project dashboard.
