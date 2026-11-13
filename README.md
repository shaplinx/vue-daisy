# Vue Daisy

A Vue 3 + TypeScript component library / Dasboard Starter built on DaisyUI, packaged with a component
showcase, an admin dashboard, a Laravel-ready data layer and a FormKit form system.

The project implements all DaisyUI component categories as reusable `Dz*` components,
demonstrates each one with live previews, variants, API tables and copyable source, and
adds real application patterns: CRUD, server pagination, authentication, theming and a
WordPress-style media library.

## Highlights

- **69 reusable components** across 7 categories, all with working behaviour and demos.
- **Component showcase** with search, category filters, deep links, preview/variants/API/source tabs.
- **Admin shell** with responsive sidebar, breadcrumbs, global search, theme picker, notifications and user menu.
- **DataTable** that works in client and server modes with one joined query model.
- **Laravel pagination** consumed from the native `paginate()` envelope without transformation.
- **Users CRUD** demo with create, view, edit, delete, search, filters and pagination.
- **FormKit** with a DaisyUI-compatible theme, three custom inputs and eight validation demos.
- **Media library** in management and selector modes, with infinite scroll, uploads, metadata editing and bulk actions.
- **Authentication** via Laravel Sanctum SPA sessions, Sanctum bearer tokens or a disabled/no-auth driver.
- **Six DaisyUI themes** with persistence and a live picker.
- **Responsive and keyboard accessible** layouts and controls, verified from 320 px to 1440 px.

## Tech Stack

| Tool | Version / role |
| --- | --- |
| Vue | 3.5, Composition API with `<script setup>` |
| TypeScript | 5.9 |
| Vite | 8 |
| Tailwind CSS | 4 |
| DaisyUI | 5 |
| Vue Router | 5 |
| Pinia | 4 |
| FormKit | 2.5 |
| Lucide | Icon set (`@lucide/vue`) |

## Getting Started

Requirements: Node.js 20.19+ or 22.12+ and npm.

```bash
npm install
npm run dev
```

The dev server starts at the URL printed by Vite (usually `http://localhost:5173`).

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Preview the production build |
| `npm run typecheck` | Run `vue-tsc --noEmit` |

## Project Structure

```text
src/
├── assets/                 # Tailwind entry point and shared helpers
├── auth/                   # Auth config, provider, drivers, mock Laravel backend
├── components/
│   ├── auth/               # Auth panels and driver switcher
│   ├── dashboard/          # Sidebar, topbar, search, menus, breadcrumbs
│   ├── datatable/          # DzDataTable
│   ├── form/               # Form layout and status helpers
│   ├── media/              # DzMediaLibrary and its panels
│   └── ui/                 # Reusable Dz* components by DaisyUI category
├── composables/            # useAuth, useDataTable, useTheme, useToast, useMediaLibrary…
├── data/                   # Component registry (demos, props, events, slots, source)
├── layouts/                # Dashboard and auth layouts
├── pages/                  # Dashboard, showcase, data, media, forms, settings, themes, auth
├── plugins/                # Component registration and FormKit theme
├── router/                 # Routes and auth guard
├── services/               # Laravel contract helpers, HTTP client, mock resources
├── showcase/               # Showcase cards, code blocks and demo components
├── stores/                 # Pinia auth store
└── utils/                  # Class, DaisyUI, table and formatting helpers
```

## Routes

| Path | Page |
| --- | --- |
| `/` | Redirects to `/dashboard` |
| `/dashboard` | Project overview, milestones and activity |
| `/components` | Component showcase with search, filters and deep links |
| `/data` | DataTable and Users CRUD demonstration |
| `/media` | Media library demonstration |
| `/forms` | FormKit form examples and validation coverage |
| `/settings` | Preferences, auth driver settings and project info |
| `/themes` | Theme picker |
| `/backend-integration` | Laravel authentication and API integration guide |
| `/login`, `/forgot-password`, `/reset-password` | Auth pages (explain the disabled state when auth is off) |
| `/:pathMatch(.*)*` | Not-found page |

## Component Library

Components live under `src/components/ui/` and are grouped by DaisyUI category:

- **Actions** — button, dropdown, modal, swap, theme controller.
- **Data display** — accordion, avatar, badge, card, carousel, chat bubble, collapse, countdown, diff, kbd, list, stat, status, table, timeline.
- **Navigation** — breadcrumbs, dock, link, menu, navbar, pagination, steps, tabs.
- **Feedback** — alert, loading, progress, radial progress, skeleton, toast, tooltip.
- **Data input** — checkbox, file input, filter, input, radio, range, rating, select, textarea, toggle.
- **Layout** — divider, drawer, footer, hero, indicator, join, mask, stack.
- **Mockup** — browser, code, phone and window mockups.

All components are globally registered by `src/plugins/components.ts` and can also be
imported explicitly from `src/components/ui`.

### Showcase registry

`src/data/componentRegistry.ts` is the single source of truth for the showcase. Each entry
contains the component name, category, demo component, documented props/events/slots and a
source example. The demo itself lives in `src/showcase/demos/` and is resolved by
`src/showcase/demoMap.ts`.

To add a component:

1. Create the reusable component under the appropriate `src/components/ui/` folder.
2. Register it in `src/plugins/components.ts` if it should be global.
3. Add a demo in `src/showcase/demos/` and map it in `src/showcase/demoMap.ts`.
4. Add the registry entry with props, events, slots and source.

## DataTable and Laravel Pagination

`DzDataTable` never fetches data. It receives `rows` and pagination metadata as props and
emits a single joined `update:query` event containing page, page size, search, sort and
filters. Bind it with `v-model:query`.

