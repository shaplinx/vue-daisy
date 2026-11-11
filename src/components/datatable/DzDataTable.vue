<script setup lang="ts">
/**
 * DzDataTable — a configurable, data-source agnostic table.
 *
 * The component never fetches. Rows and pagination metadata arrive as
 * props; every state change — page, page size, search, sort and slot-edited
 * filters — leaves as a single `update:query` event carrying the complete
 * query object (bind it with `v-model:query`, see `src/services/api.ts`).
 * In `mode="client"` the table applies search, filters, sorting and
 * pagination locally over the `rows` prop.
 *
 * The filter panel is a plain `filters` slot scoped with the filter values,
 * so any input component can be bound directly with
 * `v-model="filters.<key>"`. In client mode a filter key matching a column
 * key filters that column (strings contain, arrays match membership, other
 * values compare equal) and `<key>_from` / `<key>_to` entries bound a range.
 */
import { computed, reactive, ref, useId, useSlots, watch } from 'vue'
import type { PropType } from 'vue'
import { ArrowDown, ArrowUp, ArrowUpDown, Funnel, Inbox, RotateCcw, Search, TriangleAlert } from '@lucide/vue'
import DzButton from '@/components/ui/actions/DzButton.vue'
import DzInput from '@/components/ui/data-input/DzInput.vue'
import DzSelect from '@/components/ui/data-input/DzSelect.vue'
import DzSkeleton from '@/components/ui/feedback/DzSkeleton.vue'
import DzPagination from '@/components/ui/navigation/DzPagination.vue'
import { cellInRange, compareCellValues } from '@/utils/cell'
import { cn } from '@/utils/cn'
import { modifier, SIZES } from '@/utils/daisy'
import type { DataTableFilterValue, DataTableQuery, DataTableSortState } from '@/services/api'

export type DataTableRow = Record<string, unknown>

export interface DataTableColumn {
  key: string
  label?: string
  align?: 'start' | 'center' | 'end'
  /** Explicit column width, e.g. `'10rem'`. */
  width?: string
  headerClass?: string
  class?: string
  sortable?: boolean
  /** Hidden columns keep their data (still searched) but are not rendered. */
  hidden?: boolean
  formatter?: (value: unknown, row: DataTableRow, column: DataTableColumn, index: number) => unknown
  /** Direction-aware comparator used by client-mode sorting. */
  sorter?: (a: DataTableRow, b: DataTableRow, direction: 'asc' | 'desc') => number
}

type SelectChangeValue = string | number | Array<string | number>
type InputValue = string | number

const props = defineProps({
  columns: { type: Array as PropType<DataTableColumn[]>, default: () => [] },
  rows: { type: Array as PropType<DataTableRow[]>, default: () => [] },
  rowKey: {
    type: [String, Function] as PropType<string | ((row: DataTableRow, index: number) => string | number)>,
    default: 'id',
  },
  /** `client` manages search/filter/sort/pagination locally; `server` emits. */
  mode: { type: String as PropType<'client' | 'server'>, default: 'client' },
  searchable: { type: Boolean, default: true },
  searchPlaceholder: { type: String, default: 'Search…' },
  selectable: { type: Boolean, default: false },
  pageSizes: { type: Array as PropType<number[]>, default: () => [10, 25, 50, 100] },
  /** Server mode: total record count from the paginator envelope. */
  total: { type: Number, default: 0 },
  /** Server mode: range start from the paginator envelope. */
  from: { type: Number as PropType<number | null>, default: null },
  /** Server mode: range end from the paginator envelope. */
  to: { type: Number as PropType<number | null>, default: null },
  loading: { type: Boolean, default: false },
  loadingRows: { type: Number, default: 5 },
  error: { type: String, default: '' },
  emptyText: { type: String, default: 'No records found' },
  actionsLabel: { type: String, default: 'Actions' },
  zebra: { type: Boolean, default: false },
  size: { type: String, default: 'md' },
  ariaLabel: { type: String, default: 'Data table' },
})

const emit = defineEmits<{
  'row-click': [payload: { row: DataTableRow; index: number }]
  'select-all': [selected: Array<string | number>]
  retry: []
}>()

/**
 * One joined model: the complete query state of the table. Bind it for
 * server mode (or to seed/observe client mode); leave it unbound and the
 * table manages its own state.
 */
const query = defineModel<DataTableQuery>('query', {
  default: () => ({
    page: 1,
    perPage: 10,
    search: '',
    sort: { key: null, direction: 'asc' as const },
    filters: {},
  }),
})
const selected = defineModel<Array<string | number>>('selected', { default: () => [] })

