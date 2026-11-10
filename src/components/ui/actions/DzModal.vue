<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { X } from '@lucide/vue'
import { cn } from '@/utils/cn'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  size: { type: String, default: 'md' },
  position: { type: String, default: 'middle' },
  backdropClose: { type: Boolean, default: true },
  escClose: { type: Boolean, default: true },
  showClose: { type: Boolean, default: true },
  loading: { type: Boolean, default: false },
  hideHeader: { type: Boolean, default: false },
  contentClass: { type: [String, Array, Object], default: '' },
})

const emit = defineEmits(['update:modelValue', 'close', 'open', 'confirm'])

const dialog = ref(null)

const sizeClass = computed(
  () =>
    ({
      sm: 'max-w-sm',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
      full: 'max-w-[min(96vw,72rem)]',
    })[props.size] || 'max-w-lg',
)

const positionClass = computed(() =>
  ['top', 'middle', 'bottom', 'start', 'end'].includes(props.position)
    ? `modal-${props.position}`
    : 'modal-middle',
)

function open() {
  if (!dialog.value || dialog.value.open) return
  dialog.value.showModal()
  emit('open')
}

function close(reason = 'programmatic') {
  if (!dialog.value?.open) return
  dialog.value.close(reason)
}

function onCancel(event) {
  if (!props.escClose) {
    event.preventDefault()
    return
  }
  emit('update:modelValue', false)
  emit('close', 'escape')
}

function onDialogClick(event) {
  if (event.target !== dialog.value) return
  if (!props.backdropClose) return
  close('backdrop')
}

function onCloseEvent() {
  emit('update:modelValue', false)
  emit('close', 'close')
}

watch(
  () => props.modelValue,
  (value) => {
    if (value) nextTick(open)
    else close()
  },
)

onMounted(() => {
  if (props.modelValue) nextTick(open)
})

onBeforeUnmount(() => close())

defineExpose({ open, close })
</script>

<template>
  <dialog
    ref="dialog"
    class="modal"
    :class="positionClass"
    :aria-label="title || 'Dialog'"
    @cancel="onCancel"
    @click="onDialogClick"
    @close="onCloseEvent"
  >
    <div class="modal-box" :class="[sizeClass, contentClass]">
      <header v-if="!hideHeader" class="mb-4 flex items-start justify-between gap-4">
        <div>
          <slot name="header">
            <h2 v-if="title" class="text-lg font-semibold">{{ title }}</h2>
            <p v-if="description" class="mt-1 text-sm text-base-content/70">{{ description }}</p>
          </slot>
        </div>
        <button
          v-if="showClose"
          type="button"
          class="btn btn-ghost btn-sm btn-circle"
          aria-label="Close dialog"
          @click="close('button')"
        >
          <X class="size-4" aria-hidden="true" />
        </button>
      </header>

      <slot />

      <footer v-if="$slots.footer || $slots.actions" class="modal-action">
        <slot name="footer">
          <slot name="actions" :close="close" />
        </slot>
      </footer>
    </div>

    <form v-if="backdropClose" method="dialog" class="modal-backdrop">
      <button type="submit" aria-label="Close dialog" @click="emit('update:modelValue', false)">
        close
      </button>
    </form>
  </dialog>
</template>
