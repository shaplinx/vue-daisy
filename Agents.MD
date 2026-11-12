# Project: Vue 3 DaisyUI Component Library & Admin Dashboard

## 1. Project Overview

Build a fully functional, reusable Vue 3 component library based on DaisyUI.

The goal is to convert the entire collection of DaisyUI components into reusable, configurable, and working Vue 3 typescript components using the Composition API.

This project will also serve as a component playground, UI documentation system, and starter admin dashboard.

The application must be modular, scalable, maintainable, and suitable for future production applications.

### Core Technology Stack

- Vue 3
- Vue Composition API (`<script setup>`)
- TypeScript
- Vite
- Tailwind CSS
- DaisyUI
- Vue Router
- FormKit for form generation and validation
- Lucide Icons

Use the latest mutually compatible stable versions of these dependencies.

Do not unnecessarily introduce additional UI frameworks.

---

# 2. Architecture and Development Principles

Follow these principles throughout development:

1. Every DaisyUI component must have its own reusable Vue component.
2. Components must support configurable props, events, slots, and variants.
3. Use Vue 3 Composition API with `<script setup>`.
4. TypeScript.
5. Avoid hardcoded application-specific content inside reusable components.
6. Components must be independent of the dashboard layout.
7. Maintain consistent naming conventions and folder structures.
8. Support responsive layouts.
9. Follow accessibility best practices, including keyboard navigation and ARIA attributes.
10. Use DaisyUI semantic classes and design tokens wherever possible.
11. Avoid duplicating component logic.
12. Do not create decorative components that look functional but have no working behavior.

The component library must be the foundation of every page in this application.

---

# 3. DaisyUI Component Library

Convert the complete set of components available in the selected DaisyUI version into reusable Vue 3 components.

Before implementation, inspect the official DaisyUI documentation and create a component inventory.

Organize components into categories.

### A. Actions
- Button
- Dropdown
- Modal
- Swap
- Theme Controller

### B. Data Display
- Accordion
- Avatar
- Badge
- Card
- Carousel
- Chat Bubble
- Collapse
- Countdown
- Diff
- KBD
- List
- Stat
- Status
- Table
- Timeline

### C. Navigation
- Breadcrumbs
- Dock
- Link
- Menu
- Navbar
- Pagination
- Steps
- Tab
- Bottom Navigation

### D. Feedback
- Alert
- Loading
- Progress
- Radial Progress
- Skeleton
- Toast
- Tooltip

### E. Data Input
- Checkbox
- File Input
- Filter
- Input
- Radio
- Range
- Rating
- Select
- Textarea
- Toggle

### F. Layout
- Divider
- Drawer
- Footer
- Hero
- Indicator
- Join
- Mask
- Stack

### G. Mockup
- Browser Mockup
- Code Mockup
- Phone Mockup
- Window Mockup

Include additional components introduced in the selected DaisyUI version.

For each component, implement:

- Default variant
- Available color variants
- Available sizes
- Available visual styles
- Relevant state variations
- Disabled state
- Loading state where applicable
- Responsive behavior
- Relevant slots
- Relevant emitted events

Important: Do not just reproduce the visual appearance. Implement actual interactive behavior.

Examples:

**Button**
- Variants: primary, secondary, accent, neutral, info, success, warning, error, ghost, link, outline, soft.
- Sizes: xs, sm, md, lg, xl.
- States: loading, disabled, active.
- Support native button attributes.

**Modal**
- Open and close functionality.
- Backdrop click behavior.
- Escape key support.
- Custom header, body, and footer slots.
- Configurable backdrop and dismiss behavior.

**Dropdown**
- Open and close behavior.
- Click outside to close.
- Keyboard navigation.
- Custom trigger slot.
- Menu item slots.

**Tabs**
- Active tab management.
- Dynamic tab content.
- Keyboard navigation.
- Controlled and uncontrolled modes.

**Accordion**
- Single-open and multiple-open modes.
- Customizable headers.
- Dynamic content.

**Toast**
- Success, error, warning, and info notifications.
- Configurable duration.
- Manual dismissal.
- Multiple notification support.

All components must preserve DaisyUI's original visual conventions.

---

# 4. Dashboard Layout

Create a professional admin dashboard using the reusable components.

### Main Layout

Use a responsive layout consisting of:

