<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'
import type { PropType } from 'vue'
import { ArrowDown, ArrowUp, ArrowUpDown, LoaderCircle } from '@lucide/vue'
import { cn } from '@/utils/cn'
import { modifier, SIZES } from '@/utils/daisy'

export interface TableRow {
  [key: string]: unknown
}

export interface TableColumn {
  key: string
  label?: string
  align?: 'start' | 'center' | 'end'
  sortable?: boolean
  width?: string
  headerClass?: string
  class?: string
  sorter?: (a: TableRow, b: TableRow, direction: 'asc' | 'desc') => number
  formatter?: (value: unknown, row: TableRow, column: TableColumn, index: number) => unknown
}

export type TableSortDirection = 'asc' | 'desc'

type RowKey = string | ((row: TableRow, index: number) => string | number)

const props = defineProps({
  columns: { type: Array as PropType<TableColumn[]>, default: () => [] },
  rows: { type: Array as PropType<TableRow[]>, default: () => [] },
  rowKey: { type: [String, Function] as PropType<RowKey>, default: 'id' },
  caption: { type: String, default: '' },
  zebra: { type: Boolean, default: false },
  hover: { type: Boolean, default: true },
  compact: { type: Boolean, default: false },
  pinRows: { type: Boolean, default: false },
  pinCols: { type: Boolean, default: false },
  size: { type: String, default: 'md' },
  loading: { type: Boolean, default: false },
  loadingRows: { type: Number, default: 5 },
  emptyText: { type: String, default: 'No records found' },
  selectable: { type: Boolean, default: false },
  selected: { type: Array as PropType<Array<string | number>>, default: () => [] },
  clientSort: { type: Boolean, default: true },
  ariaLabel: { type: String, default: 'Data table' },
})

const emit = defineEmits<{
  'update:selected': [value: Array<string | number>]
  'row-click': [payload: { row: TableRow; index: number }]
  'sort-change': [payload: { key: string; direction: TableSortDirection }]
  'select-all': [value: Array<string | number>]
}>()

const uid = useId()
const sortKey = ref('')
const sortDirection = ref<TableSortDirection>('asc')

const tableClass = computed(() =>
  cn('table', modifier('table', props.size, SIZES), {
    'table-zebra': props.zebra,
    'table-pin-rows': props.pinRows,
    'table-pin-cols': props.pinCols,
    'table-sm': props.compact,
  }),
)

const sortedRows = computed<TableRow[]>(() => {
  if (!props.clientSort || !sortKey.value) return props.rows
  const column = props.columns.find((item) => item.key === sortKey.value)
  const rows = [...props.rows]
  rows.sort((a, b) => {
    if (column?.sorter) return column.sorter(a, b, sortDirection.value)
    const av = a[sortKey.value]
    const bv = b[sortKey.value]
    if (av == null && bv == null) return 0
    if (av == null) return 1
    if (bv == null) return -1
    if (typeof av === 'number' && typeof bv === 'number') return av - bv
    return String(av).localeCompare(String(bv), undefined, { numeric: true, sensitivity: 'base' })
  })
  return sortDirection.value === 'desc' ? rows.reverse() : rows
})

const allSelected = computed(
  () => props.rows.length > 0 && props.rows.every((row) => props.selected.includes(keyFor(row))),
)

const someSelected = computed(
  () => props.selected.length > 0 && !allSelected.value,
)

function keyFor(row: TableRow, index = 0): string | number {
  if (typeof props.rowKey === 'function') return props.rowKey(row, index)
  const value = row[props.rowKey]
  return value === undefined || value === null ? index : (value as string | number)
}

function isSelected(row: TableRow, index: number): boolean {
  return props.selected.includes(keyFor(row, index))
}

function toggleRow(row: TableRow, index: number): void {
  const key = keyFor(row, index)
  const next = props.selected.includes(key)
    ? props.selected.filter((value) => value !== key)
    : [...props.selected, key]
  emit('update:selected', next)
}

