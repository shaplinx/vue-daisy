<script setup>
import { computed } from 'vue'
import { cn } from '@/utils/cn'

const props = defineProps({
  variant: { type: String, default: 'rectangle' },
  lines: { type: Number, default: 1 },
  width: { type: [String, Number], default: '' },
  height: { type: [String, Number], default: '' },
  rounded: { type: Boolean, default: true },
})

const classes = computed(() =>
  cn('skeleton', {
    'skeleton-text': props.variant === 'text',
    'rounded-full': props.variant === 'circle' || (props.variant === 'avatar' && props.rounded),
  }),
)

const style = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width || undefined,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height || undefined,
}))
</script>

<template>
  <div v-if="lines > 1" class="flex w-full flex-col gap-2" aria-hidden="true">
    <div
      v-for="line in lines"
      :key="line"
      :class="[classes, 'h-4']"
      :style="{ ...style, width: line === lines ? '70%' : style.width }"
    />
  </div>
  <div v-else :class="classes" :style="style" aria-hidden="true" />
</template>
