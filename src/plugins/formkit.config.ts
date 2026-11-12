import type { App } from 'vue'
import { createInput, defaultConfig, plugin } from '@formkit/vue'
import { generateClasses } from '@formkit/themes'
import theme from './formkit.theme'
import {
  availableUsername,
  maxFileSize,
  noDisposableEmail,
  strongPassword,
} from '@/utils/formkitRules'
import DzFormToggle from '@/components/form/formkit/DzFormToggle.vue'
import DzFormRating from '@/components/form/formkit/DzFormRating.vue'
import DzFormOtp from '@/components/form/formkit/DzFormOtp.vue'

/**
 * `createInput` wraps a component in FormKit's default outer → wrapper →
 * label → inner → help → messages schema. Our custom inputs render their own
 * field layout through `DzFormField`, so the default label, help and message
 * sections are disabled to prevent duplicate markup. The outer/wrapper/inner
 * sections remain, which keeps FormKit's `outer-class` and state attributes.
 */
const customInputSections = {
  label: { if: 'false' },
  help: { if: 'false' },
  messages: { if: 'false' },
} as const

/**
 * Custom FormKit inputs.
 *
 * FormKit already ships every text, choice, date, range and file input type
 * used by the application. Those are rendered by FormKit itself and styled
 * with the DaisyUI theme in `./formkit.theme.ts` — no wrapper is
 * needed. Only controls absent from FormKit get a component input here:
 *
 * - `dzToggle` → `DzToggle`
 * - `dzRating` → `DzRating`
 * - `dzOtp`    → `DzOtp`
 *
 * Usage:
 *   <FormKit type="email" name="email" label="Email" validation="required|email" />
 *   <FormKit type="dzToggle" name="notifications" label="Notifications" />
 *
 * `dzOtp` intentionally has no `family` — its component renders the whole
 * DaisyUI control itself, so family/text theme classes would otherwise bleed
 * into the `createInput` wrapper sections.
 */
export const formkitDaisyInputs = {
  dzToggle: createInput(DzFormToggle, {}, customInputSections),
  dzRating: createInput(DzFormRating, { family: 'rating' }, customInputSections),
  dzOtp: createInput(DzFormOtp, {}, customInputSections),
}

/**
 * Register FormKit once at the application root.
 *
 * Forms are authored as regular Vue templates. `generateClasses` turns the
 * DaisyUI theme object in `./formkit.theme.ts` into per-section class
 * functions; FormKit's default `rootClasses` stays active so sections also
 * keep their `formkit-*` semantic classes.
 */
export function registerFormKit(app: App): void {
  app.use(
    plugin,
    defaultConfig({
      inputs: formkitDaisyInputs,
      rules: {
        strongPassword,
        noDisposableEmail,
        availableUsername,
        maxFileSize,
      },
      config: {
        classes: generateClasses(theme),
      },
    }),
  )
}
