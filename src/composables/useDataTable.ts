import { computed, onBeforeUnmount, ref, shallowRef } from 'vue'
import type { DataTableFilters, DataTableQuery, DataTableSortState, LaravelPaginator } from '@/services/api'

export interface UseDataTableOptions<Row> {
  /**
   * Loads one page of data. Provided by the page — the DataTable never
   * performs requests itself, so any fetch implementation (mock service,
   * Axios, fetch, GraphQL…) can be swapped without touching the table.
   */
  fetcher: (query: DataTableQuery) => Promise<LaravelPaginator<Row>>
  initialPage?: number
  initialPerPage?: number
  initialSearch?: string
  initialSort?: DataTableSortState
  initialFilters?: DataTableFilters
  /** Debounce applied to search- and filter-driven refetches, in ms. */
  debounceMs?: number
  /** Fetch immediately when the composable is created. */
  immediate?: boolean
}

/**
 * Server-side DataTable controller.
 *
 * Owns the query state and the fetching so `DzDataTable` stays purely
 * presentational: the page binds the returned state as props and pipes the
 * table's `update:page` / `update:perPage` / `update:search` / `update:sort`
 * / `update:filters` events into the `set*` handlers below. Each handler
 * mutates state and schedules exactly one request per interaction — bursty
 * updates (for example the table's filter reset emitting several events)
 * collapse into a single fetch.
 *
 * Consumes Laravel's native paginator envelope without transformation.
 */
export function useDataTable<Row>(options: UseDataTableOptions<Row>) {
  const page = ref(options.initialPage ?? 1)
  const perPage = ref(options.initialPerPage ?? 10)
  const search = ref(options.initialSearch ?? '')
  const sort = ref<DataTableSortState>(options.initialSort ?? { key: null, direction: 'asc' })
  const filters = ref<DataTableFilters>({ ...options.initialFilters })

  const rows = shallowRef<Row[]>([])
  const total = ref(0)
  const lastPage = ref(1)
  const from = ref<number | null>(null)
  const to = ref<number | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const query = computed<DataTableQuery>(() => ({
    page: page.value,
    perPage: perPage.value,
    search: search.value,
    sort: { ...sort.value },
    filters: { ...filters.value },
  }))

  const debounceMs = options.debounceMs ?? 300

  let timer: ReturnType<typeof setTimeout> | null = null
  /** Request sequence token: a newer request invalidates stale responses. */
  let token = 0

  function schedule(immediate = false): void {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    const delay = immediate ? 0 : debounceMs
    if (delay <= 0) {
      void load()
      return
    }
    timer = setTimeout(() => {
      timer = null
      void load()
    }, delay)
  }

  async function load(): Promise<void> {
    const request = ++token
    loading.value = true
    error.value = null
    try {
      const response = await options.fetcher(query.value)
      if (request !== token) return
      rows.value = response.data
      total.value = response.total
      lastPage.value = Math.max(1, response.last_page)
      from.value = response.from
      to.value = response.to
      page.value = response.current_page || page.value
      // Self-heal when the current page slid past the last page (deletions,
      // shrinking result sets) and the backend returned an empty page.
      if (!rows.value.length && page.value > 1 && page.value > lastPage.value) {
        page.value = lastPage.value
        schedule(true)
      }
    } catch (cause) {
      if (request !== token) return
      error.value = cause instanceof Error ? cause.message : 'Failed to load data'
    } finally {
      if (request === token) loading.value = false
    }
  }

  /** Jump to a page (immediate refetch). */
  function setPage(next: number): void {
    const target = Math.max(1, Math.floor(next) || 1)
    if (target === page.value) return
    page.value = target
    schedule(true)
  }

  /** Change the page size; returns to the first page (immediate refetch). */
  function setPerPage(next: number): void {
    const target = Math.max(1, Math.floor(next) || 10)
    if (target === perPage.value) return
    perPage.value = target
    page.value = 1
    schedule(true)
  }

  /** Type-ahead search (debounced refetch, returns to the first page). */
  function setSearch(next: string): void {
    if (next === search.value) return
    search.value = next
    page.value = 1
    schedule()
  }

  /** Apply a sort state (immediate refetch, returns to the first page). */
  function setSort(next: DataTableSortState): void {
    if (next.key === sort.value.key && next.direction === sort.value.direction) return
    sort.value = { ...next }
    page.value = 1
    schedule(true)
  }

  /** Apply column filters (debounced refetch, returns to the first page). */
  function setFilters(next: DataTableFilters): void {
    filters.value = { ...next }
    page.value = 1
    schedule()
  }

  /** Refetch with the current query state. */
  function refresh(): void {
    schedule(true)
  }

  if (options.immediate !== false) schedule(true)

  onBeforeUnmount(() => {
    token += 1
    if (timer) clearTimeout(timer)
  })

  return {
    // state, bound back into the table as props
    page,
    perPage,
    search,
    sort,
    filters,
    rows,
    total,
    lastPage,
    from,
    to,
    loading,
    error,
    // event handlers for the table's update:* events
    setPage,
    setPerPage,
    setSearch,
    setSort,
    setFilters,
    refresh,
  }
}
