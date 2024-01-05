
<template >
    <div :class="selectClass">
        <div class="e-field__control" v-click-outside="handleOutsideMenu">
            <div role="button" aria-expanded="false" class="e-field__slot">
                <div v-if="prependIcon" class="e-field__prepend-inner" @click="handleClickPrependIcon">
                    <div class="e-field__icon e-field__icon--prepend-inner">
                        <EIcon :icon="prependIcon" />
                    </div>
                </div>
                <div class="e-field__overlay"></div>
                <div class="e-select__slot e-field__field" @click="handleSelectSlotCLick" @mouseenter="handleHover(true)"
                    @mouseleave="handleHover(false)">
                    <label v-if="mounted" :for="id" :class="[textColor, 'e-label']" :style="labelStyle">
                        <slot name="label"> {{ label }}</slot>
                    </label>
                    <div v-if="prefix" :class="[textColor, 'e-field__prefix']" @click="setInputFocus">
                        {{ prefix }}
                    </div>
                    <div :class="['e-select__selections', textColor]">
                        <div v-if="empty && !autocomplete" class="e-select__selection" :style="selectionStyle">
                            <span class="e-select__selection-placeholder">
                                {{ placeholder }}
                            </span>
                        </div>
                        <template v-else-if="multiple">
                            <div v-for="(itemValue, index) in modelValue" class="e-select__selection" :key="index"
                                :style="selectionStyle">
                                <slot name="selection" :selection="selectionItem(itemValue)"
                                    :attrs="selectionAttrs(itemValue)">
                                    <EChip closable @click:close="handleItemClick(selectionItem(itemValue))">
                                        {{ selectedText(itemValue) }}
                                    </EChip>
                                </slot>
                            </div>
                        </template>
                        <div v-else-if="!empty" class="e-select__selection" :style="selectionStyle">
                            <slot name="selection" :selection="selectionItem()" :attrs="selectionAttrs()">
                                <EChip v-if="chip" :closable="chipClosable" @click:close="changeValue(null)">
                                    {{ selectedText() }}
                                </EChip>
                                <span v-else>{{ selectedText() }}</span>
                            </slot>
                        </div>
                        <input v-if="mounted" ref="input" :value="search" :id="id" :readonly="inputReadonly"
                            class="input--text" type="text" :aria-readonly="inputReadonly" :placeholder="placeholder"
                            autocomplete="off" @blur="handleBlur" @focus="handleSelectFocus"
                            @input="changeSearchValue($event, true)" />
                    </div>

                    <div v-if="suffix" :class="[textColor, 'e-field__suffix']" @click="setInputFocus">
                        {{ suffix }}
                    </div>
                    <transition name="scale">
                        <div v-if="!empty && clearable" class="e-field__append-inner">
                            <div class="e-field__icon e-field__icon--clear e-icon--size-default">
                                <EButton text :icon="icon.clear" small @click.stop.prevent="clear" />
                            </div>
                        </div>
                    </transition>
                    <div class="e-field__append-inner">
                        <div class="e-field__icon e-field__icon--append">
                            <EIcon :icon="arrowDown || icon.arrowDown" class="flip-icon"></EIcon>
                        </div>
                    </div>
                </div>

                <div v-if="appendIcon" class="e-field__append-inner" @click="handleClickAppendIcon">
                    <div class="e-field__icon e-field__icon--append">
                        <EIcon :icon="appendIcon" />
                    </div>
                </div>
                <div v-if="!outlined" :style="lineStyle" class="e-field__line"></div>

                <EProgressLinear v-if="loading" :color="color" :indeterminate="loading" height="3" />

                <div class="e-menu">
                    <transition name="fade">
                        <div v-show="opened" class="e-menu__content">
                            <e-list :color="color" :style="listStyle">
                                <template v-for="(item, index) in items">
                                    <slot name="item" :attrs="slotItemAttrs(item, index)" :item="item">
                                        <e-list-item :class="{ 'e-list-item--active': active(item) }"
                                            @click="handleItemClick(item)" :key="index">
                                            <slot name="item-text">
                                                {{ displayedText(item) }}
                                            </slot>
                                        </e-list-item>
                                    </slot>
                                </template>

                            </e-list>
                        </div>
                    </transition>
                </div>
            </div>
            <EDetails :details="details" :textColor="textColor" :showDetails="showDetails"></EDetails>
        </div>
    </div>
</template>

