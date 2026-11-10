import { onScopeDispose, ref } from 'vue'

/**
 * Copy text to the clipboard with a legacy fallback and transient feedback.
 */
export function useClipboard({ timeout = 1600 } = {}) {
  const copied = ref(false)
  let timer

  async function copy(text) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.setAttribute('readonly', '')
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      copied.value = true
      clearTimeout(timer)
      timer = setTimeout(() => {
        copied.value = false
      }, timeout)
      return true
    } catch {
      copied.value = false
      return false
    }
  }

  onScopeDispose(() => clearTimeout(timer))

  return { copied, copy }
}
