<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Trash2 } from '@lucide/vue'
import FormActions from '@/components/form/FormActions.vue'
import FormGrid from '@/components/form/FormGrid.vue'
import FormStatus from '@/components/form/FormStatus.vue'
import { useDemoForm } from '@/composables/useDemoForm'

const { status, submitting, lastSubmission, submit } = useDemoForm({
  message: 'Contacts saved',
})

const contacts = ref([
  { name: 'Ada Lovelace', email: 'ada@example.com', role: 'developer', primary: true },
  { name: 'Grace Hopper', email: 'grace@example.com', role: 'product', primary: false },
])

const roles = [
  { label: 'Developer', value: 'developer' },
  { label: 'Designer', value: 'designer' },
  { label: 'Product manager', value: 'product' },
]
</script>

<template>
  <div class="space-y-2">
    <FormKit id="repeating-form" type="form" :actions="false" @submit="submit">
      <FormKit type="list" name="contacts" v-model="contacts" dynamic sync>
        <template #default="{ items, node, value }">
          <div class="space-y-3">
            <div
              v-for="(item, index) in items"
              :key="index"
              class="rounded-box border border-base-300 bg-base-200/40 p-4"
            >
              <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h3 class="text-sm font-semibold">Contact {{ index + 1 }}</h3>
                <DzButton
                  type="button"
                  size="xs"
                  variant="ghost"
                  color="error"
                  :disabled="(items?.length ?? 0) <= 1"
                  @click="node.input((value ?? []).filter((_, itemIndex) => itemIndex !== index))"
                >
                  <template #icon>
                    <Trash2 class="size-3.5" aria-hidden="true" />
                  </template>
                  Remove
                </DzButton>
              </div>

              <FormGrid>
                <FormKit type="group" :index="index">
                  <FormKit type="text" name="name" label="Name" validation="required" />
                  <FormKit type="email" name="email" label="Email" validation="required|email" />
                  <FormKit type="select" name="role" label="Role" :options="roles" validation="required" />
                  <FormKit type="checkbox" name="primary" label="Primary contact" />
                </FormKit>
              </FormGrid>
            </div>

            <DzButton
              type="button"
              variant="outline"
              size="sm"
              @click="
                node.input(
                  (value ?? []).concat({ name: '', email: '', role: 'developer', primary: false }),
                )
              "
            >
              <template #icon>
                <Plus class="size-4" aria-hidden="true" />
              </template>
              Add contact
            </DzButton>
          </div>
        </template>
      </FormKit>

      <FormActions>
        <DzButton type="submit" color="primary" :loading="submitting">Save contacts</DzButton>
        <span class="text-xs text-base-content/60">
          Each row is a FormKit <code class="rounded bg-base-200 px-1 py-0.5">group</code> inside a
          dynamic <code class="rounded bg-base-200 px-1 py-0.5">list</code>.
        </span>
      </FormActions>
    </FormKit>

    <FormStatus
      :show="status === 'success'"
      title="Contacts saved"
      message="The dynamic list serialized every repeated group into a nested array."
    >
      <pre
        v-if="lastSubmission"
        class="mt-3 max-h-56 overflow-auto rounded-box bg-base-100/70 p-3 text-xs"
      >{{ JSON.stringify(lastSubmission, null, 2) }}</pre>
    </FormStatus>
  </div>
</template>
