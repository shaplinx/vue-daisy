<script setup>
import { ref } from 'vue'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const notes = ref('')
const message = ref('Thanks for the great component library!')
const limited = ref('')
</script>

<template>
  <div v-if="mode !== 'variants'" class="max-w-xl space-y-4">
    <div class="form-control">
      <span class="label-text mb-1">Release notes</span>
      <DzTextarea v-model="notes" :rows="4" placeholder="What changed in this release?" />
    </div>
    <div class="form-control">
      <span class="label-text mb-1">Feedback (200 characters)</span>
      <DzTextarea v-model="message" :rows="3" :maxlength="200" show-count resize="none" />
    </div>
    <p class="text-xs text-base-content/60">The counter updates live and respects the native maxlength.</p>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Sizes</p>
      <div class="grid gap-3 sm:grid-cols-2">
        <DzTextarea v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']" :key="size" :size="size" :rows="2" :placeholder="`Size ${size}`" />
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Colors</p>
      <div class="grid gap-3 sm:grid-cols-2">
        <DzTextarea
          v-for="color in ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error']"
          :key="color"
          :color="color"
          :rows="2"
          :placeholder="color"
        />
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Resize &amp; states</p>
      <div class="grid gap-3 sm:grid-cols-2">
        <DzTextarea :model-value="''" resize="none" :rows="2" placeholder="No resize" />
        <DzTextarea :model-value="''" resize="both" :rows="2" placeholder="Resize both" />
        <DzTextarea :model-value="''" invalid :rows="2" placeholder="Invalid" />
        <DzTextarea :model-value="'Disabled content'" disabled :rows="2" />
        <DzTextarea v-model="limited" :rows="2" :maxlength="80" show-count placeholder="Live counter" />
      </div>
    </div>
  </div>
</template>
