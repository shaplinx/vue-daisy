<script setup>
import { computed } from 'vue'
import { cn } from '@/utils/cn'
import { modifier, COLORS, SIZES } from '@/utils/daisy'

const props = defineProps({
  modelValue: { type: [String, Number, Boolean], default: '' },
  value: { type: [String, Number, Boolean], default: '' },
  name: { type: String, default: 'radio' },
  size: { type: String, default: 'md' },
  color: { type: String, default: 'default' },
  label: { type: String, default: '' },
  description: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'change'])

const classes = computed(() =>
  cn('radio', modifier('radio', props.size, SIZES), modifier('radio', props.color, COLORS)),
)

function onChange(event) {
  emit('update:modelValue', props.value)
  emit('change', event)
}
</script>

<template>
  <label
    class="flex cursor-pointer items-start gap-3"
    :class="{ 'cursor-not-allowed opacity-60': disabled }"
  >
    <input
      type="radio"
      :class="classes"
      :name="name"
      :value="value"
      :checked="modelValue === value"
      :disabled="disabled"
      @change="onChange"
    />
    <span v-if="label || description || $slots.default" class="flex flex-col">
      <span class="text-sm font-medium"><slot>{{ label }}</slot></span>
      <span v-if="description" class="text-xs opacity-60">{{ description }}</span>
    </span>
  </label>
</template>
