<template>
    <section class="textarea-playground">
        <div class="textarea-playground__hero">
            <p class="eyebrow">Playground</p>
            <h1>Textarea Playground</h1>
            <p class="hero-copy">
                Esta vista deja aislada la nueva linea basada en <strong>Field</strong>
                para iterar label, details, contador y comportamiento del shell sin mezclarla
                con los textfields legacy.
            </p>
        </div>
        <e-card elevation="md" class="textarea-card">
             <ETextfield v-model.trim="fullName" :cols="12" :md="6" clearable dense label="dense" suffix="suffix" prefix="prefix"
                    placeholder="Ada Lovelace"
                    detail="Se usa para personalizar la experiencia." />
        </e-card>

        <ECard class="textarea-card" elevation="md">
            <div class="textarea-card__header">
                <div>
                    <p class="section-kicker">Textarea</p>
                    <h2>Casos base para ETextarea</h2>
                </div>
                <p class="textarea-card__copy">
                    El primer bloque valida el caso base. El segundo mantiene floating label,
                    contador y mensajes enriquecidos desde el propio componente.
                </p>
            </div>

            <EForm
                ref="formRef"
                v-model="formValid"
                class="textarea-demo-form"
                field-color="cyan-800"
                label-behavior="floating"
                dense
                @submit="handleSubmit"
            >
                <ETextarea
                    v-model="form.summary"
                    :cols="12"
                    :md="6"
                    label="Resumen del proyecto"
                    placeholder="Describe alcance, objetivos y restricciones principales"
                    detail="Caso base del nuevo textarea usando el shell Field."
                    :rules="summaryRules"
                />

                <ETextarea
                    v-model="form.retrospective"
                    :cols="12"
                    :md="6"
                    counter
                    :limit="240"
                    label="Notas retrospectivas"
                    placeholder="Que funciono bien, que falta ajustar y que deberiamos iterar"
                    detail="Caso floating con contador y details enriquecido desde textarea."
                    :rules="retrospectiveRules"
                />
            </EForm>

            <div class="textarea-actions">
                <EButton color="primary" @click="handleValidate">Validar</EButton>
                <EButton color="secondary" outlined @click="handleSubmit">Simular submit</EButton>
                <EButton text @click="handleReset">Restablecer</EButton>
            </div>

            <div class="textarea-summary">
                <div>
                    <span>Resumen</span>
                    <strong>{{ form.summary || "Sin definir" }}</strong>
                </div>
                <div>
                    <span>Retrospectiva</span>
                    <strong>{{ form.retrospective.length }} / 240</strong>
                </div>
            </div>

            <p :class="['feedback', `feedback--${submitState.kind}`]">
                {{ submitState.message }}
            </p>
        </ECard>
    </section>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";

import EButton from "../../src/components/button/index.vue";
import ECard from "../../src/components/card/index.vue";
import EForm from "../../src/components/form/form.vue";
import ETextarea from "../../src/components/form/textarea/index.vue";
import ETextfield from "../../src/components/form/textfield/index.vue";

type TextareaFormModel = {
    summary: string;
    retrospective: string;
};

type SubmitState = {
    kind: "success" | "warning" | "idle";
    message: string;
};

type FormInstance = {
    validate?: () => Promise<boolean>;
    reset?: () => void;
};

const createInitialForm = (): TextareaFormModel => ({
    summary: "",
    retrospective: "",
});

const requiredText = (value: unknown) => {
    return `${value ?? ""}`.trim().length > 0 || "Este campo es obligatorio.";
};

const maxRetrospectiveLength = (value: unknown) => {
    return (
        `${value ?? ""}`.length <= 240 ||
        "La retrospectiva no puede superar 240 caracteres."
    );
};

const summaryRules = [requiredText];
const retrospectiveRules = [maxRetrospectiveLength];

const formRef = ref<FormInstance | null>(null);
    const fullName = ref("");
const formValid = ref(false);
const form = reactive<TextareaFormModel>(createInitialForm());
const submitState = reactive<SubmitState>({
    kind: "idle",
    message: "Completa los campos y usa validar o submit para revisar el comportamiento del textarea.",
});

const handleValidate = async (): Promise<void> => {
    const valid = await formRef.value?.validate?.();

    if (valid) {
        submitState.kind = "success";
        submitState.message = "Textarea validado correctamente.";
        return;
    }

    submitState.kind = "warning";
    submitState.message = "Hay campos pendientes o con validaciones incumplidas.";
};

const handleSubmit = async (): Promise<void> => {
    const valid = await formRef.value?.validate?.();

    if (!valid) {
        submitState.kind = "warning";
        submitState.message = "Corrige las validaciones antes de simular el submit.";
        return;
    }

    submitState.kind = "success";
    submitState.message = "Submit simulado: el flujo de textarea quedo validado.";
};

const handleReset = (): void => {
    formRef.value?.reset?.();
    Object.assign(form, createInitialForm());
    formValid.value = false;
    submitState.kind = "idle";
    submitState.message = "Estado restablecido para seguir probando el textarea.";
};
</script>

<style scoped>
.textarea-playground {
    display: grid;
    gap: 24px;
    margin: 0 auto;
    max-width: 1100px;
    padding: 24px;
}

.textarea-playground__hero,
.textarea-card,
.textarea-card__header {
    display: grid;
    gap: 10px;
}

.textarea-card {
    padding: 24px;
}

.textarea-card__copy,
.feedback,
.hero-copy {
    color: #5f6f86;
    line-height: 1.6;
    margin: 0;
}

.textarea-demo-form {
    border: 1px solid rgba(23, 32, 51, 0.08);
    border-radius: 18px;
    padding: 16px;
}

.textarea-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}

.textarea-summary {
    display: grid;
    gap: 14px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
}

.textarea-summary div {
    border: 1px solid rgba(23, 32, 51, 0.08);
    border-radius: 18px;
    padding: 16px;
}

.textarea-summary span,
.section-kicker {
    color: var(--e-contrast-surface-1);
    display: block;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    margin: 0 0 4px;
    text-transform: uppercase;
}

.textarea-summary strong {
    color: var(--e-contrast-surface-1);
    font-size: 14px;
}

.feedback {
    background: var(--e-color-surface-1);
    border-radius: 14px;
    margin-top: 4px;
    padding: 14px 16px;
}

.feedback--success {
    background: rgba(42, 138, 90, 0.1);
    color: var(--e-color-success);
}

.feedback--warning {
    background: rgba(196, 116, 37, 0.12);
    color: var(--e-color-warning);
}

@media (max-width: 960px) {
    .textarea-playground {
        padding: 16px;
    }

    .textarea-card {
        padding: 18px;
    }

    .textarea-summary {
        grid-template-columns: 1fr;
    }
}
</style>