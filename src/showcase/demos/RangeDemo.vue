<script setup>
import { ref } from 'vue'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const value = ref(40)
const volume = ref(65)
const colors = ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error']
const sizes = ['xs', 'sm', 'md', 'lg', 'xl']
</script>

<template>
  <div v-if="mode !== 'variants'" class="max-w-md space-y-5">
    <DzRange v-model="value" label="Volume" show-value />
    <DzRange v-model="volume" label="Zoom" :min="0" :max="200" :step="10" color="secondary" show-value />
    <p class="text-xs text-base-content/60">Values update on input; the component emits both input and change events.</p>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Colors</p>
      <div class="max-w-md space-y-3">
        <DzRange v-for="color in colors" :key="color" :model-value="55" :color="color" :label="color" show-value />
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Sizes</p>
      <div class="max-w-md space-y-3">
        <DzRange v-for="size in sizes" :key="size" :model-value="60" :size="size" :label="`Size ${size}`" show-value />
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">States</p>
      <div class="max-w-md space-y-3">
        <DzRange :model-value="30" disabled label="Disabled" show-value />
        <DzRange :model-value="80" :step="0.5" :min="0" :max="1" label="Fractional step" show-value />
      </div>
    </div>
  </div>
</template>
