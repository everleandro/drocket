<template>
    <section class="checkbox-playground">
        <div class="checkbox-playground__hero">
            <p class="eyebrow">Playground</p>
            <h1>Checkbox Playground</h1>
            <p class="hero-copy">
                Esta vista concentra pruebas de <strong>ECheckbox</strong> dentro de
                <strong>EForm</strong> para validar estados booleanos, valores custom,
                readonly y herencia de estilos.
            </p>
        </div>

        <div class="checkbox-grid">
            <ECard class="checkbox-card" elevation="md">
                <div class="checkbox-card__header">
                    <div>
                        <p class="section-kicker">Integracion con form</p>
                        <h2>Estados y comportamiento de seleccion</h2>
                    </div>
                    <p class="card-copy">
                        Prueba <strong>labelBehavior</strong>, cambio de valor, readonly,
                        disabled y herencia de color en checkboxes.
                    </p>
                </div>

                <EForm class="checkbox-demo-form" field-color="teal-900" label-behavior="floating" dense>
                    <ECheckbox v-model="checkboxState.termsAccepted" :cols="12" :md="4" label="Acepto terminos"
                        detail="Caso booleano simple para revisar color, focus y detalles." />

                    <ECheckbox v-model="checkboxState.releaseChecklist" :cols="12" :md="4"
                        label="Checklist de release"
                        detail="Usa valores custom ready/hold para probar modelValue." color="secondary"
                        true-value="ready" false-value="hold" />

                    <ECheckbox v-model="checkboxState.readonlyAudit" :cols="12" :md="4" readonly outlined
                        label="Auditoria readonly"
                        detail="Sirve para comprobar que readonly mantiene el valor." />

                    <ECheckbox v-model="checkboxState.readonlyAudit" :cols="12" :md="4" disabled outlined
                        label="Auditoria readonly"
                        detail="Sirve para comprobar que readonly mantiene el valor." />

                    <ECheckbox v-model="checkboxState.readonlyAudit" :cols="12" :md="4" readonly
                        label="Auditoria readonly"
                        detail="Sirve para comprobar que readonly mantiene el valor." />
                </EForm>
            </ECard>

            <div class="checkbox-sidebar">
                <ECard class="checkbox-card" elevation="sm">
                    <p class="section-kicker">Estado</p>
                    <h2>Resumen vivo</h2>

                    <div class="checkbox-summary">
                        <div>
                            <span>Terminos</span>
                            <strong>{{ checkboxState.termsAccepted ? "Aceptados" : "Pendientes" }}</strong>
                        </div>
                        <div>
                            <span>Release checklist</span>
                            <strong>{{ checkboxState.releaseChecklist }}</strong>
                        </div>
                        <div>
                            <span>Readonly</span>
                            <strong>{{ checkboxState.readonlyAudit ? "On" : "Off" }}</strong>
                        </div>
                    </div>
                </ECard>

                <ECard class="checkbox-card" elevation="sm">
                    <p class="section-kicker">Payload</p>
                    <h2>Checkbox state</h2>
                    <pre class="payload-preview">{{ checkboxPreview }}</pre>
                </ECard>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";

import ECard from "../../src/components/card/index.vue";
import ECheckbox from "../../src/components/form/checkbox/index.vue";
import EForm from "../../src/components/form/form.vue";

type CheckboxDemoModel = {
    termsAccepted: boolean;
    releaseChecklist: string;
    readonlyAudit: boolean;
};

const createInitialCheckboxState = (): CheckboxDemoModel => ({
    termsAccepted: true,
    releaseChecklist: "hold",
    readonlyAudit: true,
});

const checkboxState = reactive<CheckboxDemoModel>(createInitialCheckboxState());

const checkboxPreview = computed(() => {
    return JSON.stringify(checkboxState, null, 2);
});
</script>

<style scoped>
.checkbox-playground {
    display: grid;
    gap: 24px;
}

.checkbox-playground__hero {
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

.checkbox-playground__hero h1,
.checkbox-card h2 {
    color: #172033;
    margin: 0;
}

.hero-copy,
.card-copy {
    color: #596579;
    line-height: 1.6;
    margin: 0;
}

.checkbox-grid {
    display: grid;
    gap: 20px;
    grid-template-columns: minmax(0, 2fr) minmax(300px, 1fr);
}

.checkbox-sidebar {
    display: grid;
    gap: 16px;
}

.checkbox-card {
    border: 1px solid rgba(23, 32, 51, 0.08);
    border-radius: 20px;
    display: grid;
    gap: 18px;
    padding: 24px;
}

.checkbox-card__header {
    display: grid;
    gap: 10px;
}

.checkbox-demo-form {
    border: 1px solid rgba(23, 32, 51, 0.08);
    border-radius: 18px;
    padding: 16px;
}

.checkbox-summary {
    display: grid;
    gap: 14px;
}

.checkbox-summary div {
    border: 1px solid rgba(23, 32, 51, 0.08);
    border-radius: 16px;
    padding: 14px 16px;
}

.checkbox-summary span {
    color: #51617d;
    display: block;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    margin: 0 0 4px;
    text-transform: uppercase;
}

.checkbox-summary strong {
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

@media (max-width: 960px) {
    .checkbox-grid {
        grid-template-columns: 1fr;
    }

    .checkbox-card {
        padding: 18px;
    }
}
</style>