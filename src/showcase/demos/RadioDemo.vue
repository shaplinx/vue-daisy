<script setup lang="ts">
import { ref } from 'vue'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const plan = ref('pro')
const colors = ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error']
const sizes = ['xs', 'sm', 'md', 'lg', 'xl']

const plans = [
  { value: 'starter', label: 'Starter', description: 'For personal projects' },
  { value: 'pro', label: 'Pro', description: 'For growing teams' },
  { value: 'enterprise', label: 'Enterprise', description: 'Custom requirements' },
]
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-4">
    <div class="flex flex-col gap-3">
      <DzRadio v-for="option in plans" :key="option.value" v-model="plan" :value="option.value" :label="option.label" :description="option.description" />
    </div>
    <p class="text-xs text-base-content/60">Selected plan: <span class="badge badge-primary badge-sm">{{ plan }}</span></p>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Colors</p>
      <div class="flex flex-wrap gap-4">
        <DzRadio v-for="color in colors" :key="color" :model-value="'x'" value="x" :color="color" :label="color" :name="`radio-${color}`" />
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Sizes</p>
      <div class="flex flex-wrap items-center gap-4">
        <DzRadio v-for="size in sizes" :key="size" :model-value="'x'" value="x" :size="size" :label="size" :name="`radio-size-${size}`" />
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">States</p>
      <div class="flex flex-wrap gap-4">
        <DzRadio :model-value="'a'" value="a" label="Checked" name="state-a" />
        <DzRadio :model-value="'a'" value="b" label="Unchecked" name="state-b" />
        <DzRadio :model-value="'a'" value="c" disabled label="Disabled" name="state-c" />
      </div>
    </div>
  </div>
</template>
