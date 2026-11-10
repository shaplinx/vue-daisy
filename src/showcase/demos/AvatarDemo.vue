<script setup>
import { UserRound } from '@lucide/vue'
import { gradientA, gradientB } from '@/showcase/demoAssets'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const sizes = ['xs', 'sm', 'md', 'lg', 'xl']
const colors = ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error']
const shapes = ['circle', 'squircle', 'rounded', 'square', 'hexagon', 'star']
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-5">
    <div class="flex flex-wrap items-center gap-5">
      <DzAvatar size="lg" alt="Alex Morgan" placeholder="AM" status="online" ring="primary" />
      <DzAvatar size="lg" alt="Jamie Lee" placeholder="JL" status="offline" />
      <DzAvatar size="lg" :src="gradientA" alt="Aurora avatar" ring="secondary" />
      <DzAvatar size="lg" alt="No photo" />
      <div class="flex -space-x-3">
        <DzAvatar size="md" alt="Alex Morgan" placeholder="AM" ring="primary" />
        <DzAvatar size="md" alt="Jamie Lee" placeholder="JL" ring="secondary" />
        <DzAvatar size="md" alt="Riley Kim" placeholder="RK" ring="accent" />
        <DzAvatar size="md" alt="Sam Patel" placeholder="SP" ring="info" />
      </div>
    </div>
    <p class="text-xs text-base-content/60">
      Images fall back to initials or an icon when the source is missing or fails to load.
    </p>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Sizes</p>
      <div class="flex flex-wrap items-end gap-3">
        <DzAvatar v-for="size in sizes" :key="size" :size="size" alt="Alex Morgan" placeholder="AM" />
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Shapes</p>
      <div class="flex flex-wrap items-center gap-3">
        <DzAvatar v-for="shape in shapes" :key="shape" :shape="shape" :src="shape === 'star' ? gradientB : gradientA" :alt="shape" />
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Rings &amp; status</p>
      <div class="flex flex-wrap items-center gap-3">
        <DzAvatar v-for="color in colors" :key="color" :ring="color" alt="Alex Morgan" placeholder="AM" />
        <DzAvatar status="online" alt="Online" placeholder="ON" ring="success" />
        <DzAvatar status="offline" alt="Offline" placeholder="OF" />
        <DzAvatar :icon="UserRound" alt="Icon fallback" />
      </div>
    </div>
  </div>
</template>
