<template>
    <section class="progress-playground">
        <div class="progress-playground__hero">
            <p class="eyebrow">Playground</p>
            <h1>Progress Linear Playground</h1>
            <p class="hero-copy">
                Esta vista sirve para revisar <strong>EProgressLinear</strong> en
                distintos colores, alturas y superficies, sin mezclarlo con otros
                componentes.
            </p>
        </div>

        <div class="progress-grid">
            <ECard class="progress-card" elevation="md">
                <div class="progress-card__header">
                    <div>
                        <p class="section-kicker">Casos base</p>
                        <h2>Modo indeterminate y determinate</h2>
                    </div>
                    <p class="card-copy">
                        La vista compara animación continua y progreso real para
                        validar color, grosor y transición de ancho.
                    </p>
                </div>

                <div class="progress-showcase">
                    <div
                        v-for="example in examples"
                        :key="`${example.color}-${example.height}`"
                        class="progress-row"
                    >
                        <div class="progress-row__meta">
                            <span>{{ example.label }}</span>
                            <strong>{{ example.color }} / {{ example.height }}px / {{ example.indeterminate ? 'indeterminate' : `${example.value}%` }}</strong>
                        </div>
                        <EProgressLinear :color="example.color" :height="example.height"
                            :indeterminate="example.indeterminate" :value="example.value"
                            :use-contrast-color="example.useContrastColor" />
                    </div>
                </div>
            </ECard>

            <ECard class="progress-card" elevation="md">
                <div class="progress-card__header">
                    <div>
                        <p class="section-kicker">Sandbox</p>
                        <h2>Prueba rápida</h2>
                    </div>
                    <p class="card-copy">
                        Cambia la combinación para ver cómo responde el linear sobre
                        una superficie clara, neutra o fuerte.
                    </p>
                </div>

                <div class="control-group">
                    <span class="control-group__label">Modo</span>
                    <div class="pill-group">
                        <button
                            :class="['pill-button', { 'pill-button--active': sandbox.indeterminate }]"
                            type="button"
                            @click="sandbox.indeterminate = true"
                        >
                            Indeterminate
                        </button>
                        <button
                            :class="['pill-button', { 'pill-button--active': !sandbox.indeterminate }]"
                            type="button"
                            @click="sandbox.indeterminate = false"
                        >
                            Determinate
                        </button>
                    </div>
                </div>

                <div class="control-group">
                    <span class="control-group__label">Color</span>
                    <div class="pill-group">
                        <button
                            v-for="option in colorOptions"
                            :key="option"
                            :class="['pill-button', { 'pill-button--active': sandbox.color === option }]"
                            type="button"
                            @click="sandbox.color = option"
                        >
                            {{ option }}
                        </button>
                    </div>
                </div>

                <div class="control-group">
                    <span class="control-group__label">Altura</span>
                    <div class="pill-group">
                        <button
                            v-for="option in heightOptions"
                            :key="option"
                            :class="['pill-button', { 'pill-button--active': sandbox.height === option }]"
                            type="button"
                            @click="sandbox.height = option"
                        >
                            {{ option }}px
                        </button>
                    </div>
                </div>

                <div class="control-group">
                    <span class="control-group__label">Superficie</span>
                    <div class="pill-group">
                        <button
                            v-for="option in surfaceOptions"
                            :key="option.value"
                            :class="['pill-button', { 'pill-button--active': sandbox.surface === option.value }]"
                            type="button"
                            @click="sandbox.surface = option.value"
                        >
                            {{ option.label }}
                        </button>
                    </div>
                </div>

                <div class="control-group">
                    <span class="control-group__label">Resolución de color</span>
                    <div class="pill-group">
                        <button
                            :class="['pill-button', { 'pill-button--active': !sandbox.useContrastColor }]"
                            type="button"
                            @click="sandbox.useContrastColor = false"
                        >
                            Base
                        </button>
                        <button
                            :class="['pill-button', { 'pill-button--active': sandbox.useContrastColor }]"
                            type="button"
                            @click="sandbox.useContrastColor = true"
                        >
                            Contrast
                        </button>
                    </div>
                </div>

                <div v-if="!sandbox.indeterminate" class="control-group">
                    <label class="control-group__label" for="progress-value">Valor</label>
                    <div class="progress-slider-row">
                        <input id="progress-value" v-model.number="sandbox.value" class="progress-slider" type="range"
                            min="0" max="100" step="1" />
                        <strong class="progress-slider__value">{{ sandbox.value }}%</strong>
                    </div>
                </div>

                <div :class="['progress-stage', `progress-stage--${sandbox.surface}`]">
                    <div class="progress-stage__frame">
                        <EProgressLinear :color="sandbox.color" :height="sandbox.height"
                            :indeterminate="sandbox.indeterminate" :value="sandbox.value"
                            :use-contrast-color="sandbox.useContrastColor" />
                    </div>
                </div>
            </ECard>

            <div class="progress-sidebar">
                <ECard class="progress-card" elevation="sm">
                    <p class="section-kicker">Notas</p>
                    <h2>Qué revisar</h2>

                    <ul class="progress-checklist">
                        <li>Que el color principal sea legible sobre el fondo elegido.</li>
                        <li>Que el grosor mantenga una silueta limpia en mobile y desktop.</li>
                        <li>Que la pista tenga suficiente contraste respecto a la barra activa.</li>
                    </ul>
                </ECard>

                <ECard class="progress-card" elevation="sm">
                    <p class="section-kicker">Estado</p>
                    <h2>Configuración actual</h2>
                    <pre class="payload-preview">{{ sandboxPreview }}</pre>
                </ECard>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";

