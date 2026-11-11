<script setup lang="ts">
import { ArrowRight, CheckCircle2, ClipboardList, Layers, ShieldCheck } from '@lucide/vue'

const patterns = [
  'Basic contact form',
  'Login form',
  'User registration',
  'Profile editing',
  'Complex validation',
  'Conditional fields',
  'Repeating groups',
  'File upload',
]

const validation = [
  'Required fields',
  'Email format',
  'Min / max length',
  'Numeric ranges',
  'Custom rules',
  'Cross-field validation',
  'Conditional validation',
  'Submission loading & success states',
]
</script>

<template>
  <section class="space-y-6">
    <header class="space-y-1">
      <div class="flex flex-wrap items-center gap-2">
        <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">Form Examples</h1>
        <span class="badge badge-warning badge-soft">Phase 4</span>
      </div>
      <p class="max-w-2xl text-sm text-base-content/70">
        FormKit will power form generation and validation, with a custom theme that maps every input
        to DaisyUI classes. The underlying form controls are already available.
      </p>
    </header>

    <div role="status" class="alert alert-info alert-soft">
      <ClipboardList class="size-5" aria-hidden="true" />
      <div>
        <h2 class="font-semibold">FormKit arrives after CRUD</h2>
        <p class="text-sm">
          Milestone 1 is the component library. All data-input components used by the future theme
          are implemented and demonstrated now.
        </p>
      </div>
      <DzButton size="sm" variant="outline" :to="{ path: '/components', query: { category: 'data-input' } }">
        Browse data input
        <ArrowRight class="size-4" aria-hidden="true" />
      </DzButton>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <div class="rounded-box border border-base-300 bg-base-100 p-5">
        <h2 class="flex items-center gap-2 font-semibold">
          <Layers class="size-4 text-primary" aria-hidden="true" />
          Form examples planned
        </h2>
        <ul class="mt-3 grid gap-2 sm:grid-cols-2">
          <li v-for="pattern in patterns" :key="pattern" class="flex items-center gap-2 text-sm">
            <CheckCircle2 class="size-4 shrink-0 text-base-content/30" aria-hidden="true" />
            {{ pattern }}
          </li>
        </ul>
      </div>

      <div class="rounded-box border border-base-300 bg-base-100 p-5">
        <h2 class="flex items-center gap-2 font-semibold">
          <ShieldCheck class="size-4 text-primary" aria-hidden="true" />
          Validation coverage
        </h2>
        <ul class="mt-3 grid gap-2 sm:grid-cols-2">
          <li v-for="rule in validation" :key="rule" class="flex items-center gap-2 text-sm">
            <CheckCircle2 class="size-4 shrink-0 text-base-content/30" aria-hidden="true" />
            {{ rule }}
          </li>
        </ul>
      </div>
    </div>

    <div class="rounded-box border border-base-300 bg-base-100 p-5">
      <h2 class="font-semibold">Try the form primitives today</h2>
      <p class="mt-1 text-sm text-base-content/70">
        Inputs, selects, checkboxes, radios, toggles, ranges, ratings, OTP, file inputs and the
        native validator are all interactive in the showcase.
      </p>
      <div class="mt-4 flex flex-wrap gap-2">
        <DzButton v-for="id in ['input', 'select', 'checkbox', 'toggle', 'validator', 'otp']" :key="id" size="sm" variant="outline" :to="{ path: '/components', query: { component: id } }">
          {{ id }}
        </DzButton>
      </div>
    </div>
  </section>
</template>
