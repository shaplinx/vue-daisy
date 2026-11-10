<script setup>
import { Sparkles } from '@lucide/vue'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const variants = ['border', 'dual', 'rainbow', 'holo', 'gold', 'silver', 'glow']
const sizes = ['xs', 'sm', 'md', 'lg', 'xl']
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-4">
    <div class="flex flex-wrap items-center gap-6">
      <DzAura variant="rainbow" class="rounded-box">
        <div class="card w-64 bg-base-100">
          <div class="card-body">
            <h3 class="card-title"><Sparkles class="size-5 text-primary" aria-hidden="true" /> Rainbow aura</h3>
            <p class="text-sm opacity-70">An animated glow that follows the component's border.</p>
            <div class="card-actions justify-end">
              <DzButton size="sm" color="primary">Upgrade</DzButton>
            </div>
          </div>
        </div>
      </DzAura>

      <DzAura variant="glow" class="rounded-box">
        <div class="rounded-box bg-base-100 p-6 text-center">
          <p class="text-2xl font-bold">Glow</p>
          <p class="text-xs opacity-60">Subtle ambient light</p>
        </div>
      </DzAura>
    </div>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Variants</p>
      <div class="flex flex-wrap gap-5">
        <DzAura v-for="variant in variants" :key="variant" :variant="variant" class="rounded-box">
          <div class="flex h-24 w-36 items-center justify-center rounded-box bg-base-100 text-sm font-semibold">
            {{ variant }}
          </div>
        </DzAura>
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Sizes</p>
      <div class="flex flex-wrap items-end gap-5">
        <DzAura v-for="size in sizes" :key="size" :size="size" variant="border" class="rounded-box">
          <div class="grid h-16 w-16 place-items-center rounded-box bg-base-100 text-xs">{{ size }}</div>
        </DzAura>
      </div>
    </div>
  </div>
</template>
