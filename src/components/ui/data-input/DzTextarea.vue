<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { cn } from '@/utils/cn'
import { modifier, COLORS, SIZES } from '@/utils/daisy'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  modelValue: { type: String, default: '' },
  rows: { type: Number, default: 3 },
  size: { type: String, default: 'md' },
  color: { type: String, default: 'default' },
  bordered: { type: Boolean, default: true },
  ghost: { type: Boolean, default: false },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  maxlength: { type: Number, default: undefined },
  showCount: { type: Boolean, default: false },
  invalid: { type: Boolean, default: false },
  resize: { type: String, default: 'vertical' },
})

const emit = defineEmits(['update:modelValue', 'input', 'change', 'focus', 'blur'])
const attrs = useAttrs()

const classes = computed(() =>
  cn(
    'textarea',
    modifier('textarea', props.size, SIZES),
    modifier('textarea', props.color, COLORS),
    {
      'textarea-bordered': props.bordered,
      'textarea-ghost': props.ghost,
      'textarea-error': props.invalid,
      'resize-none': props.resize === 'none',
      'resize-y': props.resize === 'vertical',
      'resize-x': props.resize === 'horizontal',
      'resize': props.resize === 'both',
    },
  ),
)

function onInput(event: Event): void {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
  emit('input', event)
}
</script>

<template>
  <div class="w-full">
    <textarea
      v-bind="attrs"
      :class="[classes, attrs.class]"
      :rows="rows"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :aria-invalid="invalid || undefined"
      @input="onInput"
      @change="emit('change', $event)"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
    />
    <div
      v-if="showCount"
      class="mt-1 text-end text-xs opacity-60"
      aria-live="polite"
    >
      {{ modelValue.length }}{{ maxlength ? ` / ${maxlength}` : '' }}
    </div>
  </div>
</template>
