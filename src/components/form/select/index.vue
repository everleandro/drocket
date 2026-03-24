<template>
    <div :class="selectClass" :style="fieldStyle">
        <div class="e-field__control">
            <EMenu v-model="opened" full-width hold-focus check-offset :close-on-content-click="false">
                <template #activator="{ ref: activatorRef }">
                    <div role="button" class="e-field__slot" :ref="activatorRef" @click="handleSelectSlotClick"
                        @keydown="handleSelectSlotKeydown">
                        <div v-if="prependIcon" class="e-field__prepend-inner" @click="handleClickPrependIcon">
                            <div class="e-field__icon e-field__icon--prepend-inner">
                                <EIcon :icon="prependIcon" />
                            </div>
                        </div>
                        <div class="e-field__overlay"></div>
                        <div class="e-select__slot e-field__field" @click="focusInput" @mouseenter="handleHover(true)"
                            @mouseleave="handleHover(false)">
                            <label v-if="mounted" :for="id" :class="[
                                'e-label',
                                {
                                    'e-label--floating': isLabelFloating,
                                    'e-label--floated': shouldFloatLabel,
                                },
                            ]" :style="labelStyle">
                                <slot name="label"> {{ label }}</slot>
                            </label>
                            <div v-if="prefix" class="e-field__prefix" @click="focus">
                                {{ prefix }}
                            </div>
                            <div class="e-select__selections">
                                <div v-if="showPlaceholderSelection" class="e-select__selection" :style="selectionStyle">
                                    <span class="e-select__selection-placeholder">
                                        {{ resolvedPlaceholder }}
                                    </span>
                                </div>
                                <template v-else-if="multiple && chip">
                                    <div v-for="(itemValue, index) in selectedItems" class="e-select__selection"
                                        :key="index" :style="selectionStyle">
                                        <slot name="selection" :selection="selectionItem(itemValue)"
                                            :attrs="selectionAttrs(itemValue)">
                                            <EChip v-if="chip" :closable="true" @click:close="handleItemClick(selectionItem(itemValue))" :color="color">
                                                {{ selectedText(itemValue) }}
                                            </EChip>
                                        </slot>
                                    </div>
                                </template>
                                <div v-else-if="multiple" class="e-select__selection e-select__selection--text"
                                    :style="selectionStyle">
                                    <span class="e-select__selection-text" :title="multipleSelectedText">
                                        {{ multipleSelectedText }}
                                    </span>
                                </div>
                                <div v-else-if="!empty" class="e-select__selection" :style="selectionStyle">
                                    <slot name="selection" :selection="selectionItem()" :attrs="selectionAttrs()">
                                        <EChip v-if="chip" :closable="chipClosable" :color="color" @click:close="changeValue(null)">
                                            {{ selectedText() }}
                                        </EChip>
                                        <span v-else>{{ selectedText() }}</span>
                                    </slot>
                                </div>
                                <input ref="input" :value="search" :id="id" :readonly="inputReadonly"
                                    class="input--text" type="text" :aria-readonly="inputReadonly"
                                    :placeholder="resolvedPlaceholder" autocomplete="off" @blur="handleBlur"
                                    @focus="handleSelectFocus" @input="changeSearchValue($event, true)" />
                            </div>

                            <div v-if="suffix" class="e-field__suffix" @click="focus">
                                {{ suffix }}
                            </div>
                            <transition name="scale">
                                <div v-if="!empty && clearable" class="e-field__append-inner">
                                    <div class="e-field__icon e-field__icon--clear e-icon--size-default">
                                        <EButton text :icon="icon.clear" size="small" @click.stop.prevent="clear" />
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
                    </div>
                </template>

                <div class="e-select__menu-content">
                    <e-list :color="color" :style="listStyle">
                        <template v-for="(item, index) in items">
                            <slot name="item" :attrs="slotItemAttrs(item, index)" :item="item">
                                <e-list-item active-class="e-list-item--active" :isActive="active(item)"
                                    @click="handleItemClick(item)" :key="index" :value="getListItemValue(item)">
                                    {{ displayedText(item) }}
                                </e-list-item>
                            </slot>
                        </template>
                    </e-list>
                </div>
            </EMenu>
            <EDetails :details="details" :showDetails="showDetails"></EDetails>
        </div>
    </div>
</template>

<script lang="ts">
export default { name: "Select" }
</script>
<script lang="ts" setup>
import type { SelectEmits, SelectItemObject, SelectItemType, SelectModelValue, SelectProps } from '@/types';
import icon from '@/utils/icons';
import { useFieldActions } from "@/composables/field-actions"
import { useGridCol } from "@/composables/grid-col"
import { useField } from "@/composables/field"
import { useUtils } from "@/composables/utils"

