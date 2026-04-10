<template>
    <section class="time-picker-playground">
        <div class="time-picker-playground__hero">
            <p class="section-kicker">Playground</p>
            <h1>Time Picker Playground</h1>
            <p class="hero-copy">
                Esta vista sirve para probar <strong>ETimePicker</strong> de forma aislada,
                con foco en pasos, alineacion, estados de lectura, outlined y color sin
                depender del resto del formulario.
            </p>
        </div>

        <div class="time-picker-layout">
            <ECard class="time-picker-card time-picker-card--controls" elevation="md">
                <p class="section-kicker">Controles</p>
                <h2>Sandbox</h2>

                <div class="control-grid">
                    <label class="control-field">
                        <span>Color</span>
                        <select v-model="sandbox.color">
                            <option value="">default</option>
                            <option value="primary">primary</option>
                            <option value="secondary">secondary</option>
                            <option value="success">success</option>
                            <option value="warning">warning</option>
                            <option value="teal-900">teal-900</option>
                            <option value="cyan-800">cyan-800</option>
                        </select>
                    </label>

                    <label class="control-field">
                        <span>Label behavior</span>
                        <select v-model="sandbox.labelBehavior">
                            <option value="">default</option>
                            <option value="floating">floating</option>
                            <option value="inline">inline</option>
                        </select>
                    </label>

                    <label class="control-field">
                        <span>Input align</span>
                        <select v-model="sandbox.inputAlign">
                            <option value="">auto</option>
                            <option value="start">start</option>
                            <option value="center">center</option>
                            <option value="end">end</option>
                        </select>
                    </label>

                    <label class="control-field">
                        <span>Hours step</span>
                        <select v-model.number="sandbox.hoursStep">
                            <option :value="1">1</option>
                            <option :value="2">2</option>
                            <option :value="3">3</option>
                            <option :value="6">6</option>
                        </select>
                    </label>

                    <label class="control-field">
                        <span>Minutes step</span>
                        <select v-model.number="sandbox.minutesStep">
                            <option :value="5">5</option>
                            <option :value="10">10</option>
                            <option :value="15">15</option>
                            <option :value="30">30</option>
                        </select>
                    </label>
                </div>

                <div class="toggle-grid">
                    <label class="toggle-field">
                        <input v-model="sandbox.outlined" type="checkbox">
                        <span>Outlined</span>
                    </label>

                    <label class="toggle-field">
                        <input v-model="sandbox.readonly" type="checkbox">
                        <span>Readonly</span>
                    </label>

                    <label class="toggle-field">
                        <input v-model="sandbox.hourReadonly" type="checkbox">
                        <span>Hour readonly</span>
                    </label>

                    <label class="toggle-field">
                        <input v-model="sandbox.minuteReadonly" type="checkbox">
                        <span>Minute readonly</span>
                    </label>

                    <label class="toggle-field">
                        <input v-model="sandbox.disabled" type="checkbox">
                        <span>Disabled</span>
                    </label>
                </div>

                <div class="actions-row">
                    <EButton color="primary" @click="resetState">Reset demo</EButton>
                </div>

                <div class="state-panel">
                    <p class="state-panel__title">Estado</p>
                    <pre>{{ statePreview }}</pre>
                </div>
            </ECard>

            <div class="time-picker-grid">
                <ECard class="time-picker-card" elevation="md">
                    <p class="section-kicker">Base</p>
                    <h2>Casos principales</h2>
                    <p class="card-copy">
                        Usa esta columna para iterar el comportamiento base del componente con la
                        configuracion actual del sandbox.
                    </p>

                    <EForm class="time-picker-demo-form" :field-color="resolvedColor">
                        <ETimePicker
                            v-model="demo.kickoff"
                            :cols="12"
                            :hours-step="sandbox.hoursStep"
                            :minutes-step="sandbox.minutesStep"
                            :label-behavior="resolvedLabelBehavior"
                            :input-align="resolvedInputAlign"
                            :outlined="sandbox.outlined"
                            :readonly="sandbox.readonly"
                            :hour-readonly="sandbox.hourReadonly"
                            :minute-readonly="sandbox.minuteReadonly"
                            :disabled="sandbox.disabled"
                            :color="resolvedColor"
                            label="Kickoff"
                            detail="Caso base del sandbox actual." />

                        <ETimePicker
                            v-model="demo.review"
                            :cols="12"
                            :hours-step="sandbox.hoursStep"
                            :minutes-step="sandbox.minutesStep"
                            :label-behavior="resolvedLabelBehavior"
                            :input-align="resolvedInputAlign"
                            :outlined="sandbox.outlined"
                            :readonly="sandbox.readonly"
                            :hour-readonly="sandbox.hourReadonly"
                            :minute-readonly="sandbox.minuteReadonly"
                            :disabled="sandbox.disabled"
                            :color="resolvedColor"
                            :prepend-icon="iconFactory.arrowRight"
                            label="Review"
                            detail="Variante con icono prepend para revisar espaciados." />

                        <ETimePicker
                            v-model="demo.publish"
                            :cols="12"
                            :hours-step="sandbox.hoursStep"
                            :minutes-step="sandbox.minutesStep"
                            :label-behavior="resolvedLabelBehavior"
                            :input-align="resolvedInputAlign"
                            :outlined="sandbox.outlined"
                            :readonly="sandbox.readonly"
                            :hour-readonly="sandbox.hourReadonly"
                            :minute-readonly="sandbox.minuteReadonly"
                            :disabled="sandbox.disabled"
                            :color="resolvedColor"
                            :append-icon="iconFactory.arrowRight"
                            label="Publish"
                            detail="Variante con icono append para validar el slot final." />
                    </EForm>
                </ECard>

                <ECard class="time-picker-card" elevation="md">
                    <p class="section-kicker">Estados</p>
                    <h2>Combinaciones fijas</h2>
                    <p class="card-copy">
                        Estos casos quedan estables para detectar regresiones sin depender de los
                        toggles del sandbox.
                    </p>

                    <EForm class="time-picker-demo-form" field-color="teal-900">
                        <ETimePicker
                            v-model="fixedState.denseWindow"
                            :cols="12"
                            :md="6"
                            label="Ventana compacta"
                            label-behavior="floating"
                            color="teal-900"
                            :minutes-step="5"
                            detail="Paso corto para probar escritura manual y menu." />

                        <ETimePicker
                            v-model="fixedState.blockedWindow"
                            :cols="12"
                            :md="6"
                            label="Bloqueado"
                            outlined
                            disabled
                            color="secondary"
                            detail="Referencia visual para disabled + outlined." />

                        <ETimePicker
                            v-model="fixedState.readonlyMinutes"
                            :cols="12"
                            :md="6"
                            label="Minutos protegidos"
                            minute-readonly
                            :hours-step="2"
                            :minutes-step="30"
                            detail="Sirve para validar readonly parcial del grupo." />

                        <ETimePicker
                            v-model="fixedState.inlineLabel"
                            :cols="12"
                            :md="6"
                            label="Inline label"
                            label-behavior="inline"
                            detail="Caso fijo para revisar layout con label inline." />
                    </EForm>
                </ECard>

                <ECard class="time-picker-card" elevation="md">
                    <p class="section-kicker">Resumen</p>
                    <h2>Valores actuales</h2>
                    <div class="summary-grid">
                        <div>
                            <span>Kickoff</span>
                            <strong>{{ formatTimePreview(demo.kickoff) }}</strong>
                        </div>
                        <div>
                            <span>Review</span>
                            <strong>{{ formatTimePreview(demo.review) }}</strong>
                        </div>
                        <div>
                            <span>Publish</span>
                            <strong>{{ formatTimePreview(demo.publish) }}</strong>
                        </div>
                    </div>

                    <div class="state-panel state-panel--spacious">
                        <p class="state-panel__title">Payload</p>
                        <pre>{{ previewPayload }}</pre>
                    </div>
                </ECard>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";

