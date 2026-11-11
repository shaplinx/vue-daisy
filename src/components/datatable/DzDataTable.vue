<script setup lang="ts">
/**
 * DzDataTable — a configurable, data-source agnostic table.
 *
 * The component never fetches. Rows and pagination metadata arrive as props;
 * user interactions leave as `update:*` events that the owning page routes
 * to its data layer (see `useDataTable` + `src/services/api.ts`). In
 * `mode="client"` the table applies search, column filters, sorting and
 * pagination locally over the `rows` prop.
 *
 * All query state (`page`, `perPage`, `search`, `sort`, `filters`,
 * `selected`) is a two-way model: bind it for server mode and handle the
 * `update:*` events, or leave it unbound for self-managed client mode.
 */
import { computed, ref, useId, useSlots, watch } from 'vue'
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
import type { DataTableFilterValue, DataTableFilters, DataTableSortState } from '@/services/api'

export type DataTableRow = Record<string, unknown>

export interface DataTableColumnFilter {
  /** Input kind rendered in the filter panel. */
  type: 'text' | 'select' | 'date-range'
  /** Options for select filters. */
  options?: Array<{ label: string; value: string | number }>
  /** Placeholder for text filters; label of a select's "no filter" option. */
  placeholder?: string
}

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
  /** Column filter config; `true` is shorthand for a text filter. */
  filter?: boolean | DataTableColumnFilter
}

type SelectChangeValue = string | number | Array<string | number>

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
  /** Render the filter panel for columns that declare a filter. */
  filterable: { type: Boolean, default: true },
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

const page = defineModel<number>('page', { default: 1 })
const perPage = defineModel<number>('perPage', { default: 10 })
const search = defineModel<string>('search', { default: '' })
const sort = defineModel<DataTableSortState>('sort', { default: () => ({ key: null, direction: 'asc' as const }) })
const filters = defineModel<DataTableFilters>('filters', { default: () => ({}) })
const selected = defineModel<Array<string | number>>('selected', { default: () => [] })

const slots = useSlots()
const uid = useId()

const hasActions = computed(() => Boolean(slots.actions))
const isClient = computed(() => props.mode === 'client')
const visibleColumns = computed(() => props.columns.filter((column) => !column.hidden))

function normalizeFilter(column: DataTableColumn): DataTableColumnFilter {
  return typeof column.filter === 'object' ? column.filter : { type: 'text', placeholder: 'Filter' }
}

const filterableColumns = computed(() =>
  props.filterable
    ? props.columns
        .filter((column) => !column.hidden && column.filter)
        .map((column) => ({ column, config: normalizeFilter(column) }))
    : [],
)

const columnCount = computed(
  () => visibleColumns.value.length + (props.selectable ? 1 : 0) + (hasActions.value ? 1 : 0),
)

// ---------------------------------------------------------------------------
// Client mode pipeline: search → filter → sort → paginate
// ---------------------------------------------------------------------------

function displayValue(row: DataTableRow, column: DataTableColumn, index: number): string {
  const raw = row[column.key]
  const value = column.formatter ? column.formatter(raw, row, column, index) : raw
  return value === null || value === undefined ? '' : String(value)
}

function filterValue(column: DataTableColumn): DataTableFilterValue | undefined {
  return filters.value[column.key]
}

function isEmptyFilter(value: DataTableFilterValue | undefined): boolean {
  if (value === null || value === undefined || value === '') return true
  if (typeof value === 'object') return !value.from && !value.to
  return false
}

function rowMatchesFilter(row: DataTableRow, column: DataTableColumn, config: DataTableColumnFilter): boolean {
  const value = filterValue(column)
  if (isEmptyFilter(value)) return true
  const cell = row[column.key]

  if (value !== null && typeof value === 'object') {
    return cellInRange(cell, value.from, value.to)
  }

  const expected = String(value).toLowerCase()
  const actual = cell === null || cell === undefined ? '' : String(cell).toLowerCase()
  return config.type === 'select' ? actual === expected : actual.includes(expected)
}

const clientFiltered = computed<DataTableRow[]>(() => {
  if (!isClient.value) return props.rows
  const term = search.value.trim().toLowerCase()
  return props.rows.filter((row) => {
    const matchesSearch =
      !term || props.columns.some((column) => displayValue(row, column, 0).toLowerCase().includes(term))
    return (
      matchesSearch &&
      filterableColumns.value.every(({ column, config }) => rowMatchesFilter(row, column, config))
    )
  })
})

const clientSorted = computed<DataTableRow[]>(() => {
  if (!isClient.value || !sort.value.key) return clientFiltered.value
  const column = props.columns.find((item) => item.key === sort.value.key)
  if (!column) return clientFiltered.value
  const direction = sort.value.direction
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
  const start = (page.value - 1) * perPage.value
  return clientSorted.value.slice(start, start + perPage.value)
})

const totalCount = computed(() => (isClient.value ? clientFiltered.value.length : props.total))
const lastPage = computed(() => Math.max(1, Math.ceil(totalCount.value / Math.max(1, perPage.value))))

const rangeFrom = computed(() => {
  if (!isClient.value && props.from !== null) return props.from
  return displayRows.value.length ? (page.value - 1) * perPage.value + 1 : null
})

const rangeTo = computed(() => {
  if (!isClient.value && props.to !== null) return props.to
  return displayRows.value.length ? (page.value - 1) * perPage.value + displayRows.value.length : null
})

// Keep client mode on a valid page when result sets shrink.
watch(lastPage, (max) => {
  if (isClient.value && page.value > max) page.value = max
})

