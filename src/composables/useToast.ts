import { reactive, readonly } from 'vue'
import type { Component } from 'vue'

export type ToastType = 'info' | 'success' | 'warning' | 'error'

export interface ToastAction {
  label: string
  onClick?: () => void
}

export interface ToastOptions {
  type?: ToastType
  title?: string
  message?: string
  /** Auto-dismiss delay in ms. Use 0 to keep the toast until dismissed manually. */
  duration?: number
  dismissible?: boolean
  icon?: Component
  action?: ToastAction
}

export interface ToastNotification {
  id: number
  type: ToastType
  title: string
  message: string
  duration: number
  dismissible: boolean
  icon?: Component
  action?: ToastAction
}

let seed = 0
const timers = new Map<number, ReturnType<typeof setTimeout>>()

const state = reactive<{ notifications: ToastNotification[] }>({ notifications: [] })

function remove(id: number): void {
  const index = state.notifications.findIndex((item) => item.id === id)
  if (index !== -1) state.notifications.splice(index, 1)
  const timer = timers.get(id)
  if (timer) {
    clearTimeout(timer)
    timers.delete(id)
  }
}

function schedule(id: number, duration: number): void {
  if (!duration || duration <= 0) return
  const timer = setTimeout(() => remove(id), duration)
  timers.set(id, timer)
}

/**
 * Add a toast notification.
 * @param options Toast options, or a plain message string.
 * @returns The notification id.
 */
function add(options: ToastOptions | string): number {
  const config: ToastOptions =
    typeof options === 'string' ? { message: options } : { ...options }
  const id = ++seed
  const notification: ToastNotification = {
    id,
    type: config.type ?? 'info',
    title: config.title ?? '',
    message: config.message ?? '',
    duration: config.duration ?? 4000,
    dismissible: config.dismissible !== false,
    icon: config.icon,
    action: config.action,
  }
  state.notifications.push(notification)
  schedule(id, notification.duration)
  return id
}

function pause(id: number): void {
  const timer = timers.get(id)
  if (timer) {
    clearTimeout(timer)
    timers.delete(id)
  }
}

function resume(id: number): void {
  const notification = state.notifications.find((item) => item.id === id)
  if (notification && !timers.has(id)) schedule(id, notification.duration)
}

function clear(): void {
  timers.forEach((timer) => clearTimeout(timer))
  timers.clear()
  state.notifications.splice(0)
}

const toast = {
  // `readonly()` deep-maps the interface; the plain interface is preserved
  // because every field is already immutable-friendly.
  notifications: readonly(state.notifications) as readonly ToastNotification[],
  add,
  remove,
  clear,
  pause,
  resume,
  success: (message: string, options: Partial<ToastOptions> = {}) =>
    add({ ...options, message, type: 'success' }),
  error: (message: string, options: Partial<ToastOptions> = {}) =>
    add({ ...options, message, type: 'error' }),
  warning: (message: string, options: Partial<ToastOptions> = {}) =>
    add({ ...options, message, type: 'warning' }),
  info: (message: string, options: Partial<ToastOptions> = {}) =>
    add({ ...options, message, type: 'info' }),
}

export type ToastApi = typeof toast

/** App-wide toast queue (single shared store via module state). */
export function useToast(): ToastApi {
  return toast
}
