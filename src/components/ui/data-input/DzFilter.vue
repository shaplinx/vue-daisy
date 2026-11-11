<script setup lang="ts">
import { ref } from 'vue'
import type { Component, PropType } from 'vue'
import { X } from '@lucide/vue'

export interface FilterItem {
  label: string
  value: string | number
  icon?: Component
  disabled?: boolean
}

const props = defineProps({
  items: { type: Array as PropType<FilterItem[]>, default: () => [] },
  modelValue: { type: [String, Number] as PropType<string | number>, default: '' },
  name: { type: String, default: 'filter' },
  showReset: { type: Boolean, default: true },
  resetLabel: { type: String, default: 'Reset filter' },
  ariaLabel: { type: String, default: 'Filter' },
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  change: [value: string | number]
  reset: []
}>()

const group = ref(null)

function select(item: FilterItem): void {
  if (item.disabled) return
  emit('update:modelValue', item.value)
  emit('change', item.value)
}

function reset(): void {
  emit('update:modelValue', '')
  emit('change', '')
  emit('reset')
}
</script>

<template>
  <div class="filter" role="group" :aria-label="ariaLabel">
    <button
      v-for="(item, index) in items"
      :key="item.value ?? index"
      type="button"
      class="btn btn-square"
      :class="{ 'btn-primary': modelValue === item.value, 'btn-disabled': item.disabled }"
      :aria-pressed="modelValue === item.value"
      :aria-label="item.label"
      :title="item.label"
      :disabled="item.disabled"
      @click="select(item)"
    >
      <component :is="item.icon" v-if="item.icon" class="size-4" aria-hidden="true" />
      <span v-else class="text-xs">{{ item.label }}</span>
    </button>

    <button
      v-if="showReset"
      type="button"
      class="btn btn-square"
      :aria-label="resetLabel"
      :title="resetLabel"
      @click="reset"
    >
      <X class="size-4" aria-hidden="true" />
    </button>
  </div>
</template>
