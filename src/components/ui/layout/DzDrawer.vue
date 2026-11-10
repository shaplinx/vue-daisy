<script setup>
import { computed, useId } from 'vue'
import { cn } from '@/utils/cn'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  side: { type: String, default: 'start' },
  responsive: { type: String, default: 'lg' },
  width: { type: String, default: 'w-80' },
  contentClass: { type: [String, Array, Object], default: '' },
})

const emit = defineEmits(['update:modelValue', 'change'])
const uid = useId()

const rootClass = computed(() =>
  cn('drawer', {
    'drawer-end': props.side === 'end',
    'lg:drawer-open': props.responsive === 'lg',
    'md:drawer-open': props.responsive === 'md',
  }),
)

const sideClass = computed(() => cn('drawer-side z-40', props.width))

function onChange(event) {
  emit('update:modelValue', event.target.checked)
  emit('change', event.target.checked)
}
</script>

<template>
  <div :class="rootClass">
    <input
      :id="uid"
      type="checkbox"
      class="drawer-toggle"
      :checked="modelValue"
      @change="onChange"
    />

    <div class="drawer-content" :class="contentClass">
      <slot />
    </div>

    <div :class="sideClass">
      <label :for="uid" class="drawer-overlay" aria-label="Close sidebar" />
      <aside class="min-h-full bg-base-100">
        <slot name="sidebar" />
      </aside>
    </div>
  </div>
</template>
