<script setup lang="ts">
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const words = ['design systems', 'interactive demos', 'Vue components', 'DaisyUI themes']
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-3">
    <p class="text-2xl font-semibold">
      We build
      <DzTextRotate :items="words" :duration="9000" class="text-primary" />
    </p>
    <p class="text-xs text-base-content/60">The list rotates automatically every few seconds.</p>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Durations</p>
      <p class="text-lg">Fast: <DzTextRotate :items="words" :duration="4000" class="text-secondary" /></p>
      <p class="text-lg">Slow: <DzTextRotate :items="words" :duration="16000" class="text-accent" /></p>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Centered</p>
      <div class="rounded-box border border-base-300 p-6 text-center">
        <DzTextRotate :items="words" :duration="7000" center class="text-xl font-bold" />
      </div>
    </div>
  </div>
</template>
