<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/utils/cn'

const props = defineProps({
  direction: { type: String, default: 'top' },
  as: { type: String, default: 'div' },
})

const classes = computed(() =>
  cn('stack', {
    'stack-top': props.direction === 'top',
    'stack-bottom': props.direction === 'bottom',
    'stack-start': props.direction === 'start',
    'stack-end': props.direction === 'end',
  }),
)
</script>

<template>
  <component :is="as" :class="classes">
    <slot />
  </component>
</template>
