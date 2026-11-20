# AGENTS.md

## Stack and commands

- Nuxt 4 app (`nuxt@^4`, Vue 3, TypeScript) using npm (`package-lock.json` present).
- Scripts (`package.json`): `npm run dev`, `npm run build`, `npm run generate`, `npm run preview`.
- `postinstall` runs `nuxt prepare` to generate `.nuxt` types/config; `tsconfig.json` and `server/tsconfig.json` extend files under `.nuxt/`. If editor/types break, run `npm install` or `npm run postinstall`.
- No lint, test, or typecheck scripts are currently defined in `package.json`; do not assume they exist.

## Project structure

- Source lives under `app/` (Nuxt 4 app directory): root shell `app/app.vue`, pages in `app/pages/`, shared utilities in `app/lib/`, global styles in `app/assets/css/tailwind.css`.
- `nuxt.config.ts` registers `~/assets/css/tailwind.css`, enables `shadcn-nuxt`, and uses `@tailwindcss/vite` for Tailwind v4.

## UI / styling conventions

- shadcn-vue is configured via `components.json` and `nuxt.config.ts`: UI components are expected in `@/components/ui` (`app/components/ui`) with prefix `Ui` (e.g. `UiButton`), icon library `lucide` (`@lucide/vue`), style `reka-nova`.
- Aliases from `components.json`: `components -> @/components`, `ui -> @/components/ui`, `utils -> @/lib/utils`, `lib -> @/lib`, `composables -> @/composables`.
- Tailwind CSS entry/theme tokens live in `app/assets/css/tailwind.css` (`@import "tailwindcss"`, `tw-animate-css`, `shadcn-vue/tailwind.css`).
- `app/lib/utils.ts` currently re-exports `cn` from the `cn` package (`export { cn } from "cn"`); follow existing utility patterns rather than assuming a `clsx`+`tailwind-merge` implementation.

## Repo-local agent resources

- `.agents/skills/` and `skills-lock.json` contain repo-installed agent skills (Nuxt/Vue/Vite/Pinia/testing/SEO, etc.). Use relevant skills when working in those areas.

## Backend API

This Nuxt application consumes an external
Laravel backend.

API documentation:
docs/api/postman_collection.json

When implementing API-related features:

- Consult the Postman collection.
- Delegate API contract analysis to api-integration.
- Follow existing request and response patterns.
- Never invent undocumented API endpoints.
- Do not modify the external Laravel backend.
