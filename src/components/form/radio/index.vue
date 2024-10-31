<template>
    <div :class="radioClass" @click="changeModelValue(true)">
        <div :class="['e-field--selection-controls__field']" :data-focused="controlFocused">
            <span aria-hidden="true" class="e-icon" :class="radioColor"><svg xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24" role="img" aria-hidden="true" class="e-icon__svg">
                    <path v-if="active"
                        d="M12,20C7.58,20 4,16.42 4,12C4,7.58 7.58,4 12,4C16.42,4 20,7.58 20,12C20,16.42 16.42,20 12,20M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2M12,7C9.24,7 7,9.24 7,12C7,14.76 9.24,17 12,17C14.76,17 17,14.76 17,12C17,9.24 14.76,7 12,7Z">
                    </path>
                    <path v-else
                        d="M12,20C7.58,20 4,16.42 4,12C4,7.58 7.58,4 12,4C16.42,4 20,7.58 20,12C20,16.42 16.42,20 12,20M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2Z">
                    </path>
                </svg>
            </span>
            <input v-if="mounted" ref="input" :aria-checked="active" :id="id" role="radio" type="radio" :name="id"
                :value="modelValue" @input="changeModelValue()" @focus="handleFocus" @blur="handleBlur" />

            <div v-ripple="{ center: true }" :class="['e-field--selection-controls__ripple', radioColor]">
            </div>
        </div>
        <label v-if="mounted" :class="[textColor, 'e-label']" :for="id" :labelStyle="labelStyle">
            <slot name="label"> {{ label }} </slot>
        </label>
    </div>
</template>

<script lang="ts" setup>
import { computed, getCurrentInstance, inject, onMounted, ref } from "vue";
import { radioType, RadioGroup } from "@/types"
import { useField } from "@/composables/field"

export interface Props {
    retainColor?: boolean;
    isActive?: boolean;
    disabled?: boolean; readonly?: boolean; label?: string | number;
    modelValue: radioType; color?: string; labelMinWidth?: string;
}
const controlFocused = ref(false)
const input = ref<HTMLInputElement>()
const { fieldClass, id, textColor, labelStyle, setConfiguration, configuration, mounted } = useField(false)

const radioGroup = inject<Partial<RadioGroup> | undefined>("ERadioGroup", undefined);

const props = defineProps<Props>()

const radioClass = computed(() => [...fieldClass.value, 'e-radio'])

const radioColor = computed(() => {
    const color = props.color || configuration.color
    return textColor.value || color ? `${color}--text` : ''
})

const active = computed(() => {
    if (props.isActive !== undefined) return props.isActive;
    return radioGroup?.modelValue?.value === props.modelValue
})

const changeModelValue = (forceFocus = false): void => {
    forceFocus && input.value?.focus();
    radioGroup?.changeModelValue?.(props.modelValue)
}

const handleFocus = (evt: FocusEvent): void => {
    controlFocused.value = true
    radioGroup?.handleFocus?.(evt)
}

const handleBlur = (evt: FocusEvent): void => {
    controlFocused.value = false
    radioGroup?.handleBlur?.(evt)
}

const uid = getCurrentInstance()?.uid;

onMounted(() => {
    radioGroup?.bindRadio?.({ uid: uid || -1, setConfiguration, modelValue: props.modelValue });
});


</script>