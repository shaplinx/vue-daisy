import type { FormKitInputs } from '@formkit/inputs'

/**
 * Teach FormKit's prop types about the component-based custom inputs that
 * `src/plugins/formkit.ts` registers at runtime.
 *
 * These are the only input types that need a custom component: FormKit ships
 * every other control (text, email, select, checkbox, radio, date, file,
 * range, etc.) and those are styled by the DaisyUI theme in
 * `src/plugins/formkit.theme.ts`.
 */
declare module '@formkit/inputs' {
  interface FormKitInputProps<Props extends FormKitInputs<Props>> {
    dzToggle: { type: 'dzToggle'; value?: boolean }

    dzRating: {
      type: 'dzRating'
      value?: number
      max?: number
      allowClear?: boolean
      readonly?: boolean
    }

    dzOtp: {
      type: 'dzOtp'
      value?: string
      length?: number
      joined?: boolean
    }
  }
}
