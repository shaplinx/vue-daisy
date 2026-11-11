<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/utils/cn'

const props = defineProps({
  variant: { type: String, default: 'border' },
  size: { type: String, default: 'md' },
  duration: { type: [String, Number], default: null },
})

const classes = computed(() =>
  cn('aura', {
    'aura-dual': props.variant === 'dual',
    'aura-rainbow': props.variant === 'rainbow',
    'aura-holo': props.variant === 'holo',
    'aura-gold': props.variant === 'gold',
    'aura-silver': props.variant === 'silver',
    'aura-glow': props.variant === 'glow',
    'aura-xs': props.size === 'xs',
    'aura-sm': props.size === 'sm',
    'aura-lg': props.size === 'lg',
    'aura-xl': props.size === 'xl',
  }),
)

const style = computed(() =>
  props.duration ? { '--duration': `${props.duration}ms`, animationDuration: `${props.duration}ms` } : {},
)
</script>

<template>
  <div :class="classes" :style="style">
    <slot />
  </div>
</template>
