<script setup lang="ts">
import { ref } from 'vue'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const name = ref('')
const email = ref('')
const bio = ref('')
</script>

<template>
  <div v-if="mode !== 'variants'" class="max-w-xl space-y-4">
    <DzFieldset legend="Profile details" hint="All fields are optional in this demo.">
      <DzLabel text="Full name" html-for="fieldset-name" />
      <DzInput id="fieldset-name" v-model="name" placeholder="Reza Irfan" clearable />
      <DzLabel text="Email" html-for="fieldset-email" required />
      <DzInput id="fieldset-email" v-model="email" type="email" placeholder="alex@example.com" />
      <DzLabel text="Bio" html-for="fieldset-bio" optional />
      <DzTextarea id="fieldset-bio" v-model="bio" placeholder="Tell us about yourself…" :rows="2" />
    </DzFieldset>
  </div>

  <div v-else class="grid gap-6 md:grid-cols-2">
    <DzFieldset legend="Default fieldset" hint="Helper text sits below the controls.">
      <DzLabel text="Name" />
      <DzInput model-value="Reza Irfan" />
    </DzFieldset>

    <DzFieldset legend="Disabled fieldset" disabled>
      <DzLabel text="Name" />
      <DzInput model-value="Reza Irfan" disabled />
      <DzLabel text="Email" />
      <DzInput model-value="alex@example.com" disabled />
    </DzFieldset>
  </div>
</template>
