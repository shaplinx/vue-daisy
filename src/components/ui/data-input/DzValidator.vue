<script setup>
import { computed, ref, useId } from 'vue'
import { cn } from '@/utils/cn'
import { modifier, COLORS, SIZES } from '@/utils/daisy'

const props = defineProps({
  modelValue: { type: String, default: '' },
  type: { type: String, default: 'text' },
  label: { type: String, default: '' },
  hint: { type: String, default: 'Please enter a valid value' },
  placeholder: { type: String, default: '' },
  size: { type: String, default: 'md' },
  color: { type: String, default: 'default' },
  required: { type: Boolean, default: false },
  pattern: { type: String, default: undefined },
  minlength: { type: [String, Number], default: undefined },
  maxlength: { type: [String, Number], default: undefined },
  min: { type: [String, Number], default: undefined },
  max: { type: [String, Number], default: undefined },
  disabled: { type: Boolean, default: false },
  name: { type: String, default: undefined },
})

const emit = defineEmits(['update:modelValue', 'input', 'validity'])
const uid = useId()
const input = ref(null)

const classes = computed(() =>
  cn(
    'input validator w-full',
    modifier('input', props.size, SIZES),
    modifier('input', props.color, COLORS),
  ),
)

function onInput(event) {
  emit('update:modelValue', event.target.value)
  emit('input', event)
  emit('validity', event.target.checkValidity())
}

defineExpose({ validate: () => input.value?.checkValidity() ?? false, input })
</script>

<template>
  <div class="w-full">
    <label v-if="label" class="label" :for="uid">
      <span class="label-text">{{ label }}</span>
      <span v-if="required" class="text-error" aria-hidden="true">*</span>
    </label>
    <input
      ref="input"
      :id="uid"
      :type="type"
      :class="classes"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :pattern="pattern"
      :minlength="minlength"
      :maxlength="maxlength"
      :min="min"
      :max="max"
      :disabled="disabled"
      :name="name"
      :aria-describedby="`${uid}-hint`"
      @input="onInput"
    />
    <p :id="`${uid}-hint`" class="validator-hint">
      <slot name="hint">{{ hint }}</slot>
    </p>
  </div>
</template>
