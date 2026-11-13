<script setup lang="ts">
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const positions = ['top', 'bottom', 'left', 'right', 'start', 'end', 'center']
const colors = ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error']
</script>

<template>
  <div v-if="mode !== 'variants'" class="flex flex-wrap items-center gap-4">
    <DzTooltip text="This is a tooltip" position="top">
      <DzButton variant="outline">Hover me</DzButton>
    </DzTooltip>
    <DzTooltip text="Delayed by 500ms" :delay="500" position="bottom" color="primary">
      <DzButton variant="soft" color="primary">Delayed tooltip</DzButton>
    </DzTooltip>
    <DzTooltip position="bottom" color="secondary">
      <template #content>
        <span class="font-semibold">Rich content</span>
        <span class="mt-1 block text-xs opacity-80">Tooltips can use a content slot.</span>
      </template>
      <DzButton variant="ghost">Custom content</DzButton>
    </DzTooltip>
    <DzTooltip text="This is disabled" disabled>
      <DzButton disabled>Disabled tooltip</DzButton>
    </DzTooltip>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Positions</p>
      <div class="flex flex-wrap gap-3">
        <DzTooltip v-for="position in positions" :key="position" :text="position" :position="position">
          <DzButton size="sm" variant="outline">{{ position }}</DzButton>
        </DzTooltip>
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Colors</p>
      <div class="flex flex-wrap gap-3">
        <DzTooltip v-for="color in colors" :key="color" :text="color" :color="color">
          <DzButton size="sm" variant="soft" :color="color">{{ color }}</DzButton>
        </DzTooltip>
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Interactive</p>
      <DzTooltip text="Clickable content inside" position="bottom" interactive>
        <DzButton size="sm" variant="ghost">Interactive tooltip</DzButton>
      </DzTooltip>
    </div>
  </div>
</template>