import { computed, ref, watch } from 'vue';

import EButton from '@/components/button/index.vue'
import EIcon from '@/components/icon/index.vue'
import EDetails from '@/components/form/details.vue'
import EChip from '@/components/chip/index.vue'
import EList from '@/components/list/index.vue'
import EListItem from '@/components/list/item.vue'
import EMenu from '@/components/menu/index.vue'
import EProgressLinear from '@/components/progress/linear.vue'

const emit = defineEmits<SelectEmits>()

const input = ref<HTMLInputElement | null>(null)

const props = withDefaults(defineProps<SelectProps>(), { itemText: 'text', itemValue: 'value', inputAlign: 'start', itemCol: 1 })
const opened = ref<boolean>(false)
const { fieldClass, fieldStyle, id, focused, focus, blur, showDetails, color, mounted,
    details, labelStyle, handleHover, handleBlur, handleFocus, validate, reset, resetValidation,
    isLabelFloating, shouldFloatLabel } = useField()
const { handleClickPrependIcon, handleClickAppendIcon } = useFieldActions({ emit, focus })
const { gridColClass } = useGridCol(props)
const { isObject } = useUtils()

const isItemObject = (value: unknown): value is SelectItemObject => isObject(value)

const getItemValue = (item: SelectItemType | SelectModelValue | undefined): SelectItemType | undefined => {
    if (!isItemObject(item)) return item as SelectItemType | undefined
    return item[props.itemValue] as SelectItemType | undefined
}

const getItemText = (item: SelectItemType | undefined): string => {
    if (!isItemObject(item)) {
        return item == null ? '' : String(item)
    }

    const result = item[props.itemText]
    return result == null ? '' : String(result)
}

const getListItemValue = (item: SelectItemType): string | number | undefined => {
    const value = getItemValue(item) ?? item
    return typeof value === 'string' || typeof value === 'number' ? value : undefined
}

watch(() => opened.value, (val: boolean) => {
    if (val) focus()
})

watch(() => props.loading, (val: boolean) => {
    if (val) closeMenu()
    else {
        opened.value = true;
        focusInput()
    }
})

const lineStyle = computed(() => {
    return props.lineWidth ? { '--v-field-border-width': `${props.lineWidth}px` } : {}
})

