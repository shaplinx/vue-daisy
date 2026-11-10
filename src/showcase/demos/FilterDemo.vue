<script setup>
import { ref } from 'vue'
import { LayoutGrid, List, Table2 } from '@lucide/vue'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const view = ref('grid')

const items = [
  { value: 'grid', label: 'Grid view', icon: LayoutGrid },
  { value: 'list', label: 'List view', icon: List },
  { value: 'table', label: 'Table view', icon: Table2 },
]
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-4">
    <DzFilter v-model="view" :items="items" aria-label="View mode" />
    <p class="text-xs text-base-content/60">
      Active view: <span class="badge badge-primary badge-sm">{{ view || 'none' }}</span> · the reset
      button clears the selection.
    </p>
  </div>

  <div v-else class="space-y-4">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">With reset</p>
      <DzFilter v-model="view" :items="items" />
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Without reset</p>
      <DzFilter v-model="view" :items="items" :show-reset="false" />
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Disabled option</p>
      <DzFilter
        v-model="view"
        :items="[...items, { value: 'map', label: 'Map view', icon: LayoutGrid, disabled: true }]"
      />
    </div>
  </div>
</template>
