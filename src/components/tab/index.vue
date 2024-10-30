<template>
    <slot name="activator" :attrs="activatorAttrs()">
        <EButton v-bind="buttonProps" :class="['e-tab',
            { 'e-slide-group-item--active e-tab--selected': active }]" tabindex="0" role="tab" :aria-selected="active"
            :value="value" @click="changeGroupValue" :icon="icon">
            <slot></slot>
            <div class="e-tab__slider" :style="sliderStyle"></div>
        </EButton>
    </slot>
</template>
<script lang="ts" setup>
import { computed, inject, reactive } from "vue";
import { TabGroup } from "./group.vue"
import EButton from "@/components/button/index.vue";
import { ButtonProps } from "@/components/button/index.vue";
export interface Props extends ButtonProps {
    value: string | number
    to: any
}
const props = defineProps<Props>();
const Group = inject<Partial<TabGroup> | undefined>("TabGroup", undefined);
const sliderStyle = reactive<Record<string, string>>({})
const active = computed(() => Group?.modelValue?.value === props.value && props.value !== undefined)

const changeGroupValue = (): void => {
    Group?.changeValue?.(props.value)
}

const color = computed((): string => {
    if (props.value === undefined)
        return props.color || 'primary'
    return active.value ? (props.color || Group?.color?.value || 'primary') : (Group?.inactiveColor?.value || 'secondary')
})
const buttonProps = computed((): Partial<ButtonProps> => {
    const propsResult: ButtonProps = {
        ...props,
        color: color.value,
        text: props.text || true,
    }
    return propsResult;
})
const activatorAttrs = () => {
    const attrs: Record<string, any> = {}
    attrs['onClick'] = () => changeGroupValue()
    return attrs;
}

</script>
<style lang="scss" src="./style.scss"></style>