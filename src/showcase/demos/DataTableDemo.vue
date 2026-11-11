<script setup lang="ts">
import { ref } from 'vue'
import DzDataTable from '@/components/datatable/DzDataTable.vue'
import type { DataTableColumn } from '@/components/datatable/DzDataTable.vue'
import type { DataTableQuery } from '@/services/api'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()

const columns: DataTableColumn[] = [
  { key: 'name', label: 'Account', sortable: true },
  { key: 'region', label: 'Region', sortable: true },
  { key: 'plan', label: 'Plan', sortable: true, align: 'center' },
  { key: 'revenue', label: 'Revenue', sortable: true, align: 'end' },
  { key: 'since', label: 'Since', sortable: true, align: 'end' },
]

type Account = {
  id: number
  name: string
  region: string
  plan: string
  revenue: number
  active: boolean
  since: string
}

const accounts: Account[] = [
  { id: 1, name: 'Northwind Traders', region: 'EMEA', plan: 'growth', revenue: 12480, active: true, since: '2024-01-12' },
  { id: 2, name: 'Aperture Labs', region: 'AMER', plan: 'starter', revenue: 4310, active: true, since: '2024-02-03' },
  { id: 3, name: 'Globex Corp', region: 'APAC', plan: 'scale', revenue: 18750, active: false, since: '2023-11-18' },
  { id: 4, name: 'Initech', region: 'AMER', plan: 'starter', revenue: 980, active: true, since: '2024-04-02' },
  { id: 5, name: 'Umbrella Films', region: 'EMEA', plan: 'growth', revenue: 26700, active: true, since: '2023-08-30' },
  { id: 6, name: 'Stark Industries', region: 'AMER', plan: 'scale', revenue: 51200, active: true, since: '2022-05-15' },
  { id: 7, name: 'Acme Freight', region: 'APAC', plan: 'starter', revenue: 3400, active: false, since: '2024-03-07' },
  { id: 8, name: 'Wonka Industries', region: 'EMEA', plan: 'scale', revenue: 22600, active: true, since: '2023-01-24' },
  { id: 9, name: 'Cyberdyne Systems', region: 'AMER', plan: 'growth', revenue: 14900, active: true, since: '2024-06-19' },
  { id: 10, name: 'Soylent Corp', region: 'APAC', plan: 'growth', revenue: 8200, active: false, since: '2023-10-05' },
  { id: 11, name: 'Tyrell Corp', region: 'EMEA', plan: 'starter', revenue: 2100, active: true, since: '2024-07-28' },
  { id: 12, name: 'Massive Dynamic', region: 'AMER', plan: 'scale', revenue: 39400, active: true, since: '2022-12-09' },
]

const planFilterOptions = [
  { label: 'All plans', value: '' },
  { label: 'Starter', value: 'starter' },
  { label: 'Growth', value: 'growth' },
  { label: 'Scale', value: 'scale' },
]

const regionOptions = [
  { label: 'AMER', value: 'AMER' },
  { label: 'EMEA', value: 'EMEA' },
  { label: 'APAC', value: 'APAC' },
]

/**
 * The joined query model: every search, filter, sort and page change lands
 * here as one object. Bind it with `v-model:query` — or leave it unbound and
 * the table manages its own state.
 */
const query = ref<DataTableQuery>({
  page: 1,
  perPage: 5,
  search: '',
  sort: { key: null, direction: 'asc' },
  filters: {},
})

const selected = ref<Array<string | number>>([])
const serverQuery = ref<DataTableQuery>({
  page: 1,
  perPage: 5,
  search: '',
  sort: { key: null, direction: 'asc' },
  filters: {},
})

function formatCurrency(value: unknown): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0))
}

function planBadgeColor(value: unknown): string {
  const colors: Record<string, string> = { starter: 'neutral', growth: 'primary', scale: 'success' }
  return typeof value === 'string' && colors[value] ? colors[value] : 'ghost'
}