const selectClass = computed(() => {
    const result = [...fieldClass.value, 'e-select', ...gridColClass.value]
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

const resolvedPlaceholder = computed(() => {
    if (!props.placeholder) return undefined
    if (!isLabelFloating.value) return props.placeholder

    return shouldFloatLabel.value ? props.placeholder : undefined
})

const hasObjectItems = computed((): boolean => isItemObject(props.items[0]))

const selectedItems = computed<Array<SelectItemType>>(() => {
    return props.multiple ? ((props.modelValue as Array<SelectItemType>) || []) : []
})

const multipleModel = computed<Array<SelectItemType>>(() => {
    return props.multiple ? [...selectedItems.value] : []
})

const areSameItems = (left: SelectItemType, right: SelectItemType): boolean => {
    return JSON.stringify(left) === JSON.stringify(right)
}

const getComparableValue = (item: SelectItemType | SelectModelValue | undefined): SelectItemType | undefined => {
    return props.returnObject ? getItemValue(item) : getItemValue(item) ?? (item as SelectItemType | undefined)
}

const getEmittedItemValue = (item: SelectItemType): SelectItemType => {
    if (props.returnObject || !isItemObject(item)) return item
    return getItemValue(item) as SelectItemType
}

const findSelectedIndex = (items: Array<SelectItemType>, item: SelectItemType): number => {
    if (isItemObject(item)) {
        if (props.returnObject) {
            return items.findIndex((candidate) => areSameItems(candidate, item))
        }

        const comparableValue = getComparableValue(item)
        return items.findIndex((candidate) => candidate === comparableValue)
    }

    return items.findIndex((candidate) => candidate === item)
}

const selectionAttrs = (item?: SelectItemType) => {
    const attrs: Record<string, unknown> = { closable: Boolean(props.chip && (props.chipClosable || props.multiple)) }

    if (item) {
        attrs['onClick:close'] = () => handleItemClick(selectionItem(item))
    } else {
        attrs['onClick:close'] = () => changeValue(null)
    }
    return attrs
}

const selectionItem = (value?: SelectItemType): SelectItemType => {
    let item: SelectItemType | undefined
    const localValue = value || props.modelValue

    if (props.returnObject) {
        const compareItem = getComparableValue(localValue)
        item = props.items.find((candidate) => getComparableValue(candidate) === compareItem)
    }
    else if (hasObjectItems.value) {
        item = props.items.find((candidate) => getComparableValue(candidate) == localValue)
    }
    else {
        item = props.items.find((candidate) => candidate === localValue)
    }

    return item || (isItemObject(localValue) ? localValue : {})
}

const handleSelectFocus = (event: FocusEvent): void => {
    opened.value = true;
    handleFocus(event)
}

const focusInput = (): void => {
    input.value?.focus()
}

const empty = computed((): boolean => {
    if (props.multiple) {
        return (props.modelValue as Array<SelectItemType>)?.length === 0
    }
    return props.modelValue === undefined || props.modelValue === null || props.modelValue === ""
})

const showPlaceholderSelection = computed((): boolean => {
    return empty.value && !props.autocomplete && Boolean(resolvedPlaceholder.value)
})

const slotItemAttrs = (item: SelectItemType, index: number): Record<string, unknown> => {
    const attrs: Record<string, unknown> = {}
    attrs.class = { 'e-list-item--active': active(item) }
    attrs.value = getListItemValue(item)
    attrs.onClick = () => handleItemClick(item)
    attrs.key = index
    return attrs;
}

const getEventInputValue = (value: Event): string => {
    return (value.target as HTMLInputElement | null)?.value || ''
}

const changeSearchValue = (value: Event | string | number, isEvent = false): void => {
    const valueResult: string | number = isEvent || value instanceof Event
        ? getEventInputValue(value as Event)
        : value
    if (props.autocomplete) {
        opened.value = true
    }
    emit('update:search', valueResult)
}

const openMenu = (): void => {
    if (props.disabled || props.readonly || props.loading) return
    opened.value = true
}

const closeMenu = (): void => {
    opened.value = false;
    focused.value = false;
}
const displayedText = (item: SelectItemType): string => {
    return getItemText(item)
}
const changeValue = (value: Event | SelectModelValue | undefined, isEvent = false) => {
    const valueResult: SelectModelValue = isEvent ? getEventInputValue(value as Event) : (value as SelectModelValue)
    emit('update:modelValue', valueResult)
}

const handleItemClick = (item: SelectItemType): void => {
    if (props.autocomplete) changeSearchValue('')

    if (props.multiple) {
        const result: Array<SelectItemType> = [...multipleModel.value]
        const index = findSelectedIndex(result, item)
        const value = getEmittedItemValue(item)
        index < 0 ? result.push(value) : result.splice(index, 1)
        changeValue(result);
        return
    }

    changeValue(getEmittedItemValue(item));
    closeMenu()
}

const active = (item: SelectItemType): boolean => {
    if (props.multiple) {
        return findSelectedIndex(multipleModel.value, item) !== -1
    }

    if (!isItemObject(item)) {
        return item === props.modelValue;
    }

    if (props.returnObject) {
        return JSON.stringify(item) === JSON.stringify(props.modelValue);
    }

    return getComparableValue(item) === props.modelValue;
}

const selectedText = (itemValue?: SelectItemType): string => {
    if (empty.value) {
        return '';
    }

    return getItemText(selectionItem(itemValue))

}

const multipleSelectedText = computed((): string => {
    return selectedItems.value
        .map((itemValue) => selectedText(itemValue))
        .filter((value) => value.length > 0)
        .join(', ')
})

const selectionStyle = computed((): Record<string, string> => {
    return { textAlign: props.inputAlign }
})

const listStyle = computed((): Record<string, string> => {
    const col = `${props.itemCol}`
    const percent = (1 / parseInt(col, 10) * 100)
    return { '--list-item-percent': `${percent}%`, '--list-item-col': col }
})

const clear = (): void => {
    changeValue(props.multiple ? [] : undefined)
    changeSearchValue('')
    emit('click:clear')
    openMenu()
    focusInput()
}

const handleSelectSlotClick = (evt: Event): void => {
    evt.stopPropagation()
    openMenu()
    focusInput()
}

const handleSelectSlotKeydown = (evt: KeyboardEvent): void => {
    if (evt.target === input.value) return

    if (evt.key === 'Escape') {
        closeMenu()
        return
    }

    if (evt.key === 'Enter' || evt.key === ' ' || evt.key === 'ArrowDown') {
        evt.preventDefault()
        openMenu()
        focusInput()
    }
}

defineExpose({
    focus,
    blur,
    validate,
    reset,
    resetValidation,
    input,
})
</script>
<style lang="scss" src="./style.scss"></style>