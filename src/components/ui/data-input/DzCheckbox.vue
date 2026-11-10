<script setup>
import { computed, ref, watch } from 'vue'
import { cn } from '@/utils/cn'
import { modifier, COLORS, SIZES } from '@/utils/daisy'

const props = defineProps({
  modelValue: { type: [Boolean, Array], default: false },
  value: { type: [String, Number, Boolean], default: true },
  indeterminate: { type: Boolean, default: false },
  size: { type: String, default: 'md' },
  color: { type: String, default: 'default' },
  label: { type: String, default: '' },
  description: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  name: { type: String, default: undefined },
})

const emit = defineEmits(['update:modelValue', 'change'])

const input = ref(null)

const isArray = computed(() => Array.isArray(props.modelValue))
const isChecked = computed(() =>
  isArray.value ? props.modelValue.includes(props.value) : Boolean(props.modelValue),
)

const classes = computed(() =>
  cn('checkbox', modifier('checkbox', props.size, SIZES), modifier('checkbox', props.color, COLORS)),
)

function onChange(event) {
  if (isArray.value) {
    const next = event.target.checked
      ? [...props.modelValue, props.value]
      : props.modelValue.filter((item) => item !== props.value)
    emit('update:modelValue', next)
  } else {
    emit('update:modelValue', event.target.checked)
  }
  emit('change', event)
}

watch(
  () => props.indeterminate,
  (value) => {
    if (input.value) input.value.indeterminate = value
  },
  { immediate: true },
)
</script>

<template>
  <label
    v-if="label || description || $slots.default"
    class="flex cursor-pointer items-start gap-3"
    :class="{ 'cursor-not-allowed opacity-60': disabled }"
  >
    <input
      ref="input"
      type="checkbox"
      :class="classes"
      :checked="isChecked"
      :disabled="disabled"
      :name="name"
      @change="onChange"
    />
    <span class="flex flex-col">
      <span class="text-sm font-medium"><slot>{{ label }}</slot></span>
      <span v-if="description" class="text-xs opacity-60">{{ description }}</span>
    </span>
  </label>
  <input
    v-else
    ref="input"
    type="checkbox"
    :class="classes"
    :checked="isChecked"
    :disabled="disabled"
    :name="name"
    :aria-label="label || 'Checkbox'"
    @change="onChange"
  />
</template>
