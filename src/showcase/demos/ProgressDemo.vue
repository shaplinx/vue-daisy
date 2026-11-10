<script setup>
import { ref } from 'vue'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const value = ref(65)
const colors = ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error']
const sizes = ['xs', 'sm', 'md', 'lg', 'xl']
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-4">
    <DzProgress :value="value" color="primary" show-value label="Upload progress" />
    <div class="max-w-sm">
      <DzRange v-model="value" :min="0" :max="100" color="primary" label="Progress value" show-value />
    </div>
    <div class="space-y-2">
      <DzProgress indeterminate color="secondary" label="Indeterminate" />
      <DzProgress :value="100" color="success" show-value label="Complete" />
    </div>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Colors</p>
      <div class="space-y-2">
        <DzProgress v-for="color in colors" :key="color" :value="55" :color="color" :label="color" />
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Sizes</p>
      <div class="space-y-2">
        <DzProgress v-for="size in sizes" :key="size" :value="70" :size="size" :label="`Size ${size}`" />
      </div>
    </div>
  </div>
</template>