**Left Sidebar**
- Application logo and name.
- Dashboard.
- Component Library.
- Data Management.
- Form Examples.
- Settings.
- Theme Settings.

The sidebar must support:
- Expand/collapse.
- Active menu highlighting.
- Nested navigation.
- Responsive mobile drawer.
- Icon and text navigation.

**Top Navbar**
- Sidebar toggle.
- Breadcrumb navigation.
- Global search.
- Theme switcher.
- Notification dropdown.
- User profile dropdown.

**Main Content**
- Dynamic page rendering through Vue Router.
- Consistent page headers.
- Breadcrumbs.
- Responsive content containers.

**Footer**
- Application version.
- Copyright information.

Use a modern, clean admin dashboard aesthetic with DaisyUI.

---

# 5. First Page: Component Playground

The first page after opening the application must be the Component Library Showcase.

This is the most important initial deliverable.

Create a dedicated page to demonstrate every implemented DaisyUI component and all its variations.

### Component Showcase Requirements

For each component, display:

1. Component name.
2. Short description.
3. Default appearance.
4. Available variants.
5. Available sizes.
6. Interactive examples.
7. Different states.
8. Relevant props.
9. Example implementation code.

Provide a tabbed or segmented interface:

- Preview
- Variants
- Props & Events
- Source Example

Include a copy-to-clipboard button for code examples.

Allow users to interact with components directly in the showcase.

Examples:
- Click buttons.
- Open modals.
- Expand accordions.
- Change tabs.
- Open dropdowns.
- Trigger toast notifications.
- Toggle switches.
- Change themes.

The showcase should function as an interactive component documentation system, not just a static gallery.

Use a searchable component navigation menu with category filters.

---

# 6. Second Page: CRUD Demonstration

After completing the component showcase, create a functional CRUD demonstration page.

Use a sample resource called "Users".

### CRUD Features

Implement:

- Display records.
- Create new records.
- View record details.
- Edit existing records.
- Delete records.
- Confirmation dialog before deletion.
- Success and error notifications.

Use a reusable DataTable component.

### DataTable Requirements

Create a highly configurable and reusable Vue 3 DataTable component.

Features:

**Column Management**
- Dynamic column definitions.
- Custom column rendering through slots.
- Custom cell formatting.
- Hidden and visible columns.
- Alignment configuration.

**Filtering**
- Global search.
- Column-specific filters.
- Text filters.
- Select filters.
- Date range filters.
- Reset filters.

**Sorting**
- Ascending and descending sorting.
- Sortable column configuration.
- Multi-column sorting if practical.
- Visual sort indicators.

**Pagination**
- Page navigation.
- Previous and next buttons.
- First and last page.
- Configurable page sizes (10, 25, 50, 100).
- Total records display.
- Current page display.
- Total pages display.

**Additional Features**
- Row selection.
- Bulk selection.
- Bulk actions.
- Loading skeleton.
- Empty state.
- Error state.
- Responsive table.
- Configurable action column.

### Laravel API Compatibility (CRITICAL)

The DataTable must support Laravel's standard paginated API response out of the box.

Expected response structure:

```json
{
  "current_page": 1,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  ],
  "first_page_url": "...",
  "from": 1,
  "last_page": 10,
  "last_page_url": "...",
  "links": [],
  "next_page_url": "...",
  "path": "...",
  "per_page": 10,
  "prev_page_url": null,
  "to": 10,
  "total": 100
}
```

Support this response directly without requiring developers to manually transform the API response.

Implement two data modes:

**Mode 1: Client-side**
- Filtering.
- Sorting.
- Pagination.
- Suitable for small datasets.

**Mode 2: Server-side**
- Server-side pagination.
- Server-side filtering.
- Server-side sorting.
- API-driven search.
- API-driven page size.
- Loading states.
- Request error handling.

Create a reusable API integration layer.

Example usage:

```typescript
const usersTable = {
  endpoint: '/api/users',
  method: 'GET',
  pagination: true,
  searchable: true,
  sortable: true
}
```

Expected query parameters:

```text
?page=1
&per_page=10
&search=john
&sort_by=name
&sort_direction=asc
```

Make the query parameter mapping configurable because Laravel applications may use different naming conventions.

Use Axios or a centralized Fetch API client.

Avoid making API requests directly inside the DataTable presentation component.

