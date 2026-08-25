<template>
    <div :class="itemClass" :style="colorStyles" role="status" :aria-live="ariaLive" @mouseenter="handlePause"
        @mouseleave="handleResume">
        <div class="e-snackbar__row">
            <EButton v-if="isClosable && closeSlot === 'start'" :icon="icon.clear"
                size="small" text :aria-label="closeLabel" @click="handleDismiss" />

            <EIcon v-if="entry.icon" class="e-snackbar__icon" :icon="entry.icon" />

            <div class="e-snackbar__content">
                <p v-if="entry.title" class="e-snackbar__title">{{ entry.title }}</p>
                <p v-if="entry.message" class="e-snackbar__message">{{ entry.message }}</p>
            </div>

            <EButton v-if="isClosable && closeSlot === 'end'" :icon="icon.clear"
                size="small" text :aria-label="closeLabel" @click="handleDismiss" />
        </div>

        <div v-if="entry.action" class="e-snackbar__actions">
            <EButton :color="actionColor" :text="entry.action.text" :outlined="entry.action.outlined"
                :elevation="entry.action.elevation" :tonal="entry.action.tonal" @click="handleAction">
                {{ entry.action.label }}
            </EButton>
        </div>
    </div>
</template>
<script lang="ts">
export default { name: "ESnackbarItem" };
</script>
<script lang="ts" setup>
import { computed } from "vue";
import EButton from "@/components/button/index.vue";
import EIcon from "@/components/icon/index.vue";
import icon from "@/utils/icons";
import { useResolvedColor } from "@/composables/color";
import { getBooleanClasses } from "@/composables/utils";
import { useSnackbarService } from "@/composables/snackbar-service";
import type { SnackbarInstance } from "@/types";

const props = withDefaults(defineProps<{
    entry: SnackbarInstance;
    closeLabel?: string;
}>(), {
    closeLabel: "Close",
});

const actionColor = computed(() => props.entry.action?.color);
const { dismiss, pause, resume } = useSnackbarService();

const isClosable = computed((): boolean => props.entry.closable !== false);
const closeSlot = computed(() => props.entry.closeSlot ?? "end");
const ariaLive = computed((): "assertive" | "polite" => (props.entry.color === "error" ? "assertive" : "polite"));

const { colorStyles } = useResolvedColor({
    color: computed(() => props.entry.color),
    colorVar: "--e-snackbar-color",
    contrastVar: "--e-snackbar-contrast-color",
});

const booleanClassKeys = ["tonal", "outlined"] as const;

const itemClass = computed((): string[] => {
    const surfaceFlags = { tonal: props.entry.tonal, outlined: props.entry.outlined };
    const classes = ["e-snackbar", ...getBooleanClasses(surfaceFlags, booleanClassKeys, "e-snackbar")];

    if (props.entry.elevation && props.entry.elevation !== "none") {
        classes.push(`e-elevation--${props.entry.elevation}`);
    }

    return classes;
});

const handleDismiss = (): void => dismiss(props.entry.id);
const handlePause = (): void => pause(props.entry.id);
const handleResume = (): void => resume(props.entry.id);

const handleAction = (): void => {
    props.entry.action?.onClick?.(props.entry.id);
    dismiss(props.entry.id);
};
</script>
