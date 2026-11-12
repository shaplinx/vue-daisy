<script setup lang="ts">
import { CheckCircle2 } from '@lucide/vue'

withDefaults(
  defineProps<{
    show: boolean
    title?: string
    message?: string
  }>(),
  {
    title: 'Submitted successfully',
    message: 'The form passed FormKit validation and the async submit handler resolved.',
  },
)
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="-translate-y-1 opacity-0"
    leave-active-class="transition duration-150 ease-in"
    leave-to-class="-translate-y-1 opacity-0"
  >
    <div v-if="show" role="status" class="alert alert-success alert-soft mt-5 items-start">
      <CheckCircle2 class="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <div class="min-w-0">
        <h3 class="font-semibold">{{ title }}</h3>
        <p class="text-sm">{{ message }}</p>
        <slot />
      </div>
    </div>
  </Transition>
</template>
