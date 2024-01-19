<template>
    <div role="listbox" :class="groupCLass()">
        <slot name="activator" :attrs="activatorAttrs()"></slot>
        <ETransitionExpand>
            <div v-show="active" class="e-list-group__content">
                <slot></slot>
            </div>
        </ETransitionExpand>
    </div>
</template>
  
<script lang="ts" setup>
import { inject, computed } from 'vue';
import { EListInjection } from '@/types'
import ETransitionExpand from '@/components/transition/expand.vue';
import icon from '@/utils/icons';

export interface Props {
    disabled?: boolean
    value?: string
}
const props = defineProps<Props>()

const parentList = inject<Partial<EListInjection> | undefined>("EList", undefined);

const active = computed((): boolean => {
    if (typeof parentList !== "undefined") {
        if (Array.isArray(parentList?.group?.value)) {
            return parentList?.group.value?.includes(props.value || -1)
        } else {
            return parentList?.group?.value === props.value
        }
    }
    return false
})

const activatorAttrs = () => {
    const attrs: Record<string, any> = {
        isActive: active.value,
        ['data-activator-node']: true,
        ['append-icon']: icon.chevronDown
    }
    attrs['onClick'] = () => updateParentValue()
    return attrs;
}
const updateParentValue = () => {
    parentList?.changeGroupValue?.(props.value)
}

const groupCLass = (): Array<string> => {
    const classes = ["e-list-group"]
    return classes
}

</script>
  