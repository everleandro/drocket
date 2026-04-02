<template>
    <section class="date-picker-playground">
        <div class="date-picker-playground__hero">
            <p class="section-kicker">Playground</p>
            <h1>Date Picker Playground</h1>
            <p class="hero-copy">
                Esta vista sirve para probar <strong>EDatePicker</strong> inline, dentro de menu y dentro de dialog,
                incluyendo modos de fecha, mes y anio.
            </p>
        </div>

        <div class="date-picker-layout">
            <ECard class="date-picker-card date-picker-card--controls" elevation="md">
                <p class="section-kicker">Controles</p>
                <h2>Configuracion</h2>

                <div class="control-grid">
                    <label class="control-field">
                        <span>Modo</span>
                        <select v-model="sandbox.mode">
                            <option value="date">Date</option>
                            <option value="month">Month</option>
                            <option value="year">Year</option>
                        </select>
                    </label>

                    <label class="control-field">
                        <span>Idioma</span>
                        <select v-model="sandbox.lng">
                            <option value="en">en</option>
                            <option value="es">es</option>
                            <option value="fr">fr</option>
                        </select>
                    </label>

                    <label class="control-field">
                        <span>Color</span>
                        <select v-model="sandbox.color">
                            <option value="primary">primary</option>
                            <option >None</option>
                            <option value="secondary">secondary</option>
                            <option value="success">success</option>
                            <option value="warning">warning</option>
                            <option value="teal-300">teal-300</option>
                            <option value="teal-900">teal-900</option>
                        </select>
                    </label>

                    <label class="control-field">
                        <span>Week start</span>
                        <select v-model.number="sandbox.weekStart">
                            <option :value="0">0 - Sunday</option>
                            <option :value="1">1 - Monday</option>
                            <option :value="6">6 - Saturday</option>
                        </select>
                    </label>

                    <label class="control-field">
                        <span>Elevation</span>
                        <select v-model="sandbox.elevation">
                            <option value="">none</option>
                            <option value="xs">xs</option>
                            <option value="sm">sm</option>
                            <option value="md">md</option>
                            <option value="lg">lg</option>
                            <option value="xl">xl</option>
                        </select>
                    </label>

                    <label class="control-field">
                        <span>Grid button elevation</span>
                        <select v-model="sandbox.gridButtonElevation">
                            <option value="">none</option>
                            <option value="xs">xs</option>
                            <option value="sm">sm</option>
                            <option value="md">md</option>
                            <option value="lg">lg</option>
                            <option value="xl">xl</option>
                        </select>
                    </label>
                </div>

                <div class="toggle-grid">
                    <label class="toggle-field">
                        <input v-model="sandbox.landscape" type="checkbox">
                        <span>Landscape</span>
                    </label>

                    <label class="toggle-field">
                        <input v-model="sandbox.noTitle" type="checkbox">
                        <span>No title</span>
                    </label>

                    <label class="toggle-field">
                        <input v-model="sandbox.showHighlighted" type="checkbox">
                        <span>Highlighted range</span>
                    </label>

                    <label class="toggle-field">
                        <input v-model="sandbox.showDisabled" type="checkbox">
                        <span>Disabled dates</span>
                    </label>
                </div>

                <div class="state-panel">
                    <p class="state-panel__title">Estado</p>
                    <pre>{{ statePreview }}</pre>
                </div>
            </ECard>

            <div class="date-picker-grid">
                <ECard class="date-picker-card" elevation="md">
                    <p class="section-kicker">Inline</p>
                    <h2>Picker embebido</h2>
                    <p class="card-copy">
                        Seleccion actual: <strong>{{ formatDate(inlineValue) }}</strong>
                    </p>

                    <div class="picker-frame">
                        <EDatePicker
                            v-model="inlineValue"
                            :lng="sandbox.lng"
                            :color="sandbox.color"
                            :elevation="resolvedElevation"
                            :grid-button-elevation="resolvedGridButtonElevation"
                            :week-start="sandbox.weekStart"
                            :landscape="sandbox.landscape"
                            :no-title="sandbox.noTitle"
                            :only-month="isMonthMode"
                            :only-year="isYearMode"
                            :highlighted="highlightedConfig"
                            :disabled="disabledConfig"
                        />
                    </div>
                </ECard>

                <ECard class="date-picker-card" elevation="md">
                    <p class="section-kicker">Menu</p>
                    <h2>Close on change</h2>
                    <p class="card-copy">
                        Fecha del menu: <strong>{{ formatDate(menuValue) }}</strong>
                    </p>

                    <div class="actions-row">
                        <EMenu v-model="menuOpen" :close-on-content-click="false" origin="bottom left">
                            <template #activator="activator">
                                <EButton :color="sandbox.color" outlined v-bind="buildActivatorBindings(activator)">
                                    Open menu picker
                                </EButton>
                            </template>

                            <EDatePicker
                                v-model="menuValue"
                                close-on-change
                                :lng="sandbox.lng"
                                :color="sandbox.color"
                                :elevation="resolvedElevation"
                                :grid-button-elevation="resolvedGridButtonElevation"
                                :week-start="sandbox.weekStart"
                                :only-month="isMonthMode"
                                :only-year="isYearMode"
                            />
                        </EMenu>
                    </div>
                </ECard>

                <ECard class="date-picker-card" elevation="md">
                    <p class="section-kicker">Dialog</p>
                    <h2>Picker en dialog</h2>
                    <p class="card-copy">
                        Fecha del dialog: <strong>{{ formatDate(dialogValue) }}</strong>
                    </p>

                    <div class="actions-row">
                        <EButton :color="sandbox.color" @click="dialogOpen = true">Open dialog picker</EButton>
                    </div>

                    <EDialog v-model="dialogOpen" elevation="xl">
                        <ECard class="dialog-picker-card">
                            <EDatePicker
                                v-model="dialogValue"
                                close-on-change
                                :lng="sandbox.lng"
                                :color="sandbox.color"
                                :elevation="resolvedElevation"
                                :grid-button-elevation="resolvedGridButtonElevation"
                                :week-start="sandbox.weekStart"
                                :landscape="sandbox.landscape"
                                :no-title="sandbox.noTitle"
                                :only-month="isMonthMode"
                                :only-year="isYearMode"
                                :highlighted="highlightedConfig"
                            />
                        </ECard>
                    </EDialog>
                </ECard>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";

