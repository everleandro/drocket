<template>
    <Teleport to="body">
        <div v-for="position in activePositions" :key="position" :class="stackClass(position)">
            <TransitionGroup name="e-snackbar-stack" tag="div" class="e-snackbar-stack__list">
                <ESnackbarItem v-for="entry in visibleEntries(position)" :key="entry.id" :entry="entry" />
            </TransitionGroup>
        </div>
    </Teleport>
</template>
<script lang="ts">
export default { name: "ESnackbarContainer" };
</script>
<script lang="ts" setup>
import ESnackbarItem from "./item.vue";
import { useSnackbarService } from "@/composables/snackbar-service";
import type { SnackbarPosition } from "@/types";

const { activePositions, visibleByPosition } = useSnackbarService();

const visibleEntries = (position: SnackbarPosition) => visibleByPosition(position).value;

const stackClass = (position: SnackbarPosition): string[] => [
    "e-snackbar-stack",
    `e-snackbar-stack--${position}`,
];
</script>
<style lang="scss" src="./style.scss"></style>
