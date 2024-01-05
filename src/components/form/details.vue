<template>
    <ETransitionExpand>
        <div v-if="showDetails">
            <div class="e-field__details">
                <div class="e-messages" role="alert">
                    <div class="e-messages__wrapper" :class="textColor">
                        {{ details }}
                    </div>
                </div>
                <div v-if="counter || limit" class="e-counter" :class="textColor">
                    {{ modelValue.length }}
                    <template v-if="limit"> / {{ limit }}</template>
                </div>
            </div>
        </div>
    </ETransitionExpand>
</template>
  
<script lang="ts" setup>
import ETransitionExpand from '@/components/transition/expand.vue'
export interface Props {
    modelValue?: any
    showDetails?: boolean
    textColor?: string
    details?: string | boolean
    limit?: string | number
    counter?: boolean
}
const props = defineProps<Props>()

</script>
<style lang="scss">
.e-messages {
    text-align: left;
    color: rgba(0, 0, 0, .6);
    flex: 1 1 auto;
    font-size: 12px;
    min-height: 14px;
    min-width: 1px;
    position: relative;
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
}
</style>
  