<template >
    <div :class="textFieldClass">
        <div class="e-field__control">
            <div class="e-field__slot" @mouseenter="handleHover(true)" @mouseleave="handleHover(false)">
                <div v-if="prependIcon" class="e-field__prepend-inner" @click="handleClickPrependIcon">
                    <div class="e-field__icon e-field__icon--prepend-inner">
                        <EIcon :icon="prependIcon" />
                    </div>
                </div>
                <div class="e-field__overlay"></div>
                <div v-if="mounted" class="e-text-field__slot e-field__field">
                    <label :for="id" :class="[textColor, 'e-label']" :style="labelStyle">
                        <slot name="label">{{ label }}</slot>
                    </label>
                    <div v-if="prefix" :class="[textColor, 'e-field__prefix']" @click="setInputFocus">
                        {{ prefix }}
                    </div>

                    <input ref="input" :id="id" :value="modelValue" :readonly="inputReadonly" class="input--text"
                        :maxlength="limit" :style="inputStyle" :type="type" :placeholder="placeholder" :name="name"
                        :autocomplete="autocomplete" @blur="handleBlur" @input="changeValue($event, true)"
                        @focus="handleFocus" />

                    <div v-if="suffix" :class="[textColor, 'e-field__suffix']" @click="setInputFocus">
                        {{ suffix }}
                    </div>
                </div>
                <transition name="scale">
                    <div v-show="showClearable" class="e-field__append-inner">
                        <div class="e-field__icon e-field__icon--clear">
                            <EButton :icon="iconClear || icon.clear" small text @click.stop.prevent="clear" />
                        </div>
                    </div>
                </transition>
                <div v-if="appendIcon" class="e-field__append-inner" @click="handleClickAppendIcon">
                    <div class="e-field__icon e-field__icon--append">
                        <EIcon :icon="appendIcon" />
                    </div>
                </div>
                <div v-if="!outlined" class="e-field__line"></div>
            </div>
            <EDetails :counter="counter" :details="details" :modelValue="modelValue" :limit="limit" :textColor="textColor"
                :showDetails="showDetails">
            </EDetails>
        </div>
    </div>
</template>

<script setup lang="ts">
import { IconPath } from '@/types';
import icon from '@/utils/icons';

import { useGrid } from "@/composables/grid"
import { useField } from "@/composables/field"

import EButton from '@/components/button/index.vue'
import EIcon from '@/components/icon/index.vue'
import EDetails from '@/components/form/details.vue'
import { computed } from 'vue';

export interface Props {
    iconClear?: Array<IconPath> | IconPath | string; retainColor?: boolean; name?: string;
    disabled?: boolean; dense?: boolean; readonly?: boolean; counter?: boolean; clearable?: boolean;
    labelInline?: boolean; detail?: string; outlined?: boolean; label?: string | number;
    modelValue?: string | number | null; placeholder?: string; suffix?: string; autocomplete?: string;
    prefix?: string; inputAlign?: string; color?: string; limit?: string | number; prependIcon?: Array<IconPath> | IconPath | string;
    detailErrors?: Array<string>; detailsOnMessageOnly?: boolean; type?: string; appendIcon?: Array<IconPath> | IconPath | string;
    labelMinWidth?: string; rules?: Array<(param: string) => string | true>;
    cols?: string | number; xs?: string | number; sm?: string | number; md?: string | number;
    lg?: string | number; xl?: string | number; inputReadonly?: boolean
}

const props = withDefaults(defineProps<Props>(), { inputAlign: 'start', type: 'text' })


const emit = defineEmits<{
    (e: 'click:clear'): void, (e: 'focus', value: FocusEvent): void,
    (e: 'click:prepend'): void, (e: 'click:append'): void, (e: 'blur', value: Event): void,
    (e: 'update:modelValue', value: string | number): void
}>()

const { fieldClass, inputStyle, id, showClearable, showDetails, textColor, mounted,
    details, labelStyle, handleHover, handleBlur, handleClickPrependIcon,
    handleClickAppendIcon, handleFocus, setInputFocus } = useField()


const { gridClass } = useGrid('e-field')
const textFieldClass = computed(() => [...fieldClass.value, 'e-text-field', ...gridClass.value])

const changeValue = (value: any, isEvent = false) => {
    const valueResult = isEvent ? value.target.value : value
    emit('update:modelValue', valueResult)
}

const clear = () => {
    changeValue('');
    emit('click:clear')
    setInputFocus()
};

</script>
<style lang="scss" src="./style.scss"></style>