const slots = useSlots()
const uid = useId()

const hasActions = computed(() => Boolean(slots.actions))
/** The filter panel renders whenever a `filters` slot is provided. */
const hasFilters = computed(() => Boolean(slots.filters))
const isClient = computed(() => props.mode === 'client')
const visibleColumns = computed(() => props.columns.filter((column) => !column.hidden))

const columnCount = computed(
  () => visibleColumns.value.length + (props.selectable ? 1 : 0) + (hasActions.value ? 1 : 0),
)

// ---------------------------------------------------------------------------
// Query updates — every mutation emits one joined `update:query`
// ---------------------------------------------------------------------------

function updateQuery(patch: Partial<DataTableQuery>): void {
  query.value = { ...query.value, ...patch }
}

/** Footer pagination binding over `query.page`. */
const page = computed<number>({
  get: () => query.value.page,
  set: (next) => updateQuery({ page: next }),
})

function toggleSort(column: DataTableColumn): void {
  if (!column.sortable) return
  const current = query.value.sort
  let next: DataTableSortState
  if (current.key !== column.key) next = { key: column.key, direction: 'asc' }
  else if (current.direction === 'asc') next = { key: column.key, direction: 'desc' }
  else next = { key: null, direction: 'asc' }
  updateQuery({ sort: next, page: 1 })
}

function onSearchInput(value: InputValue): void {
  updateQuery({ search: String(value), page: 1 })
}

function onPerPageChange(value: SelectChangeValue): void {
  const next = Number(Array.isArray(value) ? value[0] : value)
  if (Number.isFinite(next) && next > 0 && next !== query.value.perPage) {
    updateQuery({ perPage: next, page: 1 })
  }
}

// ---------------------------------------------------------------------------
// Filter state — slot-scoped and v-model friendly
// ---------------------------------------------------------------------------

/**
 * Reactive mirror of `query.filters` handed to the `filters` slot. Slot
 * inputs bind with `v-model="filters.<key>"`; writes flow out as one
 * `update:query` emit. External query changes sync in (diffed, so the emit
 * echo does not loop). Values are intentionally `any` so any input
 * component's model can bind here — the matchers above constrain the
 * supported shapes at runtime.
 */
const filterState = reactive<Record<string, any>>({ ...query.value.filters })

/**
 * Snapshot of the filters last emitted by the mutation watcher below. The
 * import watcher compares incoming query filters against it and skips
 * matching echoes — a search- or page-only `update:query` changes the query
 * object identity, which alone re-runs the deep import watcher; without
 * this guard it would resurrect filter keys deleted in the same tick
 * (before the deletion's own emit round-trips through the parent).
 */
let lastEmittedFilters: Record<string, any> | null = null

function filtersMatch(a: Record<string, any>, b: Record<string, any>): boolean {
  const keys = Object.keys(a)
  if (keys.length !== Object.keys(b).length) return false
  return keys.every((key) => a[key] === b[key])
}

// The import watcher runs after the parent re-renders (`flush: 'post'`): a
// `defineModel` prop only reflects an emitted value once the parent has
// re-rendered, so a pre-flush import would read the stale previous filters
// and resurrect keys deleted in the same tick. The snapshot guard then skips
// echoes of our own emits.
watch(
  () => query.value.filters,
  (next) => {
    if (lastEmittedFilters && filtersMatch(next, lastEmittedFilters)) return
    for (const key of Object.keys(filterState)) {
      if (!(key in next)) delete filterState[key]
    }
    for (const [key, value] of Object.entries(next)) {
      if (filterState[key] !== value) filterState[key] = value
    }
  },
  { deep: true, flush: 'post' },
)

watch(
  filterState,
  () => {
    // Filter edits return to the first page, like every other query change.
    lastEmittedFilters = { ...filterState }
    updateQuery({ page: 1, filters: { ...filterState } })
  },
  { deep: true },
)

/** Clear every filter entry and the search term. */
function resetFilters(): void {
  for (const key of Object.keys(filterState)) delete filterState[key]
  if (query.value.search) updateQuery({ search: '', page: 1 })
}

function isEmptyFilter(value: DataTableFilterValue | undefined): boolean {
  if (value === null || value === undefined || value === '') return true
  if (Array.isArray(value)) return value.length === 0
  return false
}

const activeFilterCount = computed(
  () => Object.values(filterState).filter((value) => !isEmptyFilter(value)).length,
)

