<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/utils/cn'
import { modifier, SIZES } from '@/utils/daisy'

const props = defineProps({
  vertical: { type: Boolean, default: false },
  size: { type: String, default: 'md' },
})

const classes = computed(() =>
  cn('join', modifier('join', props.size, SIZES), { 'join-vertical': props.vertical }),
)
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
