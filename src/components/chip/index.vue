<template>
    <component
        v-ripple="rippleBinding"
        :is="rootTag"
        v-bind="rootAttributes"
        :class="chipClass"
        :style="chipStyle"
        @click="handleRootClick"
        @keydown="handleKeydown"
        @keyup="handleKeyup">
        <span v-if="hasPrepend" class="e-chip__prepend">
            <slot name="prepend">
                <EIcon v-if="prependIcon" :icon="prependIcon" />
                <EAvatar v-if="prependAvatar" :src="prependAvatar" />
            </slot>
        </span>
        <span class="e-chip__underlay"></span>
        <span class="e-chip__content">
            <slot></slot>
        </span>

        <span v-if="hasAppend" class="e-chip__append">
            <slot name="append">
                <EIcon v-if="appendIcon" :icon="appendIcon" />
                <EAvatar v-if="appendAvatar" :src="appendAvatar" />
            </slot>
        </span>

        <span v-if="closable" class="e-chip__close">
            <button v-ripple="{ center: true }" type="button"
                class="e-btn e-btn--icon"
                :aria-label="props.closeLabel"
                @click.stop="handleClickClose">
                <EIcon :icon="icon.clear" />
            </button>
        </span>
    </component>
</template>
<script lang="ts">
export default { name: "Chip" }
</script>
<script lang="ts" setup>
import { ElevationProps, IconPath, SizeProps } from '@/types'
import { useResolvedColor } from '@/composables/color'
import { ripple } from '@/directives'
import icon from '@/utils/icons';
import EIcon from '@/components/icon/index.vue'
import EAvatar from '@/components/avatar.vue'
import { getBooleanClasses } from '@/composables/utils'

import { computed, useAttrs, useSlots } from 'vue';

const vRipple = { ...ripple }

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ElevationProps & SizeProps & {
    tag?: string
    type?: string
    ariaLabel?: string
    clickable?: boolean
    disabled?: boolean
    ripple?: boolean
    selected?: boolean
    closable?: boolean
    closeLabel?: string
    color?: string
    text?: boolean
    prependAvatar?: string
    appendAvatar?: string
    appendIcon?: Array<IconPath> | IconPath | string
    prependIcon?: Array<IconPath> | IconPath | string
}>(), {
    closeLabel: 'Close',
    clickable: false,
    disabled: false,
    ripple: false,
    size: 'default',
})
const attrs = useAttrs()
const slots = useSlots()

const interactiveRootTags = ['button', 'a'] as const

const rootTag = computed(() => {
    if (props.tag) {
        if (props.closable && interactiveRootTags.includes(props.tag as typeof interactiveRootTags[number])) {
            return 'div'
        }

        return props.tag
    }

    if (props.closable) return 'div'
    return props.clickable ? 'button' : 'span'
})

const isButtonTag = computed(() => rootTag.value === 'button')
const needsButtonSemantics = computed(() => props.clickable && !isButtonTag.value)
const booleanClassKeys = ['clickable', 'disabled', 'selected', 'text'] as const
const rippleBinding = computed(() => ({
    center: true,
    disabled: !props.ripple || !props.clickable || props.disabled,
}))

const rootAttributes = computed(() => {
    const resolvedAttrs: Record<string, unknown> = {
        ...attrs,
        draggable: false,
    }

    if (props.ariaLabel && resolvedAttrs['aria-label'] === undefined) {
        resolvedAttrs['aria-label'] = props.ariaLabel
    }

    if (props.clickable) {
        if (isButtonTag.value) {
            resolvedAttrs.type = props.type || 'button'
            resolvedAttrs.disabled = props.disabled
        } else {
            if (resolvedAttrs.role === undefined) {
                resolvedAttrs.role = 'button'
            }

            if (resolvedAttrs.tabindex === undefined) {
                resolvedAttrs.tabindex = props.disabled ? -1 : 0
            }

            resolvedAttrs['aria-disabled'] = String(props.disabled)
        }

        if (props.selected !== undefined) {
            resolvedAttrs['aria-pressed'] = String(props.selected)
        }
    }

    return resolvedAttrs
})

const chipClass = computed(() => {
    const classes = [`e-chip e-chip--size-${props.size}`]
    props.ripple && classes.push('v-ripple-element')
    classes.push(...getBooleanClasses(props, booleanClassKeys, 'e-chip'))
    hasPrepend.value && classes.push('e-chip--has-prepend')
    props.prependAvatar && classes.push('e-chip--has-prepend-avatar')
    hasAppend.value && classes.push('e-chip--has-append')
    props.appendAvatar && classes.push('e-chip--has-append-avatar')
    props.closable && classes.push('e-chip--has-close')
    props.elevation && classes.push(`e-elevation--${props.elevation}`)
    return classes
})

const { colorStyles: chipStyle } = useResolvedColor({
    color: computed(() => props.color),
    colorVar: '--e-chip-color',
})

const emit = defineEmits<{
    (e: 'click', value: MouseEvent | KeyboardEvent): void
    (e: 'click:close', value: Event): void
}>()

const emitChipClick = (evt: MouseEvent | KeyboardEvent) => {
    if (!props.clickable || props.disabled) return
    emit('click', evt)
}

const handleRootClick = (evt: MouseEvent) => {
    if (!props.clickable) return

    if (props.disabled) {
        evt.preventDefault()
        evt.stopPropagation()
        return
    }

    emitChipClick(evt)
}

const handleClickClose = (evt: Event) => {
    emit('click:close', evt)
}

const triggerKeyboardClick = (evt: KeyboardEvent) => {
    if (!needsButtonSemantics.value || props.disabled) return
    emitChipClick(evt)
}

const handleKeydown = (evt: KeyboardEvent) => {
    if (!needsButtonSemantics.value) return

    if (evt.key === 'Enter') {
        evt.preventDefault()
        triggerKeyboardClick(evt)
    }

    if (evt.key === ' ') {
        evt.preventDefault()
    }
}

const handleKeyup = (evt: KeyboardEvent) => {
    if (!needsButtonSemantics.value) return
    if (evt.key !== ' ') return

    evt.preventDefault()
    triggerKeyboardClick(evt)
}

const hasPrepend = computed((): boolean => {
    return !!slots.prepend || !!props.prependAvatar || !!props.prependIcon;
})

const hasAppend = computed((): boolean => {
    return !!slots.append || !!props.appendAvatar || !!props.appendIcon;
})

</script>
<style lang="scss" src="./style.scss"></style>