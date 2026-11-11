<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/utils/cn'
import { modifier, COLORS } from '@/utils/daisy'

const props = defineProps({
  badge: { type: [String, Number], default: '' },
  color: { type: String, default: 'primary' },
  placement: { type: String, default: 'top-end' },
  size: { type: String, default: 'md' },
  ariaLabel: { type: String, default: 'Indicator' },
})

const classes = computed(() =>
  cn('indicator', {
    'indicator-top': props.placement.includes('top'),
    'indicator-bottom': props.placement.includes('bottom'),
    'indicator-start': props.placement.includes('start'),
    'indicator-end': props.placement.includes('end'),
    'indicator-center': props.placement.includes('center'),
    'indicator-middle': props.placement.includes('middle'),
  }),
)

const itemClasses = computed(() =>
  cn(
    'indicator-item badge',
    modifier('badge', props.color, COLORS),
    {
      'badge-xs': props.size === 'xs',
      'badge-sm': props.size === 'sm',
      'badge-lg': props.size === 'lg',
    },
  ),
)
</script>

<template>
  <div :class="classes" :aria-label="badge ? `${ariaLabel}: ${badge}` : ariaLabel">
    <slot name="indicator">
      <span v-if="badge !== ''" :class="itemClasses">{{ badge }}</span>
    </slot>
    <slot />
  </div>
</template>
