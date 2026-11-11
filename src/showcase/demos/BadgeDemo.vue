<script setup lang="ts">
import { Check, Clock, Star, X } from '@lucide/vue'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const colors = ['primary', 'secondary', 'accent', 'neutral', 'info', 'success', 'warning', 'error']
const variants = ['solid', 'outline', 'soft', 'dash', 'ghost']
const sizes = ['xs', 'sm', 'md', 'lg', 'xl']
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-5">
    <div class="flex flex-wrap items-center gap-2">
      <DzBadge color="primary">Primary</DzBadge>
      <DzBadge color="secondary">Secondary</DzBadge>
      <DzBadge color="accent">Accent</DzBadge>
      <DzBadge color="success"><template #icon><Check class="size-3" aria-hidden="true" /></template>Active</DzBadge>
      <DzBadge color="warning"><template #icon><Clock class="size-3" aria-hidden="true" /></template>Pending</DzBadge>
      <DzBadge color="error"><template #icon><X class="size-3" aria-hidden="true" /></template>Failed</DzBadge>
      <DzBadge color="info" variant="soft">Soft info</DzBadge>
      <DzBadge variant="outline">Outline</DzBadge>
      <DzBadge color="neutral" variant="dash">Draft</DzBadge>
      <DzBadge color="warning" variant="ghost"><template #icon><Star class="size-3" aria-hidden="true" /></template>Featured</DzBadge>
    </div>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Colors</p>
      <div class="flex flex-wrap gap-2">
        <DzBadge v-for="color in colors" :key="color" :color="color">{{ color }}</DzBadge>
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Styles</p>
      <div class="flex flex-wrap gap-2">
        <DzBadge v-for="variant in variants" :key="variant" :variant="variant" color="primary">{{ variant }}</DzBadge>
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Sizes</p>
      <div class="flex flex-wrap items-center gap-2">
        <DzBadge v-for="size in sizes" :key="size" :size="size" color="secondary">{{ size }}</DzBadge>
      </div>
    </div>
  </div>
</template>
