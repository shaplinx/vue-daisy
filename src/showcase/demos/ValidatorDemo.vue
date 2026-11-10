<script setup>
import { ref } from 'vue'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const email = ref('')
const username = ref('')
const age = ref('')
const website = ref('')
const valid = ref(true)

function onValidity(value) {
  valid.value = value
}
</script>

<template>
  <div v-if="mode !== 'variants'" class="max-w-md space-y-5">
    <DzValidator
      v-model="email"
      type="email"
      required
      label="Email address"
      placeholder="you@example.com"
      hint="Enter a valid email address"
    />
    <DzValidator
      v-model="username"
      required
      pattern="[A-Za-z0-9_]{3,16}"
      label="Username"
      placeholder="3–16 letters, numbers or underscores"
      hint="Use 3–16 letters, numbers or underscores"
      @validity="onValidity"
    />
    <p class="text-xs" :class="valid ? 'text-success' : 'text-base-content/60'">
      The username field reports its native validity on every keystroke.
    </p>
  </div>

  <div v-else class="grid max-w-3xl gap-5 sm:grid-cols-2">
    <DzValidator
      v-model="email"
      type="email"
      required
      label="Email"
      placeholder="you@example.com"
      hint="A valid email is required"
    />
    <DzValidator
      v-model="username"
      required
      minlength="3"
      maxlength="16"
      label="Username"
      placeholder="ada_lovelace"
      hint="Between 3 and 16 characters"
    />
    <DzValidator
      v-model="age"
      type="number"
      :min="18"
      :max="120"
      label="Age"
      placeholder="18"
      hint="You must be between 18 and 120"
    />
    <DzValidator
      v-model="website"
      type="url"
      label="Website"
      placeholder="https://example.com"
      hint="Include the full https:// URL"
    />
    <div class="sm:col-span-2">
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Custom hint slot</p>
      <DzValidator v-model="username" required minlength="5" label="Project slug">
        <template #hint>
          <span class="text-xs">At least five characters, lowercase recommended.</span>
        </template>
      </DzValidator>
    </div>
  </div>
</template>
