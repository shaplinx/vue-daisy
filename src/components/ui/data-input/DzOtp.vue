<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { cn } from '@/utils/cn'
import { modifier, COLORS, SIZES } from '@/utils/daisy'

const props = defineProps({
  modelValue: { type: String, default: '' },
  length: { type: Number, default: 6 },
  size: { type: String, default: 'md' },
  color: { type: String, default: 'default' },
  joined: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  autofocus: { type: Boolean, default: false },
  label: { type: String, default: 'One-time password' },
  name: { type: String, default: 'otp' },
})

const emit = defineEmits(['update:modelValue', 'change', 'complete'])

const input = ref(null)

const classes = computed(() =>
  cn(
    'otp',
    modifier('otp', props.size, SIZES),
    modifier('otp', props.color, COLORS),
    { 'otp-joined': props.joined },
  ),
)

function onInput(event) {
  const value = event.target.value.replace(/\D/g, '').slice(0, props.length)
  event.target.value = value
  emit('update:modelValue', value)
  emit('change', value)
  if (value.length === props.length) emit('complete', value)
}

onMounted(() => {
  if (props.autofocus) nextTick(() => input.value?.focus())
})

defineExpose({ focus: () => input.value?.focus(), input })
</script>

<template>
  <div class="w-full">
    <label :class="classes" :aria-label="label">
      <span v-for="index in length" :key="index" aria-hidden="true" />
      <input
        ref="input"
        type="text"
        :name="name"
        :value="modelValue"
        :maxlength="length"
        :disabled="disabled"
        inputmode="numeric"
        autocomplete="one-time-code"
        :pattern="`[0-9]{${length}}`"
        :aria-label="label"
        @input="onInput"
      />
    </label>
  </div>
</template>
