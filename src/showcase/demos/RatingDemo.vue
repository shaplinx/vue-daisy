<script setup>
import { computed, ref } from 'vue'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const score = ref(3)
const productScore = ref(4)
const readonlyScore = ref(2)

const label = computed(() => {
  if (!score.value) return 'No rating yet'
  return `${score.value} of 5 stars`
})
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-5">
    <div class="flex flex-wrap items-center gap-4">
      <DzRating v-model="score" label="Your rating" />
      <span class="text-sm text-base-content/70">{{ label }}</span>
    </div>
    <div class="flex flex-wrap items-center gap-4">
      <DzRating v-model="productScore" :max="10" size="sm" color="accent" label="Product score" />
      <span class="text-xs text-base-content/60">Ten-star scale · click the active star to clear.</span>
    </div>
    <p class="text-xs text-base-content/60">
      Use <kbd class="kbd kbd-xs">Tab</kbd> to focus a star and
      <kbd class="kbd kbd-xs">Enter</kbd> / <kbd class="kbd kbd-xs">Space</kbd> to select it.
    </p>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Colors</p>
      <div class="flex flex-wrap gap-6">
        <DzRating
          v-for="color in ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error']"
          :key="color"
          :model-value="4"
          :color="color"
          :label="color"
        />
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Sizes</p>
      <div class="flex flex-wrap items-center gap-6">
        <DzRating
          v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']"
          :key="size"
          :model-value="3"
          :size="size"
          :label="`Size ${size}`"
        />
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">States</p>
      <div class="flex flex-wrap items-center gap-6">
        <DzRating :model-value="readonlyScore" readonly label="Read-only" />
        <DzRating :model-value="0" label="Empty" />
        <DzRating :model-value="2" :allow-clear="false" label="Clear disabled" />
      </div>
    </div>
  </div>
</template>
