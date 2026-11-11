<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useId, useSlots, watch } from 'vue'
import type { PropType } from 'vue'
import type { ClassValue } from '@/utils/cn'
import { cn } from '@/utils/cn'

const props = defineProps({
  modelValue: { type: Boolean, default: undefined },
  placement: { type: String, default: 'end' },
  trigger: { type: String, default: 'click' },
  closeOnSelect: { type: Boolean, default: true },
  closeOnOutsideClick: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
  contentClass: { type: [String, Array, Object] as PropType<ClassValue>, default: '' },
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  open: []
  close: []
  select: [event: Event]
}>()

const root = ref<HTMLElement | null>(null)
const content = ref<HTMLElement | null>(null)
const internalOpen = ref(false)
const menuId = `dropdown-${useId()}`
const slots = useSlots()

const hasTriggerSlot = computed(() => Boolean(slots.trigger))

const isControlled = computed(() => props.modelValue !== undefined)
const isOpen = computed(() => (isControlled.value ? props.modelValue : internalOpen.value))

const placementClass = computed(() => {
  const allowed = ['end', 'top', 'bottom', 'left', 'right', 'center']
  return allowed.includes(props.placement) ? `dropdown-${props.placement}` : 'dropdown-end'
})

function setOpen(value: boolean): void {
  if (props.disabled) return
  if (!isControlled.value) internalOpen.value = value
  emit('update:modelValue', value)
  if (value) emit('open')
  else emit('close')
  if (value) nextTick(() => focusFirstItem())
}

function toggle(): void {
  setOpen(!isOpen.value)
}

function close(): void {
  if (isOpen.value) setOpen(false)
}

function focusableItems(): HTMLElement[] {
  if (!content.value) return []
  return Array.from(
    content.value.querySelectorAll<HTMLElement>(
      '[role="menuitem"]:not([disabled]), a[href]:not([aria-disabled="true"]), button:not([disabled])',
    ),
  )
}

function focusFirstItem(): void {
  const items = focusableItems()
  items[0]?.focus()
}

function focusItem(index: number): void {
  const items = focusableItems()
  if (!items.length) return
  const next = (index + items.length) % items.length
  items[next]?.focus()
}

function onTriggerClick(): void {
  // Custom trigger slots receive `toggle` and wire it themselves; the click
  // would otherwise bubble here and toggle a second time.
  if (hasTriggerSlot.value) return
  toggle()
}

function onTriggerKeydown(event: KeyboardEvent): void {
  if (props.disabled) return
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    setOpen(true)
  }
}

function onMenuKeydown(event: KeyboardEvent): void {
  const items = focusableItems()
  const current = items.indexOf(document.activeElement as HTMLElement)

  switch (event.key) {
    case 'Escape':
      event.preventDefault()
      close()
      root.value?.querySelector<HTMLElement>('[data-dropdown-trigger]')?.focus()
      break
    case 'ArrowDown':
      event.preventDefault()
      focusItem(current + 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      focusItem(current - 1)
      break
    case 'Home':
      event.preventDefault()
      focusItem(0)
      break
    case 'End':
      event.preventDefault()
      focusItem(items.length - 1)
      break
    case 'Tab':
      close()
      break
    default:
      break
  }
}

function onContentClick(event: Event): void {
  const target = event.target as HTMLElement
  if (props.closeOnSelect && target.closest('[role="menuitem"], a, button')) {
    emit('select', event)
    close()
  }
}

function onDocumentPointerDown(event: PointerEvent): void {
  if (!props.closeOnOutsideClick || !isOpen.value) return
  if (!root.value?.contains(event.target as Node)) close()
}

function onDocumentKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && isOpen.value) close()
}

function onMouseEnter(): void {
  if (props.trigger === 'hover') setOpen(true)
}

function onMouseLeave(): void {
  if (props.trigger === 'hover') close()
}

watch(
  isOpen,
  (open) => {
    if (open) {
      document.addEventListener('pointerdown', onDocumentPointerDown)
      document.addEventListener('keydown', onDocumentKeydown)
    } else {
      document.removeEventListener('pointerdown', onDocumentPointerDown)
      document.removeEventListener('keydown', onDocumentKeydown)
    }
  },
  // Attach the global listeners in the same tick the menu opens, so an
  // immediate Escape press is never missed.
  { flush: 'sync' },
)

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown)
  document.removeEventListener('keydown', onDocumentKeydown)
})

defineExpose({ open: () => setOpen(true), close, toggle, isOpen })
</script>

<template>
  <div
    ref="root"
    class="dropdown"
    :class="[placementClass, { 'dropdown-open': isOpen, 'dropdown-hover': trigger === 'hover' }]"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <div
      data-dropdown-trigger
      :aria-expanded="hasTriggerSlot ? undefined : isOpen"
      :aria-controls="menuId"
      aria-haspopup="menu"
      @click="onTriggerClick"
      @keydown="onTriggerKeydown"
    >
      <slot name="trigger" :open="isOpen" :toggle="toggle" :close="close">
        <button type="button" class="btn" :disabled="disabled">Open</button>
      </slot>
    </div>

    <div
      v-show="isOpen"
      :id="menuId"
      ref="content"
      role="menu"
      tabindex="-1"
      :class="cn('dropdown-content z-50 mt-2 rounded-box bg-base-100 shadow-xl', contentClass)"
      @keydown="onMenuKeydown"
      @click="onContentClick"
    >
      <slot :close="close" :open="isOpen" />
    </div>
  </div>
</template>