const filterPanelOpen = ref(false)

// ---------------------------------------------------------------------------
// Client mode pipeline: search → filter → sort → paginate
// ---------------------------------------------------------------------------

function displayValue(row: DataTableRow, column: DataTableColumn, index: number): string {
  const raw = row[column.key]
  const value = column.formatter ? column.formatter(raw, row, column, index) : raw
  return value === null || value === undefined ? '' : String(value)
}

/** Range bound of a `<key>_from` / `<key>_to` filter entry. */
function rangeBound(value: DataTableFilterValue | undefined): string | undefined {
  if (value === null || value === undefined || value === '' || Array.isArray(value) || typeof value === 'boolean') {
    return undefined
  }
  return String(value)
}

/**
 * Client-mode filter evaluation. Values match by shape: strings contain,
 * arrays match membership, anything else compares equal; `<key>_from` /
 * `<key>_to` entries bound a range on `<key>`. Keys without a matching
 * column are ignored — use them for page- or server-side filtering.
 */
function rowPassesFilters(row: DataTableRow): boolean {
  for (const [key, value] of Object.entries(filterState)) {
    if (isEmptyFilter(value)) continue

    if (key.endsWith('_from') || key.endsWith('_to')) {
      const column = key.endsWith('_from') ? key.slice(0, -5) : key.slice(0, -3)
      const from = rangeBound(key.endsWith('_from') ? value : filterState[`${column}_from`])
      const to = rangeBound(key.endsWith('_to') ? value : filterState[`${column}_to`])
      if (!cellInRange(row[column], from, to)) return false
      continue
    }

    if (!(key in row)) continue
    const cell = row[key]
    const actual = cell === null || cell === undefined ? '' : String(cell).toLowerCase()
    if (Array.isArray(value)) {
      if (!value.some((item) => actual === String(item).toLowerCase())) return false
    } else if (!actual.includes(String(value).toLowerCase())) {
      return false
    }
  }
  return true
}

const clientFiltered = computed<DataTableRow[]>(() => {
  if (!isClient.value) return props.rows
  const term = query.value.search.trim().toLowerCase()
  return props.rows.filter((row) => {
    const matchesSearch =
      !term || props.columns.some((column) => displayValue(row, column, 0).toLowerCase().includes(term))
    return matchesSearch && rowPassesFilters(row)
  })
})

const clientSorted = computed<DataTableRow[]>(() => {
  if (!isClient.value || !query.value.sort.key) return clientFiltered.value
  const column = props.columns.find((item) => item.key === query.value.sort.key)
  if (!column) return clientFiltered.value
  const direction = query.value.sort.direction
  const rows = [...clientFiltered.value]
  rows.sort((a, b) => {
    if (column.sorter) return column.sorter(a, b, direction)
    const result = compareCellValues(a[column.key], b[column.key])
    return direction === 'asc' ? result : -result
  })
  return rows
})

const displayRows = computed<DataTableRow[]>(() => {
  if (!isClient.value) return props.rows
  const start = (query.value.page - 1) * query.value.perPage
  return clientSorted.value.slice(start, start + query.value.perPage)
})

const totalCount = computed(() => (isClient.value ? clientFiltered.value.length : props.total))
const lastPage = computed(() =>
  Math.max(1, Math.ceil(totalCount.value / Math.max(1, query.value.perPage))),
)

const rangeFrom = computed(() => {
  if (!isClient.value && props.from !== null) return props.from
  return displayRows.value.length ? (query.value.page - 1) * query.value.perPage + 1 : null
})

const rangeTo = computed(() => {
  if (!isClient.value && props.to !== null) return props.to
  return displayRows.value.length
    ? (query.value.page - 1) * query.value.perPage + displayRows.value.length
    : null
})

// Keep client mode on a valid page when result sets shrink.
watch(lastPage, (max) => {
  if (isClient.value && query.value.page > max) updateQuery({ page: max })
})

// ---------------------------------------------------------------------------
// Row selection
// ---------------------------------------------------------------------------

function keyFor(row: DataTableRow, index: number): string | number {
  if (typeof props.rowKey === 'function') return props.rowKey(row, index)
  const value = row[props.rowKey]
  return value === null || value === undefined ? index : (value as string | number)
}

const pageKeys = computed(() => displayRows.value.map((row, index) => keyFor(row, index)))
const allSelected = computed(
  () => pageKeys.value.length > 0 && pageKeys.value.every((key) => selected.value.includes(key)),
)
const someSelected = computed(() => selected.value.length > 0 && !allSelected.value)

