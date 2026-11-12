<script setup lang="ts">
import {
  CheckCircle2,
  ClipboardCheck,
  FileUp,
  Layers,
  ListChecks,
  ShieldCheck,
  Sparkles,
} from '@lucide/vue'
import CodeBlock from '@/showcase/CodeBlock.vue'
import FormDemoCard from '@/showcase/forms/FormDemoCard.vue'
import BasicFormDemo from '@/showcase/forms/BasicFormDemo.vue'
import ConditionalFormDemo from '@/showcase/forms/ConditionalFormDemo.vue'
import FileUploadFormDemo from '@/showcase/forms/FileUploadFormDemo.vue'
import LoginFormDemo from '@/showcase/forms/LoginFormDemo.vue'
import ProfileFormDemo from '@/showcase/forms/ProfileFormDemo.vue'
import RegistrationFormDemo from '@/showcase/forms/RegistrationFormDemo.vue'
import RepeatingFormDemo from '@/showcase/forms/RepeatingFormDemo.vue'
import ValidationFormDemo from '@/showcase/forms/ValidationFormDemo.vue'

const demos = [
  {
    id: 'basic-form',
    title: 'Basic form',
    description:
      'Contact form with text, email, select, textarea and consent checkbox, submitted through the shared async handler.',
    badge: 'Foundations',
    component: BasicFormDemo,
  },
  {
    id: 'login-form',
    title: 'Login form',
    description:
      'Compact credentials form with password length validation, a remember-me checkbox and a loading submit button.',
    badge: 'Auth',
    component: LoginFormDemo,
  },
  {
    id: 'registration-form',
    title: 'Registration form',
    description:
      'Account creation flow exercising required, email, length, custom, async and cross-field rules.',
    badge: 'Validation',
    component: RegistrationFormDemo,
  },
  {
    id: 'profile-form',
    title: 'Profile form',
    description:
      'Edit an existing profile seeded through the form value prop, including date, range and toggle inputs.',
    badge: 'Seeded values',
    component: ProfileFormDemo,
  },
  {
    id: 'validation-form',
    title: 'Complex validation form',
    description:
      'Every major rule type side by side: required, email, length, numeric, regex, URL and cross-field dates.',
    badge: 'Rules',
    component: ValidationFormDemo,
  },
  {
    id: 'conditional-form',
    title: 'Conditional fields',
    description:
      'Plain v-if and v-model drive business or personal fields, with no schema definitions involved.',
    badge: 'Conditional',
    component: ConditionalFormDemo,
  },
  {
    id: 'repeating-form',
    title: 'Repeating groups',
    description:
      'Dynamic FormKit list of grouped contact rows with add and remove controls that stay fully validated.',
    badge: 'Dynamic list',
    component: RepeatingFormDemo,
  },
  {
    id: 'file-upload-form',
    title: 'File upload form',
    description:
      'Built-in file input with validated File objects, including multiple optional supporting uploads.',
    badge: 'Files',
    component: FileUploadFormDemo,
  },
]

const builtInGroups = [
  {
    label: 'Text',
    types: ['text', 'email', 'password', 'number', 'url', 'search', 'tel', 'color', 'textarea'],
  },
  {
    label: 'Choice',
    types: ['select', 'checkbox', 'radio'],
  },
  {
    label: 'Date & time',
    types: ['date', 'time', 'datetime-local', 'month', 'week'],
  },
  {
    label: 'Range & files',
    types: ['range', 'file'],
  },
]

const builtInCount = builtInGroups.reduce((total, group) => total + group.types.length, 0)

const customInputs = [
  { type: 'dzToggle', base: 'DzToggle', description: 'On/off switches' },
  { type: 'dzRating', base: 'DzRating', description: 'Star ratings' },
  { type: 'dzOtp', base: 'DzOtp', description: 'One-time codes' },
]