<script lang="ts">
export default { name: "Select" }
</script>
<script lang="ts" setup>
import { IconPath } from '@/types';
import icon from '@/utils/icons';

import { useGrid } from "@/composables/grid"
import { useField } from "@/composables/field"
import { useUtils } from "@/composables/utils"

import { computed, ref, watch } from 'vue';

import EButton from '@/components/button/index.vue'
import EIcon from '@/components/icon/index.vue'
import EDetails from '@/components/form/details.vue'

export type itemType = string | number | null | Record<string, any> | Array<itemType>;
export interface Props {
    arrowDown?: string | IconPath | Array<IconPath>; multiple?: boolean, returnObject?: boolean; retainColor?: boolean; loading?: boolean
    disabled?: boolean; dense?: boolean; readonly?: boolean; clearable?: boolean; itemCol?: string | number;
    labelInline?: boolean; detail?: string; outlined?: boolean; label?: string | number; search?: string | number
    modelValue?: itemType; placeholder?: string; suffix?: string; autocomplete?: boolean; chip?: boolean; lineWidth?: string | number
    prefix?: string; inputAlign?: string; color?: string; limit?: string | number; chipClosable?: boolean
    detailErrors?: Array<string>; detailsOnMessageOnly?: boolean; appendIcon?: Array<IconPath> | IconPath | string;
    labelMinWidth?: string; prependIcon?: Array<IconPath> | IconPath | string; rules?: Array<(param: any) => string | boolean>;
    cols?: string | number; xs?: string | number; sm?: string | number; md?: string | number;
    lg?: string | number; xl?: string | number;
    itemText?: string
    itemValue?: string
    items: Array<any>
}


const emit = defineEmits<{
    (e: 'click:clear'): void, (e: 'focus', value: FocusEvent): void,
    (e: 'click:prepend'): void, (e: 'click:append'): void, (e: 'blur', value: Event): void,
    (e: 'update:modelValue', value: itemType): void
    (e: 'update:search', value: string | number): void
}>()

const input = ref()

const props = withDefaults(defineProps<Props>(), { itemText: 'text', itemValue: 'value', inputAlign: 'start', itemCol: 1 })
const opened = ref<boolean>(false)
const { fieldClass, dirty, id, focused, showDetails, textColor, color, mounted,
    details, labelStyle, handleHover, handleBlur, handleClickPrependIcon,
    handleClickAppendIcon, handleFocus, setInputFocus } = useField()
const { gridClass } = useGrid('e-field')
const { isObject } = useUtils()
watch(() => opened.value, (val: boolean) => {
    if (val) {
        document.addEventListener("keydown", handleExcListener);
        setInputFocus()
    }
    else
        document.removeEventListener("keydown", handleExcListener);

})

watch(() => props.loading, (val: boolean) => {
    if (val) closeMenu()
    else {
        opened.value = true;
        openMenu()
    }
})

const lineStyle = computed(() => {
    return props.lineWidth ? { '--v-field-border-width': `${props.lineWidth}px` } : {}
})

const selectClass = computed(() => {
    const result = [...fieldClass.value, 'e-select', ...gridClass.value]
    opened.value && result.push('e-select--is-open')
    props.itemCol && result.push('e-select--columns-variant')
    props.multiple && result.push('e-select--multiple')
    props.autocomplete && result.push('e-select--autocomplete')
    props.loading && result.push('e-select--loading')
    return result
})

const inputReadonly = computed((): boolean => {
    if (!props.autocomplete) return true
    if (!props.multiple) return !empty.value
    return false
})

const selectionAttrs = (item?: itemType) => {
    const attrs: Record<string, any> = { closable: props.chipClosable || props.multiple }

    if (item) {
        attrs['onClick:close'] = () => handleItemClick(selectionItem(item))
    } else {
        attrs['onClick:close'] = () => changeValue(null)
    }
    return attrs
}

const handleExcListener = ({ key }: KeyboardEvent): void => {
    if (key === "Escape") {
        closeMenu()
    }
}
const selectionItem = (value?: itemType): any => {
    const isArrayOfObjects = isObject(props.items[0]);
    let item: itemType | undefined;
    const localValue = value || props.modelValue
    if (props.returnObject) {
        const compareItem: string | number = (localValue as Record<string, any>)?.[props.itemValue]
        item = (props.items as Array<Record<string, any>>).find((el) => el[props.itemValue] === compareItem)
    }
    else if (isArrayOfObjects) {
        item = (props.items as Array<Record<string, any>>).find((el) => el[props.itemValue] == localValue)
    }
    else {
        item = (props.items as Array<string | number>).find((el) => el === localValue)
    }
    return item || {}
}