import EButton from "../../src/components/button/index.vue";
import ECard from "../../src/components/card/index.vue";
import EForm from "../../src/components/form/form.vue";
import ETimePicker from "../../src/components/form/time-picker/index.vue";
import iconFactory from "../../src/utils/icons";

type TimePickerSandbox = {
    color: string;
    labelBehavior: "" | "floating" | "inline";
    inputAlign: "" | "start" | "center" | "end";
    hoursStep: number;
    minutesStep: number;
    outlined: boolean;
    readonly: boolean;
    hourReadonly: boolean;
    minuteReadonly: boolean;
    disabled: boolean;
};

type DemoState = {
    kickoff: Date;
    review: Date;
    publish: Date;
};

type FixedState = {
    denseWindow: Date;
    blockedWindow: Date;
    readonlyMinutes: Date;
    inlineLabel: Date;
};

const createDemoState = (): DemoState => ({
    kickoff: new Date("2026-04-10T09:00:00"),
    review: new Date("2026-04-10T13:30:00"),
    publish: new Date("2026-04-10T18:45:00"),
});

const createFixedState = (): FixedState => ({
    denseWindow: new Date("2026-04-10T08:15:00"),
    blockedWindow: new Date("2026-04-10T11:00:00"),
    readonlyMinutes: new Date("2026-04-10T16:30:00"),
    inlineLabel: new Date("2026-04-10T20:00:00"),
});

