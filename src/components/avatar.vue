<template>
    <div class="e-avatar__wrapper">
        <div :class="avatarClass" :style="style">
            <slot>
                <EIcon v-if="icon" :icon="icon"></EIcon>
                <img v-else :src="src" alt="avatar" />
            </slot>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import EIcon from '@/components/icon/index.vue'

export interface Props {
    color?: string
    icon?: string
    src?: string
    size?: string | number
}

const props = withDefaults(defineProps<Props>(), { size: '65' })

const avatarClass = computed(() => {
    const classes = ['e-avatar__container']
    props.color && classes.push(`${props.color}--text`)
    return classes
})

const style = computed(() => {
    return { height: `${props.size}px`, width: `${props.size}px`, '--size': `${props.size}px` }
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
        }

        i.e-icon {
            font-size: calc(var(--size) - var(--size) / 3);
        }
    }
}
</style>
