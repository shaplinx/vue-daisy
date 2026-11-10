<script setup>
import { computed, useId } from 'vue'
import { CalendarDays } from '@lucide/vue'
import DzInput from './DzInput.vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  type: { type: String, default: 'date' },
  label: { type: String, default: '' },
  min: { type: String, default: undefined },
  max: { type: String, default: undefined },
  step: { type: [String, Number], default: undefined },
  size: { type: String, default: 'md' },
  color: { type: String, default: 'default' },
  disabled: { type: Boolean, default: false },
  name: { type: String, default: undefined },
})

const emit = defineEmits(['update:modelValue', 'change'])
const uid = useId()

const inputType = computed(() =>
  ['date', 'month', 'week', 'time', 'datetime-local'].includes(props.type) ? props.type : 'date',
)
</script>

<template>
  <div class="w-full">
    <label v-if="label" class="label" :for="uid">
      <span class="label-text">{{ label }}</span>
    </label>
    <DzInput
      :id="uid"
      :model-value="modelValue"
      :type="inputType"
      :size="size"
      :color="color"
      :disabled="disabled"
      :min="min"
      :max="max"
      :step="step"
      :name="name"
      @update:model-value="emit('update:modelValue', $event)"
      @change="emit('change', $event)"
    >
      <template #prefix>
        <CalendarDays class="size-4 opacity-50" aria-hidden="true" />
      </template>
    </DzInput>
  </div>
</template>
