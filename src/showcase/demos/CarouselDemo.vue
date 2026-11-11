<script setup lang="ts">
import { ref } from 'vue'
import { carouselSlides } from '@/showcase/demoAssets'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const active = ref(0)
const vertical = ref(0)
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-3">
    <DzCarousel v-model="active" :items="carouselSlides" :loop="true" item-class="w-full" aria-label="Featured slides" />
    <div class="flex items-center justify-between text-xs text-base-content/60">
      <span>Slide {{ active + 1 }} of {{ carouselSlides.length }}</span>
      <span>Arrow keys, controls and indicators all work.</span>
    </div>
  </div>

  <div v-else class="grid gap-6 lg:grid-cols-2">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Looping, wide slides</p>
      <DzCarousel :items="carouselSlides" :loop="true" item-class="w-full" :show-indicators="false" />
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Vertical carousel</p>
      <DzCarousel v-model="vertical" :items="carouselSlides" vertical :loop="true" class="h-64" item-class="h-full" :show-indicators="false" :show-controls="false" />
    </div>
    <div class="lg:col-span-2">
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Custom item slot</p>
      <DzCarousel :items="carouselSlides.slice(0, 2)" :show-controls="false">
        <template #item="{ item, index }">
          <div class="flex h-40 w-72 flex-col justify-end rounded-box bg-base-200 p-4">
            <span class="text-xs opacity-50">Slide {{ index + 1 }}</span>
            <span class="font-semibold">{{ item.alt }}</span>
          </div>
        </template>
      </DzCarousel>
    </div>
  </div>
</template>
