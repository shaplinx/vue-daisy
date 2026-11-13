<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { X } from "@lucide/vue";
import { cn } from "@/utils/cn";
import { modifier, COLORS } from "@/utils/daisy";

const props = defineProps({
	color: { type: String, default: "info" },
	variant: { type: String, default: "solid" },
	icon: { type: [Object, Function], default: null },
	title: { type: String, default: "" },
	description: { type: String, default: "" },
	closable: { type: Boolean, default: false },
	modelValue: { type: Boolean, default: undefined },
	role: { type: String, default: "alert" },
});

const emit = defineEmits(["update:modelValue", "close"]);

const internalVisible = ref(true);
const isControlled = computed(() => props.modelValue !== undefined);
const visible = computed(() =>
	isControlled.value ? props.modelValue : internalVisible.value,
);

const classes = computed(() =>
	cn(
		"alert",
		modifier("alert", props.color, COLORS),
		modifier("alert", props.variant, ["outline", "soft", "dash"]),
	),
);

function close() {
	if (!isControlled.value) internalVisible.value = false;
	emit("update:modelValue", false);
	emit("close");
}

watch(
	() => props.modelValue,
	(value) => {
		if (value) internalVisible.value = true;
	},
);

defineExpose({ close });
</script>

<template>
	<Transition name="fade">
		<div v-if="visible" :class="classes" :role="role">
			<div>
				<slot name="icon">
					<component
						:is="icon"
						v-if="icon"
						class="size-5 shrink-0"
						aria-hidden="true"
					/>
				</slot>
			</div>
			<div class="flex-1">
				<slot>
					<h3 v-if="title" class="font-semibold">{{ title }}</h3>
					<p v-if="description" class="text-sm" :class="{ 'mt-0.5': title }">
						{{ description }}
					</p>
				</slot>
			</div>

			<slot name="actions" />

			<button
				v-if="closable"
				type="button"
				class="btn btn-ghost btn-xs btn-circle"
				aria-label="Dismiss alert"
				@click="close"
			>
				<X class="size-4" aria-hidden="true" />
			</button>
		</div>
	</Transition>
</template>
