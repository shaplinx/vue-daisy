<script setup>
import { diffAfter, diffBefore, gradientC, gradientF } from '@/showcase/demoAssets'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-3">
    <DzDiff :before="diffBefore" :after="diffAfter" before-alt="Original design" after-alt="Redesigned version" aspect="aspect-16/9" />
    <p class="text-center text-xs text-base-content/60">
      Drag the divider (or use the arrow keys when focused) to compare before and after.
    </p>
  </div>

  <div v-else class="grid gap-6 md:grid-cols-2">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">16:9</p>
      <DzDiff :before="gradientF" :after="gradientC" before-alt="Ember" after-alt="Ocean" aspect="aspect-16/9" />
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Square with custom slots</p>
      <DzDiff aspect="aspect-square">
        <template #before>
          <div class="flex size-full items-center justify-center bg-neutral text-neutral-content">
            <span class="text-xl font-bold">Before</span>
          </div>
        </template>
        <template #after>
          <div class="flex size-full items-center justify-center bg-primary text-primary-content">
            <span class="text-xl font-bold">After</span>
          </div>
        </template>
      </DzDiff>
    </div>
  </div>
</template>
