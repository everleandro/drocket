<template>
    <div role="group" :class="groupCLass" :style="groupStyle" :aria-disabled="isDisabled || undefined">
        <slot name="activator" :attrs="activatorAttrs()"></slot>
        <ETransitionExpand>
            <div v-show="active" :id="contentId" class="e-list-group__content">
                <slot></slot>
            </div>
        </ETransitionExpand>
    </div>
</template>
  
<script lang="ts" setup>
import { inject, computed, provide, useId } from 'vue';
import { EListGroupInjection, EListInjection, ListGroupValue } from '@/types'
import ETransitionExpand from '@/components/transition/expand.vue';
import icon from '@/utils/icons';
import { LIST_GROUP_KEY, LIST_KEY } from './constants';

export interface Props {
    disabled?: boolean
    value?: ListGroupValue
}
const props = defineProps<Props>()

const parentList = inject<Partial<EListInjection> | undefined>(LIST_KEY, undefined);
const parentGroup = inject<EListGroupInjection | undefined>(LIST_GROUP_KEY, undefined);
const contentId = `e-list-group-${useId()}-content`
const rawId = useId()

const groupValue = computed((): ListGroupValue => {
    return props.value ?? rawId
})

const level = computed((): number => {
    return (parentGroup?.level.value ?? -1) + 1
})

const path = computed((): string => {
    const parentPath = parentGroup?.path.value
    return parentPath ? `${parentPath}/${groupValue.value}` : String(groupValue.value)
})

const isDisabled = computed((): boolean => {
    return !!props.disabled || !!parentList?.disabled?.value
})

const active = computed((): boolean => {
    if (typeof parentList !== "undefined") {
        if (Array.isArray(parentList?.group?.value)) {
            return parentList?.group.value?.includes(path.value)
        } else {
            return parentList?.group?.value === path.value
        }
    }
    return false
})

const groupStyle = computed((): Record<string, string> => {
    return {
        '--list-group-level': String(level.value),
    }
})

provide(LIST_GROUP_KEY, {
    level,
    path,
})

const activatorAttrs = () => {
    const attrs: Record<string, any> = {
        isActive: active.value,
        ['data-activator-node']: true,
        ['data-list-group-activator']: true,
        ['data-list-group-path']: path.value,
        ['data-list-group-parent-path']: parentGroup?.path.value,
        ['data-list-group-level']: level.value,
        ['append-icon']: icon.chevronDown,
        ['aria-expanded']: active.value,
        ['aria-controls']: contentId,
        disabled: isDisabled.value,
    }
    attrs['onClick'] = () => updateParentValue()
    return attrs;
}
const updateParentValue = () => {
    if (isDisabled.value) return
    parentList?.changeGroupValue?.(path.value)
}

const groupCLass = computed((): Array<string> => {
    const classes = ["e-list-group"]
    active.value && classes.push('e-list-group--active')
    level.value > 0 && classes.push('e-list-group--nested')
    return classes
})

</script>
  