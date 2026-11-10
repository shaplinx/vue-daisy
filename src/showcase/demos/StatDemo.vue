<script setup>
import { Activity, DollarSign, Users, Zap } from '@lucide/vue'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()

const items = [
  { id: 'revenue', title: 'Revenue', value: '$48.2k', description: '↑ 12% from last month', icon: DollarSign, color: 'success' },
  { id: 'users', title: 'Active users', value: '2,318', description: '↑ 8% from last week', icon: Users, color: 'primary' },
  { id: 'requests', title: 'Requests', value: '92.4k', description: '↓ 3% from yesterday', icon: Activity, color: 'warning' },
  { id: 'uptime', title: 'Uptime', value: '99.98%', description: 'Last 30 days', icon: Zap, color: 'accent' },
]

const colors = ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error']
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-4">
    <DzStat :items="items" shadow class="w-full" />
    <DzStat :items="items.slice(0, 2)" vertical class="w-full sm:w-auto" />
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Color values</p>
      <div class="flex flex-wrap gap-3">
        <DzStat
          v-for="color in colors"
          :key="color"
          :title="color"
          value="128"
          :color="color"
          class="w-40 border border-base-300"
        />
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Custom slots</p>
      <DzStat :items="items.slice(0, 2)">
        <template #title="{ item }">
          <span class="inline-flex items-center gap-1.5"><component :is="item.icon" class="size-3.5" aria-hidden="true" />{{ item.title }}</span>
        </template>
        <template #description="{ item }">
          <span class="text-success">{{ item.description }}</span>
        </template>
      </DzStat>
    </div>
  </div>
</template>
