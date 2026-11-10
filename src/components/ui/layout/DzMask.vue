<script setup>
import { computed } from 'vue'
import { cn } from '@/utils/cn'

const props = defineProps({
  shape: { type: String, default: 'squircle' },
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
  size: { type: String, default: 'w-24' },
})

const classes = computed(() => cn('mask', `mask-${props.shape}`, props.size))
</script>

<template>
  <div :class="classes">
    <img v-if="src" :src="src" :alt="alt" />
    <slot v-else />
  </div>
</template>
