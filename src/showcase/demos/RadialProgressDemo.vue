<script setup>
import { ref } from 'vue'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const value = ref(72)
const colors = ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error']
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-5">
    <div class="flex flex-wrap items-center gap-8">
      <DzRadialProgress :value="value" color="primary" :size="110" :thickness="10" label="Overall progress" />
      <div class="w-full max-w-xs space-y-2">
        <DzRange v-model="value" :min="0" :max="100" label="Radial value" show-value />
        <p class="text-xs opacity-60">The radial progress uses a CSS custom property, so updates animate smoothly.</p>
      </div>
    </div>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Colors</p>
      <div class="flex flex-wrap items-center gap-5">
        <DzRadialProgress v-for="color in colors" :key="color" :value="60" :color="color" :size="72" :label="color" />
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Sizes &amp; thickness</p>
      <div class="flex flex-wrap items-center gap-5">
        <DzRadialProgress :value="40" :size="48" :thickness="4" label="Small" />
        <DzRadialProgress :value="60" :size="80" :thickness="8" label="Medium" />
        <DzRadialProgress :value="80" :size="120" :thickness="14" label="Large" />
        <DzRadialProgress :value="90" :size="120" :thickness="6" label="Custom content">
          <span class="text-xs font-bold">90/100</span>
        </DzRadialProgress>
      </div>
    </div>
  </div>
</template>