const handleSelectFocus = (event: FocusEvent): void => {
    opened.value = true;
    handleFocus(event)
}

const openMenu = (): void => {
    input.value?.focus()
}

const empty = computed((): boolean => {
    if (props.multiple) {
        return (props.modelValue as Array<itemType>)?.length === 0
    }
    return props.modelValue === undefined || props.modelValue === null || props.modelValue === ""
})

const slotItemAttrs = (item: itemType, index: number): Record<string, any> => {
    const attrs: Record<string, any> = {}
    attrs.class = { 'e-list-item--active': active(item) }
    attrs.onClick = () => handleItemClick(item)
    attrs.key = index
    return attrs;
}
const changeSearchValue = (value: any, isEvent = false): void => {
    const valueResult = isEvent ? value.target.value : value
    emit('update:search', valueResult)
}

const closeMenu = (): void => {
    opened.value = false;
    focused.value = false;
}
const displayedText = (item: itemType): string => {
    return isObject(item) ? (item as Record<string, any>)[props.itemText] : item;
}
const changeValue = (value: any, isEvent = false) => {
    const valueResult = isEvent ? value.target.value : value
    emit('update:modelValue', valueResult)
}

const handleItemClick = (item: itemType): void => {
    if (props.autocomplete) changeSearchValue('')
    if (props.multiple) {
        const result: Array<itemType> = [...(props.modelValue as Array<itemType>)]

        let index = -1;
        let value: itemType = item;
        if (isObject(item)) {
            if (props.returnObject) {
                index = result.findIndex((e) => JSON.stringify(e) === JSON.stringify(item));
            } else {
                index = result.findIndex(
                    (e) => e === (item as Record<string, string>)[props.itemValue]
                );
                value = (item as Record<string, string>)?.[props.itemValue]
            }
        } else {
            index = result.findIndex((e) => e === item);
            value = item
        }

        index < 0 ? result.push(value) : result.splice(index, 1)
        changeValue(result);

    } else if (props.returnObject || !isObject(item)) {
        changeValue(item);
        closeMenu()
    } else {
        changeValue((item as Record<string, any>)[props.itemValue]);
        closeMenu()
    }
}

const active = (item: itemType): boolean => {
    if (props.multiple) {
        const model: Array<itemType> = [...(props.modelValue as Array<itemType>)]

        let index = -1;
        if (isObject(item)) {
            if (props.returnObject) {
                index = model.findIndex((e) => JSON.stringify(e) === JSON.stringify(item));
            } else {
                index = model.findIndex(
                    (e) => e === (item as Record<string, string>)[props.itemValue]
                );
            }
        } else {
            index = model.findIndex((e) => e === item);
        }
        return index !== -1;

    } else if (!isObject(item)) {
        return item === props.modelValue;
    } else if (props.returnObject) {
        return JSON.stringify(item) === JSON.stringify(props.modelValue);
    } else {
        return (item as Record<string, any>)[props.itemValue] === props.modelValue;
    }
}

const selectedText = (itemValue?: itemType): string => {
    const value = itemValue || props.modelValue
    if (empty.value) {
        return '';
    }
    const isArrayOfObjects = isObject(props.items[0]);

    if (props.returnObject) {
        const item = (value || {}) as Record<string, string>
        return `${item[props.itemText]}`
    }

    if (isArrayOfObjects) {
        const item = props.items.find(
            (e) => (e as Record<string, string>)?.[props.itemValue] === value
        );

        return item?.[props.itemText] || '';
    }

    return `${value}`

}

const selectionStyle = computed((): Record<string, string> => {
    return { textAlign: props.inputAlign }
})

const listStyle = computed((): Record<string, string> => {
    const col = `${props.itemCol}`
    const percent = (1 / parseInt(col, 10) * 100)
    return { '--list-item-percent': `${percent}%`, '--list-item-col': col }
})

const clear = (): void => {
    changeValue(undefined)
    openMenu()
}

const handleOutsideMenu = (): void => {
    if (opened.value) {
        dirty.value = true;
        closeMenu()
    }
}

const handleSelectSlotCLick = (evt: Event): void => {
    evt.stopPropagation()
    openMenu()
}
</script>
<style lang="scss" src="./style.scss"></style>