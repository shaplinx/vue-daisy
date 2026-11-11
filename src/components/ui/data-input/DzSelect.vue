<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import type { PropType } from 'vue'
import { cn } from '@/utils/cn'
import { modifier, COLORS, SIZES } from '@/utils/daisy'

defineOptions({ inheritAttrs: false })

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
  group?: string
}

export type SelectValue = string | number | Array<string | number>

const props = defineProps({
  modelValue: { type: [String, Number, Array] as PropType<SelectValue>, default: '' },
  options: { type: Array as PropType<SelectOption[]>, default: () => [] },
  placeholder: { type: String, default: '' },
  size: { type: String, default: 'md' },
  color: { type: String, default: 'default' },
  bordered: { type: Boolean, default: true },
  ghost: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false },
  invalid: { type: Boolean, default: false },
  ariaLabel: { type: String, default: 'Select an option' },
})

const emit = defineEmits<{
  'update:modelValue': [value: SelectValue]
  change: [event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()
const attrs = useAttrs()

const classes = computed(() =>
  cn(
    'select',
    modifier('select', props.size, SIZES),
    modifier('select', props.color, COLORS),
    {
      'select-bordered': props.bordered,
      'select-ghost': props.ghost,
      'select-error': props.invalid,
    },
  ),
)

const groups = computed<Array<{ label: string; options: SelectOption[] }>>(() => {
  const grouped = new Map<string, SelectOption[]>()
  for (const option of props.options) {
    const group = option.group ?? ''
    if (!grouped.has(group)) grouped.set(group, [])
    grouped.get(group)?.push(option)
  }
  return Array.from(grouped.entries()).map(([label, options]) => ({ label, options }))
})

function isSelected(value: string | number): boolean {
  if (props.multiple) {
    return Array.isArray(props.modelValue) && props.modelValue.includes(value)
  }
  return props.modelValue === value
}

function onChange(event: Event): void {
  const target = event.target as HTMLSelectElement
  const value: SelectValue = props.multiple
    ? Array.from(target.selectedOptions).map((option) => option.value)
    : target.value
  emit('update:modelValue', value)
  emit('change', event)
}
</script>

<template>
  <select
    v-bind="attrs"
    :class="[classes, attrs.class]"
    :value="modelValue"
    :multiple="multiple"
    :disabled="disabled"
    :aria-label="ariaLabel"
    :aria-invalid="invalid || undefined"
    @change="onChange"
    @focus="emit('focus', $event)"
    @blur="emit('blur', $event)"
  >
    <option v-if="placeholder" disabled value="">{{ placeholder }}</option>
    <template v-for="group in groups" :key="group.label">
      <optgroup v-if="group.label" :label="group.label">
        <option
          v-for="option in group.options"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
          :selected="isSelected(option.value)"
        >
          {{ option.label }}
        </option>
      </optgroup>
      <template v-else>
        <option
          v-for="option in group.options"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
          :selected="isSelected(option.value)"
        >
          {{ option.label }}
        </option>
      </template>
    </template>
  </select>
</template>
