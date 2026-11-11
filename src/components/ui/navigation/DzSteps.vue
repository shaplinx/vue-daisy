<script setup lang="ts">
import { computed } from 'vue'
import type { Component, PropType } from 'vue'
import { cn } from '@/utils/cn'
import { modifier, COLORS } from '@/utils/daisy'

export interface StepItem {
  id?: string | number
  label?: string
  description?: string
  icon?: Component
  color?: string
  disabled?: boolean
  [key: string]: unknown
}

const props = defineProps({
  items: { type: Array as PropType<StepItem[]>, default: () => [] },
  modelValue: { type: Number, default: 0 },
  vertical: { type: Boolean, default: false },
  responsive: { type: Boolean, default: false },
  clickable: { type: Boolean, default: false },
  color: { type: String, default: 'primary' },
  ariaLabel: { type: String, default: 'Progress steps' },
})

const emit = defineEmits<{
  'update:modelValue': [index: number]
  change: [index: number]
}>()

const classes = computed(() =>
  cn('steps', {
    'steps-vertical': props.vertical,
    'steps-horizontal': !props.vertical,
  }),
)

function isComplete(index: number): boolean {
  return index < props.modelValue
}

function isCurrent(index: number): boolean {
  return index === props.modelValue
}

function stepClass(item: StepItem, index: number): Record<string, boolean> {
  return {
    [modifier('step', item.color || props.color, COLORS)]: isComplete(index) || isCurrent(index),
    'opacity-50': !!item.disabled,
  }
}

function selectStep(item: StepItem, index: number): void {
  if (!props.clickable || item.disabled) return
  emit('update:modelValue', index)
  emit('change', index)
}

function onKeydown(event: KeyboardEvent, item: StepItem, index: number): void {
  if (!props.clickable) return
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    selectStep(item, index)
  }
}
</script>

<template>
  <ul :class="classes" :aria-label="ariaLabel">
    <li
      v-for="(item, index) in items"
      :key="item.id ?? index"
      class="step"
      :class="[stepClass(item, index), { 'cursor-pointer': clickable && !item.disabled }]"
      :aria-current="isCurrent(index) ? 'step' : undefined"
      :tabindex="clickable && !item.disabled ? 0 : undefined"
      @click="selectStep(item, index)"
      @keydown="onKeydown($event, item, index)"
    >
      <slot name="step" :item="item" :index="index" :current="isCurrent(index)" :complete="isComplete(index)">
        <span class="flex flex-col items-center gap-0.5">
          <span class="font-medium">{{ item.label }}</span>
          <span v-if="item.description" class="text-xs opacity-60">{{ item.description }}</span>
        </span>
      </slot>
    </li>
  </ul>
</template>
