<template>
    <div class="e-avatar__wrapper">
        <div :class="avatarClass" :style="avatarStyle">
            <slot>
                <img v-if="hasImage" :src="src" alt="avatar" />
                <EIcon v-else :icon="resolvedIcon"></EIcon>
            </slot>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { ElevationProps, IconPath, SizeProps, SizeValue } from '@/types';
import { normalizeDimension } from '@/composables/utils'
import EIcon from '@/components/icon/index.vue'
import iconFactory from '@/utils/icons'

export interface Props extends ElevationProps, SizeProps<SizeValue> {
    color?: string
    icon?: string | IconPath | IconPath[]
    src?: string
}

const avatarSizeKeys = ['x-small', 'small', 'default', 'large', 'x-large'] as const

const props = withDefaults(defineProps<Props>(), { size: 'default' })

const isPresetSize = computed(() => {
    return typeof props.size === 'string' && avatarSizeKeys.includes(props.size as typeof avatarSizeKeys[number])
})

const avatarClass = computed(() => {
    const classes: string[] = ['e-avatar__container']
    props.color && classes.push(`${props.color}--text`)
    props.elevation && classes.push(`e-elevation--${props.elevation}`)
    isPresetSize.value && classes.push(`e-avatar__container--size-${props.size}`)
    return classes
})

const hasImage = computed(() => typeof props.src === 'string' && props.src.trim().length > 0)

const resolvedIcon = computed(() => props.icon || iconFactory.person)

const avatarStyle = computed(() => {
    if (isPresetSize.value) {
        return {}
    }

    const size = normalizeDimension(props.size)
    return size ? { '--avatar-size': size, '--size': size } : {}
})

</script>

<style lang="scss">
@use '~/public/styles/_mixins.scss' as *;

.e-avatar {
    &__container {
        flex: none;
        align-items: center;
        display: inline-flex;
        justify-content: center;
        line-height: normal;
        overflow: hidden;
        position: relative;
        text-align: center;
        transition: .2s cubic-bezier(.4, 0, .2, 1);
        transition-property: width, height;
        vertical-align: middle;
        border-radius: 50%;
        @include button-before();

        &::before {
            opacity: .1;
        }

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
}
</style>
