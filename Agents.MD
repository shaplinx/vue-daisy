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

### Phase 5 — Quality Assurance
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