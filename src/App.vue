<script setup lang="ts">
import { useToast } from '@/composables/useToast'
import DzToast from '@/components/ui/feedback/DzToast.vue'

const toast = useToast()
</script>

<template>
  <RouterView />
  <DzToast :notifications="toast.notifications" position="bottom-end" />
</template>
