<script setup lang="ts">
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const colors = ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error']
const sizes = ['xs', 'sm', 'md', 'lg', 'xl']
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-4">
    <div class="flex flex-wrap items-center gap-6">
      <span class="inline-flex items-center gap-2 text-sm"><DzStatus color="success" label="Online" /> Online</span>
      <span class="inline-flex items-center gap-2 text-sm"><DzStatus color="warning" label="Away" /> Away</span>
      <span class="inline-flex items-center gap-2 text-sm"><DzStatus color="error" label="Offline" /> Offline</span>
      <span class="inline-flex items-center gap-2 text-sm"><DzStatus color="primary" ping label="Connecting" /> Connecting</span>
    </div>
    <p class="text-xs text-base-content/60">Each status includes an accessible label via screen-reader text.</p>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Colors</p>
      <div class="flex flex-wrap items-center gap-4">
        <span v-for="color in colors" :key="color" class="inline-flex items-center gap-2 text-xs">
          <DzStatus :color="color" :label="color" /> {{ color }}
        </span>
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Sizes</p>
      <div class="flex flex-wrap items-center gap-4">
        <span v-for="size in sizes" :key="size" class="inline-flex items-center gap-2 text-xs">
          <DzStatus :size="size" color="primary" :label="`Size ${size}`" /> {{ size }}
        </span>
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Ping animation</p>
      <div class="flex items-center gap-4">
        <DzStatus color="success" ping label="Live" />
        <DzStatus color="error" ping label="Alert" />
        <DzStatus color="info" ping label="Syncing" />
      </div>
    </div>
  </div>
</template>
