<script setup lang="ts">
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const colors = ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error']
const sizes = ['xs', 'sm', 'md', 'lg', 'xl']
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-4">
    <div class="flex flex-wrap items-center gap-2 text-sm">
      <DzKbd>Ctrl</DzKbd><span>+</span><DzKbd>K</DzKbd><span class="ms-4">Search</span>
    </div>
    <div class="flex flex-wrap items-center gap-2 text-sm">
      <DzKbd>⌘</DzKbd><span>+</span><DzKbd>Enter</DzKbd><span class="ms-4">Submit</span>
    </div>
    <div class="flex flex-wrap items-center gap-2 text-sm">
      <DzKbd>Shift</DzKbd><span>+</span><DzKbd>?</DzKbd><span class="ms-4">Keyboard shortcuts</span>
    </div>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Sizes</p>
      <div class="flex flex-wrap items-center gap-2">
        <DzKbd v-for="size in sizes" :key="size" :size="size">{{ size }}</DzKbd>
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Colors</p>
      <div class="flex flex-wrap items-center gap-2">
        <DzKbd v-for="color in colors" :key="color" :color="color">{{ color }}</DzKbd>
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Inline in a sentence</p>
      <p class="text-sm">Press <DzKbd size="sm">Esc</DzKbd> to close a dialog or <DzKbd size="sm" color="primary">Enter</DzKbd> to confirm.</p>
    </div>
  </div>
</template>