import EButton from "../../src/components/button/index.vue";
import ECard from "../../src/components/card/index.vue";
import EDatePicker from "../../src/components/date-picker/index.vue";
import EDialog from "../../src/components/dialog/index.vue";
import EMenu from "../../src/components/menu/index.vue";

type PickerMode = "date" | "month" | "year";
type ActivatorBindings = {
    ref?: (value: unknown) => void;
    onClick?: (event?: Event) => void;
    onKeydown?: (event: KeyboardEvent) => void;
    "aria-haspopup"?: string;
    "aria-expanded"?: string;
    "aria-controls"?: string;
    "aria-disabled"?: string;
    [key: string]: unknown;
};

const sandbox = reactive({
    mode: "date" as PickerMode,
    lng: "en",
    color: undefined,
    elevation: "",
    gridButtonElevation: "",
    weekStart: 1,
    landscape: false,
    noTitle: false,
    showHighlighted: true,
    showDisabled: true,
});

const inlineValue = ref(new Date(2026, 2, 14));
const menuValue = ref(new Date(2026, 2, 21));
const dialogValue = ref(new Date(2026, 2, 28));
const menuOpen = ref(false);
const dialogOpen = ref(false);

const isMonthMode = computed(() => sandbox.mode === "month");
const isYearMode = computed(() => sandbox.mode === "year");
const resolvedElevation = computed(() => sandbox.elevation || undefined);
const resolvedGridButtonElevation = computed(() => sandbox.gridButtonElevation || undefined);

