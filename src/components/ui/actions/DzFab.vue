<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import type { Component, PropType } from 'vue'
import { Plus, X } from '@lucide/vue'
import { cn } from '@/utils/cn'
import { modifier, COLORS, SIZES } from '@/utils/daisy'

export interface FabAction {
  id?: string | number
  label: string
  icon?: Component
  color?: string
  [key: string]: unknown
}

const props = defineProps({
  modelValue: { type: Boolean, default: undefined },
  items: { type: Array as PropType<FabAction[]>, default: () => [] },
  icon: { type: [Object, Function] as PropType<Component | null>, default: null },
  color: { type: String, default: 'primary' },
  size: { type: String, default: 'lg' },
  flower: { type: Boolean, default: false },
  closeOnAction: { type: Boolean, default: true },
  ariaLabel: { type: String, default: 'Open actions' },
  itemSize: { type: String, default: 'lg' },
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  action: [payload: { item: FabAction; index: number; event: MouseEvent }]
  open: []
  close: []
}>()

const trigger = ref<HTMLElement | null>(null)
const internalOpen = ref(false)
const isControlled = computed(() => props.modelValue !== undefined)
const isOpen = computed(() => (isControlled.value ? props.modelValue : internalOpen.value))

const rootClass = computed(() =>
  cn('fab', {
    'fab-flower': props.flower,
  }),
)

const mainClass = computed(() =>
  cn(
    'btn btn-circle',
    modifier('btn', props.color, COLORS),
    modifier('btn', props.size, SIZES),
  ),
)

function setOpen(value: boolean): void {
  if (!isControlled.value) internalOpen.value = value
  emit('update:modelValue', value)
  if (value) emit('open')
  else emit('close')
}

function toggle(): void {
  setOpen(!isOpen.value)
  nextTick(() => {
    if (!isOpen.value) trigger.value?.blur()
  })
}

function onAction(item: FabAction, index: number, event: MouseEvent): void {
  emit('action', { item, index, event })
  if (props.closeOnAction) {
    setOpen(false)
    trigger.value?.blur()
  }
}

function onFocusOut(event: FocusEvent): void {
  const currentTarget = event.currentTarget
  if (!(currentTarget instanceof Node) || !currentTarget.contains(event.relatedTarget as Node | null)) {
    setOpen(false)
  }
}

watch(
  () => props.modelValue,
  (value) => {
    if (value) nextTick(() => trigger.value?.focus())
  },
)
</script>

<template>
  <div :class="rootClass" @focusout="onFocusOut">
    <div
      ref="trigger"
      tabindex="0"
      role="button"
      :aria-label="ariaLabel"
      :aria-expanded="isOpen"
      :class="[mainClass, { 'rotate-45': isOpen }]"
      @click="toggle"
      @keydown.enter.prevent="toggle"
      @keydown.space.prevent="toggle"
    >
      <component :is="icon || Plus" class="size-6" aria-hidden="true" />
    </div>

    <button
      v-for="(item, index) in items"
      :key="item.id ?? index"
      type="button"
      class="btn btn-circle"
      :class="[modifier('btn', item.color, COLORS), modifier('btn', itemSize, SIZES)]"
      :aria-label="item.label"
      :title="item.label"
      @click="onAction(item, index, $event)"
    >
      <component :is="item.icon || X" class="size-5" aria-hidden="true" />
      <span class="sr-only">{{ item.label }}</span>
    </button>

    <slot />
  </div>
</template>
