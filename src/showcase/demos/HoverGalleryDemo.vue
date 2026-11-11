<script setup lang="ts">
import { galleryImages } from '@/showcase/demoAssets'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-3">
    <div class="flex flex-wrap gap-8">
      <DzHoverGallery :images="galleryImages" width="max-w-64" />
      <div class="max-w-xs self-center text-sm text-base-content/70">
        <p class="font-semibold text-base-content">Hover gallery</p>
        <p class="mt-1 text-xs">Hover the stack to cycle through the images with a smooth layered reveal.</p>
      </div>
    </div>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Widths</p>
      <div class="flex flex-wrap items-end gap-8">
        <DzHoverGallery :images="galleryImages.slice(0, 3)" width="max-w-40" />
        <DzHoverGallery :images="galleryImages.slice(0, 3)" width="max-w-60" />
        <DzHoverGallery :images="galleryImages.slice(0, 3)" width="max-w-80" />
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Square corners</p>
      <DzHoverGallery :images="galleryImages.slice(0, 3)" :rounded="false" width="max-w-60" />
    </div>
  </div>
</template>
