<script setup lang="ts">
import { ArrowUpRight, Layers, Sparkles } from '@lucide/vue'
import { gradientA, gradientB } from '@/showcase/demoAssets'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-3">
    <div class="flex flex-wrap gap-8">
      <DzHover3d label="3D product card">
        <div class="card w-64 bg-base-100 shadow-xl">
          <figure><img :src="gradientA" alt="Aurora" /></figure>
          <div class="card-body">
            <h3 class="card-title text-base">Hover 3D card</h3>
            <p class="text-xs opacity-70">Move your pointer across the card to tilt it in 3D space.</p>
            <div class="card-actions justify-end">
              <DzButton size="xs" color="primary">View <ArrowUpRight class="size-3" aria-hidden="true" /></DzButton>
            </div>
          </div>
        </div>
      </DzHover3d>

      <DzHover3d label="3D feature tile">
        <div class="flex h-64 w-64 flex-col justify-between rounded-box bg-gradient-to-br from-primary to-secondary p-5 text-primary-content shadow-xl">
          <Sparkles class="size-8" aria-hidden="true" />
          <div>
            <p class="text-lg font-bold">3D tile</p>
            <p class="text-xs opacity-80">A second example with custom content.</p>
          </div>
        </div>
      </DzHover3d>
    </div>
  </div>

  <div v-else class="space-y-4">
    <p class="text-xs text-base-content/60">Hover each card. The component adds the eight depth layers DaisyUI expects.</p>
    <div class="flex flex-wrap gap-8">
      <DzHover3d>
        <div class="card w-56 bg-base-100 shadow-lg">
          <figure><img :src="gradientB" alt="Sunset" /></figure>
          <div class="card-body p-4">
            <h3 class="card-title text-sm"><Layers class="size-4" aria-hidden="true" /> Layered card</h3>
          </div>
        </div>
      </DzHover3d>
      <DzHover3d>
        <div class="grid h-48 w-56 place-items-center rounded-box border border-base-300 bg-base-100">
          <span class="text-sm font-semibold">Plain content</span>
        </div>
      </DzHover3d>
    </div>
  </div>
</template>