// ---------------------------------------------------------------------------
// Interactions — every mutation is a `update:*` emit routed by the owner
// ---------------------------------------------------------------------------

function toggleSort(column: DataTableColumn): void {
  if (!column.sortable) return
  let next: DataTableSortState
  if (sort.value.key !== column.key) next = { key: column.key, direction: 'asc' }
  else if (sort.value.direction === 'asc') next = { key: column.key, direction: 'desc' }
  else next = { key: null, direction: 'asc' }
  sort.value = next
  page.value = 1
}

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
// Toolbar, filter panel and footer wiring
// ---------------------------------------------------------------------------

function onSearchInput(value: string | number): void {
  search.value = String(value)
}

const filterPanelOpen = ref(false)
const activeFilterCount = computed(
  () => filterableColumns.value.filter(({ column }) => !isEmptyFilter(filterValue(column))).length,
)

function textFilterValue(column: DataTableColumn): string {
  const value = filterValue(column)
  return typeof value === 'string' || typeof value === 'number' ? String(value) : ''
}

function selectFilterValue(column: DataTableColumn): string | number {
  const value = filterValue(column)
  return typeof value === 'string' || typeof value === 'number' ? value : ''
}

function rangeFilterBound(column: DataTableColumn, bound: 'from' | 'to'): string {
  const value = filterValue(column)
  if (value && typeof value === 'object') return value[bound] ?? ''
  return ''
}

function setFilterValue(column: DataTableColumn, value: DataTableFilterValue): void {
  filters.value = { ...filters.value, [column.key]: value }
}

function onTextFilterInput(column: DataTableColumn, value: string | number): void {
  setFilterValue(column, String(value))
}

function onSelectFilterChange(column: DataTableColumn, value: SelectChangeValue): void {
  setFilterValue(column, Array.isArray(value) ? String(value[0] ?? '') : value)
}

function onRangeFilterInput(column: DataTableColumn, bound: 'from' | 'to', value: string | number): void {
  const current = filterValue(column)
  const range = current && typeof current === 'object' ? { ...current } : {}
  range[bound] = String(value)
  setFilterValue(column, range)
}

function selectFilterOptions(config: DataTableColumnFilter): Array<{ label: string; value: string | number }> {
  return [{ label: config.placeholder ?? 'All', value: '' }, ...(config.options ?? [])]
}

function resetFilters(): void {
  filters.value = {}
  if (search.value) search.value = ''
  page.value = 1
}

const pageSizeOptions = computed(() => {
  const sizes = props.pageSizes.includes(perPage.value)
    ? props.pageSizes
    : [...props.pageSizes, perPage.value].sort((a, b) => a - b)
  return sizes.map((size) => ({ label: String(size), value: size }))
})

function onPerPageChange(value: SelectChangeValue): void {
  const next = Number(Array.isArray(value) ? value[0] : value)
  if (Number.isFinite(next) && next > 0 && next !== perPage.value) {
    perPage.value = next
    page.value = 1
  }
}

// ---------------------------------------------------------------------------
// Presentation helpers
// ---------------------------------------------------------------------------

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
  if (sort.value.key !== column.key) return 'none'
  return sort.value.direction === 'asc' ? 'ascending' : 'descending'
}
</script>

<template>
  <section :aria-label="ariaLabel" class="w-full space-y-3">
    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-2">
      <slot name="toolbar" />
      <div v-if="searchable || filterableColumns.length" class="ms-auto flex flex-wrap items-center gap-2">
        <DzInput
          v-if="searchable"
          :model-value="search"
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
          v-if="filterableColumns.length"
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

    <!-- Filter panel -->
    <div
      v-if="filterPanelOpen && filterableColumns.length"
      :id="`dz-table-filters-${uid}`"
      class="rounded-box border border-base-300 bg-base-200/40 p-3 sm:p-4"
    >
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <template v-for="{ column, config } in filterableColumns" :key="column.key">
          <div class="flex flex-col gap-1">
            <span class="text-xs font-medium text-base-content/70">{{ column.label ?? column.key }}</span>

            <DzInput
              v-if="config.type === 'text'"
              :model-value="textFilterValue(column)"
              size="sm"
              :placeholder="config.placeholder ?? 'Filter'"
              :aria-label="`Filter by ${column.label ?? column.key}`"
              clearable
              @update:model-value="(value: string | number) => onTextFilterInput(column, value)"
            />

            <DzSelect
              v-else-if="config.type === 'select'"
              :model-value="selectFilterValue(column)"
              :options="selectFilterOptions(config)"
              size="sm"
              :aria-label="`Filter by ${column.label ?? column.key}`"
              @update:model-value="(value: SelectChangeValue) => onSelectFilterChange(column, value)"
            />

            <div v-else class="grid grid-cols-2 gap-2">
              <DzInput
                type="date"
                :model-value="rangeFilterBound(column, 'from')"
                size="sm"
                :aria-label="`${column.label ?? column.key} from`"
                @update:model-value="(value: string | number) => onRangeFilterInput(column, 'from', value)"
              />
              <DzInput
                type="date"
                :model-value="rangeFilterBound(column, 'to')"
                size="sm"
                :aria-label="`${column.label ?? column.key} to`"
                @update:model-value="(value: string | number) => onRangeFilterInput(column, 'to', value)"
              />
            </div>
          </div>
        </template>
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
                    v-if="sort.key === column.key && sort.direction === 'asc'"
                    class="size-3.5"
                    aria-hidden="true"
                  />
                  <ArrowDown v-else-if="sort.key === column.key" class="size-3.5" aria-hidden="true" />
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
              <slot name="empty" :search="search" :filters="filters">
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
            :model-value="perPage"
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