/** Checked → filter to active accounts; unchecked → remove the filter. */
function onActiveToggle(value: boolean | Array<string | number | boolean>): void {
  const active = Array.isArray(value) ? value.length > 0 : Boolean(value)
  if (active) query.value.filters.active = true
  else delete query.value.filters.active
}
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-3">
    <DzDataTable
      v-model:query="query"
      v-model:selected="selected"
      :columns="columns"
      :rows="accounts"
      selectable
      zebra
      :page-sizes="[5, 10, 20]"
      search-placeholder="Search accounts…"
      empty-text="No accounts match your search or filters"
      aria-label="Accounts"
    >
      <!-- Any input works here — each binds to one filter key with v-model -->
      <template #filters="{ filters }">
        <div class="flex flex-col gap-1">
          <span class="text-xs font-medium text-base-content/70">Plan</span>
          <DzSelect v-model="filters.plan" :options="planFilterOptions" size="sm" aria-label="Filter by plan" />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs font-medium text-base-content/70">Regions</span>
          <DzSelect
            v-model="filters.region"
            :options="regionOptions"
            size="sm"
            multiple
            aria-label="Filter by region"
          />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs font-medium text-base-content/70">Revenue</span>
          <div class="grid grid-cols-2 gap-2">
            <DzInput
              v-model="filters.revenue_from"
              type="number"
              min="0"
              size="sm"
              placeholder="From"
              aria-label="Revenue from"
            />
            <DzInput
              v-model="filters.revenue_to"
              type="number"
              min="0"
              size="sm"
              placeholder="To"
              aria-label="Revenue to"
            />
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs font-medium text-base-content/70">Status</span>
          <DzCheckbox
            :model-value="filters.active === true"
            label="Active only"
            @update:model-value="onActiveToggle"
          />
        </div>
      </template>

      <template #cell-plan="{ value }">
        <DzBadge :color="planBadgeColor(value)" size="sm" variant="soft" class="capitalize">{{ value }}</DzBadge>
      </template>

      <template #cell-revenue="{ value }">
        <span class="font-medium tabular-nums">{{ formatCurrency(value) }}</span>
      </template>
    </DzDataTable>

    <p class="text-xs text-base-content/60">
      Joined model:
      <span class="badge badge-ghost badge-sm">page {{ query.page }}</span>
      <span class="badge badge-ghost badge-sm">perPage {{ query.perPage }}</span>
      <span class="badge badge-ghost badge-sm">sort {{ query.sort.key ?? 'none' }} {{ query.sort.direction }}</span>
      <span class="badge badge-ghost badge-sm">search “{{ query.search }}”</span>
      <span class="badge badge-ghost badge-sm">{{ Object.keys(query.filters).length }} filter keys</span>
      <span class="badge badge-ghost badge-sm">{{ selected.length }} selected</span>
    </p>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Server mode</p>
      <DzDataTable
        v-model:query="serverQuery"
        mode="server"
        :columns="columns.slice(0, 3)"
        :rows="accounts.slice(0, 5)"
        :total="accounts.length"
        :from="(serverQuery.page - 1) * serverQuery.perPage + 1"
        :to="serverQuery.page * serverQuery.perPage"
        aria-label="Server-driven accounts"
      >
        <p class="text-xs text-base-content/60">
          The table never fetches — rows and the pagination envelope arrive as props, and every
          interaction leaves as one <code>update:query</code> event.
        </p>
        <template #toolbar>
          <p class="text-xs text-base-content/60">
            Current page: <span class="badge badge-ghost badge-sm">{{ serverQuery.page }}</span>
          </p>
        </template>
      </DzDataTable>
    </div>

    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Loading &amp; empty</p>
      <div class="grid gap-3 lg:grid-cols-2">
        <DzDataTable :columns="columns.slice(0, 3)" :rows="[]" loading aria-label="Loading accounts" />
        <DzDataTable
          :columns="columns.slice(0, 3)"
          :rows="[]"
          empty-text="No accounts match your filters"
          aria-label="Empty accounts"
        />
      </div>
    </div>

    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Error</p>
      <DzDataTable
        :columns="columns.slice(0, 3)"
        :rows="[]"
        error="The request failed — the owning page decides what to do next."
        aria-label="Failed accounts"
      />
    </div>
  </div>
</template>
