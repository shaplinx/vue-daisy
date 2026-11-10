<script setup>
import { computed, ref, useId } from 'vue'
import { ChevronDown } from '@lucide/vue'
import { cn } from '@/utils/cn'

const props = defineProps({
  items: { type: Array, default: () => [] },
  modelValue: { type: [Array, String, Number], default: undefined },
  multiple: { type: Boolean, default: false },
  bordered: { type: Boolean, default: false },
  icon: { type: String, default: 'arrow' },
})

const emit = defineEmits(['update:modelValue', 'change'])
const uid = useId()
const internal = ref([])

const isControlled = computed(() => props.modelValue !== undefined)

const openIds = computed(() => {
  if (isControlled.value) {
    return Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue]
  }
  return internal.value
})

function itemId(item, index) {
  return item.id ?? item.key ?? index
}

function isOpen(item, index) {
  return openIds.value.includes(itemId(item, index))
}

function toggle(item, index) {
  const id = itemId(item, index)
  let next
  if (props.multiple) {
    next = isOpen(item, index)
      ? openIds.value.filter((value) => value !== id)
      : [...openIds.value, id]
  } else {
    next = isOpen(item, index) ? [] : [id]
  }

  if (!isControlled.value) internal.value = next
  emit('update:modelValue', props.multiple ? next : (next[0] ?? null))
  emit('change', next)
}

function panelId(item, index) {
  return `${uid}-panel-${itemId(item, index)}`
}

function headerId(item, index) {
  return `${uid}-header-${itemId(item, index)}`
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div
      v-for="(item, index) in items"
      :key="itemId(item, index)"
      class="collapse"
      :class="[
        bordered ? 'collapse-border border border-base-300' : '',
        icon === 'arrow' ? 'collapse-arrow' : '',
        icon === 'plus' ? 'collapse-plus' : '',
        { 'collapse-open': isOpen(item, index) },
      ]"
    >
      <button
        :id="headerId(item, index)"
        type="button"
        class="collapse-title flex items-center gap-2 text-start font-medium"
        :aria-expanded="isOpen(item, index)"
        :aria-controls="panelId(item, index)"
        @click="toggle(item, index)"
      >
        <component
          :is="item.icon"
          v-if="item.icon"
          class="size-4 shrink-0 text-base-content/70"
          aria-hidden="true"
        />
        <span class="flex-1">
          <slot name="title" :item="item" :index="index" :open="isOpen(item, index)">
            {{ item.title }}
          </slot>
        </span>
        <ChevronDown
          v-if="icon === 'chevron'"
          class="size-4 transition-transform"
          :class="{ 'rotate-180': isOpen(item, index) }"
          aria-hidden="true"
        />
      </button>

      <div
        :id="panelId(item, index)"
        class="collapse-content"
        role="region"
        :aria-labelledby="headerId(item, index)"
        :aria-hidden="!isOpen(item, index)"
      >
        <slot name="content" :item="item" :index="index" :open="isOpen(item, index)">
          <p class="whitespace-pre-line">{{ item.content }}</p>
        </slot>
      </div>
    </div>
    <slot />
  </div>
</template>
