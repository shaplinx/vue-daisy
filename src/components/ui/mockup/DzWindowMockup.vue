<script setup>
import { cn } from '@/utils/cn'

const props = defineProps({
  bordered: { type: Boolean, default: true },
  contentClass: { type: [String, Array, Object], default: '' },
})
</script>

<template>
  <div class="mockup-window w-full bg-base-100" :class="{ 'border border-base-300': bordered }">
    <div :class="cn('flex justify-center bg-base-200 p-6', contentClass)">
      <slot />
    </div>
  </div>
</template>
