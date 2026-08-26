<template>
    <EDialog :model-value="isActive" class="e-dialog-service__container" persistent elevation="lg" max-width="400">
        <ECard v-if="displayed" :color="displayed.color" :title="displayed.title" width="400">
            <p v-if="displayed.message" class="e-dialog-service__message">{{ displayed.message }}</p>

            <ETextfield v-if="displayed.kind === 'prompt'" class="e-dialog-service__field mt-4"
                :model-value="displayed.inputValue" :placeholder="displayed.placeholder" autofocus
                @update:model-value="handleInput" @keyup.enter="handleConfirm" />

            <template #footer>
                <div class="e-dialog-service__actions">
                    <EButton v-if="displayed.kind !== 'alert'" v-bind="buttonProperty(displayed.cancelButton)"
                        @click="handleCancel">
                        {{ displayed.cancelButton?.label }}
                    </EButton>
                    <EButton v-bind="buttonProperty(displayed.confirmButton)" @click="handleConfirm">
                        {{ displayed.confirmButton?.label }}
                    </EButton>
                </div>
            </template>
        </ECard>
    </EDialog>
</template>
<script lang="ts">
export default { name: "EDialogContainer" };
</script>
<script lang="ts" setup>
import { ref, watch } from "vue";
import EDialog from "@/components/dialog/index.vue";
import ECard from "@/components/card/index.vue";
import EButton from "@/components/button/index.vue";
import ETextfield from "@/components/form/textfield/index.vue";
import { useDialogService } from "@/composables/dialog-service";
import type { DialogInstance } from "@/types";

const { current, isActive, confirmDialog, cancelDialog, updateInputValue } = useDialogService();

// Kept until the next dialog opens so EDialog's fade-out has content to animate instead of going blank.
const displayed = ref<DialogInstance | undefined>(current.value);

watch(current, (value) => {
    if (value) displayed.value = value;
});

const handleInput = (value: string | number | null): void => {
    if (displayed.value) updateInputValue(displayed.value.id, value === null ? "" : String(value));
};
const buttonProperty = (options: DialogInstance["cancelButton"] | DialogInstance["confirmButton"]) => {
    const { label, ...props } = options ?? {};
    return props;
}

const handleConfirm = (): void => {
    if (displayed.value) confirmDialog(displayed.value.id);
};

const handleCancel = (): void => {
    if (displayed.value) cancelDialog(displayed.value.id);
};
</script>
<style lang="scss" src="./style.scss"></style>