import ECard from "../../src/components/card/index.vue";
import EProgressLinear from "../../src/components/progress/linear.vue";

type ProgressColor = "primary" | "secondary" | "teal-900" | "cyan-800" | "error";
type ProgressSurface = "light" | "muted" | "strong";

type SandboxState = {
    color: ProgressColor;
    height: number;
    surface: ProgressSurface;
    useContrastColor: boolean;
    indeterminate: boolean;
    value: number;
};

const colorOptions: Array<ProgressColor> = ["primary", "secondary", "teal-900", "cyan-800", "error"];
const heightOptions = [2, 4, 6, 10, 14];
const surfaceOptions: Array<{ label: string; value: ProgressSurface }> = [
    { label: "Light", value: "light" },
    { label: "Muted", value: "muted" },
    { label: "Strong", value: "strong" },
];

const examples: Array<{ label: string; color: ProgressColor; height: number; indeterminate: boolean; value: number; useContrastColor: boolean }> = [
    { label: "Base loading", color: "primary", height: 4, indeterminate: true, value: 0, useContrastColor: false },
    { label: "Compact upload", color: "secondary", height: 2, indeterminate: false, value: 24, useContrastColor: false },
    { label: "Dense sync", color: "teal-900", height: 6, indeterminate: false, value: 56, useContrastColor: false },
    { label: "High emphasis", color: "cyan-800", height: 10, indeterminate: false, value: 82, useContrastColor: false },
    { label: "Alert recovery", color: "error", height: 14, indeterminate: true, value: 0, useContrastColor: true },
];

const sandbox = reactive<SandboxState>({
    color: "primary",
    height: 6,
    surface: "light",
    useContrastColor: false,
    indeterminate: true,
    value: 64,
});

const sandboxPreview = computed(() => {
    return JSON.stringify(sandbox, null, 2);
});
</script>

<style scoped>
.progress-playground {
    display: grid;
    gap: 24px;
}

.progress-playground__hero {
    display: grid;
    gap: 8px;
    max-width: 760px;
}

.eyebrow,
.section-kicker {
    color: #5b6b8a;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.12em;
    margin: 0;
    text-transform: uppercase;
}

.progress-playground__hero h1,
.progress-card h2 {
    color: #172033;
    margin: 0;
}

.hero-copy,
.card-copy {
    color: #596579;
    line-height: 1.6;
    margin: 0;
}

.progress-grid {
    display: grid;
    gap: 20px;
    grid-template-columns: minmax(0, 1.8fr) minmax(0, 1.8fr) minmax(280px, 1fr);
}

.progress-sidebar {
    display: grid;
    gap: 16px;
}

.progress-card {
    border: 1px solid rgba(23, 32, 51, 0.08);
    border-radius: 20px;
    display: grid;
    gap: 18px;
    padding: 24px;
}

.progress-card__header {
    display: grid;
    gap: 10px;
}

.progress-showcase {
    display: grid;
    gap: 16px;
}

.progress-row {
    border: 1px solid rgba(23, 32, 51, 0.08);
    border-radius: 16px;
    display: grid;
    gap: 10px;
    padding: 16px;
}

.progress-row__meta {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: baseline;
}

.progress-row__meta span {
    color: #51617d;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.progress-row__meta strong {
    color: #172033;
    font-size: 14px;
}

.control-group {
    display: grid;
    gap: 10px;
}

.control-group__label {
    color: #51617d;
    display: block;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.progress-slider-row {
    align-items: center;
    display: grid;
    gap: 12px;
    grid-template-columns: minmax(0, 1fr) auto;
}

.progress-slider {
    width: 100%;
}

.progress-slider__value {
    color: #172033;
    font-size: 14px;
}

.pill-group {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.pill-button {
    appearance: none;
    background: rgba(23, 32, 51, 0.05);
    border: 1px solid rgba(23, 32, 51, 0.08);
    border-radius: 999px;
    color: #172033;
    cursor: pointer;
    font: inherit;
    font-size: 13px;
    font-weight: 600;
    padding: 8px 12px;
    transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.pill-button--active {
    background: #172033;
    border-color: #172033;
    color: #f8fafc;
}

.progress-stage {
    border-radius: 20px;
    min-height: 180px;
    padding: 24px;
    display: grid;
    align-items: center;
}

.progress-stage--light {
    background: linear-gradient(180deg, #ffffff, #f8fbff);
}

.progress-stage--muted {
    background: linear-gradient(180deg, #edf2f7, #dfe7f2);
}

.progress-stage--strong {
    background: linear-gradient(180deg, #172033, #243149);
}

.progress-stage__frame {
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(23, 32, 51, 0.08);
    border-radius: 16px;
    padding: 20px;
}

.progress-stage--strong .progress-stage__frame {
    background: rgba(11, 18, 32, 0.62);
    border-color: rgba(226, 232, 240, 0.12);
}

.progress-checklist {
    display: grid;
    gap: 10px;
    margin: 0;
    padding-left: 18px;
    color: #596579;
    line-height: 1.6;
}

.payload-preview {
    background: #111827;
    border-radius: 16px;
    color: #d9e2f1;
    font-size: 12px;
    line-height: 1.55;
    margin: 0;
    overflow: auto;
    padding: 16px;
}

@media (max-width: 1180px) {
    .progress-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 720px) {
    .progress-card {
        padding: 18px;
    }

    .progress-row__meta {
        display: grid;
        gap: 4px;
    }

    .progress-stage {
        min-height: 140px;
        padding: 18px;
    }
}
</style>