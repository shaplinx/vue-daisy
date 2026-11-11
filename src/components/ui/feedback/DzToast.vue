<script setup lang="ts">
import { computed } from 'vue'
import type { Component, PropType } from 'vue'
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  XCircle,
} from '@lucide/vue'
import { useToast } from '@/composables/useToast'
import type { ToastNotification, ToastType } from '@/composables/useToast'
import { cn } from '@/utils/cn'

const props = defineProps({
  notifications: {
    type: Array as PropType<readonly ToastNotification[] | null>,
    default: null,
  },
  position: { type: String, default: 'bottom-end' },
  max: { type: Number, default: 5 },
  ariaLabel: { type: String, default: 'Notifications' },
})

const toast = useToast()

const items = computed<readonly ToastNotification[]>(() =>
  (props.notifications ?? toast.notifications).slice(-props.max),
)

const positionClass = computed(() => {
  const [vertical = 'bottom', horizontal = 'end'] = props.position.split('-')
  return cn('toast z-[100]', `toast-${vertical}`, `toast-${horizontal}`)
})

const icons: Record<ToastType, Component> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const alertClasses: Record<ToastType, string> = {
  success: 'alert-success',
  error: 'alert-error',
  warning: 'alert-warning',
  info: 'alert-info',
}

function iconFor(type: ToastType): Component {
  return icons[type] || Info
}

function onClose(notification: ToastNotification): void {
  if (notification.dismissible) toast.remove(notification.id)
}
</script>

<template>
  <div :class="positionClass" :aria-label="ariaLabel">
    <slot>
      <TransitionGroup name="toast-list" tag="div" class="flex w-full flex-col gap-2">
        <div
          v-for="notification in items"
          :key="notification.id"
          class="alert max-w-sm shadow-lg"
          :class="alertClasses[notification.type] || 'alert-info'"
          role="status"
          @mouseenter="toast.pause(notification.id)"
          @mouseleave="toast.resume(notification.id)"
        >
          <component :is="iconFor(notification.type)" class="size-5 shrink-0" aria-hidden="true" />
          <div class="flex-1">
            <h3 v-if="notification.title" class="text-sm font-semibold">{{ notification.title }}</h3>
            <p class="text-sm">{{ notification.message }}</p>
            <button
              v-if="notification.action"
              type="button"
              class="btn btn-ghost btn-xs mt-1"
              @click="notification.action.onClick?.()"
            >
              {{ notification.action.label }}
            </button>
          </div>
          <button
            v-if="notification.dismissible"
            type="button"
            class="btn btn-ghost btn-xs btn-circle"
            aria-label="Dismiss notification"
            @click="onClose(notification)"
          >
            <X class="size-4" aria-hidden="true" />
          </button>
        </div>
      </TransitionGroup>
    </slot>
  </div>
</template>