function toggleAll(): void {
  const next = allSelected.value ? [] : props.rows.map((row, index) => keyFor(row, index))
  emit('update:selected', next)
  emit('select-all', next)
}

function toggleSort(column: TableColumn): void {
  if (!column.sortable) return
  if (sortKey.value !== column.key) {
    sortKey.value = column.key
    sortDirection.value = 'asc'
  } else {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  }
  emit('sort-change', { key: sortKey.value, direction: sortDirection.value })
}

function alignClass(align?: string): Record<string, boolean> {
  return {
    'text-start': align === 'start',
    'text-center': align === 'center',
    'text-end': align === 'end',
  }
}

function cellValue(row: TableRow, column: TableColumn, index: number): unknown {
  if (column.formatter) return column.formatter(row[column.key], row, column, index)
  return row[column.key]
}

watch(
  () => props.rows,
  () => {
    sortKey.value = ''
    sortDirection.value = 'asc'
  },
)
</script>

<template>
  <div class="w-full overflow-x-auto rounded-box">
    <table :class="tableClass" :aria-label="ariaLabel">
      <caption v-if="caption" class="pb-2 text-start text-sm opacity-70">
        {{ caption }}
      </caption>
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
            v-for="column in columns"
            :key="column.key"
            scope="col"
            :class="[alignClass(column.align), column.headerClass, { 'cursor-pointer select-none': column.sortable }]"
            :style="column.width ? { width: column.width } : undefined"
            :aria-sort="sortKey === column.key ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined"
            @click="toggleSort(column)"
            @keydown.enter.prevent="toggleSort(column)"
            @keydown.space.prevent="toggleSort(column)"
            :tabindex="column.sortable ? 0 : undefined"
          >
            <span class="inline-flex items-center gap-1.5">
              <slot :name="`header-${column.key}`" :column="column">
                {{ column.label }}
              </slot>
              <template v-if="column.sortable">
                <ArrowUp v-if="sortKey === column.key && sortDirection === 'asc'" class="size-3.5" aria-hidden="true" />
                <ArrowDown v-else-if="sortKey === column.key && sortDirection === 'desc'" class="size-3.5" aria-hidden="true" />
                <ArrowUpDown v-else class="size-3.5 opacity-40" aria-hidden="true" />
              </template>
            </span>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="loading">
          <td :colspan="columns.length + (selectable ? 1 : 0)" class="py-6 text-center">
            <LoaderCircle class="mx-auto size-6 animate-spin opacity-60" aria-label="Loading" />
          </td>
        </tr>
        <template v-else-if="sortedRows.length">
          <tr
            v-for="(row, index) in sortedRows"
            :key="keyFor(row, index)"
            :class="{ 'bg-base-200/60': isSelected(row, index) }"
            @click="emit('row-click', { row, index })"
          >
            <td v-if="selectable" @click.stop>
              <input
                type="checkbox"
                class="checkbox checkbox-sm"
                :checked="isSelected(row, index)"
                :aria-label="`Select row ${index + 1}`"
                @change="toggleRow(row, index)"
              />
            </td>
            <td
              v-for="column in columns"
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
                <slot
                  name="cell"
                  :row="row"
                  :column="column"
                  :value="row[column.key]"
                  :index="index"
                >
                  {{ cellValue(row, column, index) }}
                </slot>
              </slot>
            </td>
          </tr>
        </template>
        <tr v-else>
          <td :colspan="columns.length + (selectable ? 1 : 0)" class="py-10 text-center">
            <slot name="empty">
              <span class="text-sm opacity-60">{{ emptyText }}</span>
            </slot>
          </td>
        </tr>
      </tbody>

      <tfoot v-if="$slots.footer">
        <tr>
          <td :colspan="columns.length + (selectable ? 1 : 0)">
            <slot name="footer" />
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>
