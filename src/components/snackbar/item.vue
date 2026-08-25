<template>
    <div :class="itemClass" role="status" :aria-live="ariaLive" @mouseenter="handlePause" @mouseleave="handleResume">
        <ECard class="e-snackbar__card" v-bind="cardProps">
            <template v-if="isClosable && closeSlot === 'prepend'" #prepend>
                <EButton v-ripple="{ center: true }" :icon="icon.clear" type="button" size="small" text
                    :aria-label="closeLabel" @click="handleDismiss" />
            </template>

            <template v-if="isClosable && closeSlot === 'append'" #append>
                <EButton v-ripple="{ center: true }" type="button" size="small" :aria-label="closeLabel" text
                    :icon="icon.clear" @click="handleDismiss" />
            </template>
            <template v-if="isClosable && closeSlot === 'append-header'" #append-header>
                <EButton v-ripple="{ center: true }" type="button" size="small" :aria-label="closeLabel" text
                    :icon="icon.clear" @click="handleDismiss" />
            </template>
            <template v-if="isClosable && closeSlot === 'prepend-header'" #prepend-header>
                <EButton v-ripple="{ center: true }" type="button" size="small" :aria-label="closeLabel" text
                    :icon="icon.clear" @click="handleDismiss" />
            </template>
            <span v-if="entry.message">{{ entry.message }}</span>

            <template v-if="entry.action" #footer>
                <div class="e-snackbar__actions">
                    <EButton :color="entry.action.color" :text="entry.action.text" :outlined="entry.action.outlined"
                        :elevation="entry.action.elevation" :tonal="isTonalAction" @click="handleAction">
                        {{ entry.action.label }}
                    </EButton>
                </div>
            </template>
        </ECard>
    </div>
</template>
<script lang="ts">
export default { name: "ESnackbarItem" };
</script>
<script lang="ts" setup>
import { computed } from "vue";
import ECard, { type Props as CardProps } from "@/components/card/index.vue";
import EButton from "@/components/button/index.vue";
import { ripple } from "@/directives";
import icon from "@/utils/icons";
import { useSnackbarService } from "@/composables/snackbar-service";
import type { SnackbarInstance } from "@/types";

const vRipple = { ...ripple };
const isTonalAction = computed((): boolean => typeof props.entry.action?.tonal === "boolean" ? props.entry.action.tonal : true);
const props = withDefaults(defineProps<{
    entry: SnackbarInstance;
    closeLabel?: string;
}>(), {
    closeLabel: "Close",
});

const { dismiss, pause, resume } = useSnackbarService();

const isClosable = computed((): boolean => props.entry.closable !== false);
const closeSlot = computed(() => props.entry.closeSlot ?? "append");
const ariaLive = computed((): "assertive" | "polite" => (props.entry.color === "error" ? "assertive" : "polite"));

// Only Card's own props are forwarded; snackbar-specific fields stay out of v-bind.
const cardProps = computed((): CardProps => {
    const { message, timeout, closable, closeSlot: _closeSlot, position, action, id, createdAt, ...rest } = props.entry;
    return rest;
});

const itemClass = computed((): string[] => {
    const classes = ["e-snackbar"];
    if (props.entry.color) classes.push(`e-snackbar--${props.entry.color}`);
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
