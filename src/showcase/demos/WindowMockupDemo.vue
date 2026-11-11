<script setup lang="ts">
import { Activity, BarChart3, CreditCard, DollarSign, Users } from '@lucide/vue'
import { gradientD } from '@/showcase/demoAssets'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()

const stats = [
  { label: 'Revenue', value: '$48.2k', icon: DollarSign, trend: '+12.4%' },
  { label: 'Customers', value: '2,340', icon: Users, trend: '+4.1%' },
  { label: 'Orders', value: '1,024', icon: CreditCard, trend: '+8.7%' },
]
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-3">
    <DzWindowMockup>
      <div class="w-full max-w-3xl rounded-box bg-base-100 shadow-sm">
        <div class="flex items-center justify-between border-b border-base-300 px-5 py-3">
          <div class="flex items-center gap-2">
            <BarChart3 class="size-4 text-primary" aria-hidden="true" />
            <span class="text-sm font-semibold">Analytics overview</span>
          </div>
          <span class="badge badge-success badge-sm gap-1">
            <Activity class="size-3" aria-hidden="true" />
            Live
          </span>
        </div>
        <div class="grid gap-3 p-5 sm:grid-cols-3">
          <div v-for="stat in stats" :key="stat.label" class="rounded-box border border-base-300 p-4">
            <div class="flex items-center justify-between text-xs opacity-60">
              <span>{{ stat.label }}</span>
              <component :is="stat.icon" class="size-4" aria-hidden="true" />
            </div>
            <p class="mt-2 text-2xl font-bold">{{ stat.value }}</p>
            <p class="text-xs text-success">{{ stat.trend }} vs last month</p>
          </div>
        </div>
        <div class="px-5 pb-5">
          <div class="h-32 overflow-hidden rounded-box">
            <img :src="gradientD" alt="Citrus gradient chart placeholder" class="size-full object-cover" />
          </div>
        </div>
      </div>
    </DzWindowMockup>
    <p class="text-xs text-base-content/60">
      Window frames are great for showing an application screenshot inside documentation.
    </p>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Default frame</p>
      <DzWindowMockup>
        <img :src="gradientD" alt="Citrus gradient dashboard" class="w-full max-w-2xl rounded-box" />
      </DzWindowMockup>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Borderless with content class</p>
      <DzWindowMockup :bordered="false" content-class="items-center bg-base-300 p-10">
        <div class="text-center">
          <p class="text-lg font-bold">Borderless window</p>
          <p class="text-xs opacity-60">Custom content alignment and background.</p>
        </div>
      </DzWindowMockup>
    </div>
  </div>
</template>
