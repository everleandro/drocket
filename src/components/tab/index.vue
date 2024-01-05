<template>
    <slot name="activator" :attrs="activatorAttrs()">
        <EButton :class="['e-tab',
            { 'e-slide-group-item--active e-tab--selected': active }]" :color="color" text tabindex="0" role="tab"
            :aria-selected="active" :value="value" @click="changeGroupValue">
            <slot></slot>
            <div class="e-tab__slider" :style="sliderStyle"></div>
        </EButton>
    </slot>
</template>
<script lang="ts" setup>
import { computed, inject, reactive } from "vue";
import { TabGroup } from "./group.vue"

export interface Props {
    value: string | number
}
const props = defineProps<Props>()
const Group = inject<Partial<TabGroup> | undefined>("TabGroup", undefined);
const sliderStyle = reactive<Record<string, string>>({})
const active = computed(() => Group?.modelValue?.value === props.value)

const changeGroupValue = (): void => {
    Group?.changeValue?.(props.value)
}

const color = computed((): string => {
    return active.value ? (Group?.color?.value || 'primary') : (Group?.inactiveColor?.value || 'secondary')
})
const activatorAttrs = () => {
    const attrs: Record<string, any> = {}
    attrs['onClick'] = () => changeGroupValue()
    return attrs;
}

</script>
<style lang="scss" src="./style.scss"></style>