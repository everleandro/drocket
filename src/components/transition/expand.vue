<template>
    <transition name="e-expand" @enter="(enter as never as undefined)" @after-enter="(afterEnter as never as undefined)"
        @leave="(leave as never as undefined)">
        <slot />
    </transition>
</template>
  
<script lang="ts" setup>

const enter = (element: HTMLElement): void => {
    element.style.width = getComputedStyle(element).width;
    element.style.position = "absolute";
    element.style.visibility = "hidden";
    element.style.height = "auto";

    const height = getComputedStyle(element).height;

    element.style.width = "";
    element.style.position = "";
    element.style.visibility = "";
    element.style.height = "0px";

    // Force repaints to make sure the
    // animation is triggered correctly.
    getComputedStyle(element).height;

    // Trigger the animation.
    // We use `requestAnimationFrame` because we need
    // to make sure the browser has finished
    // painting after setting the `height`
    // to `0` in the line above.
    requestAnimationFrame(() => {
        element.style.height = height;
    });
}
const afterEnter = (element: HTMLElement): void => {
    element.style.height = "auto";
}
const leave = (element: HTMLElement): void => {
    element.style.height = getComputedStyle(element).height;

    // Force repaints to make sure the
    // animation is triggered correctly.
    getComputedStyle(element).height;

    requestAnimationFrame(() => {
        element.style.height = "0";
    });
}

</script>
<style lang="scss">
.e-expand {

    &-enter-active,
    &-leave-active {
        transition: height 0.25s ease-in-out;
        overflow: hidden;
    }

    &-enter,
    &-leave-to {
        height: 0;
    }
}
</style>
  