function toggleRow(row: DataTableRow, index: number): void {
  const key = keyFor(row, index)
  selected.value = selected.value.includes(key)
    ? selected.value.filter((item) => item !== key)
    : [...selected.value, key]
}

function toggleAll(): void {
  const next = allSelected.value ? [] : pageKeys.value
  selected.value = next
  emit('select-all', next)
}

// ---------------------------------------------------------------------------
// Presentation helpers
// ---------------------------------------------------------------------------

const pageSizeOptions = computed(() => {
  const sizes = props.pageSizes.includes(query.value.perPage)
    ? props.pageSizes
    : [...props.pageSizes, query.value.perPage].sort((a, b) => a - b)
  return sizes.map((size) => ({ label: String(size), value: size }))
})

const tableClass = computed(() =>
  cn('table', modifier('table', props.size, SIZES), { 'table-zebra': props.zebra }),
)

function alignClass(align?: string): Record<string, boolean> {
  return {
    'text-start': align === 'start',
    'text-center': align === 'center',
    'text-end': align === 'end',
  }
}

function ariaSort(column: DataTableColumn): 'ascending' | 'descending' | 'none' | undefined {
  if (!column.sortable) return undefined
  if (query.value.sort.key !== column.key) return 'none'
  return query.value.sort.direction === 'asc' ? 'ascending' : 'descending'
}
</script>

