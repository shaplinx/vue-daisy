<script setup lang="ts">
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-5">
    <div class="flex flex-wrap items-start gap-8">
      <div class="w-64 space-y-3">
        <div class="flex items-center gap-3">
          <DzSkeleton variant="circle" width="3rem" height="3rem" />
          <div class="flex-1 space-y-2">
            <DzSkeleton variant="text" width="70%" height="0.75rem" />
            <DzSkeleton variant="text" width="45%" height="0.6rem" />
          </div>
        </div>
        <DzSkeleton :lines="3" />
      </div>
      <div class="w-64 rounded-box border border-base-300 p-3">
        <DzSkeleton height="8rem" class="mb-3" />
        <DzSkeleton :lines="2" />
      </div>
    </div>
    <p class="text-xs text-base-content/60">Skeletons are marked aria-hidden and are intended to mirror the final layout.</p>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Shapes</p>
      <div class="flex flex-wrap items-center gap-4">
        <DzSkeleton width="8rem" height="3rem" />
        <DzSkeleton variant="circle" width="3rem" height="3rem" />
        <DzSkeleton variant="text" width="10rem" height="0.8rem" />
        <DzSkeleton variant="avatar" width="3rem" height="3rem" />
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Multiple text lines</p>
      <DzSkeleton :lines="5" />
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Card placeholder</p>
      <div class="w-72 rounded-box border border-base-300 p-3">
        <DzSkeleton height="7rem" class="mb-3" />
        <DzSkeleton :lines="3" />
        <div class="mt-3 flex gap-2">
          <DzSkeleton width="4rem" height="1.5rem" />
          <DzSkeleton width="4rem" height="1.5rem" />
        </div>
      </div>
    </div>
  </div>
</template>
