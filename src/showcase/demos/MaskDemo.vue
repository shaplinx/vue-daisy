<script setup>
import { gradientA, gradientB, gradientC, gradientD, gradientE, gradientF } from '@/showcase/demoAssets'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()

const shapes = [
  { shape: 'squircle', src: gradientA, label: 'Squircle' },
  { shape: 'heart', src: gradientB, label: 'Heart' },
  { shape: 'hexagon', src: gradientC, label: 'Hexagon' },
  { shape: 'star', src: gradientD, label: 'Star' },
  { shape: 'triangle', src: gradientE, label: 'Triangle' },
  { shape: 'circle', src: gradientF, label: 'Circle' },
]
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-5">
    <div class="flex flex-wrap items-end gap-6">
      <DzMask
        v-for="item in shapes.slice(0, 4)"
        :key="item.shape"
        :shape="item.shape"
        :src="item.src"
        :alt="`${item.label} mask`"
        size="w-28"
      />
    </div>
    <p class="text-xs text-base-content/60">
      Masks crop images and any slotted content. Use the <code>size</code> prop to control dimensions.
    </p>
    <div class="flex flex-wrap items-center gap-4">
      <DzMask shape="squircle" size="w-20">
        <div class="grid size-full place-items-center bg-primary text-xs font-semibold text-primary-content">
          Slot
        </div>
      </DzMask>
      <DzMask shape="hexagon" size="w-20">
        <div class="grid size-full place-items-center bg-secondary text-xs font-semibold text-secondary-content">
          Content
        </div>
      </DzMask>
    </div>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Shapes</p>
      <div class="flex flex-wrap items-end gap-6">
        <div v-for="item in shapes" :key="item.shape" class="text-center">
          <DzMask :shape="item.shape" :src="item.src" :alt="`${item.label} mask`" size="w-24" />
          <p class="mt-2 text-xs opacity-60">{{ item.label }}</p>
        </div>
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Sizes</p>
      <div class="flex flex-wrap items-end gap-6">
        <DzMask
          v-for="size in ['w-12', 'w-16', 'w-24', 'w-32']"
          :key="size"
          shape="squircle"
          :src="gradientA"
          :alt="`Size ${size}`"
          :size="size"
        />
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Half masks</p>
      <div class="flex flex-wrap items-end gap-6">
        <DzMask shape="half-1" :src="gradientE" alt="Half one" size="w-24" />
        <DzMask shape="half-2" :src="gradientF" alt="Half two" size="w-24" />
      </div>
    </div>
  </div>
</template>
