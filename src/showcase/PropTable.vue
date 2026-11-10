<script setup>
import { computed } from 'vue'
import { Braces, Radio, SlidersHorizontal } from '@lucide/vue'

const props = defineProps({
  props: { type: Array, default: () => [] },
  events: { type: Array, default: () => [] },
  slots: { type: Array, default: () => [] },
})

const sections = computed(() => [
  {
    id: 'props',
    title: 'Props',
    icon: SlidersHorizontal,
    rows: props.props,
    columns: [
      { key: 'name', label: 'Prop' },
      { key: 'type', label: 'Type' },
      { key: 'default', label: 'Default' },
      { key: 'description', label: 'Description' },
    ],
  },
  {
    id: 'events',
    title: 'Events',
    icon: Radio,
    rows: props.events,
    columns: [
      { key: 'name', label: 'Event' },
      { key: 'payload', label: 'Payload' },
      { key: 'description', label: 'Description' },
    ],
  },
  {
    id: 'slots',
    title: 'Slots',
    icon: Braces,
    rows: props.slots,
    columns: [
      { key: 'name', label: 'Slot' },
      { key: 'description', label: 'Description' },
    ],
  },
])
</script>

<template>
  <div class="space-y-6">
    <section v-for="section in sections" :key="section.id" class="space-y-2">
      <h3 class="flex items-center gap-2 text-sm font-semibold">
        <component :is="section.icon" class="size-4 opacity-60" aria-hidden="true" />
        {{ section.title }}
        <span class="badge badge-ghost badge-xs">{{ section.rows.length }}</span>
      </h3>

      <div v-if="section.rows.length" class="overflow-x-auto rounded-box border border-base-300">
        <table class="table table-sm">
          <thead>
            <tr>
              <th v-for="column in section.columns" :key="column.key">{{ column.label }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in section.rows" :key="row.name ?? index">
              <td v-for="column in section.columns" :key="column.key" :class="{ 'whitespace-nowrap': column.key !== 'description' }">
                <code v-if="column.key === 'name'" class="rounded bg-base-200 px-1.5 py-0.5 text-xs font-semibold">
                  {{ row[column.key] }}
                </code>
                <span v-else-if="column.key === 'type' || column.key === 'default' || column.key === 'payload'" class="text-xs opacity-80">
                  {{ row[column.key] ?? '—' }}
                </span>
                <span v-else class="text-xs opacity-70">{{ row[column.key] ?? '—' }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-else class="rounded-box border border-dashed border-base-300 px-3 py-4 text-xs opacity-50">
        No {{ section.title.toLowerCase() }} are emitted by this component.
      </p>
    </section>
  </div>
</template>
