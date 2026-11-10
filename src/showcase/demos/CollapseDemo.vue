<script setup>
import { ref } from 'vue'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const open = ref(true)
const plusOpen = ref(false)
const disabledOpen = ref(false)
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-4">
    <DzCollapse v-model="open" title="What is Vue Daisy?" icon="arrow" bordered>
      <p class="text-sm text-base-content/70">
        A Vue 3 component library that turns every DaisyUI component into a reusable, interactive
        component with props, events and slots.
      </p>
    </DzCollapse>
    <DzCollapse :model-value="true" title="Force-open collapse" icon="plus" bordered force-open>
      <p class="text-sm text-base-content/70">This panel cannot be closed because <code class="rounded bg-base-200 px-1">forceOpen</code> is set.</p>
    </DzCollapse>
    <p class="text-xs text-base-content/60">First collapse is {{ open ? 'open' : 'closed' }}.</p>
  </div>

  <div v-else class="grid gap-4 lg:grid-cols-2">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Arrow vs plus</p>
      <DzCollapse v-model="open" title="Arrow icon" icon="arrow" bordered>
        <p class="text-sm opacity-70">Default collapse-arrow indicator.</p>
      </DzCollapse>
      <DzCollapse v-model="plusOpen" title="Plus icon" icon="plus" bordered class="mt-2">
        <p class="text-sm opacity-70">Uses collapse-plus.</p>
      </DzCollapse>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">States</p>
      <DzCollapse :model-value="true" title="Force open" force-open>
        <p class="text-sm opacity-70">Always visible.</p>
      </DzCollapse>
      <DzCollapse v-model="disabledOpen" title="Disabled" disabled bordered class="mt-2">
        <p class="text-sm opacity-70">Cannot be toggled.</p>
      </DzCollapse>
    </div>
  </div>
</template>