Create a composable such as:

`useDataTable.js`

It should manage:
- Data fetching.
- Pagination state.
- Search state.
- Filter state.
- Sorting state.
- Loading state.
- Error handling.
- Request cancellation or stale response protection.

The component must work with Laravel's native pagination metadata, including `current_page`, `last_page`, `per_page`, and `total`.

Do not assume that the Laravel API returns a custom response structure.

---

# 7. Third Page: FormKit Integration

Use FormKit as the primary form generation and validation system.

Do not build a competing form validation engine.

Create a custom FormKit theme that visually matches DaisyUI.

### FormKit Theme Requirements

All FormKit inputs must inherit DaisyUI styling.

Customize:
- Text inputs.
- Email inputs.
- Password inputs.
- Number inputs.
- Textarea.
- Select.
- Checkbox.
- Radio.
- Toggle.
- Date inputs.
- File inputs.
- Submit buttons.
- Validation messages.
- Help text.
- Labels.
- Input wrappers.

Use DaisyUI classes such as:

- `input`
- `input-bordered`
- `input-primary`
- `select`
- `select-bordered`
- `textarea`
- `checkbox`
- `radio`
- `toggle`
- `btn`
- `label`
- `fieldset`

Make the theme consistent with DaisyUI's color system.

### Form Examples

Create a dedicated Form Showcase page demonstrating:

1. Basic form.
2. Login form.
3. User registration form.
4. Profile editing form.
5. Complex validation form.
6. Conditional fields.
7. Repeating/grouped fields.
8. File upload form.

### Form Validation

Demonstrate:
- Required fields.
- Email validation.
- Minimum and maximum length.
- Numeric validation.
- Custom validation rules.
- Cross-field validation.
- Conditional validation.
- Error messages.
- Submission loading state.
- Success feedback.

Use FormKit schemas where appropriate.

Create a reusable custom theme configuration rather than manually styling every form individually.

---

# 8. Theme System

Implement DaisyUI theme support.

At minimum:
- Light
- Dark
- Corporate
- Business
- Cupcake
- Dracula

Allow users to switch themes from the dashboard navbar.

The selected theme should persist after page refresh.

Ensure:
- Components follow the active theme.
- Sidebar follows the active theme.
- Forms follow the active theme.
- Tables follow the active theme.
- Modals and notifications follow the active theme.

Avoid hardcoding colors in individual components when DaisyUI semantic color tokens are available.

---

# 9. Suggested Folder Structure

Organize the project using a modular structure:

```text
src/
├── assets/
├── components/
│   ├── ui/
│   │   ├── actions/
│   │   ├── data-display/
│   │   ├── navigation/
│   │   ├── feedback/
│   │   ├── data-input/
│   │   ├── layout/
│   │   └── mockup/
│   ├── dashboard/
│   ├── datatable/
│   └── form/
├── composables/
│   ├── useDataTable.js
│   ├── useTheme.js
│   ├── useToast.js
│   └── usePagination.js
├── layouts/
│   └── DashboardLayout.vue
├── pages/
│   ├── DashboardPage.vue
│   ├── ComponentShowcasePage.vue
│   ├── CrudUsersPage.vue
│   ├── FormShowcasePage.vue
│   └── SettingsPage.vue
├── router/
├── services/
│   ├── api.js
│   └── userService.js
├── stores/
├── plugins/
│   └── formkit.js
├── themes/
│   └── formkit-theme.js
├── utils/
├── App.vue
└── main.js
```

Adjust the structure if necessary, but preserve separation of concerns.

---

# 10. Development Workflow

Build the project incrementally.

Do not attempt to generate the entire application in one step.

Follow these phases:

### Phase 1 — Foundation
- Initialize Vue 3 and Vite.
- Install and configure Tailwind CSS and DaisyUI.
- Configure Vue Router.
- Configure the theme system.
- Build the dashboard layout.
- Create the left sidebar and navbar.

### Phase 2 — Component Library
- Inventory all DaisyUI components.
- Implement reusable Vue components.
- Implement component variants and states.
- Build the component showcase page.
- Verify interactive behavior.
- Provide example code for each component.

### Phase 3 — DataTable
- Build the reusable DataTable.
- Implement client-side mode.
- Implement server-side mode.
- Support native Laravel pagination responses.
- Implement filtering, sorting, and pagination.
- Build the Users CRUD demonstration.
- Test against realistic mock Laravel API responses.

