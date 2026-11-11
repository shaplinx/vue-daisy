<script setup lang="ts">
const props = defineProps({
  contentClass: { type: [String, Array, Object], default: '' },
})
</script>

<template>
  <div class="mockup-phone">
    <div class="mockup-phone-camera" />
    <div class="mockup-phone-display" :class="contentClass">
      <slot />
    </div>
  </div>
</template>
