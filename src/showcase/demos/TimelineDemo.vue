<script setup lang="ts">
import { Check, Rocket, Sparkles, Truck } from '@lucide/vue'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()

const items = [
  { id: 1, date: 'Jan 2024', title: 'Project started', description: 'Initial Vue 3 and DaisyUI setup.', icon: Sparkles, color: 'primary' },
  { id: 2, date: 'Mar 2024', title: 'Component inventory', description: 'All 69 DaisyUI components catalogued.', icon: Check, color: 'secondary' },
  { id: 3, date: 'Jun 2024', title: 'Showcase shipped', description: 'Live previews, variants and source examples.', icon: Rocket, color: 'accent' },
  { id: 4, date: 'Next', title: 'DataTable & CRUD', description: 'Laravel-compatible server-side data.', icon: Truck, color: 'warning' },
]
</script>

<template>
  <div v-if="mode !== 'variants'" class="mx-auto max-w-2xl">
    <DzTimeline :items="items" />
  </div>

  <div v-else class="space-y-8">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Horizontal</p>
      <div class="overflow-x-auto pb-2">
        <DzTimeline :items="items.slice(0, 3)" horizontal />
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Compact without boxes</p>
      <DzTimeline :items="items.slice(0, 3)" compact :box="false" />
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Custom slots</p>
      <DzTimeline :items="items.slice(0, 2)">
        <template #content="{ item }">
          <div class="rounded-box border border-primary/30 bg-primary/5 p-3">
            <p class="text-sm font-medium">{{ item.title }}</p>
            <p class="text-xs opacity-60">{{ item.description }}</p>
          </div>
        </template>
      </DzTimeline>
    </div>
  </div>
</template>