const sandbox = reactive<TimePickerSandbox>({
    color: "cyan-800",
    labelBehavior: "floating",
    inputAlign: "",
    hoursStep: 1,
    minutesStep: 15,
    outlined: false,
    readonly: false,
    hourReadonly: false,
    minuteReadonly: false,
    disabled: false,
});

const demo = reactive<DemoState>(createDemoState());
const fixedState = reactive<FixedState>(createFixedState());

const resolvedColor = computed(() => sandbox.color || undefined);
const resolvedLabelBehavior = computed(() => sandbox.labelBehavior || undefined);
const resolvedInputAlign = computed(() => sandbox.inputAlign || undefined);

const formatTimePreview = (value: Date): string => {
    return new Intl.DateTimeFormat("es", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(value);
};

const previewPayload = computed(() => {
    return JSON.stringify(
        {
            kickoff: demo.kickoff.toISOString(),
            review: demo.review.toISOString(),
            publish: demo.publish.toISOString(),
        },
        null,
        2,
    );
});

const statePreview = computed(() => {
    return JSON.stringify(
        {
            ...sandbox,
            demo: {
                kickoff: formatTimePreview(demo.kickoff),
                review: formatTimePreview(demo.review),
                publish: formatTimePreview(demo.publish),
            },
        },
        null,
        2,
    );
});

const resetState = (): void => {
    Object.assign(sandbox, {
        color: "cyan-800",
        labelBehavior: "floating",
        inputAlign: "",
        hoursStep: 1,
        minutesStep: 15,
        outlined: false,
        readonly: false,
        hourReadonly: false,
        minuteReadonly: false,
        disabled: false,
    });

    Object.assign(demo, createDemoState());
    Object.assign(fixedState, createFixedState());
};
</script>

<style scoped>
.time-picker-playground {
    display: grid;
    gap: 24px;
    padding: 24px;
}

.time-picker-playground__hero {
    display: grid;
    gap: 8px;
    max-width: 760px;
}

.section-kicker {
    color: #5b6b8a;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.12em;
    margin: 0;
    text-transform: uppercase;
}

.time-picker-playground__hero h1,
.time-picker-card h2 {
    color: #172033;
    margin: 0;
}

.hero-copy,
.card-copy {
    color: #596579;
    line-height: 1.6;
    margin: 0;
}

.time-picker-layout {
    display: grid;
    gap: 20px;
}

.time-picker-grid {
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

.time-picker-card {
    border: 1px solid rgba(23, 32, 51, 0.08);
    border-radius: 20px;
    display: grid;
    gap: 18px;
    padding: 24px;
}

.time-picker-card--controls {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(245, 249, 255, 0.98));
}

.control-grid,
.toggle-grid,
.summary-grid {
    display: grid;
    gap: 14px;
}

.control-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.toggle-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.control-field,
.toggle-field {
    border: 1px solid rgba(23, 32, 51, 0.08);
    border-radius: 16px;
    display: grid;
    gap: 8px;
    padding: 14px 16px;
}

.control-field span,
.toggle-field span,
.state-panel__title,
.summary-grid span {
    color: #51617d;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    margin: 0;
    text-transform: uppercase;
}

.control-field select {
    background: #fff;
    border: 1px solid rgba(23, 32, 51, 0.12);
    border-radius: 12px;
    color: #172033;
    font: inherit;
    padding: 10px 12px;
}

.toggle-field {
    align-items: center;
    grid-template-columns: auto 1fr;
}

.toggle-field input {
    margin: 0;
}

.actions-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}

.time-picker-demo-form {
    border: 1px solid rgba(23, 32, 51, 0.08);
    border-radius: 18px;
    padding: 16px;
}

.summary-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
}

.summary-grid div,
.state-panel {
    border: 1px solid rgba(23, 32, 51, 0.08);
    border-radius: 18px;
    padding: 16px;
}

.summary-grid strong {
    color: #172033;
    font-size: 14px;
}

.state-panel {
    background: linear-gradient(180deg, rgba(244, 247, 252, 0.9), rgba(255, 255, 255, 0.96));
}

.state-panel--spacious {
    margin-top: 4px;
}

.state-panel pre {
    margin: 12px 0 0;
    overflow: auto;
    white-space: pre-wrap;
}

@media (max-width: 800px) {
    .time-picker-playground {
        padding: 16px;
    }

    .summary-grid {
        grid-template-columns: 1fr;
    }
}
</style>