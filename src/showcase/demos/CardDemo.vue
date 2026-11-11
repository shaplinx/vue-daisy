<script setup lang="ts">
import { ArrowRight, Heart, MapPin } from '@lucide/vue'
import { gradientA, gradientB } from '@/showcase/demoAssets'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
</script>

<template>
  <div v-if="mode !== 'variants'" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    <DzCard :image="gradientA" image-alt="Aurora cover" bordered>
      <template #title>
        <span class="flex items-center gap-1.5">Aurora collection <DzBadge color="primary" size="xs" variant="soft">New</DzBadge></span>
      </template>
      <p class="text-sm text-base-content/70">
        A vivid gradient pack for hero sections, cards and marketing pages.
      </p>
      <template #actions>
        <DzButton size="sm" variant="ghost"><template #icon><Heart class="size-4" aria-hidden="true" /></template>Save</DzButton>
        <DzButton size="sm" color="primary">Explore <ArrowRight class="size-4" aria-hidden="true" /></DzButton>
      </template>
    </DzCard>

    <DzCard title="Compact card" bordered size="sm">
      <p class="text-sm text-base-content/70">Smaller padding and typography for dense layouts.</p>
      <template #actions>
        <DzButton size="xs" variant="outline">Details</DzButton>
      </template>
    </DzCard>

    <DzCard :image="gradientB" image-alt="Sunset cover" image-full>
      <h3 class="card-title">Image full</h3>
      <p class="text-sm">The image fills the card and content sits on top.</p>
      <template #actions>
        <DzButton size="sm">Open</DzButton>
      </template>
    </DzCard>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Styles</p>
      <div class="grid gap-4 md:grid-cols-3">
        <DzCard title="Bordered" bordered>
          <p class="text-sm opacity-70">Uses card-border.</p>
        </DzCard>
        <DzCard title="Dashed" dash>
          <p class="text-sm opacity-70">Uses card-dash.</p>
        </DzCard>
        <DzCard title="Plain" size="sm">
          <p class="text-sm opacity-70">No border, compact padding.</p>
        </DzCard>
      </div>
    </div>

    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Side layout</p>
      <DzCard side bordered>
        <template #image>
          <figure class="w-40 shrink-0">
            <img :src="gradientB" alt="Sunset" />
          </figure>
        </template>
        <template #title>Side card</template>
        <p class="text-sm opacity-70">Image and content sit side by side on wider screens.</p>
        <p class="mt-2 inline-flex items-center gap-1 text-xs opacity-60"><MapPin class="size-3" aria-hidden="true" /> Horizontal media card</p>
      </DzCard>
    </div>

    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Sizes</p>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DzCard v-for="size in ['xs', 'sm', 'md', 'lg']" :key="size" :size="size" bordered :title="`Size ${size}`">
          <p class="text-xs opacity-70">Card size {{ size }}</p>
        </DzCard>
      </div>
    </div>
  </div>
</template>