const validation = [
  'Required fields',
  'Email format',
  'Min / max length',
  'Numeric ranges',
  'Regex patterns',
  'Custom async rules',
  'Cross-field comparison',
  'Conditional validation',
  'Loading & success states',
]

const usageSnippet = `<FormKit type="form" :actions="false" @submit="submit">
  <FormGrid>
    <!-- Built-in FormKit inputs get the DaisyUI theme automatically. -->
    <FormKit
      type="email"
      name="email"
      label="Email"
      validation="required|email"
    />
    <FormKit
      type="password"
      name="password"
      label="Password"
      validation="required|strongPassword"
      validation-visibility="live"
    />
    <FormKit
      type="select"
      name="role"
      label="Role"
      :options="roles"
      validation="required"
    />
    <FormKit
      type="checkbox"
      name="terms"
      label="I accept the terms"
      validation="accepted"
      outer-class="sm:col-span-2"
    />

    <!-- Custom component input for a control FormKit does not ship. -->
    <FormKit
      type="dzToggle"
      name="updates"
      label="Product updates"
      outer-class="sm:col-span-2"
    />
  </FormGrid>

  <FormActions>
    <DzButton type="submit" color="primary" :loading="submitting">
      Create account
    </DzButton>
  </FormActions>
</FormKit>`
</script>

