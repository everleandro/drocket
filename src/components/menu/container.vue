
<template>
    <div class="e-menu-container" v-bind="forwardedAttrs" :style="menuContentStyle"
        @click="handleContentClick">
        <transition :name="props.transition">
            <div v-show="modelValue" :id="contentId" ref="wrapper" :class="wrapperClass" :data-id="dataId" role="menu"
                tabindex="-1" :aria-hidden="modelValue ? 'false' : 'true'">
                <slot></slot>
            </div>
        </transition>
    </div>
</template>
<script lang="ts">
export default {
    name: 'EMenuContainer'
}
</script>
<script setup lang="ts">
import { Ref, computed, nextTick, onMounted, onUnmounted, provide, ref, useId, watch } from 'vue';
import type { ElevationProps, MenuTypeTarget } from '@/types'
import { useMenuStack } from '@/composables/menu-stack'

const props = withDefaults(defineProps<ElevationProps & {
    absolute?: boolean
    closeOnContentClick?: boolean
    fullWidth?: boolean
    holdFocus?: boolean
    checkOffset?: boolean
    transition?: string
    origin?: string
    maxWidth?: string | number
    offsetX?: string | number
    offsetY?: string | number
    width?: string | number
    modelValue?: boolean
    target?: MenuTypeTarget
    dataId?: string
    contentId?: string
    forwardedAttrs?: Record<string, unknown>
}>(), {
    transition: 'fade',
    origin: 'bottom left',
    offsetX: 0,
    offsetY: 0,
})
const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>()

const wrapper = ref()
const timerResize = ref<number>(0);
const timerScroll = ref<number>(0);
const fallbackMenuId = `menu-${useId()}`
const menuId = computed(() => props.dataId || fallbackMenuId)
const menuContentStyle: Ref<Record<string, string | number>> = ref({
    top: 0
});
const { registerMenu, unregisterMenu, getMenuZIndex } = useMenuStack()

const wrapperClass = computed(() => {
    const classes = ['e-menu-container__wrapper']
    if (props.elevation) {
        classes.push(`e-elevation--${props.elevation}`)
    }
    return classes
})

onMounted(() => {
    updatemenuContentStyle();
    window.addEventListener('resize', handleResize, true);
    window.addEventListener('scroll', handleScroll, true);
})

onUnmounted(() => {
    destroyComponent()
})

const closeMenu = (): boolean => {
    emit('update:modelValue', false)
    return false
}

const handleContentClick = (): boolean => Boolean(props.closeOnContentClick) && closeMenu()

const resolveTarget = (): HTMLElement | null => {
    if (typeof document === 'undefined') return null

    if (typeof props.target === 'string') {
        return (document.querySelector(props.target) || null) as HTMLElement | null
    }

    return props.target ? (props.target as HTMLElement) : null
}

const targetDOMRect = (): DOMRect | null => resolveTarget()?.getBoundingClientRect() || null

const focusActivator = (): void => {
    if (props.holdFocus) return

    resolveTarget()?.focus()
}

const syncMenuStack = (): void => {
    if (!props.modelValue) return

    registerMenu({
        id: menuId.value,
        activator: resolveTarget(),
        content: (wrapper.value as HTMLElement | null) || null,
        close: () => closeMenu(),
    })
}

const destroyComponent = (): void => {
    unregisterMenu(menuId.value)
    window.removeEventListener('resize', handleResize, true);
    window.removeEventListener('scroll', handleScroll, true);
}

const handleResize = (): void => {
    timerResize.value && clearTimeout(timerResize.value)

    timerResize.value = window.setTimeout(() => {
        nextTick(() => {
            updatemenuContentStyle();
        })
    }, 300);
}

const handleScroll = (): void => {
    if (timerScroll.value) clearTimeout(timerScroll.value)

    timerScroll.value = window.setTimeout(() => {
        nextTick(() => {
            updatemenuContentStyle();
        })
    }, 300);
}

