<template>
  <div :class="expansionClass">
    <div class="e-expansion__header">
      <button class="e-btn e-btn--block e-btn--text" @click="changeValue(!opened)">
        <span class="e-expansion__header-content">
          <slot name="header">
            {{ headerTitle }}
          </slot>
          <div class="e-expansion__header-icon">
            <EIcon :icon="icon.arrowDown"></EIcon>
          </div>
        </span>
      </button>
      <div class="e-expansion__header-actions">
        <slot name="actions"></slot>
      </div>
    </div>
    <div class="e-expansion__body">
      <ETransitionExpand>
        <div v-show="opened" class="e-expansion__body-content">
          <e-divider></e-divider>
          <slot name="default"></slot>
        </div>
      </ETransitionExpand>
    </div>
  </div>
</template>
<script lang="ts" setup>
import icon from '@/utils/icons';
import { computed, ref } from 'vue';
import ETransitionExpand from '@/components/transition/expand.vue';
import EIcon from '@/components/icon/index.vue';

export interface Props {
  dense?: boolean
  headerTitle?: string
  color?: string
  modelValue?: boolean
}

const localValue = ref(false);
const props = withDefaults(defineProps<Props>(), { modelValue: undefined })

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const rootClasses = {
  dense: "e-expansion--dense",
  opened: "e-expansion--opened",
};

const opened = computed((): boolean => props.modelValue === undefined ? localValue.value : props.modelValue)

const expansionClass = computed(() => {
  const classes = ['e-expansion']
  props.dense && classes.push(rootClasses.dense)
  opened.value && classes.push(rootClasses.opened)
  props.color && classes.push(`${props.color}--text`)
  return classes
})

const changeValue = (value: boolean) => {
  if (props.modelValue === undefined) {
    localValue.value = value
  } else {
    emit("update:modelValue", value)
  }
}


</script>
<style lang="scss" src="./style.scss"></style>
  