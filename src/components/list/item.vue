<template>
    <component ref="node" v-ripple="{ disabled: !clickeableType() }" :is="tagResult" :active-class="activeClass"
        v-bind="liBindingOptions" :class="listItemCLass" @click="handleItemClick">
        <div v-if="hasPrepend" class="e-list-item__prepend">
            <slot name="prepend">
                <EIcon v-if="prependIcon" :icon="prependIcon" v-bind="iconSize"></EIcon>
                <EAvatar v-else-if="prependAvatar" :size="avatarSize" :src="prependAvatar"></EAvatar>
            </slot>
        </div>
        <div class="e-list-item__content">
            <span v-if="title" class="e-list-item-title">{{ title }}</span>
            <span v-if="subtitle" class="e-list-item-subtitle">{{ subtitle }}</span>
            <slot></slot>
        </div>
        <div v-if="hasAppend" class="e-list-item__append">
            <slot name="append">
                <EIcon v-if="appendIcon" :icon="appendIcon" v-bind="iconSize"></EIcon>
                <EAvatar v-else-if="appendAvatar" :size="avatarSize" :src="appendAvatar"></EAvatar>
            </slot>
        </div>
    </component>
</template>

<script lang="ts" setup>
import { IconPath, EListInjection, ListSizeClassKeys } from '@/types'
import EIcon from '@/components/icon/index.vue';
import { ripple } from '@/directives'
import EAvatar from '@/components/avatar.vue';
import { computed, useAttrs, useSlots, inject, ref } from 'vue';
import { parse } from 'path';

const vRipple = { ...ripple }

export interface Props {
    disabled?: boolean
    ripple?: boolean
    prependIcon?: string | IconPath | Array<IconPath>
    appendIcon?: string | IconPath | Array<IconPath>
    prependAvatar?: string
    appendAvatar?: string
    isActive?: boolean
    activeClass?: string
    title?: string
    subtitle?: string
    tag?: string
    color?: string
    value?: string | number | undefined
    avatarSize?: string | number | undefined
    small?: boolean
    xSmall?: boolean
    large?: boolean
    xLarge?: boolean
}

const props = defineProps<Props>()
const slots = useSlots()
const attrs = useAttrs()
const parentList = inject<Partial<EListInjection> | undefined>("EList", undefined);
const node = ref<HTMLElement | null>(null)

const active = computed((): boolean => {
    if (typeof props.isActive !== "undefined") return props.isActive
    if (typeof parentList !== "undefined" && props.value !== undefined) {
        if (Array.isArray(parentList?.modelValue?.value)) {
            return parentList?.modelValue.value?.includes(props.value)
        } else {
            return parentList?.modelValue?.value === props.value
        }
    }
    return false
})

const emit = defineEmits<{
    (e: 'click:item', value: MouseEvent): void
}>()
const liBindingOptions = computed((): Record<string, any> => {
    const options: Record<string, any> = {}
    if (clickeableType()) {
        options['tabindex'] = 0
        options['role'] = 'option'
        options['aria-selected'] = active.value
    }
    return options
})
const availableRootClasses = {
    disabled: "e-list-item--disabled",
    clickeable: "e-list-item--clickeable",
    root: "e-list-item",
    ripple: "v-ripple-element",
    active: "e-list-item--active",
};

const sizeClasses = {
    xSmall: 'e-list-item--size-x-small',
    small: 'e-list-item--size-small',
    default: 'e-list-item--size-default',
    large: 'e-list-item--size-large',
    xLarge: 'e-list-item--size-x-large'
}

const iconSize = computed(() => {
    if (props.small) return { small: true }
    if (props.xSmall) return { xSmall: true }
    if (props.large) return { large: true }
    if (props.xLarge) return { xLarge: true }
})

const listItemCLass = computed((): Array<unknown> => {
    const classes = [availableRootClasses.root, attrs.class || '']
    props.color && classes.push(`${props.color}--text`)
    props.disabled && classes.push(availableRootClasses.disabled)
    if (clickeableType()) {
        classes.push([availableRootClasses.clickeable, availableRootClasses.ripple].join(' '))
    }
    if (active.value) {
        (classes.push(availableRootClasses.active) && classes.push(props.activeClass || ''))
    }
    const availableSizeClassKeys = Object.keys(sizeClasses) as Array<ListSizeClassKeys>
    const sizeClass = availableSizeClassKeys.filter(
        (key) => !!props[key]
    ).map(key => sizeClasses[key]);
    if (sizeClass.length == 0) classes.push(sizeClasses.default)
    return [...classes, ...sizeClass];
})

const avatarSize = computed((): number => {
    if (props.avatarSize) return parseInt(props.avatarSize as string)
    if (props.xSmall) return 26
    if (props.small) return 20
    if (props.large) return 38
    if (props.xLarge) return 42
    return 34
})

const hasPrepend = computed((): boolean => {
    return !!slots.prepend || !!props.prependAvatar || !!props.prependIcon;
})

const hasAppend = computed((): boolean => {
    return !!slots.append || !!props.appendAvatar || !!props.appendIcon;
})

const tagResult = computed((): string => {
    if (props.tag)
        return props.tag
    return attrs.to ? "router-link" : "li"
});
const isActivator = computed((): boolean => {
    return !!attrs['data-activator-node']
})

const handleItemClick = (evt: MouseEvent): void => {
    emit('click:item', evt)
    if (typeof props.value !== 'undefined' && !isActivator.value)
        parentList?.changeModelValue?.(props.value)
}

const clickeableType = (): boolean => {
    return !!attrs.to || props.value !== undefined || isActivator.value;
}
</script>