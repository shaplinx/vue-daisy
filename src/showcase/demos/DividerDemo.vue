<script setup>
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-6">
    <DzDivider />
    <DzDivider text="OR" position="center" />
    <DzDivider text="Section start" position="start" />
    <DzDivider text="Section end" position="end" />
    <div class="flex h-24 items-center gap-4 rounded-box border border-base-300 p-4">
      <span class="text-sm">Left</span>
      <DzDivider orientation="vertical" />
      <span class="text-sm">Middle</span>
      <DzDivider orientation="vertical" />
      <span class="text-sm">Right</span>
    </div>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Positions</p>
      <div class="space-y-4">
        <DzDivider text="Start" position="start" />
        <DzDivider text="Center" position="center" />
        <DzDivider text="End" position="end" />
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Colors</p>
      <div class="space-y-4">
        <DzDivider
          v-for="color in ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error']"
          :key="color"
          :color="color"
          :text="color"
          position="center"
        />
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Vertical &amp; custom label</p>
      <div class="flex h-28 items-stretch gap-4 rounded-box border border-base-300 p-4">
        <div class="flex-1 text-sm">Panel one</div>
        <DzDivider orientation="vertical" color="primary">
          <span class="badge badge-primary badge-sm">vs</span>
        </DzDivider>
        <div class="flex-1 text-sm">Panel two</div>
      </div>
    </div>
  </div>
</template>
