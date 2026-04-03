<template>
    <div :class="radioClass" :style="fieldStyle" @click="handleRadioClick">
        <div :class="['e-field__selection-control']" :data-focused="focused">
            <span aria-hidden="true" class="e-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                    width="24" height="24 " role="img" aria-hidden="true" class="e-icon__svg">
                    <path v-if="active"
                        d="M12,20C7.58,20 4,16.42 4,12C4,7.58 7.58,4 12,4C16.42,4 20,7.58 20,12C20,16.42 16.42,20 12,20M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2M12,7C9.24,7 7,9.24 7,12C7,14.76 9.24,17 12,17C14.76,17 17,14.76 17,12C17,9.24 14.76,7 12,7Z">
                    </path>
                    <path v-else
                        d="M12,20C7.58,20 4,16.42 4,12C4,7.58 7.58,4 12,4C16.42,4 20,7.58 20,12C20,16.42 16.42,20 12,20M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2Z">
                    </path>
                </svg>
            </span>
            <input ref="input" v-model="selectedModel" :aria-checked="active" :id="id" role="radio" type="radio"
                :name="radioGroup.name" :value="modelValue" :disabled="isDisabled" :aria-disabled="isDisabled"
                :aria-readonly="isReadonly" @focus="handleFocus" @blur="handleBlur" />

            <div v-ripple="{ center: true }" class="e-field__selection-ripple">
            </div>
        </div>
        <label class="e-label ignore-field-color" :for="id" :labelStyle="labelStyle">
            <slot name="label"> {{ label }} </slot>
        </label>
    </div>
</template>

<script lang="ts" setup>
import { computed, getCurrentInstance, inject, onMounted, onUnmounted, ref } from "vue";
import type { ERadioType } from "@/types"
import { useField } from "@/composables/field"
import { ripple } from "@/directives";
import { RADIO_GROUP_KEY } from "./constants"

export interface Props {
    label?: string | number;
    modelValue: ERadioType;
}
const input = ref<HTMLInputElement>()
const { fieldClass, fieldStyle, focused, id, isDisabled, isReadonly, labelStyle, setConfiguration,
    handleFocus: handleFieldFocus, handleBlur: handleFieldBlur } = useField(false)

const radioGroup = inject(RADIO_GROUP_KEY, null);
const vRipple = { ...ripple };
if (!radioGroup) {
    throw new Error("ERadio must be used within ERadioGroup.")
}

const props = defineProps<Props>()

const radioClass = computed(() => [...fieldClass.value, 'e-radio', { 'e-radio--active': active.value }])
const isNonInteractive = computed(() => isDisabled.value || isReadonly.value)

const selectedModel = computed({
    get: () => radioGroup.modelValue.value,
    set: (value: ERadioType) => {
        if (isNonInteractive.value) {
            if (input.value) input.value.checked = active.value
            return
        }

        radioGroup.changeModelValue(value)
    }
})

const active = computed(() => {
    return selectedModel.value === props.modelValue
})

const isNativeTarget = (target: EventTarget | null): boolean => {
    return target instanceof Element && Boolean(target.closest('input, label'))
}

const changeModelValue = (forceFocus = false): void => {
    forceFocus && input.value?.focus();
    if (isNonInteractive.value) return
    selectedModel.value = props.modelValue
}

const handleRadioClick = (event: MouseEvent): void => {
    if (isNativeTarget(event.target)) return

    changeModelValue(true)
}

const handleFocus = (evt: FocusEvent): void => {
    handleFieldFocus(evt)
    radioGroup.handleFocus(evt)
}

const handleBlur = (evt: FocusEvent): void => {
    handleFieldBlur(evt)
    radioGroup.handleBlur(evt)
}

const uid = getCurrentInstance()?.uid;

onMounted(() => {
    radioGroup.bindRadio({ uid: uid || -1, setConfiguration, modelValue: props.modelValue });
});

onUnmounted(() => {
    radioGroup.unbindRadio(uid || -1)
})


</script>
<style lang="scss" src="./style.scss"></style>