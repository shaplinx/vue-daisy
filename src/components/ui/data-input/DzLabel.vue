<script setup lang="ts">
const props = defineProps({
  text: { type: String, default: '' },
  htmlFor: { type: String, default: undefined },
  required: { type: Boolean, default: false },
  optional: { type: Boolean, default: false },
})
</script>

<template>
  <label class="label" :for="htmlFor">
    <span class="label-text">
      <slot>{{ text }}</slot>
      <span v-if="required" class="text-error" aria-hidden="true">*</span>
    </span>
    <span v-if="optional" class="label-text-alt opacity-60">Optional</span>
  </label>
</template>
