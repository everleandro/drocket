<template>
    <ETransitionExpand>
        <div v-if="showSupportingText">
            <div :id="id" class="e-field__details">
                <div
                    v-if="showMessage"
                    class="e-messages"
                    :role="hasError ? 'alert' : 'status'"
                    :aria-live="hasError ? 'assertive' : 'polite'"
                >
                    <div class="e-messages__wrapper" :class="textColor">
                        {{ details }}
                    </div>
                </div>
                <div v-if="showCounter" class="e-counter" :class="textColor">
                    {{ normalizedModelValue.length }}
                    <template v-if="limit"> / {{ limit }}</template>
                </div>
            </div>
        </div>
    </ETransitionExpand>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import ETransitionExpand from "@/components/transition/expand.vue";

export interface Props {
    id?: string;
    modelValue?: unknown;
    showDetails?: boolean;
    textColor?: string;
    details?: string | boolean;
    limit?: string | number;
    counter?: boolean;
    hasError?: boolean;
}

const props = defineProps<Props>();
const normalizedModelValue = computed(() => `${props.modelValue ?? ""}`);
const showMessage = computed(() => Boolean(props.showDetails && props.details));
const showCounter = computed(() => Boolean(props.counter || props.limit));
const showSupportingText = computed(
    () => showMessage.value || showCounter.value,
);
</script>

<style lang="scss">
.e-messages {
    text-align: left;
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
