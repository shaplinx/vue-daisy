<script setup lang="ts">
import DzToggle from '@/components/ui/data-input/DzToggle.vue'
import DzFormField from './DzFormField.vue'
import type { FormKitInputContext } from './types'

defineProps<{ context: FormKitInputContext }>()
</script>

<template>
  <DzFormField :context="context" hide-label>
    <DzToggle
      :id="context.id"
      :name="context.node.props.name"
      :model-value="Boolean(context.value)"
      :label="context.label"
      :invalid="context.state.invalid"
      :disabled="context.disabled"
      :aria-describedby="context.describedBy"
      :aria-required="context.state.required || undefined"
      @update:model-value="context.node.input($event)"
      @blur="context.handlers.blur"
    />
  </DzFormField>
</template>
