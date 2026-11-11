<script setup lang="ts">
import { ArrowRight, Sparkles } from '@lucide/vue'
import { gradientA, gradientE } from '@/showcase/demoAssets'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
</script>

<template>
  <div v-if="mode !== 'variants'" class="overflow-hidden rounded-box border border-base-300">
    <DzHero :image="gradientA" overlay min-height="min-h-[26rem]">
      <div class="max-w-lg text-white">
        <span class="badge badge-outline badge-sm mb-4 gap-1 border-white/40 text-white">
          <Sparkles class="size-3" aria-hidden="true" />
          Vue 3 + DaisyUI
        </span>
        <h2 class="text-4xl font-bold">Ship admin interfaces faster</h2>
        <p class="py-4 text-white/80">
          A complete set of accessible components, themes and layout primitives for your next dashboard.
        </p>
        <div class="flex flex-wrap justify-center gap-3">
          <DzButton color="primary">
            Get started
            <ArrowRight class="size-4" aria-hidden="true" />
          </DzButton>
          <DzButton variant="outline" class="border-white/50 text-white hover:bg-white/10">
            View components
          </DzButton>
        </div>
      </div>
    </DzHero>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Image with overlay</p>
      <div class="overflow-hidden rounded-box border border-base-300">
        <DzHero :image="gradientE" overlay min-height="min-h-64">
          <div class="text-white">
            <h2 class="text-3xl font-bold">Overlay hero</h2>
            <p class="mt-2 text-white/80">Background image plus a dark overlay for contrast.</p>
          </div>
        </DzHero>
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Plain, custom height</p>
      <div class="overflow-hidden rounded-box border border-base-300 bg-base-200">
        <DzHero min-height="min-h-52">
          <div>
            <h2 class="text-2xl font-bold">Plain hero</h2>
            <p class="py-2 text-sm opacity-70">No image, just the centered content slot.</p>
            <DzButton size="sm" color="primary">Primary action</DzButton>
          </div>
        </DzHero>
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Title &amp; description props</p>
      <div class="overflow-hidden rounded-box border border-base-300">
        <DzHero
          :image="gradientA"
          overlay
          min-height="min-h-48"
          title="Prop-driven hero"
          description="Pass a title and description instead of slot content."
        >
          <template #actions>
            <DzButton size="sm" color="primary">Action</DzButton>
          </template>
        </DzHero>
      </div>
    </div>
  </div>
</template>