<template>
  <section :aria-label="ariaLabel" class="w-full space-y-3">
    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-2">
      <slot name="toolbar" />
      <div v-if="searchable || hasFilters" class="ms-auto flex flex-wrap items-center gap-2">
        <DzInput
          v-if="searchable"
          :model-value="query.search"
          size="sm"
          :placeholder="searchPlaceholder"
          :aria-label="searchPlaceholder"
          clearable
          class="w-full sm:w-56"
          @update:model-value="onSearchInput"
        >
          <template #prefix>
            <Search class="size-4 shrink-0 opacity-50" aria-hidden="true" />
          </template>
        </DzInput>
        <DzButton
          v-if="hasFilters"
          size="sm"
          :variant="filterPanelOpen ? 'soft' : 'outline'"
          :aria-expanded="filterPanelOpen"
          :aria-controls="`dz-table-filters-${uid}`"
          @click="filterPanelOpen = !filterPanelOpen"
        >
          <template #icon>
            <Funnel class="size-4" aria-hidden="true" />
          </template>
          Filters
          <span v-if="activeFilterCount" class="badge badge-sm ms-1">{{ activeFilterCount }}</span>
        </DzButton>
      </div>
    </div>

    <!-- Error state -->
    <div v-if="error" role="alert" class="alert alert-error alert-soft items-center text-sm">
      <TriangleAlert class="size-4 shrink-0" aria-hidden="true" />
      <span class="grow">{{ error }}</span>
      <DzButton size="xs" variant="outline" color="error" @click="emit('retry')">
        <template #icon>
          <RotateCcw class="size-3.5" aria-hidden="true" />
        </template>
        Retry
      </DzButton>
    </div>

    <!-- Filter panel: any input, bound with v-model to filter entries -->
    <div
      v-if="filterPanelOpen && hasFilters"
      :id="`dz-table-filters-${uid}`"
      class="rounded-box border border-base-300 bg-base-200/40 p-3 sm:p-4"
    >
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <slot name="filters" :filters="filterState" :reset-filters="resetFilters" />
      </div>
      <div class="mt-3 flex justify-end">
        <DzButton size="sm" variant="ghost" @click="resetFilters">
          <template #icon>
            <RotateCcw class="size-4" aria-hidden="true" />
          </template>
          Reset filters
        </DzButton>
      </div>
    </div>

    <!-- Bulk selection bar -->
    <div
      v-if="selectable && selected.length"
      class="flex flex-wrap items-center gap-2 rounded-box bg-primary/10 px-3 py-2 text-sm"
    >
      <slot name="bulk-actions" :selected="selected" :count="selected.length">
        <span class="font-medium">{{ selected.length }} selected</span>
      </slot>
    </div>

    <!-- Table -->
    <div class="w-full overflow-x-auto rounded-box border border-base-300">
      <table :class="tableClass" :aria-label="ariaLabel">
        <thead>
          <tr>
            <th v-if="selectable" class="w-12">
              <input
                type="checkbox"
                class="checkbox checkbox-sm"
                :checked="allSelected"
                :indeterminate="someSelected"
                aria-label="Select all rows"
                @change="toggleAll"
              />
            </th>
            <th
              v-for="column in visibleColumns"
              :key="column.key"
              scope="col"
              :class="[
                alignClass(column.align),
                column.headerClass,
                { 'cursor-pointer select-none': column.sortable },
              ]"
              :style="column.width ? { width: column.width } : undefined"
              :aria-sort="ariaSort(column)"
              :tabindex="column.sortable ? 0 : undefined"
              @click="toggleSort(column)"
              @keydown.enter.prevent="toggleSort(column)"
              @keydown.space.prevent="toggleSort(column)"
            >
              <span class="inline-flex items-center gap-1.5">
                <slot :name="`header-${column.key}`" :column="column">
                  {{ column.label ?? column.key }}
                </slot>
                <template v-if="column.sortable">
                  <ArrowUp
                    v-if="query.sort.key === column.key && query.sort.direction === 'asc'"
                    class="size-3.5"
                    aria-hidden="true"
                  />
                  <ArrowDown v-else-if="query.sort.key === column.key" class="size-3.5" aria-hidden="true" />
                  <ArrowUpDown v-else class="size-3.5 opacity-40" aria-hidden="true" />
                </template>
              </span>
            </th>
            <th v-if="hasActions" scope="col" class="text-end">{{ actionsLabel }}</th>
          </tr>
        </thead>

        <tbody>
          <!-- Loading skeleton -->
          <template v-if="loading">
            <tr v-for="line in loadingRows" :key="`skeleton-${line}`">
              <td v-if="selectable" class="py-3">
                <DzSkeleton class="size-4" />
              </td>
              <td v-for="column in visibleColumns" :key="column.key" class="py-3">
                <DzSkeleton class="h-4" :width="line % 3 === 2 ? '50%' : '75%'" />
              </td>
              <td v-if="hasActions" class="py-3 text-end">
                <DzSkeleton class="h-4 w-16" />
              </td>
            </tr>
          </template>

          <!-- Rows -->
          <template v-else-if="displayRows.length">
            <tr
              v-for="(row, index) in displayRows"
              :key="keyFor(row, index)"
              :class="{ 'bg-base-200/60': selectable && selected.includes(keyFor(row, index)) }"
              @click="emit('row-click', { row, index })"
            >
              <td v-if="selectable" @click.stop>
                <input
                  type="checkbox"
                  class="checkbox checkbox-sm"
                  :checked="selected.includes(keyFor(row, index))"
                  :aria-label="`Select row ${index + 1}`"
                  @change="toggleRow(row, index)"
                />
              </td>
              <td
                v-for="column in visibleColumns"
                :key="column.key"
                :class="[alignClass(column.align), column.class]"
              >
                <slot
                  :name="`cell-${column.key}`"
                  :row="row"
                  :column="column"
                  :value="row[column.key]"
                  :index="index"
                >
                  {{ displayValue(row, column, index) }}
                </slot>
              </td>
              <td v-if="hasActions" class="text-end" @click.stop>
                <div class="inline-flex items-center gap-1">
                  <slot name="actions" :row="row" :index="index" />
                </div>
              </td>
            </tr>
          </template>

          <!-- Empty state -->
          <tr v-else>
            <td :colspan="columnCount" class="py-10 text-center">
              <slot name="empty" :search="query.search" :filters="filterState">
                <div class="flex flex-col items-center gap-2">
                  <Inbox class="size-8 opacity-40" aria-hidden="true" />
                  <span class="text-sm opacity-70">{{ emptyText }}</span>
                </div>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer: range summary, page size and pagination -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-sm text-base-content/60" aria-live="polite">
        <template v-if="rangeFrom !== null && totalCount > 0">
          Showing <span class="font-medium text-base-content">{{ rangeFrom }}–{{ rangeTo }}</span>
          of <span class="font-medium text-base-content">{{ totalCount }}</span>
        </template>
        <template v-else>No results</template>
      </p>
      <div class="flex flex-wrap items-center justify-between gap-2 sm:justify-end">
        <label class="flex items-center gap-2 text-sm text-base-content/60">
          <span class="hidden sm:inline">Per page</span>
          <span class="sm:hidden">Rows</span>
          <DzSelect
            :model-value="query.perPage"
            :options="pageSizeOptions"
            size="xs"
            aria-label="Rows per page"
            @update:model-value="onPerPageChange"
          />
        </label>
        <DzPagination v-model="page" :total-pages="lastPage" :total="0" size="sm" />
      </div>
    </div>
  </section>
</template>
