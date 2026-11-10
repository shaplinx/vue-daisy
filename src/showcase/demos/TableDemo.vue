<script setup>
import { computed, ref } from 'vue'
import { Search } from '@lucide/vue'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'status', label: 'Status', align: 'center' },
  { key: 'joined', label: 'Joined', sortable: true, align: 'end' },
]

const rows = [
  { id: 1, name: 'Alex Morgan', role: 'Administrator', status: 'Active', joined: '2024-01-12' },
  { id: 2, name: 'Jamie Lee', role: 'Designer', status: 'Active', joined: '2024-02-03' },
  { id: 3, name: 'Riley Kim', role: 'Developer', status: 'Invited', joined: '2024-03-18' },
  { id: 4, name: 'Sam Patel', role: 'Analyst', status: 'Suspended', joined: '2024-04-02' },
  { id: 5, name: 'Drew Chen', role: 'Support', status: 'Active', joined: '2024-05-21' },
]

const search = ref('')
const selected = ref([])

const filteredRows = computed(() => {
  const query = search.value.trim().toLowerCase()
  if (!query) return rows
  return rows.filter((row) => `${row.name} ${row.role} ${row.status}`.toLowerCase().includes(query))
})

function badgeColor(status) {
  return { Active: 'success', Invited: 'warning', Suspended: 'error' }[status] || 'ghost'
}
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-3">
    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div class="w-full sm:max-w-xs">
        <DzInput v-model="search" size="sm" clearable placeholder="Filter rows…" aria-label="Filter table rows">
          <template #prefix><Search class="size-4 opacity-50" aria-hidden="true" /></template>
        </DzInput>
      </div>
      <p class="text-xs text-base-content/60">{{ filteredRows.length }} rows · {{ selected.length }} selected</p>
    </div>

    <DzTable
      v-model:selected="selected"
      :columns="columns"
      :rows="filteredRows"
      selectable
      zebra
      caption="Team members — click a header to sort"
    >
      <template #cell-status="{ value }">
        <DzBadge :color="badgeColor(value)" size="sm" variant="soft">{{ value }}</DzBadge>
      </template>
    </DzTable>

    <div class="flex items-center justify-between text-xs">
      <span class="opacity-60">Selected IDs: {{ selected.length ? selected.join(', ') : 'none' }}</span>
      <DzButton v-if="selected.length" size="xs" variant="ghost" @click="selected = []">Clear selection</DzButton>
    </div>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Compact &amp; zebra</p>
      <DzTable :columns="columns" :rows="rows.slice(0, 3)" compact zebra />
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Sizes</p>
      <div class="space-y-3">
        <DzTable :columns="columns.slice(0, 2)" :rows="rows.slice(0, 2)" size="sm" />
        <DzTable :columns="columns.slice(0, 2)" :rows="rows.slice(0, 2)" size="lg" />
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Loading &amp; empty states</p>
      <div class="grid gap-3 lg:grid-cols-2">
        <DzTable :columns="columns.slice(0, 2)" :rows="[]" loading />
        <DzTable :columns="columns.slice(0, 2)" :rows="[]" empty-text="No members match your filters" />
      </div>
    </div>
  </div>
</template>