const highlightedConfig = computed(() => {
    if (!sandbox.showHighlighted || isYearMode.value) {
        return undefined;
    }

    return {
        from: new Date(2026, 2, 18),
        to: new Date(2026, 2, 22),
    };
});

const disabledConfig = computed(() => {
    if (!sandbox.showDisabled || isYearMode.value) {
        return undefined;
    }

    return {
        days: [0, 6],
        dates: [new Date(2026, 2, 17)],
    };
});

const statePreview = computed(() => {
    return JSON.stringify(
        {
            props: {
                lng: sandbox.lng,
                color: sandbox.color,
                elevation: resolvedElevation.value,
                gridButtonElevation: resolvedGridButtonElevation.value,
                weekStart: sandbox.weekStart,
                landscape: sandbox.landscape,
                noTitle: sandbox.noTitle,
                onlyMonth: isMonthMode.value || undefined,
                onlyYear: isYearMode.value || undefined,
                highlighted: Boolean(highlightedConfig.value),
                disabled: Boolean(disabledConfig.value),
            },
            values: {
                inline: inlineValue.value,
                menu: menuValue.value,
                dialog: dialogValue.value,
            },
        },
        null,
        2,
    );
});

const buildActivatorBindings = (activator: ActivatorBindings) => ({
    ref: activator.ref,
    onClick: activator.onClick,
    onKeydown: activator.onKeydown,
    "aria-haspopup": activator["aria-haspopup"],
    "aria-expanded": activator["aria-expanded"],
    "aria-controls": activator["aria-controls"],
    "aria-disabled": activator["aria-disabled"],
});

const formatDate = (value: Date | string) => {
    const date = value instanceof Date ? value : new Date(value);

    return new Intl.DateTimeFormat(sandbox.lng, {
        weekday: "short",
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(date);
};
</script>

<style scoped>
.date-picker-playground {
    display: grid;
    gap: 24px;
}

.date-picker-playground__hero {
    display: grid;
    gap: 8px;
    max-width: 780px;
}

.section-kicker {
    color: #5b6b8a;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.12em;
    margin: 0;
    text-transform: uppercase;
}

.date-picker-playground__hero h1,
.date-picker-card h2 {
    color: var(--e-primary-color, #172033);
    margin: 0;
}

.hero-copy,
.card-copy {
    color: var(--e-secondary-color, #596579);
    line-height: 1.6;
    margin: 0;
}

.date-picker-layout {
    display: grid;
    gap: 20px;
}

.date-picker-grid {
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

.date-picker-card {
    border-radius: 20px;
    display: grid;
    gap: 18px;
    padding: 24px;
}

.date-picker-card--controls {
    max-width: 960px;
}

.control-grid {
    display: grid;
    gap: 14px;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.control-field,
.toggle-field {
    display: grid;
    gap: 8px;
}

.control-field span,
.toggle-field span,
.state-panel__title {
    color: #42526b;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    margin: 0;
    text-transform: uppercase;
}

.control-field select {
    appearance: none;
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid rgba(148, 163, 184, 0.35);
    border-radius: 12px;
    color: #172033;
    font: inherit;
    min-height: 44px;
    padding: 0 12px;
}

.toggle-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.toggle-field {
    align-items: center;
    background: rgba(239, 244, 255, 0.9);
    border: 1px solid rgba(148, 163, 184, 0.2);
    border-radius: 14px;
    grid-auto-flow: column;
    justify-content: start;
    padding: 12px 14px;
}

.toggle-field input {
    margin: 0;
}

.picker-frame {
    display: grid;
    justify-content: center;
}

.actions-row {
    display: flex;
    align-items: center;
    gap: 12px;
}

.dialog-picker-card {
    min-width: 0;
    padding: 8px;
}

.state-panel {
    background: #0f172a;
    border-radius: 16px;
    color: #dbe7ff;
    padding: 16px;
}

.state-panel pre {
    font-size: 12px;
    line-height: 1.5;
    margin: 0;
    overflow: auto;
}

@media (max-width: 680px) {
    .date-picker-card {
        padding: 18px;
    }
}
</style>