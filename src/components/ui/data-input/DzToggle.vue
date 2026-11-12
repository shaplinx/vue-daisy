<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/utils/cn'
import { modifier, COLORS, SIZES } from '@/utils/daisy'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  size: { type: String, default: 'md' },
  color: { type: String, default: 'default' },
  label: { type: String, default: '' },
  description: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  invalid: { type: Boolean, default: false },
  name: { type: String, default: undefined },
  id: { type: String, default: undefined },
  ariaDescribedby: { type: String, default: undefined },
  ariaRequired: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'change', 'blur'])

const classes = computed(() =>
  cn(
    'toggle',
    modifier('toggle', props.size, SIZES),
    modifier('toggle', props.color, COLORS),
    { 'toggle-error': props.invalid },
  ),
)

function onChange(event: Event): void {
  emit('update:modelValue', (event.target as HTMLInputElement).checked)
  emit('change', event)
}
</script>

<template>
  <label
    class="flex cursor-pointer items-center gap-3"
    :class="{ 'cursor-not-allowed opacity-60': disabled }"
  >
    <input
      type="checkbox"
      :class="classes"
      :checked="modelValue"
      :disabled="disabled"
      :name="name"
      :id="id"
      :aria-describedby="ariaDescribedby"
      :aria-required="ariaRequired || undefined"
      :aria-invalid="invalid || undefined"
      :aria-label="label || 'Toggle'"
      @change="onChange"
      @blur="emit('blur', $event)"
    />
    <span v-if="label || description || $slots.default" class="flex flex-col">
      <span class="text-sm font-medium"><slot>{{ label }}</slot></span>
      <span v-if="description" class="text-xs opacity-60">{{ description }}</span>
    </span>
  </label>
</template>
