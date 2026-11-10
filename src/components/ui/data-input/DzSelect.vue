<script setup>
import { computed, useAttrs } from 'vue'
import { cn } from '@/utils/cn'
import { modifier, COLORS, SIZES } from '@/utils/daisy'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  modelValue: { type: [String, Number, Array], default: '' },
  options: { type: Array, default: () => [] },
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

const emit = defineEmits(['update:modelValue', 'change', 'focus', 'blur'])
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

const groups = computed(() => {
  const grouped = new Map()
  for (const option of props.options) {
    const group = option.group || ''
    if (!grouped.has(group)) grouped.set(group, [])
    grouped.get(group).push(option)
  }
  return Array.from(grouped.entries()).map(([label, options]) => ({ label, options }))
})

function onChange(event) {
  const value = props.multiple
    ? Array.from(event.target.selectedOptions).map((option) => option.value)
    : event.target.value
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
          :selected="multiple ? modelValue.includes(option.value) : modelValue === option.value"
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
          :selected="multiple ? modelValue.includes(option.value) : modelValue === option.value"
        >
          {{ option.label }}
        </option>
      </template>
    </template>
  </select>
</template>
