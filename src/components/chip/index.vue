<template>
    <span :class="chipClass" draggable="false">
        <span v-if="hasPrepend" class="e-chip__prepend">
            <slot name="prepend">
                <EIcon v-if="prependIcon" :icon="prependIcon" />
                <EAvatar v-if="prependAvatar" :size="avatarSize" :src="prependAvatar" />
            </slot>
        </span>
        <span class="e-chip__underlay"></span>
        <slot></slot>

        <span class="e-chip__append">
            <slot name="append">
                <EIcon v-if="appendIcon" :icon="appendIcon" />
                <EAvatar v-if="appendAvatar" :size="32" :src="appendAvatar" />
            </slot>
        </span>
        <span v-if="closable" class="e-chip__close" aria-label="Close">
            <button v-ripple="{ center: true }" type="button" class="e-btn e-btn--icon e-btn--size-small"
                @click="handleClickClose">
                <EIcon :icon="icon.clear" />
            </button>
        </span>
    </span>
</template>
<script lang="ts">
export default { name: "Chip" }
</script>
<script lang="ts" setup>
import { IconPath } from '@/types'
import icon from '@/utils/icons';
import EIcon from '@/components/icon/index.vue'
import EAvatar from '@/components/avatar.vue'

import { computed, useSlots, withDefaults } from 'vue';
export interface Props {
    closable?: boolean
    color?: string
    text?: boolean
    prependAvatar?: string
    avatarSize?: string | number
    appendAvatar?: string
    appendIcon?: Array<IconPath> | IconPath | string
    prependIcon?: Array<IconPath> | IconPath | string
}

const props = withDefaults(defineProps<Props>(), { avatarSize: 27 })
const slots = useSlots()
const chipClass = computed(() => {
    const classes = ['e-chip e-chip--size-default']
    props.text && classes.push('e-chip--text')
    props.color && classes.push(`${props.color}--text`)
    return classes
})
const emit = defineEmits<{
    (e: 'click:close', value: Event): void
}>()

const handleClickClose = (evt: Event) => {
    emit('click:close', evt)
}

const hasPrepend = computed((): boolean => {
    return !!slots.prepend || !!props.prependAvatar || !!props.prependIcon;
})

</script>
<style lang="scss" src="./style.scss"></style>