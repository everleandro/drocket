
<template>
    <div ref="ContainerReference" class="e-menu-container" v-click-outside="handleOutside" v-bind="configuration.attrs"
        :style="menuContentStyle" @click="handleContentClick">
        <transition :name="configuration.transition">
            <div v-show="opened" ref="wrapper" class="e-menu-container__wrapper" :data-id="configuration.dataId">
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
import { Ref, nextTick, onMounted, provide, reactive, ref, watch } from 'vue';
import { MenuTypeTarget } from '@/types'

const configuration: Record<string, any> = reactive({
    absolute: false,
    target: <MenuTypeTarget>null,
    dataId: '',
    closeOnContentClick: false,
    attrs: {},
    offsetY: 0,
    offsetX: 0,
    holdFocus: false,
    fullWidth: false,
    checkOffset: false,
    maxWidth: null,
    width: null,
    contentCLass: '',
    origin: 'bottom left',
    transition: 'fade'
})

const wrapper = ref()
const opened = ref(false)
const timerResize = ref<number>(0);
const timerScroll = ref<number>(0);
const ContainerReference = ref(null)
const menuContentStyle: Ref<Record<string, string | number>> = ref({
    top: 0
});


watch(() => opened.value, (value: boolean) => {
    value ? document.addEventListener('keydown', handleExcListener) : document.removeEventListener('keydown', handleExcListener);
});

onMounted(() => {
    updatemenuContentStyle();
    window.addEventListener('resize', handleResize, true);
    // window.addEventListener('scroll', handleScroll, true);
})

const setConfiguration = (props: Record<string, any>): void => {
    Object.keys(props).forEach(
        (key: string) => configuration[key] = props[key]
    );
}

const closeMenu = (): boolean => opened.value = false

const handleContentClick = (): boolean => configuration.closeOnContentClick && closeMenu()

const handleExcListener = ({ key }: KeyboardEvent): boolean => key === 'Escape' && closeMenu()

const targetDOMRect = (): DOMRect => configuration.target?.getBoundingClientRect() || {}

const destroyComponent = (): void => {
    document.removeEventListener('keydown', handleExcListener);
    window.removeEventListener('resize', handleResize);
    // window.removeEventListener('scroll', handleScroll);
}

const openMenu = async () => {
    updatemenuContentStyle();
    await nextTick();
    opened.value = true;
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

const handleOutside = (evt: { target: HTMLElement }) => {

    if (!insideChild(evt)) {
        const triggerContainer: HTMLElement =
            (evt.target as HTMLElement).closest('[aria-hasmenu="true"]') ||
            document.createElement('div');

        if (!triggerContainer.isEqualNode(targetElement())) closeMenu();
    }
}

const insideChild = (evt: { target: HTMLElement }): boolean => {
    let insideMenu = false
    if (evt.target.classList.contains('e-menu-container__wrapper')) {
        insideMenu = !!evt.target.closest(`.e-menu-container__wrapper[data-id="${configuration.dataId}"]--child`)
    } else {
        insideMenu = !!evt.target.closest('.e-menu-container__wrapper')?.closest(`.e-menu-container__wrapper[data-id="${configuration.dataId}--child"]`)
    }
    return insideMenu
}

const targetElement = (): HTMLElement => {
    const selectorString = typeof configuration.target === 'string'
    return selectorString ?
        (document.querySelector(configuration.target as string) || document.createElement('div')) as HTMLElement :
        configuration.target as HTMLElement

}

const updatemenuContentStyle = async (): Promise<void> => {

    const { width, top, left, height, right } = targetDOMRect();
    const result: Record<string, string | number> = {}
    if (configuration.fullWidth) {
        result.minWidth = `${width}px`;
        result.maxWidth = `${width}px`;
    }

    const origin: Array<string> = configuration.origin.split(' ');
    const origin_button = origin.find((position: string) => position == 'bottom')
    const origin_right = origin.find((position: string) => position == 'right')

    let y = top + window.pageYOffset;
    if (origin_button) {
        y += height;
    }

    let x = left + window.pageXOffset;
    if (origin_right) {
        result.transform = 'translateX(-100%)';
        x += width;
    }

    if (configuration.checkOffset) {
        const margin = 12;
        const offsetY = window.pageYOffset + window.innerHeight - (y + getHeight() + margin)

        if (offsetY < 0) {
            y += offsetY;
        }
        const leftOffset = (x + getWidth() + margin) - (window.pageXOffset + window.innerWidth)
        if (!origin_right && leftOffset > 0) {
            x -= leftOffset + margin;
        }
        const rightOffset = getWidth() + margin - x
        if (origin_right && (rightOffset > 0)) {
            x += rightOffset
        }
    }
    if (origin_right) {
        x -= parseInt(`${configuration.offsetX}`)
    }
    else { x += parseInt(`${configuration.offsetX}`) }

    y += parseInt(`${configuration.offsetY}`)
    result.top = `${y}px`;
    result.left = `${x}px`;
    configuration.maxWidth && (result.maxWidth = `${configuration.maxWidth}px`);
    configuration.width && (result.width = `${configuration.width}px`);
    await nextTick();
    menuContentStyle.value = result
}


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


defineExpose({ openMenu, destroyComponent, setConfiguration, closeMenu, opened })
provide("EMenuContainer", {
    closeMenu
});

</script>
