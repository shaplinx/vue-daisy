<script setup lang="ts">
import { computed } from 'vue'
import DzOtp from '@/components/ui/data-input/DzOtp.vue'
import DzFormField from './DzFormField.vue'
import type { FormKitInputContext } from './types'

const props = defineProps<{ context: FormKitInputContext }>()

const length = computed(() => Number(props.context.node.props.length ?? 6))
const value = computed(() =>
  props.context.value === undefined || props.context.value === null
    ? ''
    : String(props.context.value),
)
</script>

<template>
  <DzFormField :context="context">
    <DzOtp
      :id="context.id"
      :name="String(context.node.props.name ?? 'otp')"
      :model-value="value"
      :length="length"
      :joined="Boolean(context.node.props.joined)"
      :label="context.label || 'One-time password'"
      :invalid="context.state.invalid"
      :disabled="context.disabled"
      :aria-describedby="context.describedBy"
      :aria-required="context.state.required || undefined"
      @update:model-value="context.node.input($event)"
      @blur="context.handlers.blur"
    />
  </DzFormField>
</template>
