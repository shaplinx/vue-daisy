<script setup>
import { computed } from 'vue'
import { cn } from '@/utils/cn'
import { modifier, COLORS, SIZES } from '@/utils/daisy'

const props = defineProps({
  size: { type: String, default: 'md' },
  color: { type: String, default: 'default' },
  as: { type: String, default: 'kbd' },
})

const classes = computed(() =>
  cn(
    'kbd',
    modifier('kbd', props.size, SIZES),
    modifier('kbd', props.color, COLORS),
  ),
)
</script>

<template>
  <component :is="as" :class="classes">
    <slot />
  </component>
</template>
