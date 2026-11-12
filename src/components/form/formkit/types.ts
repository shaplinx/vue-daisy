/**
 * Minimal structural types for FormKit's framework context.
 *
 * FormKit only needs custom components for controls it does not ship
 * (`dzToggle`, `dzRating`, `dzOtp`). Every other input type is a built-in
 * FormKit input styled by the DaisyUI theme in `src/plugins/formkit.theme.ts`.
 *
 * FormKit does not re-export `FormKitFrameworkContext` from `@formkit/vue`,
 * and `@formkit/core` is a transitive dependency. Declaring the small surface
 * our custom inputs actually consume keeps the components decoupled from
 * FormKit internals while still being fully typed.
 */

export interface FormKitMessageLike {
  key: string
  value: string
  type?: string
  meta?: Record<string, unknown>
}

export interface FormKitInputStateLike {
  invalid?: boolean
  required?: boolean
  dirty?: boolean
  blurred?: boolean
  complete?: boolean
}

export interface FormKitNodeLike {
  input: (value: unknown) => void
  props: Record<string, any>
}

export interface FormKitInputContext<T = unknown> {
  /** The input's unique DOM id. */
  id: string
  /** The registered input type, e.g. `dzToggle`. */
  type: string
  label?: string
  help?: string
  disabled?: boolean
  value: T
  _value?: T
  attrs: Record<string, any>
  classes: Record<string, string>
  /** Space separated ids for help text and validation messages. */
  describedBy?: string
  messages: Record<string, FormKitMessageLike>
  state: FormKitInputStateLike
  handlers: {
    blur: (event?: FocusEvent) => void
    touch: () => void
    [key: string]: (...args: any[]) => void
  }
  node: FormKitNodeLike
  slots?: Record<string, (...args: any[]) => unknown>
}

/** FormKit only exposes validation messages that are ready to be displayed. */
export function visibleMessages(context: FormKitInputContext): FormKitMessageLike[] {
  return Object.values(context.messages ?? {})
}
