<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/utils/cn'
import { modifier, COLORS, SIZES } from '@/utils/daisy'

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  max: { type: Number, default: 5 },
  size: { type: String, default: 'md' },
  color: { type: String, default: 'warning' },
  allowClear: { type: Boolean, default: true },
  readonly: { type: Boolean, default: false },
  label: { type: String, default: 'Rating' },
  id: { type: String, default: undefined },
  ariaDescribedby: { type: String, default: undefined },
})

const emit = defineEmits(['update:modelValue', 'change'])

const classes = computed(() => cn('rating', modifier('rating', props.size, SIZES)))

const starColor = computed(() => modifier('bg', props.color, COLORS))

function select(star: number): void {
  if (props.readonly) return
  const next = props.allowClear && props.modelValue === star ? 0 : star
  emit('update:modelValue', next)
  emit('change', next)
}
</script>

<template>
  <div
    :id="id"
    :class="classes"
    role="radiogroup"
    :aria-label="label"
    :aria-describedby="ariaDescribedby"
    :aria-disabled="readonly || undefined"
  >
    <button
      v-for="star in max"
      :key="star"
      type="button"
      class="mask mask-star-2"
      :class="[starColor, star <= modelValue ? '' : 'bg-base-300']"
      :aria-label="`${star} of ${max} stars`"
      :aria-checked="star === modelValue"
      role="radio"
      :disabled="readonly"
      @click="select(star)"
    />
  </div>
</template>
