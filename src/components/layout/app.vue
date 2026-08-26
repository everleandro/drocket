<template>
    <div class="e-app" :id="appId">
        <slot />

        <ESnackbarContainer v-if="!hideSnackbar" />
        <EDialogContainer v-if="!hideDialog" />
    </div>
</template>

<script setup lang="ts">
import { provideLayout } from '@/composables'
import ESnackbarContainer from '@/components/snackbar/container.vue'
import EDialogContainer from '@/components/dialog-service/container.vue'
import { useId } from 'vue'
const appId = useId()

withDefaults(defineProps<{
    /** Opt out when the app renders more than one EApp instance to avoid duplicate snackbar containers. */
    hideSnackbar?: boolean
    /** Opt out when the app renders more than one EApp instance to avoid duplicate dialog containers. */
    hideDialog?: boolean
}>(), {
    hideSnackbar: false,
    hideDialog: false,
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