- **Client mode** applies search, filters, sorting and pagination locally over `rows`.
- **Server mode** emits the query and renders whatever the server returns; `total`, `from`
  and `to` come straight from the paginator envelope.
- **Filters** are a scoped slot, so any input can bind to `filters.<key>`. In client mode,
  a filter key matching a column filters that column; `_from` / `_to` pairs filter ranges.

`src/services/api.ts` defines the Laravel contract:

- `DataTableQuery` — page, `perPage`, search, sort and filters.
- `LaravelPaginator<T>` — Laravel's native `current_page`, `data`, `from`, `last_page`,
  `per_page`, `to`, `total` fields.
- `toLaravelParams()` / `buildQueryString()` — map the query to `page`, `per_page`,
  `search`, `sort_by`, `sort_direction` and filter parameters (arrays become `key[]`).

The mock resources in `src/services/userService.ts` and `src/services/mediaService.ts`
follow the same contract as a real Laravel endpoint, so replacing them with HTTP calls does
not require changes to the table or composables.

## Users CRUD

The `/data` page wires `DzDataTable`, `useDataTable` and `userService` into a complete CRUD
workflow: create, view, edit, delete, search, role/status filters, sorting, page-size
changes and pagination. Writes use simulated latency and update the in-memory resource.

## FormKit

FormKit is configured in `src/plugins/formkit.config.ts` and themed by
`src/plugins/formkit.theme.ts`.

- Built-in inputs (text, email, select, textarea, checkbox, radio, range, file, date…)
  render DaisyUI classes through `generateClasses`.
- Invalid and error states use `formkit-invalid:*` / `formkit-errors:*` variants.
- Three custom inputs are registered: `dzToggle`, `dzRating` and `dzOtp`; they render their
  own DaisyUI markup through `DzFormField`.
- Custom validation rules include async username availability, disposable-email rejection,
  strong passwords and file-size checks (`src/utils/formkitRules.ts`).
- The `/forms` page demonstrates basic, login, registration, profile, validation,
  conditional, repeating and file-upload forms.

## Media Library

`DzMediaLibrary` is presentational: it receives items and emits intent events. API code
lives outside the component.

- `management` mode supports upload, metadata editing, single/bulk delete, bulk download and
  infinite scroll.
- `selector` mode supports picking assets and inserting them with a dynamic
  `Insert Media (n)` footer.
- `useMediaLibrary` owns pagination, search, selection, upload progress, saving and deletion.
- `src/services/mediaService.ts` implements a mock Laravel-style media API.

See [`docs/media-library.md`](docs/media-library.md) for the event contract, modes, service
functions and query parameters.

## Authentication

Authentication is optional and disabled by default. Configure it by copying
`.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Purpose |
| --- | --- |
| `VITE_AUTH_DRIVER` | `sanctum-spa`, `sanctum-token` or `none` |
| `VITE_API_BASE_URL` | Laravel application origin |
| `VITE_AUTH_*_ENDPOINT` | Login, logout, user, CSRF and password-reset paths |
| `VITE_AUTH_TOKEN_STORAGE` | `memory` (recommended) or `sessionStorage` |
| `VITE_AUTH_TOKEN_RESPONSE_PATH` | Dot path to the token in the login response |
| `VITE_AUTH_MOCK` | Use the simulated Laravel backend in the Axios adapter |
| `VITE_AUTH_ALLOW_RUNTIME_SWITCH` | Allow switching drivers outside development |

Behaviour:

- The auth guard initializes the active driver once before the first protected route.
- Protected routes redirect guests to `/login?redirect=…`; guest-only routes redirect
  signed-in users to the dashboard.
- With `none`, navigation is never blocked and auth pages explain that sign-in is disabled.
- An HTTP 401 on an active session clears local state and redirects to login with a warning.
- The development driver switcher is available on `/settings` when enabled.

## Theming

Six DaisyUI themes are available: Light, Dark, Corporate, Business, Cupcake and Dracula.
The active theme is written to `<html data-theme>` and persisted in `localStorage` under
`vue-daisy:theme`. The theme picker lives on `/themes`; each preview card renders its own
nested `data-theme` palette.

## Quality Assurance

Phase 7 verification covered:

- **Responsive behaviour** — no horizontal overflow on any route at 320, 390, 768, 1024 and
  1440 px, including forms, DataTable pagination, media API tables and the theme header.
- **Component interactions** — modal open/close/confirm/Escape, accordion single-open,
  dropdown open/Escape/select, tabs click and arrow keys, toasts, tooltips, search and
  category filters, and showcase documentation tabs.
- **Theme switching and persistence** — applies `data-theme`, persists in `localStorage` and
  survives reload.
- **CRUD workflows** — create, read, update and delete users with toasts and correct counts.
- **Laravel pagination compatibility** — server-mode page changes, filters, search, error
  retry and native paginator ranges.
- **FormKit validation** — required fields, password confirmation, custom rules and
  successful submissions.
- **Navigation** — every route, invalid routes, mobile sidebar open/close/navigate/Escape and
  auth pages in the disabled state.
- **Console output** — no application console errors or warnings during the QA runs.

`npm run typecheck` and `npm run build` both complete successfully.

# Personal Project & Maintenance Disclaimer

Please note that this is primarily a **personal project** built to scratch my own itch. 

* **No Guaranteed Updates:** Do not expect periodic updates, active maintenance, or new features unless I personally need them for my own use cases. 
* **Fork Away:** You are completely free—and encouraged—to fork this repository, modify it, and take it in whatever direction you want. 
* **Support:** Issues and pull requests may go unanswered or unmerged depending on my availability. If you need a specific fix or feature, your best bet is to fork the project and build it yourself!
