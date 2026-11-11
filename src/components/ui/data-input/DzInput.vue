<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { X } from '@lucide/vue'
import { cn } from '@/utils/cn'
import { modifier, COLORS, SIZES } from '@/utils/daisy'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' },
  size: { type: String, default: 'md' },
  color: { type: String, default: 'default' },
  bordered: { type: Boolean, default: true },
  ghost: { type: Boolean, default: false },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
  invalid: { type: Boolean, default: false },
  id: { type: String, default: undefined },
  ariaLabel: { type: String, default: '' },
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  input: [event: Event]
  change: [event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  clear: []
  enter: [event: KeyboardEvent]
}>()
const attrs = useAttrs()
const input = ref<HTMLInputElement | null>(null)

// `class` styles the visual wrapper; every other attribute belongs on the input.
const inputAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})

const classes = computed(() =>
  cn(
    'input',
    modifier('input', props.size, SIZES),
    modifier('input', props.color, COLORS),
    {
      'input-bordered': props.bordered,
      'input-ghost': props.ghost,
      'input-error': props.invalid,
    },
  ),
)

function onInput(event: Event): void {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
  emit('input', event)
}

function clear(): void {
  emit('update:modelValue', '')
  emit('clear')
  input.value?.focus()
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter') emit('enter', event)
}

defineExpose({ focus: () => input.value?.focus(), blur: () => input.value?.blur(), input })
</script>

<template>
  <label v-if="$slots.prefix || $slots.suffix || clearable" :class="[classes, attrs.class]">
    <slot name="prefix" />
    <input
      ref="input"
      v-bind="inputAttrs"
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :aria-label="ariaLabel || placeholder || undefined"
      :aria-invalid="invalid || undefined"
      class="grow bg-transparent outline-none"
      @input="onInput"
      @change="emit('change', $event)"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
      @keydown="onKeydown"
    />
    <button
      v-if="clearable && modelValue"
      type="button"
      class="btn btn-ghost btn-xs btn-circle"
      aria-label="Clear input"
      @click.prevent="clear"
    >
      <X class="size-3.5" aria-hidden="true" />
    </button>
    <slot name="suffix" />
  </label>

  <input
    v-else
    ref="input"
    v-bind="attrs"
    :id="id"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :aria-label="ariaLabel || placeholder || undefined"
    :aria-invalid="invalid || undefined"
    :class="[classes, attrs.class]"
    @input="onInput"
    @change="emit('change', $event)"
    @focus="emit('focus', $event)"
    @blur="emit('blur', $event)"
    @keydown="onKeydown"
  />
</template>
