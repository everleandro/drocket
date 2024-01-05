<template>
    <div class="e-app" id="app">
        <slot />
    </div>
</template>
  
<script setup lang="ts" >
interface Props {
    theme?: string
}
const props = withDefaults(defineProps<Props>(), { theme: 'light' })
</script>

<style lang="scss">
.e-app {
    flex: 1 1 auto;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    flex-direction: column;
    min-height: 100vh;
    max-width: 100%;
    position: relative;
}
</style>
  