<script setup>
import { computed } from 'vue'
import { cn } from '@/utils/cn'

const props = defineProps({
  sticky: { type: Boolean, default: false },
  bordered: { type: Boolean, default: false },
  shadow: { type: Boolean, default: false },
  ariaLabel: { type: String, default: 'Main navigation' },
})

const classes = computed(() =>
  cn('navbar', {
    'sticky top-0 z-30': props.sticky,
    'border-b border-base-300': props.bordered,
    shadow: props.shadow,
  }),
)
</script>

<template>
  <nav :class="classes" :aria-label="ariaLabel">
    <div class="navbar-start">
      <slot name="start" />
    </div>
    <div class="navbar-center">
      <slot name="center" />
    </div>
    <div class="navbar-end">
      <slot name="end" />
    </div>
    <slot />
  </nav>
</template>
