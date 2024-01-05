<template>
    <main class="e-main" :data-layout="true">
        <div class="e-main__wrapper">
            <slot />
        </div>
    </main>
</template>
  
<script setup lang="ts" >
interface Props {
    theme?: string
}
const props = withDefaults(defineProps<Props>(), { theme: 'light' })

</script>

<style lang="scss">
.e-main {
    max-width: 100%;
    transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex: 1 0 auto;
    max-width: 100%;


    &__wrapper {
        flex: 1 1 auto;
        max-width: 100%;
        position: relative;
        box-sizing: border-box;
    }
}
</style>
  