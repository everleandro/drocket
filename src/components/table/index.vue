<template>
    <div :class="tableClass">
        <table class="e-table__table">
            <thead>
                <tr>
                    <th v-for="header in headers" :key="header.key"
                        :class="`e-table__cell--align-${header.align || 'start'}`" :style="{ width: header.width }">
                        {{ header.label }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="!pageItems.length">
                    <td class="e-table__empty" :colspan="headers.length">
                        <slot name="empty">No results</slot>
                    </td>
                </tr>
                <tr v-for="(item, index) in pageItems" :key="rowKey(item, index)">
                    <td v-for="header in headers" :key="header.key"
                        :class="`e-table__cell--align-${header.align || 'start'}`">
                        <slot :name="`item.${header.key}`" :item="item" :index="(page - 1) * itemsPerPage + index"
                            :value="(item as Record<string, unknown>)[header.key]">
                            {{ (item as Record<string, unknown>)[header.key] }}
                        </slot>
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-if="items.length && !hidePagination" class="e-table__pagination">
            <span class="e-table__pagination-info">
                <slot name="pagination-info" :start="rangeStart" :end="rangeEnd" :total="items.length">
                    {{ rangeStart }}–{{ rangeEnd }} of {{ items.length }}
                </slot>
            </span>
            <div class="e-table__pagination-controls">
                <EButton :icon="icon.arrowLeft" text size="small" :aria-label="previousPageLabel" :disabled="page <= 1"
                    @click="page--" />
                <span class="e-table__pagination-page">{{ page }} / {{ totalPages }}</span>
                <EButton :icon="icon.arrowRight" size="small" text :aria-label="nextPageLabel"
                    :disabled="page >= totalPages" @click="page++" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" generic="T extends object">
import { computed, watch } from "vue";
import EButton from "@/components/button/index.vue";
import icon from "@/utils/icons";
import type { ElevationLevel, TableHeader } from "@/types";

const props = withDefaults(defineProps<{
    headers: TableHeader[];
    items: T[];
    itemKey?: string;
    itemsPerPage?: number;
    elevation?: ElevationLevel;
    hidePagination?: boolean;
    previousPageLabel?: string;
    nextPageLabel?: string;
}>(), {
    itemKey: "id",
    itemsPerPage: 10,
    previousPageLabel: "Previous page",
    nextPageLabel: "Next page",
});

const page = defineModel<number>("page", { default: 1 });

const totalPages = computed((): number => {
    return Math.max(1, Math.ceil(props.items.length / props.itemsPerPage));
});

const pageItems = computed((): T[] => {
    const start = (page.value - 1) * props.itemsPerPage;
    return props.items.slice(start, start + props.itemsPerPage);
});

const rangeStart = computed((): number => {
    return props.items.length ? (page.value - 1) * props.itemsPerPage + 1 : 0;
});

const rangeEnd = computed((): number => {
    return Math.min(page.value * props.itemsPerPage, props.items.length);
});

const tableClass = computed((): string[] => {
    const classes = ["e-table"];

    if (props.elevation) {
        classes.push(`e-elevation--${props.elevation}`);
    }
    if (props.hidePagination) {
        classes.push("e-table--no-pagination");
    }

    return classes;
});

function rowKey(item: T, index: number): string {
    const value = (item as Record<string, unknown>)[props.itemKey];
    return value !== undefined ? String(value) : String(index);
}

// Filtering/refreshing items can leave the current page out of range.
watch(totalPages, (value) => {
    if (page.value > value) page.value = value;
});
</script>

<style lang="scss" src="./style.scss"></style>
