<script setup lang="ts">
import { computed } from 'vue'
import DzRating from '@/components/ui/data-input/DzRating.vue'
import DzFormField from './DzFormField.vue'
import type { FormKitInputContext } from './types'

const props = defineProps<{ context: FormKitInputContext }>()

const max = computed(() => Number(props.context.node.props.max ?? 5))
const value = computed(() => Number(props.context.value ?? 0))
</script>

<template>
  <DzFormField :context="context">
    <DzRating
      :id="context.id"
      :model-value="value"
      :max="max"
      :label="context.label || 'Rating'"
      :allow-clear="context.node.props.allowClear !== false"
      :readonly="context.disabled || Boolean(context.node.props.readonly)"
      :aria-describedby="context.describedBy"
      @update:model-value="context.node.input($event)"
    />
  </DzFormField>
</template>