### Phase 4 — FormKit
- Install and configure FormKit.
- Develop the DaisyUI-compatible theme.
- Build reusable form examples.
- Validate all form interactions.

### Phase 5 — Pluggable Authentication Driver System

#### 1. Objective

Implement a reusable, configurable authentication system that supports Laravel Sanctum authentication.

The authentication system must support three operating modes:

1. Laravel Sanctum Stateful SPA Authentication (Cookie / Session).
2. Laravel Sanctum Personal Access Token Authentication (Bearer Token).
3. Authentication Disabled (Public / Development Mode).

The authentication architecture must be driver-based and extensible.

The application must not be tightly coupled to a particular authentication implementation.

All authentication operations must go through a unified authentication interface, regardless of the selected driver.

Use Vue 3 Composition API, TypeScript, Pinia where appropriate, Vue Router, and the existing API service layer.

Do not rewrite existing components, DataTable, or FormKit implementations.

---

#### 2. Authentication Driver Configuration

Create a centralized authentication configuration.

Suggested configuration:

```typescript
export type AuthDriver =
  | 'sanctum-spa'
  | 'sanctum-token'
  | 'none'

export interface AuthConfig {
  driver: AuthDriver

  apiBaseUrl: string

  endpoints: {
    login: string
    logout: string
    user: string
    csrfCookie: string
    forgotPassword?: string
    resetPassword?: string
  }

  token: {
    storage: 'memory' | 'sessionStorage'
    responsePath: string
    headerName: string
    prefix: string
  }

  redirect: {
    login: string
    afterLogin: string
    afterLogout: string
  }
}
```

Use environment variables for deployment-level configuration.

Example:

```env
VITE_AUTH_DRIVER=sanctum-spa

VITE_API_BASE_URL=http://localhost:8000

VITE_AUTH_LOGIN_ENDPOINT=/login
VITE_AUTH_LOGOUT_ENDPOINT=/logout
VITE_AUTH_USER_ENDPOINT=/api/user
VITE_AUTH_CSRF_ENDPOINT=/sanctum/csrf-cookie

VITE_AUTH_TOKEN_STORAGE=memory
```

Supported driver values:

- `sanctum-spa`
- `sanctum-token`
- `none`

Requirements:

- Driver selection must happen during application initialization.
- All drivers must implement the same authentication interface.
- Invalid driver configuration must produce a clear error.
- Missing optional configuration must use documented defaults.
- Do not hardcode API endpoints throughout the application.

Provide a development-only driver selector in Settings so developers can test different authentication modes without editing environment variables manually.

Production driver selection must remain deployment-controlled unless an explicit runtime configuration mechanism is implemented.

---

#### 3. Authentication Architecture

Implement an adapter/driver architecture.

Suggested folder structure:

```text
src/
├── auth/
│   ├── drivers/
│   │   ├── AuthDriver.ts
│   │   ├── SanctumSpaDriver.ts
│   │   ├── SanctumTokenDriver.ts
│   │   └── NoAuthDriver.ts
│   │
│   ├── auth.config.ts
│   ├── auth.factory.ts
│   ├── auth.types.ts
│   └── auth.provider.ts
│
├── composables/
│   ├── useAuth.ts
│   └── usePermissions.ts
│
├── stores/
│   └── auth.store.ts
│
├── services/
│   └── api.ts
│
├── router/
│   └── guards/
│       └── auth.guard.ts
│
└── pages/
    └── auth/
        ├── LoginPage.vue
        ├── ForgotPasswordPage.vue
        └── ResetPasswordPage.vue
```

Adjust the structure when necessary.

##### Unified Auth Driver Interface

Every authentication driver must implement the same interface.

Example:

```typescript
export interface AuthDriverInterface {
  initialize(): Promise<void>

  login(credentials: LoginCredentials): Promise<void>

  logout(): Promise<void>

  getUser(): Promise<User | null>

  checkAuth(): Promise<boolean>

  isAuthenticated(): boolean
}
```

Additional methods may be added when necessary.

The interface should also support:

- Authentication status.
- Current user.
- Loading state.
- Authentication errors.
- Session expiration.
- Token expiration where applicable.

