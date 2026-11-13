/**
 * FormKit → DaisyUI theme, in the `generateClasses` object format consumed by
 * `@formkit/themes` (see src/plugins/formkit.ts).
 *
 * Keys are FormKit input types (plus `global` and `family:*` groups); each
 * maps section names to DaisyUI class strings. Sections not listed for a
 * type fall back to `global`, and `family:*` applies to every input in that
 * family. `$reset` at the start of a class string discards everything that
 * would otherwise be inherited.
 *
 * State colors (per project convention):
 * - Invalid fields: `formkit-invalid:*-error` / `formkit-errors:*-error` —
 *   these variants are provided by the `@formkit/themes/tailwindcss` plugin
 *   and match the `data-invalid` / `data-errors` attributes FormKit puts on
 *   the input's `outer` wrapper.
 * - Focused, valid fields: `focus:*-primary`. The error modifiers win by
 *   specificity, so an invalid field stays error-colored even when focused.
 */

/**
 * Text-like inputs (text, email, password, number, url, search, tel, color,
 * date, time, datetime-local, month, week) all render the DaisyUI `input`
 * component, so they share one definition.
 */
const textClassification = {
  wrapper: 'flex flex-col gap-1.5',
  inner: 'flex w-full items-center gap-2 input w-full focus-within:input-primary formkit-invalid:input-error formkit-errors:input-error',
}

/**
 * Box-family inputs (checkbox, radio) share the label/fieldset/option
 * layout; each input file only sets its own DaisyUI control class.
 */
const boxClassification = {
  wrapper: 'label flex cursor-pointer items-center gap-2.5',
  label: 'cursor-pointer',
  fieldset: 'flex min-w-0 flex-col gap-2 border-0 p-0',
  inner: 'flex items-center',
  options: 'mt-2 flex flex-col gap-2',
  option: 'flex flex-col gap-1',
  optionHelp: 'text-xs text-base-content/60',
  decorator: 'hidden',
  decoratorIcon: 'hidden',
}

const buttonClassification = {
  input: 'btn btn-primary',
}

/**
 * Custom component inputs registered in src/plugins/formkit.ts render their
 * own DaisyUI markup through `DzFormField`, so the theme contributes
 * nothing: `$reset` empties the wrapper sections createInput renders.
 */
const customClassification = {
  outer: '$reset',
  wrapper: '$reset',
  inner: '$reset',
  input: '$reset',
}

export default {
  /**
   * Applied to every input type. `group` on `outer` keeps Tailwind
   * `group-data-[...]` modifiers available in userland classes.
   */
  global: {
    outer: 'group flex min-w-0 flex-col gap-1.5',
    label: 'label justify-start text-sm font-medium',
    legend: 'label justify-start text-sm font-medium',
    help: 'mt-1 text-xs text-base-content/60',
    messages: 'mt-1 flex flex-col gap-1 text-xs',
    message: 'text-error',
    prefix: 'flex items-center text-base-content/50',
    suffix: 'flex items-center text-base-content/50',
  },

  // -------------------------------------------------------------------------
  // Text family
  // -------------------------------------------------------------------------
  text: textClassification,
  email: textClassification,
  password: textClassification,
  number: textClassification,
  url: textClassification,
  search: textClassification,
  tel: textClassification,
  color: textClassification,
  date: textClassification,
  time: textClassification,
  'datetime-local': textClassification,
  month: textClassification,
  week: textClassification,

  // -------------------------------------------------------------------------
  // Box family
  // -------------------------------------------------------------------------
  checkbox: {
    ...boxClassification,
    input: 'checkbox focus:checkbox-primary formkit-invalid:checkbox-error formkit-errors:checkbox-error',
  },
  radio: {
    ...boxClassification,
    input: 'radio focus:radio-primary formkit-invalid:radio-error formkit-errors:radio-error',
  },

  // -------------------------------------------------------------------------
  // Other native controls
  // -------------------------------------------------------------------------
  select: {
    wrapper: 'flex flex-col gap-1.5',
    inner: 'flex items-center select w-full focus:select-primary formkit-invalid:select-error formkit-errors:select-error',
    input: 'grow'
  },
  textarea: {
    wrapper: 'flex flex-col gap-1.5',
    inner: 'flex w-full',
    input: `
      textarea
      min-h-24
      w-full
      resize-y
      focus:textarea-primary
      formkit-invalid:textarea-error
      formkit-errors:textarea-error
    `,
  },
  range: {
    inner: 'w-full',
    input: `
      range
      w-full
      focus:range-primary
      formkit-invalid:range-error
      formkit-errors:range-error
    `,
  },
  file: {
    input: `
      file-input
      w-full
      focus:file-input-primary
      formkit-invalid:file-input-error
      formkit-errors:file-input-error
    `,
    fileList: 'mt-2 flex flex-col gap-1',
    fileItem: 'badge badge-ghost gap-2 py-3',
    fileItemIcon: 'hidden',
    fileName: 'max-w-56 truncate text-xs',
    fileRemove: 'btn btn-ghost btn-xs',
    fileRemoveIcon: 'hidden',
    noFiles: 'hidden',
    noFilesIcon: 'hidden',
  },

  // -------------------------------------------------------------------------
  // Buttons & form
  // -------------------------------------------------------------------------
  button: buttonClassification,
  submit: buttonClassification,
  form: {
    form: 'space-y-2',
    actions: 'mt-5 flex flex-wrap items-center gap-3',
    messages: 'mt-2 flex flex-col gap-1 text-xs',
  },

  // -------------------------------------------------------------------------
  // Custom component inputs (styled by their own components)
  // -------------------------------------------------------------------------
  dzToggle: customClassification,
  dzRating: customClassification,
  dzOtp: customClassification,
}
