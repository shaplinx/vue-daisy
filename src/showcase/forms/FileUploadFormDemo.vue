<script setup lang="ts">
import { computed } from 'vue'
import FormActions from '@/components/form/FormActions.vue'
import FormGrid from '@/components/form/FormGrid.vue'
import FormStatus from '@/components/form/FormStatus.vue'
import { useDemoForm } from '@/composables/useDemoForm'

const { status, submitting, lastSubmission, submit } = useDemoForm({
  message: 'Files uploaded successfully',
})

const categories = [
  { label: 'Design asset', value: 'design' },
  { label: 'Document', value: 'document' },
  { label: 'Spreadsheet', value: 'spreadsheet' },
  { label: 'Other', value: 'other' },
]

function fileEntryName(entry: unknown): string | undefined {
  if (entry instanceof File) return entry.name
  if (entry && typeof entry === 'object' && 'name' in entry) {
    const name = (entry as { name?: unknown }).name
    return typeof name === 'string' ? name : undefined
  }
  return undefined
}

const uploadedFileNames = computed(() => {
  const submission = lastSubmission.value
  if (!submission) return []
  return Object.values(submission).flatMap((value) =>
    Array.isArray(value)
      ? value
          .map((entry) => fileEntryName(entry))
          .filter((name): name is string => Boolean(name))
      : [],
  )
})
</script>

<template>
  <div class="space-y-2">
    <FormKit id="file-upload-form" type="form" :actions="false" @submit="submit">
      <FormGrid>
        <FormKit
          type="text"
          name="title"
          label="Upload title"
          placeholder="Q4 brand refresh"
          validation="required|length:3,80"
        />
        <FormKit
          type="select"
          name="category"
          label="Category"
          placeholder="Choose a category"
          :options="categories"
          validation="required"
        />

        <FormKit
          type="file"
          name="attachment"
          label="Primary file"
          accept=".pdf,.png,.jpg,.jpeg"
          validation="required|maxFileSize:2"
          help="PDF, PNG or JPEG up to 2 MB. Validated by the custom maxFileSize rule."
          outer-class="sm:col-span-2"
        />
        <FormKit
          type="file"
          name="supportingFiles"
          label="Supporting files"
          accept=".pdf,.png,.jpg,.jpeg"
          multiple
          help="Optional — upload more than one file."
          outer-class="sm:col-span-2"
        />
        <FormKit
          type="textarea"
          name="notes"
          label="Notes"
          placeholder="Anything the reviewer should know…"
          validation="length:0,500"
          :maxlength="500"
          outer-class="sm:col-span-2"
        />
        <FormKit
          type="checkbox"
          name="confirm"
          label="I confirm these files are safe to share"
          validation="accepted"
          outer-class="sm:col-span-2"
        />
      </FormGrid>

      <FormActions>
        <DzButton type="submit" color="primary" :loading="submitting">Upload files</DzButton>
        <span class="text-xs text-base-content/60">
          Files are held in the FormKit node value and validated before submission.
        </span>
      </FormActions>
    </FormKit>

    <FormStatus
      :show="status === 'success'"
      title="Files uploaded"
      message="FormKit's built-in file input serialized the selected File objects into the form payload."
    >
      <ul v-if="uploadedFileNames.length" class="mt-2 list-inside list-disc text-sm">
        <li v-for="name in uploadedFileNames" :key="name">{{ name }}</li>
      </ul>
    </FormStatus>
  </div>
</template>