The authentication driver must be initialized once and provided through a centralized authentication provider.

Do not instantiate authentication drivers independently in individual pages.

---

#### 4. Driver A — Laravel Sanctum Stateful SPA

Implement cookie-based session authentication using Laravel Sanctum.

This is the recommended authentication mode for a first-party Vue SPA and Laravel backend sharing the same top-level domain.

##### Authentication Flow

1. User opens the login page.
2. Frontend requests the configured CSRF endpoint.
3. Laravel initializes the CSRF cookie.
4. Frontend submits credentials to the configured login endpoint.
5. Laravel authenticates the user and creates a session.
6. Frontend requests the authenticated user profile.
7. Authentication state is updated.
8. User is redirected to the intended protected page.

##### HTTP Client Requirements

Configure Axios appropriately:

```typescript
axios.defaults.withCredentials = true
axios.defaults.withXSRFToken = true
```

Ensure the following headers are included where appropriate:

```text
Accept: application/json
Content-Type: application/json
```

Implement:

- CSRF cookie initialization.
- Automatic XSRF token handling.
- Session cookie authentication.
- Login.
- Logout.
- Current user retrieval.
- Session expiration handling.
- Unauthorized response handling.
- CSRF expiration handling.

##### Important

Do not manually store session credentials or attempt to extract authentication cookies through JavaScript.

The browser must manage session cookies.

Handle:

- HTTP 401: Unauthenticated or expired session.
- HTTP 419: CSRF token or session-related expiration.

Avoid redirect loops when the user is already on the login page.

---

#### 5. Driver B — Laravel Sanctum Personal Access Token

Implement Bearer Token authentication using Laravel Sanctum Personal Access Tokens.

This mode is intended for deployments where cookie-based SPA authentication is not suitable.

##### Authentication Flow

1. User opens the login page.
2. User submits credentials.
3. Frontend sends credentials to the configurable token-login endpoint.
4. Backend validates credentials and issues a Sanctum Personal Access Token.
5. Frontend extracts the token using the configured response path.
6. Token is stored according to the selected storage strategy.
7. Subsequent API requests include the token in the Authorization header.
8. Frontend retrieves the authenticated user profile.

##### Request Header

```text
Authorization: Bearer YOUR_ACCESS_TOKEN
Accept: application/json
```

##### Requirements

Implement:

- Login using configurable endpoint.
- Token extraction from configurable response structure.
- Token storage abstraction.
- Authorization header injection.
- Current user retrieval.
- Logout and server-side token revocation.
- Token expiration handling.
- Unauthorized response handling.
- Clearing authentication state on logout.

##### Token Storage Security

Do not automatically store access tokens in localStorage.

Default to in-memory storage.

Optionally support sessionStorage through configuration, with an explicit security warning that JavaScript-accessible storage is vulnerable to token theft through XSS.

Do not store credentials or passwords.

Never log access tokens.

Do not expose tokens through debugging output.

##### Backend Compatibility

Do not assume Laravel Sanctum provides a standard login endpoint.

The token issuance endpoint is application-specific and must be configurable.

Support configurable token response paths.

Example response:

```json
{
  "token": "1|example-token",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

Allow alternative response structures, such as nested `data.token`.

The frontend must not require the backend to use this exact example structure.

---

#### 6. Driver C — Authentication Disabled

Implement a NoAuthDriver.

This driver must completely disable authentication requirements.

Intended use cases:

- Local development.
- Component showcase.
- UI testing.
- Public dashboard.
- Applications that do not require authentication.

Requirements:

- No login page required.
- No authentication API requests.
- No token management.
- No CSRF initialization.
- No authentication redirects.
- All application routes accessible unless separately restricted.
- API requests must not include Authorization headers from previously used authentication drivers.

Provide a predictable authentication state.

For example:

```typescript
{
  enabled: false,
  isAuthenticated: true,
  user: null,
  loading: false
}
```

The `isAuthenticated` value in this mode must not be interpreted as proof of an actual authenticated user.

Use `enabled: false` to distinguish disabled authentication from real authentication.

Do not create a fake authenticated user unless an explicit development mock-user feature is implemented separately.

Make sure switching to this driver clears previous in-memory authentication credentials.

---

#### 7. Authentication State Management

Create a centralized Pinia authentication store.

Suggested state:

```typescript
interface AuthState {
  enabled: boolean
  driver: AuthDriver

