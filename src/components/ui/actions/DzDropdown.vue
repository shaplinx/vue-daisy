<script setup>
import { computed, nextTick, onBeforeUnmount, ref, useId, useSlots, watch } from 'vue'
import { cn } from '@/utils/cn'

const props = defineProps({
  modelValue: { type: Boolean, default: undefined },
  placement: { type: String, default: 'end' },
  trigger: { type: String, default: 'click' },
  closeOnSelect: { type: Boolean, default: true },
  closeOnOutsideClick: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
  contentClass: { type: [String, Array, Object], default: '' },
})

const emit = defineEmits(['update:modelValue', 'open', 'close', 'select'])

const root = ref(null)
const content = ref(null)
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

function setOpen(value) {
  if (props.disabled) return
  if (!isControlled.value) internalOpen.value = value
  emit('update:modelValue', value)
  emit(value ? 'open' : 'close')
  if (value) nextTick(() => focusFirstItem())
}

function toggle() {
  setOpen(!isOpen.value)
}

function close() {
  if (isOpen.value) setOpen(false)
}

function focusableItems() {
  if (!content.value) return []
  return Array.from(
    content.value.querySelectorAll(
      '[role="menuitem"]:not([disabled]), a[href]:not([aria-disabled="true"]), button:not([disabled])',
    ),
  )
}

function focusFirstItem() {
  const items = focusableItems()
  items[0]?.focus()
}

function focusItem(index) {
  const items = focusableItems()
  if (!items.length) return
  const next = (index + items.length) % items.length
  items[next]?.focus()
}

function onTriggerClick() {
  // Custom trigger slots receive `toggle` and wire it themselves; the click
  // would otherwise bubble here and toggle a second time.
  if (hasTriggerSlot.value) return
  toggle()
}

function onTriggerKeydown(event) {
  if (props.disabled) return
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    setOpen(true)
  }
}

function onMenuKeydown(event) {
  const items = focusableItems()
  const current = items.indexOf(document.activeElement)

  switch (event.key) {
    case 'Escape':
      event.preventDefault()
      close()
      root.value?.querySelector('[data-dropdown-trigger]')?.focus()
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

function onContentClick(event) {
  if (props.closeOnSelect && event.target.closest('[role="menuitem"], a, button')) {
    emit('select', event)
    close()
  }
}

function onDocumentPointerDown(event) {
  if (!props.closeOnOutsideClick || !isOpen.value) return
  if (!root.value?.contains(event.target)) close()
}

function onDocumentKeydown(event) {
  if (event.key === 'Escape' && isOpen.value) close()
}

function onMouseEnter() {
  if (props.trigger === 'hover') setOpen(true)
}

function onMouseLeave() {
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
