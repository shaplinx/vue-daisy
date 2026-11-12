import { ref } from 'vue'
import { useToast } from '@/composables/useToast'

export type DemoFormStatus = 'idle' | 'success' | 'error'

export interface DemoFormOptions {
  /** Toast shown after a successful submit. */
  message?: string
  /** Simulated network latency in milliseconds. */
  delay?: number
}

/**
 * Shared async submit handler for the FormKit examples.
 *
 * Each example still owns its own normal Vue template and `<FormKit>` fields;
 * this composable only provides the loading/success feedback around submit.
 */
export function useDemoForm(options: DemoFormOptions = {}) {
  const toast = useToast()
  const status = ref<DemoFormStatus>('idle')
  const submitting = ref(false)
  const lastSubmission = ref<Record<string, unknown> | null>(null)

  async function submit(payload: unknown): Promise<void> {
    submitting.value = true
    status.value = 'idle'
    try {
      await new Promise((resolve) => setTimeout(resolve, options.delay ?? 700))
      lastSubmission.value = payload as Record<string, unknown>
      status.value = 'success'
      toast.success(options.message ?? 'Form submitted successfully')
    } catch {
      status.value = 'error'
      toast.error('Submission failed')
    } finally {
      submitting.value = false
    }
  }

  function resetStatus(): void {
    status.value = 'idle'
    lastSubmission.value = null
  }

  return { status, submitting, lastSubmission, submit, resetStatus }
}
