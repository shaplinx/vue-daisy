<script setup lang="ts">
import { ref } from 'vue'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const single = ref(true)
const indeterminate = ref(false)
const group = ref(['vue'])
const colors = ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error']
const sizes = ['xs', 'sm', 'md', 'lg', 'xl']
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-5">
    <div class="flex flex-wrap items-center gap-5">
      <DzCheckbox v-model="single" label="Email notifications" description="Receive updates about your account." />
      <DzCheckbox v-model="indeterminate" :indeterminate="true" label="Indeterminate" />
      <DzCheckbox :model-value="false" disabled label="Disabled" />
    </div>
    <div class="space-y-2">
      <p class="text-xs font-semibold uppercase tracking-widest opacity-50">Array binding</p>
      <div class="flex flex-wrap gap-5">
        <DzCheckbox v-model="group" value="vue" label="Vue" />
        <DzCheckbox v-model="group" value="react" label="React" />
        <DzCheckbox v-model="group" value="svelte" label="Svelte" />
      </div>
      <p class="text-xs opacity-60">Selected: {{ group.length ? group.join(', ') : 'none' }}</p>
    </div>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Colors</p>
      <div class="flex flex-wrap gap-4">
        <DzCheckbox v-for="color in colors" :key="color" :model-value="true" :color="color" :label="color" />
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Sizes</p>
      <div class="flex flex-wrap items-center gap-4">
        <DzCheckbox v-for="size in sizes" :key="size" :model-value="true" :size="size" :label="size" />
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">States</p>
      <div class="flex flex-wrap gap-4">
        <DzCheckbox :model-value="false" label="Unchecked" />
        <DzCheckbox :model-value="true" label="Checked" />
        <DzCheckbox :model-value="true" :indeterminate="true" label="Indeterminate" />
        <DzCheckbox :model-value="false" disabled label="Disabled" />
      </div>
    </div>
  </div>
</template>
