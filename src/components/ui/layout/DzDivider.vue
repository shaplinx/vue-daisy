<script setup>
import { computed } from 'vue'
import { cn } from '@/utils/cn'
import { modifier, COLORS } from '@/utils/daisy'

const props = defineProps({
  orientation: { type: String, default: 'horizontal' },
  color: { type: String, default: 'default' },
  position: { type: String, default: 'start' },
  text: { type: String, default: '' },
})

const classes = computed(() =>
  cn(
    'divider',
    { 'divider-horizontal': props.orientation === 'vertical' },
    modifier('divider', props.color, COLORS),
    modifier('divider', props.position, ['start', 'end', 'center']),
  ),
)
</script>

<template>
  <div :class="classes" role="separator" :aria-orientation="orientation">
    <slot>{{ text }}</slot>
  </div>
</template>
