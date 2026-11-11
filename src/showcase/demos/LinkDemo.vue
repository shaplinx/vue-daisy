<script setup lang="ts">
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const colors = ['primary', 'secondary', 'accent', 'neutral', 'info', 'success', 'warning', 'error']
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-4 text-sm">
    <p>Read the <DzLink href="https://daisyui.com/components/link/" external>DaisyUI documentation</DzLink> for all link styles.</p>
    <p>Jump to the <DzLink :to="{ path: '/components', query: { category: 'navigation' } }">navigation category</DzLink>.</p>
    <p><DzLink href="#!" color="primary">Primary link</DzLink> · <DzLink href="#!" color="secondary">Secondary</DzLink> · <DzLink href="#!" color="accent">Accent</DzLink></p>
    <p><DzLink href="#!" underline="none">No underline</DzLink> · <DzLink href="#!" disabled>Disabled link</DzLink></p>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Colors</p>
      <div class="flex flex-wrap gap-4 text-sm">
        <DzLink v-for="color in colors" :key="color" href="#!" :color="color">{{ color }}</DzLink>
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Underline</p>
      <div class="flex flex-wrap gap-4 text-sm">
        <DzLink href="#!" underline="hover">Hover underline</DzLink>
        <DzLink href="#!" underline="none">Never underlined</DzLink>
        <DzLink href="#!" underline="always">Always underlined</DzLink>
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">States</p>
      <div class="flex flex-wrap gap-4 text-sm">
        <DzLink href="#!" disabled>Disabled</DzLink>
        <DzLink href="#!" color="primary" disabled>Disabled primary</DzLink>
      </div>
    </div>
  </div>
</template>
