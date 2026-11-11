<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import type { Component, PropType } from 'vue'
import { ChevronDown } from '@lucide/vue'
import { cn } from '@/utils/cn'

export interface AccordionItem {
  id?: string | number
  key?: string | number
  title?: string
  content?: string
  icon?: Component
  [key: string]: unknown
}

export type AccordionValue = Array<string | number> | string | number | null

const props = defineProps({
  items: { type: Array as PropType<AccordionItem[]>, default: () => [] },
  modelValue: { type: [Array, String, Number] as PropType<AccordionValue>, default: undefined },
  multiple: { type: Boolean, default: false },
  bordered: { type: Boolean, default: false },
  icon: { type: String, default: 'arrow' },
})

const emit = defineEmits<{
  'update:modelValue': [value: AccordionValue]
  change: [openIds: Array<string | number>]
}>()

const uid = useId()
const internal = ref<Array<string | number>>([])

const isControlled = computed(() => props.modelValue !== undefined)

const openIds = computed<Array<string | number>>(() => {
  if (isControlled.value) {
    if (Array.isArray(props.modelValue)) return props.modelValue
    return props.modelValue == null ? [] : [props.modelValue]
  }
  return internal.value
})

function itemId(item: AccordionItem, index: number): string | number {
  return item.id ?? item.key ?? index
}

function isOpen(item: AccordionItem, index: number): boolean {
  return openIds.value.includes(itemId(item, index))
}

function toggle(item: AccordionItem, index: number): void {
  const id = itemId(item, index)
  let next: Array<string | number>
  if (props.multiple) {
    next = isOpen(item, index)
      ? openIds.value.filter((value) => value !== id)
      : [...openIds.value, id]
  } else {
    next = isOpen(item, index) ? [] : [id]
  }

  if (!isControlled.value) internal.value = next
  emit('update:modelValue', props.multiple ? next : (next[0] ?? null))
  emit('change', next)
}

function panelId(item: AccordionItem, index: number): string {
  return `${uid}-panel-${itemId(item, index)}`
}

function headerId(item: AccordionItem, index: number): string {
  return `${uid}-header-${itemId(item, index)}`
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div
      v-for="(item, index) in items"
      :key="itemId(item, index)"
      class="collapse"
      :class="[
        bordered ? 'collapse-border border border-base-300' : '',
        icon === 'arrow' ? 'collapse-arrow' : '',
        icon === 'plus' ? 'collapse-plus' : '',
        { 'collapse-open': isOpen(item, index) },
      ]"
    >
      <button
        :id="headerId(item, index)"
        type="button"
        class="collapse-title flex items-center gap-2 text-start font-medium"
        :aria-expanded="isOpen(item, index)"
        :aria-controls="panelId(item, index)"
        @click="toggle(item, index)"
      >
        <component
          :is="item.icon"
          v-if="item.icon"
          class="size-4 shrink-0 text-base-content/70"
          aria-hidden="true"
        />
        <span class="flex-1">
          <slot name="title" :item="item" :index="index" :open="isOpen(item, index)">
            {{ item.title }}
          </slot>
        </span>
        <ChevronDown
          v-if="icon === 'chevron'"
          class="size-4 transition-transform"
          :class="{ 'rotate-180': isOpen(item, index) }"
          aria-hidden="true"
        />
      </button>

      <div
        :id="panelId(item, index)"
        class="collapse-content"
        role="region"
        :aria-labelledby="headerId(item, index)"
        :aria-hidden="!isOpen(item, index)"
      >
        <slot name="content" :item="item" :index="index" :open="isOpen(item, index)">
          <p class="whitespace-pre-line">{{ item.content }}</p>
        </slot>
      </div>
    </div>
    <slot />
  </div>
</template>
