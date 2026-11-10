<script setup>
import { cn } from '@/utils/cn'

const props = defineProps({
  url: { type: String, default: 'https://daisyui.com' },
  bordered: { type: Boolean, default: true },
  contentClass: { type: [String, Array, Object], default: '' },
})
</script>

<template>
  <div class="mockup-browser w-full bg-base-100" :class="{ 'border border-base-300': bordered }">
    <div class="mockup-browser-toolbar">
      <div class="input">{{ url }}</div>
    </div>
    <div :class="cn('flex justify-center bg-base-200 p-6', contentClass)">
      <slot />
    </div>
  </div>
</template>