const updatemenuContentStyle = async (): Promise<void> => {
    if (!resolveTarget()) return

    const rect = targetDOMRect()
    if (!rect) return

    const { width, top, left, height } = rect;
    const result: Record<string, string | number> = {}
    const menuHeight = getHeight()
    const menuWidth = getWidth()
    const margin = 12

    if (props.fullWidth) {
        result.minWidth = `${width}px`;
        result.maxWidth = `${width}px`;
    }

    const origin: Array<string> = props.origin.split(' ');
    const prefersBottom = origin.includes('bottom')
    const prefersRight = origin.includes('right')
    const viewportTop = window.pageYOffset
    const viewportBottom = viewportTop + window.innerHeight
    const viewportLeft = window.pageXOffset
    const viewportRight = viewportLeft + window.innerWidth
    const activatorTop = top + window.pageYOffset
    const activatorBottom = activatorTop + height
    const activatorLeft = left + window.pageXOffset
    const activatorRight = activatorLeft + width
    const availableBelow = viewportBottom - activatorBottom - margin
    const availableAbove = activatorTop - viewportTop - margin
    const availableRight = viewportRight - activatorLeft - margin
    const availableLeft = activatorRight - viewportLeft - margin

    let placeBelow = prefersBottom
    let alignRight = prefersRight

    if (placeBelow && menuHeight > availableBelow && availableAbove > availableBelow) {
        placeBelow = false
    }

    if (!placeBelow && menuHeight > availableAbove && availableBelow > availableAbove) {
        placeBelow = true
    }

    if (!alignRight && menuWidth > availableRight && availableLeft > availableRight) {
        alignRight = true
    }

    if (alignRight && menuWidth > availableLeft && availableRight > availableLeft) {
        alignRight = false
    }

    let y = top + window.pageYOffset;
    if (placeBelow) {
        y += height;
    } else {
        y -= menuHeight;
    }

    let x = left + window.pageXOffset;
    if (alignRight) {
        result.transform = 'translateX(-100%)';
        x += width;
    }

    if (props.checkOffset) {
        if (y < viewportTop + margin) {
            y = viewportTop + margin
        }

        const offsetY = viewportBottom - (y + menuHeight + margin)

        if (offsetY < 0) {
            y += offsetY;
        }
        const leftOffset = (x + menuWidth + margin) - viewportRight
        if (!alignRight && leftOffset > 0) {
            x -= leftOffset + margin;
        }
        const rightOffset = menuWidth + margin - (x - viewportLeft)
        if (alignRight && rightOffset > 0) {
            x += rightOffset
        }
    }
    if (alignRight) {
        x -= parseInt(`${props.offsetX}`)
    }
    else { x += parseInt(`${props.offsetX}`) }

    if (placeBelow) {
        y += parseInt(`${props.offsetY}`)
    } else {
        y -= parseInt(`${props.offsetY}`)
    }
    result.top = `${y}px`;
    result.left = `${x}px`;
    const zIndex = getMenuZIndex(menuId.value)
    if (zIndex !== null) {
        result.zIndex = `${zIndex}`
    }
    props.maxWidth && (result.maxWidth = `${props.maxWidth}px`);
    props.width && (result.width = `${props.width}px`);
    await nextTick();
    menuContentStyle.value = result
}

watch(() => [props.modelValue, wrapper.value, props.target, props.dataId] as const, ([isOpened, contentElement]) => {
    if (!isOpened || !contentElement) return
    syncMenuStack()
    updatemenuContentStyle()
}, { flush: 'post' })

watch(() => props.modelValue, async (value) => {
    if (!value) {
        unregisterMenu(menuId.value)
        focusActivator()
        return
    }

    await nextTick()
    await updatemenuContentStyle()

    syncMenuStack()

    await nextTick()
    await updatemenuContentStyle()

    if (!props.holdFocus) {
        (wrapper.value as HTMLElement | undefined)?.focus()
    }
}, { immediate: true })

watch(menuId, (nextId, previousId) => {
    if (previousId && previousId !== nextId) {
        unregisterMenu(previousId)
    }

    if (props.modelValue) {
        syncMenuStack()
    }
})


const getHeight = (): number => {
    const el = wrapper.value as HTMLElement;
    if (!el)
        return 0
    var el_style = window.getComputedStyle(el),
        el_display = el_style.display,
        el_position = el_style.position,
        el_visibility = el_style.visibility,
        el_max_height = el_style.maxHeight.replace('px', '').replace('%', ''),

        wanted_height = 0;

    // if its not hidden we just return normal height
    if (el_display !== 'none' && el_max_height !== '0') {
        return el.offsetHeight;
    }

    // the element is hidden so:
    // making the el block so we can meassure its height but still be hidden
    el.style.position = 'absolute';
    el.style.visibility = 'hidden';
    el.style.display = 'block';

    wanted_height = el.offsetHeight;

    // reverting to the original values
    el.style.display = el_display;
    el.style.position = el_position;
    el.style.visibility = el_visibility;

    return wanted_height;
}

const getWidth = () => {
    const el = wrapper.value as HTMLElement
    if (!el)
        return 0
    var el_style = window.getComputedStyle(el),
        el_display = el_style.display,
        el_position = el_style.position,
        el_visibility = el_style.visibility,
        el_max_width = el_style.maxWidth.replace('px', '').replace('%', ''),

        wanted_width = 0;

    // if its not hidden we just return normal height
    if (el_display !== 'none' && el_max_width !== '0') {
        return el.offsetWidth;
    }

    // the element is hidden so:
    // making the el block so we can meassure its height but still be hidden
    el.style.position = 'absolute';
    el.style.visibility = 'hidden';
    el.style.display = 'block';

    wanted_width = el.offsetWidth;

    // reverting to the original values
    el.style.display = el_display;
    el.style.position = el_position;
    el.style.visibility = el_visibility;

    return wanted_width;
}

provide("EMenuContainer", {
    closeMenu
});

</script>
