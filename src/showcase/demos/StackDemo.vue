<script setup lang="ts">
import { gradientA, gradientB, gradientC } from '@/showcase/demoAssets'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-4">
    <DzStack class="w-64">
      <div class="card bg-base-100 shadow-sm">
        <figure><img :src="gradientA" alt="Aurora card" class="h-32 w-full object-cover" /></figure>
        <div class="card-body p-4">
          <h3 class="card-title text-base">Top card</h3>
          <p class="text-xs opacity-60">The last child sits on top of the stack.</p>
        </div>
      </div>
      <div class="card bg-base-100 shadow-sm">
        <figure><img :src="gradientB" alt="Sunset card" class="h-32 w-full object-cover" /></figure>
        <div class="card-body p-4">
          <h3 class="card-title text-base">Middle card</h3>
        </div>
      </div>
      <div class="card bg-base-100 shadow-sm">
        <figure><img :src="gradientC" alt="Ocean card" class="h-32 w-full object-cover" /></figure>
        <div class="card-body p-4">
          <h3 class="card-title text-base">Bottom card</h3>
        </div>
      </div>
    </DzStack>
    <p class="text-xs text-base-content/60">Hover the stack to spread the cards slightly.</p>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Directions</p>
      <div class="flex flex-wrap gap-12">
        <div v-for="direction in ['top', 'bottom', 'start', 'end']" :key="direction" class="text-center">
          <DzStack :direction="direction" class="w-36">
            <div class="grid h-24 place-items-center rounded-box bg-base-100 shadow-sm">1</div>
            <div class="grid h-24 place-items-center rounded-box bg-base-100 shadow-sm">2</div>
            <div class="grid h-24 place-items-center rounded-box bg-base-100 shadow-sm">3</div>
          </DzStack>
          <p class="mt-2 text-xs opacity-60">{{ direction }}</p>
        </div>
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Custom element</p>
      <DzStack as="ul" class="w-56">
        <li class="grid h-20 place-items-center rounded-box bg-base-200 text-sm">First</li>
        <li class="grid h-20 place-items-center rounded-box bg-base-200 text-sm">Second</li>
        <li class="grid h-20 place-items-center rounded-box bg-base-200 text-sm">Third</li>
      </DzStack>
    </div>
  </div>
</template>
