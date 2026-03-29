<template>
    <section class="radio-playground">
        <div class="radio-playground__hero">
            <p class="eyebrow">Playground</p>
            <h1>Radio Playground</h1>
            <p class="hero-copy">
                Esta vista concentra pruebas de <strong>ERadioGroup</strong> y
                <strong>ERadio</strong> dentro de <strong>EForm</strong>. Puede crecer despues
                para incluir otros selection controls como <strong>ECheckbox</strong>.
            </p>
        </div>

        <div class="radio-grid">
            <ECard class="radio-card" elevation="md">
                <div class="radio-card__header">
                    <div>
                        <p class="section-kicker">Integracion con form</p>
                        <h2>Row, column y herencia de estado</h2>
                    </div>
                    <p class="card-copy">
                        Prueba <strong>labelBehavior</strong>, cambio de valor, readonly,
                        disabled y herencia de color sin mezclar otros campos.
                    </p>
                </div>
                <e-card elevation="sm" class="p-4">
                    <h1>radioState.contactChannel: {{ radioState.contactChannel }}</h1>
                </e-card>

                <EForm class="radio-demo-form" field-color="teal-900" label-behavior="floating" dense>
                    <ERadioGroup v-model="radioState.contactChannel" :cols="12" :md="6" row
                        label="Canal de contacto"
                        detail="En modo row el label floating debe seguir el comportamiento del field.">
                        <ERadio model-value="email" label="Email" />
                        <ERadio model-value="slack" label="Slack" />
                        <ERadio model-value="meet" label="Meet" />
                    </ERadioGroup>

                    <ERadioGroup v-model="radioState.releaseTrack" :cols="12" :md="6"
                        label="Release track"
                        detail="En columna el label se mantiene estatico aunque el form use floating."
                        color="secondary">
                        <ERadio model-value="stable" label="Stable" />
                        <ERadio model-value="beta" label="Beta" />
                        <ERadio model-value="canary" label="Canary" />
                    </ERadioGroup>
                </EForm>

                <EForm class="radio-demo-form" field-color="cyan-800" >
                    <ERadioGroup v-model="radioState.approvalStage" :cols="12" row outlined
                        label="Aprobacion final"
                        detail="Este grupo hereda disabled desde el formulario para validar la integracion.">
                        <ERadio model-value="pending" label="Pending" />
                        <ERadio model-value="approved" label="Approved" />
                        <ERadio model-value="rejected" label="Rejected" />
                    </ERadioGroup>
                </EForm>

                <EForm class="radio-demo-form" field-color="cyan-800" label-behavior="floating" >
                    <ERadioGroup v-model="radioState.approvalStage" :cols="12" row 
                        label="Aprobacion final"
                        detail="Este grupo hereda disabled desde el formulario para validar la integracion.">
                        <ERadio model-value="pending" label="Pending" />
                        <ERadio model-value="approved" label="Approved" />
                        <ERadio model-value="rejected" label="Rejected" />
                    </ERadioGroup>
                </EForm>

                <EForm class="radio-demo-form" field-color="secondary" readonly>
                    <ERadioGroup v-model="radioState.audience" :cols="12" row
                        label="Audience"
                        detail="Sirve para comprobar que readonly mantiene el valor al intentar interactuar.">
                        <ERadio model-value="internal" label="Internal" />
                        <ERadio model-value="beta-users" label="Beta users" />
                        <ERadio model-value="public" label="Public" />
                    </ERadioGroup>
                </EForm>
            </ECard>

            <div class="radio-sidebar">
                <ECard class="radio-card" elevation="sm">
                    <p class="section-kicker">Estado</p>
                    <h2>Resumen vivo</h2>

                    <div class="radio-summary">
                        <div>
                            <span>Canal</span>
                            <strong>{{ radioState.contactChannel }}</strong>
                        </div>
                        <div>
                            <span>Track</span>
                            <strong>{{ radioState.releaseTrack }}</strong>
                        </div>
                        <div>
                            <span>Aprobacion</span>
                            <strong>{{ radioState.approvalStage }}</strong>
                        </div>
                        <div>
                            <span>Audience</span>
                            <strong>{{ radioState.audience }}</strong>
                        </div>
                    </div>
                </ECard>

                <ECard class="radio-card" elevation="sm">
                    <p class="section-kicker">Payload</p>
                    <h2>Radio state</h2>
                    <pre class="payload-preview">{{ radioPreview }}</pre>
                </ECard>

                <ECard class="radio-card radio-card--future" elevation="sm">
                    <p class="section-kicker">Proximo paso</p>
                    <h2>Selection controls</h2>
                    <p class="card-copy">
                        Esta vista queda preparada para crecer con ejemplos de
                        <strong>ECheckbox</strong> y otros controles relacionados,
                        manteniendo el playground de formularios principal mas limpio.
                    </p>
                </ECard>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";

import ECard from "../../src/components/card/index.vue";
import EForm from "../../src/components/form/form.vue";
import ERadio from "../../src/components/form/radio/index.vue";
import ERadioGroup from "../../src/components/form/radio/group.vue";

type RadioDemoModel = {
    contactChannel: string;
    releaseTrack: string;
    approvalStage: string;
    audience: string;
};

const createInitialRadioState = (): RadioDemoModel => ({
    contactChannel: "slack",
    releaseTrack: "beta",
    approvalStage: "pending",
    audience: "internal",
});

const radioState = reactive<RadioDemoModel>(createInitialRadioState());

const radioPreview = computed(() => {
    return JSON.stringify(radioState, null, 2);
});
</script>

<style scoped>
.radio-playground {
    display: grid;
    gap: 24px;
}

.radio-playground__hero {
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

.radio-playground__hero h1,
.radio-card h2 {
    color: #172033;
    margin: 0;
}

.hero-copy,
.card-copy {
    color: #596579;
    line-height: 1.6;
    margin: 0;
}

.radio-grid {
    display: grid;
    gap: 20px;
    grid-template-columns: minmax(0, 2fr) minmax(300px, 1fr);
}

.radio-sidebar {
    display: grid;
    gap: 16px;
}

.radio-card {
    border: 1px solid rgba(23, 32, 51, 0.08);
    border-radius: 20px;
    display: grid;
    gap: 18px;
    padding: 24px;
}

.radio-card__header {
    display: grid;
    gap: 10px;
}

.radio-demo-form {
    border: 1px solid rgba(23, 32, 51, 0.08);
    border-radius: 18px;
    padding: 16px;
}

.radio-summary {
    display: grid;
    gap: 14px;
}

.radio-summary div {
    border: 1px solid rgba(23, 32, 51, 0.08);
    border-radius: 16px;
    padding: 14px 16px;
}

.radio-summary span {
    color: #51617d;
    display: block;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    margin: 0 0 4px;
    text-transform: uppercase;
}

.radio-summary strong {
    color: #172033;
    font-size: 14px;
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

.radio-card--future {
    background: linear-gradient(180deg, #ffffff, #f7f9fc);
}

@media (max-width: 960px) {
    .radio-grid {
        grid-template-columns: 1fr;
    }

    .radio-card {
        padding: 18px;
    }
}
</style>