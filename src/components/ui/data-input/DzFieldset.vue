<script setup lang="ts">
const props = defineProps({
  legend: { type: String, default: '' },
  hint: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
})
</script>

<template>
  <fieldset class="fieldset" :disabled="disabled">
    <legend v-if="legend" class="fieldset-legend">
      <slot name="legend">{{ legend }}</slot>
    </legend>
    <slot />
    <p v-if="hint || $slots.hint" class="label">
      <slot name="hint">{{ hint }}</slot>
    </p>
  </fieldset>
</template>
