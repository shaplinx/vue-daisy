import { nextTick, onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import type { LaravelPaginator, DataTableFilters, DataTableQuery, DataTableSortState } from '@/services/api'

export interface UseDataTableOptions<Row> {
  /**
   * Loads one page of data. Provided by the page — the DataTable never
   * performs requests itself, so any fetch implementation (mock service,
   * Axios, fetch, GraphQL…) can be swapped without touching the table.
   */
  fetcher: (query: DataTableQuery) => Promise<LaravelPaginator<Row>>
  /** Seed the query state (sort, page size, filters…) before the first load. */
  initialQuery?: {
    page?: number
    perPage?: number
    search?: string
    sort?: DataTableSortState
    filters?: DataTableFilters
  }
  /** Debounce applied to search- and filter-driven refetches, in ms. */
  debounceMs?: number
  /** Fetch immediately when the composable is created. */
  immediate?: boolean
}

/** Shallow compare of two filter records (values are primitives or arrays). */
function filtersEqual(a: DataTableFilters, b: DataTableFilters): boolean {
  const keys = Object.keys(a)
  if (keys.length !== Object.keys(b).length) return false
  return keys.every((key) => a[key] === b[key])
}

/**
 * Server-side DataTable controller.
 *
 * Owns the single `query` object the table binds with `v-model:query` and
 * performs the fetching so `DzDataTable` stays purely presentational:
 * every table interaction emits one `update:query`, the assignment lands on
 * the ref below, and the watcher schedules exactly one request — page, page
 * size and sort changes refetch immediately while search and filter edits
 * are debounced so bursts collapse into a single fetch.
 *
 * Consumes Laravel's native paginator envelope without transformation.
 */
export function useDataTable<Row>(options: UseDataTableOptions<Row>) {
  const query = ref<DataTableQuery>({
    page: options.initialQuery?.page ?? 1,
    perPage: options.initialQuery?.perPage ?? 10,
    search: options.initialQuery?.search ?? '',
    sort: options.initialQuery?.sort ?? { key: null, direction: 'asc' },
    filters: { ...options.initialQuery?.filters },
  })

  const rows = shallowRef<Row[]>([])
  const total = ref(0)
  const lastPage = ref(1)
  const from = ref<number | null>(null)
  const to = ref<number | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const debounceMs = options.debounceMs ?? 300

  let timer: ReturnType<typeof setTimeout> | null = null
  /** Request sequence token: a newer request invalidates stale responses. */
  let token = 0
  /**
   * Suppresses the query watcher while `load()` syncs the page from the
   * paginator envelope, so those echoes do not trigger redundant refetches.
   */
  let applying = false

  /** Run `mutations` on the query without triggering the watcher. */
  function applyWithoutSchedule(mutations: () => void): void {
    applying = true
    mutations()
    void nextTick(() => {
      applying = false
    })
  }

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
      // Backends clamp past-the-end pages; follow the envelope silently.
      applyWithoutSchedule(() => {
        query.value.page = response.current_page || query.value.page
      })
      // Self-heal when the current page slid past the last page (deletions,
      // shrinking result sets) and the backend returned an empty page.
      if (!rows.value.length && query.value.page > 1 && query.value.page > lastPage.value) {
        const target = lastPage.value
        applyWithoutSchedule(() => {
          query.value.page = target
        })
        schedule(true)
      }
    } catch (cause) {
      if (request !== token) return
      error.value = cause instanceof Error ? cause.message : 'Failed to load data'
    } finally {
      if (request === token) loading.value = false
    }
  }

  watch(
    query,
    (next, prev) => {
      if (applying || !prev) return
      // Search and filter edits are debounced; pagination and sort changes
      // are worth an immediate refetch.
      const textual = next.search !== prev.search || !filtersEqual(next.filters, prev.filters)
      schedule(!textual)
    },
    { deep: true },
  )

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
    /** The single query object; bind it with `v-model:query`. */
    query,
    // response state, bound back into the table as props
    rows,
    total,
    lastPage,
    from,
    to,
    loading,
    error,
    /** Immediate refetch with the current query (retry, post-write reloads). */
    refresh,
  }
}
