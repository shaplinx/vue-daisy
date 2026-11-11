/**
 * Laravel API contract layer shared by the DataTable stack.
 *
 * The `DzDataTable` presentation component never performs requests. Pages
 * own data access instead: `useDataTable` accepts a fetcher function, maps
 * its query state to Laravel's conventional query parameters with
 * `toLaravelParams`, and consumes the native Laravel paginator envelope
 * (`LaravelPaginator`) without any manual transformation.
 *
 * These helpers produce the exact parameter set a Laravel endpoint receives,
 * so swapping the mock services in `src/services/*.ts` for a real HTTP
 * client (Axios or fetch) requires no changes in the table or the
 * composable — only a different fetcher function.
 */

/** Sort direction used by the table and the API. */
export type DataTableSortDirection = 'asc' | 'desc'

/** Single-column sort state; `key: null` means unsorted. */
export interface DataTableSortState {
  key: string | null
  direction: DataTableSortDirection
}

/** Value of one column filter. Date ranges use `{ from, to }` objects. */
export type DataTableFilterValue = string | number | null | { from?: string; to?: string }

/** Column filter state, keyed by column key. */
export type DataTableFilters = Record<string, DataTableFilterValue>

/** Complete query state of a data table. */
export interface DataTableQuery {
  page: number
  perPage: number
  search: string
  sort: DataTableSortState
  filters: DataTableFilters
}

/** Laravel's standard `paginate()` JSON envelope, unmodified. */
export interface LaravelPaginator<T> {
  current_page: number
  data: T[]
  first_page_url?: string | null
  from: number | null
  last_page: number
  last_page_url?: string | null
  links?: Array<{ url: string | null; label: string; active: boolean }>
  next_page_url?: string | null
  path?: string
  per_page: number
  prev_page_url?: string | null
  to: number | null
  total: number
}

/** Query parameter names Laravel expects. Override per backend. */
export interface LaravelQueryParams {
  page?: string
  perPage?: string
  search?: string
  sortBy?: string
  sortDirection?: string
}

/** Default Laravel query parameter names. */
export const LARAVEL_QUERY_PARAMS: Required<LaravelQueryParams> = {
  page: 'page',
  perPage: 'per_page',
  search: 'search',
  sortBy: 'sort_by',
  sortDirection: 'sort_direction',
}

/**
 * Map table query state to Laravel query parameters.
 *
 * Filter values pass through under their column key; date ranges become
 * `key_from` / `key_to` pairs, matching Laravel's `whereBetween` usage.
 */
export function toLaravelParams(
  query: DataTableQuery,
  overrides: LaravelQueryParams = {},
): Record<string, string | number> {
  const names = { ...LARAVEL_QUERY_PARAMS, ...overrides }
  const params: Record<string, string | number> = {
    [names.page]: query.page,
    [names.perPage]: query.perPage,
  }

  const search = query.search.trim()
  if (search) params[names.search] = search

  if (query.sort.key) {
    params[names.sortBy] = query.sort.key
    params[names.sortDirection] = query.sort.direction
  }

  for (const [key, value] of Object.entries(query.filters)) {
    if (value === null || value === '') continue
    if (typeof value === 'object') {
      if (value.from) params[`${key}_from`] = value.from
      if (value.to) params[`${key}_to`] = value.to
    } else {
      params[key] = value
    }
  }

  return params
}

/** Serialize parameters to a query string (without a leading `?`). */
export function buildQueryString(params: Record<string, string | number>): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) search.set(key, String(value))
  return search.toString()
}