  user: User | null

  isAuthenticated: boolean
  isLoading: boolean

  initialized: boolean

  error: string | null
}
```

Provide actions:

- initializeAuth()
- login()
- logout()
- fetchUser()
- refreshAuth()
- clearAuth()
- setError()

Expose a composable:

```typescript
const {
  user,
  isAuthenticated,
  isLoading,
  isAuthEnabled,
  login,
  logout,
  refreshAuth
} = useAuth()
```

Components must not communicate directly with authentication drivers.

They should use `useAuth()`.

Avoid duplicating authentication state between Pinia and individual components.

---

#### 8. API Client Integration

Integrate authentication into the existing centralized API client.

Do not create separate Axios instances unnecessarily.

The API client must obtain authentication behavior from the active driver.

Requirements:

- Automatically attach Bearer tokens in token mode.
- Send credentials in stateful SPA mode.
- Avoid authentication headers in disabled mode.
- Handle unauthorized responses centrally.
- Prevent repeated redirects.
- Handle network failures.
- Support request cancellation.
- Preserve existing DataTable API integration.

The DataTable and other services must not need to know which authentication driver is active.

---

#### 9. Router Integration

Create authentication-aware Vue Router guards.

Support route metadata:

```typescript
{
  path: '/users',
  component: UsersPage,
  meta: {
    requiresAuth: true
  }
}
```

Also support:

```typescript
{
  path: '/login',
  component: LoginPage,
  meta: {
    guestOnly: true
  }
}
```

Requirements:

##### When authentication is enabled

- Protected routes require successful authentication.
- Unauthenticated users are redirected to login.
- Authenticated users cannot access guest-only pages unnecessarily.
- Preserve the intended destination after login.
- Initialize authentication before resolving protected routes.

##### When authentication is disabled

- Authentication guards must not block navigation.
- Login routes may redirect to the default landing page or display an informational message.
- All normal application routes remain accessible.

Ensure route guards do not repeatedly fetch the current user on every navigation.

---

#### 10. Authentication UI

Create reusable authentication pages using the existing DaisyUI component library and FormKit theme.

##### Login Page

Include:

- Email or username.
- Password.
- Remember me (stateful mode only, when supported by backend).
- Show/hide password.
- Submit button.
- Loading state.
- Validation messages.
- API error messages.

##### Forgot Password

Provide a configurable password reset workflow.

Do not assume that password reset endpoints exist on every Laravel backend.

##### Reset Password

Support configurable reset endpoints and parameters.

If an endpoint is not configured, clearly indicate that this feature is unavailable.

##### Authentication Status

Add authentication status information to the dashboard profile dropdown.

Include:

- Current user name.
- Email.
- Profile information.
- Logout action.

When authentication is disabled, do not display a misleading logged-in user profile.

---

#### 11. Settings Page Integration

Add an Authentication Settings section.

Display:

- Current authentication driver.
- Authentication enabled/disabled status.
- API base URL.
- Configured authentication endpoints.
- Token storage strategy (token mode).
- Authentication connection status.
- Current authenticated user (when applicable).

For development environments, provide a driver selector:

- Sanctum Stateful SPA.
- Sanctum Bearer Token.
- No Authentication.

Changing the selected driver must:

1. Clear existing authentication state.
2. Dispose of credentials associated with the previous driver.
3. Initialize the new driver.
4. Reinitialize the API client behavior.
5. Reevaluate route access.
6. Reload the application when necessary.

Do not allow ordinary users to change production authentication configuration unless explicitly enabled by the application administrator.

Never expose passwords, tokens, cookies, or other secrets in the settings interface.

---

#### 12. Backend Integration Documentation

Create a dedicated documentation page explaining the Laravel backend requirements for each driver.

##### Stateful SPA Documentation

Explain:

- Sanctum installation.
- Stateful domain configuration.
- Stateful API middleware.
- CORS configuration.
- Session cookie domain.
- CSRF endpoint.
- Login and logout routes.
- Current user endpoint.

##### Token Documentation

Explain:

- Sanctum installation.
- HasApiTokens trait.
- Token issuance endpoint.
- Token response format.
- Token abilities.
- Token expiration.
- Token revocation endpoint.

Clearly distinguish frontend responsibilities from Laravel backend responsibilities.

Do not automatically modify or assume access to a Laravel backend repository.

Provide example Laravel implementation snippets where useful.

---

#### 13. Testing and Acceptance Criteria

The authentication system is complete only when the following conditions are met.

##### Driver Selection

- [ ] All three authentication drivers are implemented.
- [ ] Driver selection is centralized.
- [ ] Driver initialization works.
- [ ] Invalid configurations are handled.
- [ ] Development driver switching works.

##### Stateful SPA

- [ ] CSRF initialization works.
- [ ] Login works.
- [ ] Session authentication works.
- [ ] Current user retrieval works.
- [ ] Logout works.
- [ ] Session expiration is handled.
- [ ] HTTP 401 and 419 responses are handled.

##### Bearer Token

- [ ] Login works with a configurable endpoint.
- [ ] Token extraction supports configurable response paths.
- [ ] Bearer headers are injected correctly.
- [ ] Token storage works.
- [ ] Logout revokes the token through the backend.
- [ ] Token expiration and unauthorized responses are handled.
- [ ] Tokens are never exposed in logs.

##### No Authentication

- [ ] No authentication requests are made.
- [ ] No login redirect occurs.
- [ ] No Authorization header is sent.
- [ ] Protected routes remain accessible.
- [ ] Previous authentication credentials are cleared.

##### Application Integration

- [ ] Vue Router guards work with all three drivers.
- [ ] Pinia authentication state works.
- [ ] useAuth() works throughout the application.
- [ ] API client integration works.
- [ ] DataTable remains compatible.
- [ ] FormKit login forms work.
- [ ] Dashboard profile menu reflects authentication state.
- [ ] Theme switching remains functional.

##### Quality

- [ ] No major console errors.
- [ ] No duplicated authentication logic.
- [ ] No hardcoded authentication endpoints.
- [ ] No accidental credential exposure.
- [ ] Authentication architecture is extensible.

---

#### 14. Phase Completion Requirements

Before moving to Phase 6:

1. Explain the authentication architecture.
2. Show the implemented driver structure.
3. Demonstrate all three authentication modes.
4. Verify the login and logout flows.
5. Verify route guards.
6. Verify API client integration.
7. Document the Laravel backend requirements.
8. List any features requiring backend implementation.
9. Confirm all acceptance criteria.

Use realistic mock authentication responses for local testing when a Laravel backend is unavailable.

Clearly distinguish simulated authentication from actual Laravel Sanctum authentication.

**Only begin Phase 6 — Quality Assurance after Phase 5 has been implemented and verified.**


### Phase 6 — Quality Assurance
- Test responsive behavior.
- Test all component interactions.
- Test theme switching and persistence.
- Test CRUD workflows.
- Test Laravel pagination compatibility.
- Test FormKit validation.
- Fix console errors and warnings.
- Ensure there are no broken routes or nonfunctional controls.

---

# 11. Quality and Acceptance Criteria

The project is considered complete only when:

1. All components in the selected DaisyUI version have been inventoried and implemented or explicitly documented with a reason for any omission.
2. Components are reusable Vue 3 typescript components.
3. Every component has a working demonstration.
4. The component showcase is the default landing page.
5. The dashboard has a functional responsive sidebar and navbar.
6. The DataTable supports client-side and server-side operation.
7. Laravel's native pagination response works without manual response transformation.
8. Filtering, sorting, and pagination work together.
9. CRUD operations are fully functional using a mock API or a configurable backend.
10. FormKit works with a custom DaisyUI-compatible theme.
11. Theme switching works throughout the application.
12. No major console errors exist.
13. The application can be extended without rewriting existing components.

---

# 12. Important Instructions for VibeCode

Work as a senior Vue.js frontend architect.

Prioritize maintainability, component reusability, and actual functionality over visual shortcuts.

Do not skip component categories.

Do not replace real functionality with static mockups.

Do not implement everything inside one giant Vue component.

Do not duplicate DaisyUI's CSS unnecessarily.

Use official DaisyUI documentation as the source of truth for component classes, variants, and available features.

Before starting each development phase:
1. Explain what will be implemented.
2. Identify the files that will be created or modified.
3. Implement the phase.
4. Verify that the implementation works.
5. Summarize what has been completed and what remains.