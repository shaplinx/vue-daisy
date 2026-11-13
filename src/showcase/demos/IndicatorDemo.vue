<script setup lang="ts">
import { Bell, Heart, ShoppingCart, Star } from '@lucide/vue'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-6">
    <div class="flex flex-wrap items-center gap-8">
      <DzIndicator badge="3" color="error" aria-label="Notifications">
        <DzButton variant="ghost" circle aria-label="Notifications">
          <template #icon><Bell class="size-5" aria-hidden="true" /></template>
        </DzButton>
      </DzIndicator>
      <DzIndicator badge="12" color="primary" aria-label="Cart items">
        <DzButton variant="outline" circle aria-label="Cart">
          <template #icon><ShoppingCart class="size-5" aria-hidden="true" /></template>
        </DzButton>
      </DzIndicator>
      <DzIndicator badge="New" color="success" placement="bottom-start" aria-label="Status">
        <DzAvatar alt="Reza Irfan" placeholder="AM" ring="primary" />
      </DzIndicator>
      <DzIndicator badge="" aria-label="Favourite">
        <template #indicator>
          <span class="indicator-item badge badge-secondary badge-sm">
            <Heart class="size-3" aria-hidden="true" />
          </span>
        </template>
        <DzAvatar alt="Jamie Lee" placeholder="JL" />
      </DzIndicator>
    </div>
    <p class="text-xs text-base-content/60">
      The indicator wraps any element and places a badge or custom slot on the chosen corner.
    </p>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Colors</p>
      <div class="flex flex-wrap items-center gap-8">
        <DzIndicator
          v-for="color in ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error']"
          :key="color"
          :badge="color[0].toUpperCase()"
          :color="color"
        >
          <DzAvatar alt="User" placeholder="U" />
        </DzIndicator>
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Sizes</p>
      <div class="flex flex-wrap items-center gap-8">
        <DzIndicator
          v-for="size in ['xs', 'sm', 'md', 'lg']"
          :key="size"
          badge="9"
          :size="size"
          color="primary"
        >
          <DzButton variant="outline" circle :size="size">
            <template #icon><Star class="size-4" aria-hidden="true" /></template>
          </DzButton>
        </DzIndicator>
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Placements</p>
      <div class="flex flex-wrap items-center gap-10">
        <DzIndicator
          v-for="placement in ['top-start', 'top-end', 'bottom-start', 'bottom-end', 'center']"
          :key="placement"
          badge="•"
          :placement="placement"
          color="secondary"
        >
          <div class="grid size-20 place-items-center rounded-box bg-base-200 text-xs">{{ placement }}</div>
        </DzIndicator>
      </div>
    </div>
  </div>
</template>
