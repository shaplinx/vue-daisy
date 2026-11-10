<script setup>
import { computed } from 'vue'
import { cn } from '@/utils/cn'
import { modifier, COLORS, SIZES } from '@/utils/daisy'

const props = defineProps({
  color: { type: String, default: 'default' },
  size: { type: String, default: 'md' },
  variant: { type: String, default: 'solid' },
  as: { type: String, default: 'span' },
})

const classes = computed(() =>
  cn(
    'badge',
    modifier('badge', props.color, COLORS),
    modifier('badge', props.size, SIZES),
    modifier('badge', props.variant, ['outline', 'soft', 'dash', 'ghost']),
  ),
)
</script>

<template>
  <component :is="as" :class="classes">
    <slot name="icon" />
    <slot />
  </component>
</template>