<template>
  <section class="space-y-6">
    <header class="space-y-1">
      <div class="flex flex-wrap items-center gap-2">
        <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">Form Examples</h1>
        <span class="badge badge-success badge-soft">Phase 4</span>
      </div>
      <p class="max-w-3xl text-sm text-base-content/70">
        Eight complete forms built with FormKit. Every built-in input is styled with DaisyUI classes
        through a single theme, while the three controls FormKit does not ship are custom components
        wrapping the existing data-input library. Every form remains a normal Vue template: FormKit
        owns state, validation and submission, and no schemas are authored.
      </p>
    </header>

    <div role="status" class="alert alert-info alert-soft items-start">
      <Sparkles class="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <div>
        <h2 class="font-semibold">Theme first, component only when needed</h2>
        <p class="text-sm">
          FormKit already ships text, choice, date, range and file inputs. Those render natively and
          receive their DaisyUI classes from
          <code class="rounded bg-base-100/70 px-1 py-0.5 text-[0.85em]">src/plugins/formkit.theme.ts</code>.
          Only <code class="rounded bg-base-100/70 px-1 py-0.5 text-[0.85em]">dzToggle</code>,
          <code class="rounded bg-base-100/70 px-1 py-0.5 text-[0.85em]">dzRating</code> and
          <code class="rounded bg-base-100/70 px-1 py-0.5 text-[0.85em]">dzOtp</code> are registered
          with <code class="rounded bg-base-100/70 px-1 py-0.5 text-[0.85em]">createInput()</code> in
          <code class="rounded bg-base-100/70 px-1 py-0.5 text-[0.85em]">src/plugins/formkit.ts</code>
          and wrap the matching <code class="rounded bg-base-100/70 px-1 py-0.5 text-[0.85em]">Dz*</code>
          control.
        </p>
      </div>
    </div>

    <nav aria-label="Jump to a form example" class="flex flex-wrap gap-2">
      <a
        v-for="demo in demos"
        :key="demo.id"
        :href="`#${demo.id}`"
        class="btn btn-ghost btn-sm"
      >
        {{ demo.title }}
      </a>
    </nav>

    <div class="grid gap-4 lg:grid-cols-2">
      <div class="rounded-box border border-base-300 bg-base-100 p-5">
        <h2 class="flex items-center gap-2 font-semibold">
          <Layers class="size-4 text-primary" aria-hidden="true" />
          Built-in inputs
          <span class="badge badge-ghost badge-sm">{{ builtInCount }}</span>
        </h2>
        <p class="mt-1 text-sm text-base-content/70">
          Rendered by FormKit and styled by the DaisyUI theme. Use FormKit's native names directly in
          the template.
        </p>
        <dl class="mt-4 space-y-3">
          <div v-for="group in builtInGroups" :key="group.label" class="space-y-1.5">
            <dt class="text-xs font-semibold uppercase tracking-wide text-base-content/50">
              {{ group.label }}
            </dt>
            <dd class="flex flex-wrap gap-1.5">
              <code
                v-for="type in group.types"
                :key="type"
                class="rounded bg-base-200 px-1.5 py-0.5 text-xs"
              >{{ type }}</code>
            </dd>
          </div>
        </dl>
      </div>

      <div class="rounded-box border border-base-300 bg-base-100 p-5">
        <h2 class="flex items-center gap-2 font-semibold">
          <Sparkles class="size-4 text-primary" aria-hidden="true" />
          Custom components
          <span class="badge badge-ghost badge-sm">{{ customInputs.length }}</span>
        </h2>
        <p class="mt-1 text-sm text-base-content/70">
          These controls do not exist in FormKit core, so each one is registered with
          <code class="rounded bg-base-200 px-1 py-0.5 text-[0.85em]">createInput()</code> and renders
          the matching data-input component.
        </p>
        <ul class="mt-4 flex flex-col gap-2">
          <li
            v-for="input in customInputs"
            :key="input.type"
            class="flex flex-wrap items-center gap-2 rounded-box bg-base-200/60 px-3 py-2 text-sm"
          >
            <code class="rounded bg-base-100 px-1.5 py-0.5 text-xs">{{ input.type }}</code>
            <span class="text-base-content/50" aria-hidden="true">→</span>
            <code class="rounded bg-base-100 px-1.5 py-0.5 text-xs">{{ input.base }}</code>
            <span class="ml-auto text-xs text-base-content/60">{{ input.description }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="rounded-box border border-base-300 bg-base-100 p-5">
      <h2 class="flex items-center gap-2 font-semibold">
        <ShieldCheck class="size-4 text-primary" aria-hidden="true" />
        Validation coverage
      </h2>
      <ul class="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="rule in validation" :key="rule" class="flex items-center gap-2 text-sm">
          <CheckCircle2 class="size-4 shrink-0 text-success" aria-hidden="true" />
          {{ rule }}
        </li>
      </ul>
      <p class="mt-4 flex items-start gap-2 text-xs text-base-content/60">
        <FileUp class="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        The built-in file input is validated by the custom
        <code class="rounded bg-base-200 px-1 py-0.5">maxFileSize</code> rule, which understands
        FormKit's <code class="rounded bg-base-200 px-1 py-0.5">{ name, file }</code> entries.
      </p>
    </div>

    <div class="rounded-box border border-base-300 bg-base-100 p-5">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 class="flex items-center gap-2 font-semibold">
            <ClipboardCheck class="size-4 text-primary" aria-hidden="true" />
            Usage
          </h2>
          <p class="mt-1 max-w-3xl text-sm text-base-content/70">
            Import nothing extra in the form component. Use FormKit's native names for built-in
            inputs and <code class="rounded bg-base-200 px-1 py-0.5 text-[0.85em]">dz*</code> only for
            the three custom controls. Names, labels, options and validation rules stay standard
            FormKit props.
          </p>
        </div>
        <span class="badge badge-primary badge-soft badge-sm">
          <ListChecks class="size-3.5" aria-hidden="true" />
          Template only
        </span>
      </div>
      <CodeBlock class="mt-4" :code="usageSnippet" filename="RegistrationForm.vue" />
    </div>

    <div class="space-y-6">
      <FormDemoCard
        v-for="demo in demos"
        :id="demo.id"
        :key="demo.id"
        :title="demo.title"
        :description="demo.description"
        :badge="demo.badge"
      >
        <component :is="demo.component" />
      </FormDemoCard>
    </div>
  </section>
</template>
