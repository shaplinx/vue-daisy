import { readonly, reactive } from 'vue'

let seed = 0
const timers = new Map()

const state = reactive({
  notifications: [],
})

function remove(id) {
  const index = state.notifications.findIndex((item) => item.id === id)
  if (index !== -1) state.notifications.splice(index, 1)
  const timer = timers.get(id)
  if (timer) {
    clearTimeout(timer)
    timers.delete(id)
  }
}

function schedule(id, duration) {
  if (!duration || duration <= 0) return
  const timer = setTimeout(() => remove(id), duration)
  timers.set(id, timer)
}

/**
 * Add a toast notification.
 * @param {object|string} options Toast options, or a message string.
 * @returns {number} The notification id.
 */
function add(options) {
  const config = typeof options === 'string' ? { message: options } : { ...options }
  const id = ++seed
  const notification = {
    id,
    type: config.type || 'info',
    title: config.title || '',
    message: config.message || '',
    duration: config.duration ?? 4000,
    dismissible: config.dismissible !== false,
    icon: config.icon,
    action: config.action,
  }
  state.notifications.push(notification)
  schedule(id, notification.duration)
  return id
}

function pause(id) {
  const timer = timers.get(id)
  if (timer) {
    clearTimeout(timer)
    timers.delete(id)
  }
}

function resume(id) {
  const notification = state.notifications.find((item) => item.id === id)
  if (notification && !timers.has(id)) schedule(id, notification.duration)
}

function clear() {
  timers.forEach((timer) => clearTimeout(timer))
  timers.clear()
  state.notifications.splice(0)
}

const toast = {
  notifications: readonly(state.notifications),
  add,
  remove,
  clear,
  pause,
  resume,
  success: (message, options = {}) => add({ ...options, message, type: 'success' }),
  error: (message, options = {}) => add({ ...options, message, type: 'error' }),
  warning: (message, options = {}) => add({ ...options, message, type: 'warning' }),
  info: (message, options = {}) => add({ ...options, message, type: 'info' }),
}

export function useToast() {
  return toast
}
