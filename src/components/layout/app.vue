<template>
    <div class="e-app" :id="appId">
        <slot />

        <ESnackbarContainer v-if="!hideSnackbar" />
    </div>
</template>

<script setup lang="ts">
import { provideLayout } from '@/composables'
import ESnackbarContainer from '@/components/snackbar/container.vue'
import { useId } from 'vue'
const appId = useId()

withDefaults(defineProps<{
    /** Opt out when the app renders more than one EApp instance to avoid duplicate snackbar containers. */
    hideSnackbar?: boolean
}>(), {
    hideSnackbar: false,
})

provideLayout()
</script>

<style lang="scss">
.e-app {
    flex: 1 1 auto;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    flex-direction: column;
    max-width: 100%;
    position: relative;
}
</style>
