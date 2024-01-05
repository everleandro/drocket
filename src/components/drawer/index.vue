<template>
  <component :is="tag" v-click-outside="handleOutside" :class="drawerClass" data-layout="true" :style="style">
    <div v-if="right" class="e-drawer__border"></div>
    <div class="e-drawer__content" :style="{ width: `${width}${sizeUnit}` }">
      <slot></slot>
    </div>
    <div v-if="!right" class="e-drawer__border"></div>
  </component>
</template>
  
<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
// import { useRouter } from 'vue-router'

export type DrawerClassKeys = 'disabled' | 'right' | 'modelValue' | 'fixed'
export interface Props {
  modelValue?: boolean
  absolute?: boolean
  disabled?: boolean
  fixed?: boolean
  nav?: boolean
  right?: boolean
  sizeUnit?: string
  width?: string | number
}

let mdBreakpoint = ref(false);
const props = withDefaults(defineProps<Props>(), { width: 16, sizeUnit: 'rem' })

let overlayNode: HTMLElement | null = null;

const availableRootClasses: Record<DrawerClassKeys, string> = {
  disabled: 'e-drawer--disabled',
  right: 'e-drawer--right',
  fixed: 'e-drawer--fixed',
  modelValue: 'e-drawer--open',
};

// const router = useRouter()
const absoluteComputed = computed(() => props.absolute || mdBreakpoint.value)
const tag = computed(() => props.nav ? 'nav' : 'aside')

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

onMounted(() => {
  setOverlay();
  observeBreakpoint();
  refreshLayoutStyle();
  nextTick(() => {
    window?.addEventListener('resize', observeBreakpoint);
    if (props.modelValue && mdBreakpoint.value) {
      changeValue(false)
    }
  });
})

onUnmounted(() => {
  window?.removeEventListener('resize', observeBreakpoint);
  destroyOverlay();
})

const drawerClass = computed((): Array<string> => {
  const classes = ['e-drawer']
  const availableRootClassKeys = Object.keys(availableRootClasses) as Array<DrawerClassKeys>
  absoluteComputed.value && classes.push('e-drawer--absolute')
  !props.modelValue && classes.push('e-drawer--close')

  const classes2 = availableRootClassKeys.filter(
    (key) => !!props[key]
  ).map(key => availableRootClasses[key]);

  return [...classes, ...classes2];
})

watch(() => props.modelValue, () => {
  setOverlay();
  refreshLayoutStyle();
});

watch(() => mdBreakpoint.value, () => {
  setOverlay();
  refreshLayoutStyle()
});
// watch(() => route.fullPath, () => {
//   console.log('ads')

// }, { deep: true })

// watch(() => router, () => {
//   if (props.modelValue && mdBreakpoint.value) {
//     changeValue(false)
//   }

// }, { deep: true, immediate: true });

const setOverlay = (): void => {
  if (props.modelValue && absoluteComputed.value) {
    if (!overlayNode) {
      const parent: HTMLElement = document.body || new HTMLElement();
      const newOverlayNode = document.createElement('div');
      parent.prepend(newOverlayNode);
      newOverlayNode.className = 'e-overlay';
      setTimeout(() => {
        newOverlayNode.className = 'e-overlay e-overlay--active';
      }, 0);
      overlayNode = newOverlayNode;
    }
  } else {
    destroyOverlay();
  }
}

const refreshLayoutStyle = (): void => {
  const eMainNode = document.querySelector('.e-main[data-layout="true"]') as HTMLElement
  const eBarNode = document.querySelector('.e-bar.e-bar--app[data-layout="true"]') as HTMLElement
  const propertyValue =
    (absoluteComputed.value || !props.modelValue) ? '0px' : `${props.width}${props.sizeUnit}`;
  if (eMainNode) {
    props.right ? (eMainNode.style.paddingRight = propertyValue) : (eMainNode.style.paddingLeft = propertyValue)
  }

  if (eBarNode) {
    props.right ? (eBarNode.style.right = propertyValue) : (eBarNode.style.left = propertyValue)
  }
}

const destroyOverlay = (): void => {
  if (overlayNode) {
    overlayNode.className = 'e-overlay e-overlay--inactive';
    setTimeout(() => {
      overlayNode && (overlayNode as HTMLElement).remove();
      overlayNode = null;
    }, 300);
  }
}
const changeValue = (value: boolean): void => {
  emit('update:modelValue', value)
}
const observeBreakpoint = (): void => {
  const windowWidth = window?.innerWidth;
  const mdValue = getComputedStyle(document.body).getPropertyValue('--md');
  mdBreakpoint.value = windowWidth <= parseInt(mdValue, 10);
}
const handleOutside = (): void => {
  if (absoluteComputed.value && props.modelValue) {
    changeValue(false);
    destroyOverlay();
  }
}
const style = computed((): Record<string, string> => {
  const translateX = props.modelValue ? '0%' : `${props.right ? '' : '-'}100%`;
  const result: Record<string, string> = {
    height: '100%',
    top: '0px',
    transform: `translateX(${translateX})`
  };
  return { ...result };
})




</script>
<style lang="scss">
@import './style.scss';
</style>
  