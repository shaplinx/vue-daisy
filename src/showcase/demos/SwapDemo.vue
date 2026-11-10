<script setup>
import { ref } from 'vue'
import { Heart, Volume2, VolumeX } from '@lucide/vue'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const liked = ref(false)
const sound = ref(true)
const flip = ref(false)
</script>

<template>
  <div v-if="mode !== 'variants'" class="flex flex-wrap items-center gap-8">
    <div class="flex flex-col items-center gap-2">
      <DzSwap v-model="liked" animation="rotate" size="lg" aria-label="Toggle favourite">
        <template #on><Heart class="size-8 fill-error text-error" aria-hidden="true" /></template>
        <template #off><Heart class="size-8 opacity-40" aria-hidden="true" /></template>
      </DzSwap>
      <span class="text-xs opacity-60">{{ liked ? 'Favourited' : 'Not favourited' }}</span>
    </div>

    <div class="flex flex-col items-center gap-2">
      <DzSwap v-model="sound" animation="flip" size="lg" aria-label="Toggle sound">
        <template #on><Volume2 class="size-8 text-primary" aria-hidden="true" /></template>
        <template #off><VolumeX class="size-8 opacity-40" aria-hidden="true" /></template>
      </DzSwap>
      <span class="text-xs opacity-60">Sound {{ sound ? 'on' : 'off' }}</span>
    </div>

    <div class="flex flex-col items-center gap-2">
      <DzSwap v-model="flip" animation="flip" size="lg" aria-label="Flip card">
        <template #on><span class="text-2xl">🎉</span></template>
        <template #off><span class="text-2xl">🎁</span></template>
      </DzSwap>
      <span class="text-xs opacity-60">{{ flip ? 'Revealed' : 'Hidden' }}</span>
    </div>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Animations</p>
      <div class="flex items-center gap-8">
        <DzSwap :model-value="true" animation="rotate" aria-label="Rotate on"><template #on><span class="text-2xl">✓</span></template><template #off><span class="text-2xl">✕</span></template></DzSwap>
        <DzSwap :model-value="true" animation="flip" aria-label="Flip on"><template #on><span class="text-2xl">✓</span></template><template #off><span class="text-2xl">✕</span></template></DzSwap>
        <DzSwap :model-value="false" animation="rotate" aria-label="Rotate off"><template #on><span class="text-2xl">✓</span></template><template #off><span class="text-2xl">✕</span></template></DzSwap>
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Sizes</p>
      <div class="flex items-center gap-8">
        <DzSwap :model-value="true" size="sm" aria-label="Small"><template #on><span class="text-lg">✓</span></template><template #off><span class="text-lg">✕</span></template></DzSwap>
        <DzSwap :model-value="true" size="md" aria-label="Medium"><template #on><span class="text-2xl">✓</span></template><template #off><span class="text-2xl">✕</span></template></DzSwap>
        <DzSwap :model-value="true" size="lg" aria-label="Large"><template #on><span class="text-4xl">✓</span></template><template #off><span class="text-4xl">✕</span></template></DzSwap>
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">States</p>
      <div class="flex items-center gap-8">
        <DzSwap :model-value="true" active aria-label="Active"><template #on><span class="text-2xl">✓</span></template><template #off><span class="text-2xl">✕</span></template></DzSwap>
        <DzSwap :model-value="false" disabled aria-label="Disabled"><template #on><span class="text-2xl">✓</span></template><template #off><span class="text-2xl">✕</span></template></DzSwap>
      </div>
    </div>
  </div>
</template>
