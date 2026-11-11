<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/utils/cn'

const props = defineProps({
  horizontal: { type: Boolean, default: false },
  center: { type: Boolean, default: false },
})

const classes = computed(() =>
  cn('footer bg-base-200', {
    'footer-horizontal': props.horizontal,
    'footer-center': props.center,
  }),
)
</script>

<template>
  <footer :class="classes">
    <slot />
  </footer>
</template>
