<template>
  <section class="textarea-playground">
    <div class="textarea-playground__hero">
      <p class="eyebrow">Playground</p>
      <h1>Textarea Playground</h1>
      <p class="hero-copy">
        Esta vista deja aislada la nueva linea basada en <strong>Field</strong>
        para iterar label, details, contador, herencia de color y comportamiento
        del shell sin mezclarla con los textfields legacy.
      </p>
    </div>

    <div class="textarea-layout">
      <div class="textarea-stack">
        <ECard class="textarea-card" elevation="md">
          <div class="textarea-card__header">
            <div>
              <p class="section-kicker">Textarea</p>
              <h2>Casos base para ETextarea</h2>
            </div>
            <p class="textarea-card__copy">
              El bloque principal mantiene validacion, contador y details para
              el caso base del componente sobre <strong>EForm</strong>.
            </p>
          </div>

          <EForm
            ref="formRef"
            v-model="formValid"
            class="textarea-demo-form"
            dense
            @submit="handleSubmit"
          >
            <ETextarea
              v-model="form.summary"
              :cols="12"
              :md="6"
              color="cyan-800"
              label="color-cyan-800"
              placeholder="Describe alcance, objetivos y restricciones principales"
              detail="Caso base del nuevo textarea usando el shell Field."
              :rules="summaryRules"
            />

            <ETextarea
              v-model="form.retrospective"
              :cols="12"
              :md="6"
              counter
              color="primary"
              :limit="240"
              label="color-primary"
              label-behavior="floating"
              outlined
              placeholder="Que funciono bien, que falta ajustar y que deberiamos iterar"
              detail="Caso floating con contador y details enriquecido desde textarea."
              :rules="retrospectiveRules"
            />
          </EForm>

          <div class="textarea-actions">
            <EButton color="primary" @click="handleValidate">Validar</EButton>
            <EButton color="secondary" outlined @click="handleSubmit"
              >Simular submit</EButton
            >
            <EButton text @click="handleReset">Restablecer</EButton>
          </div>

          <p :class="['feedback', `feedback--${submitState.kind}`]">
            {{ submitState.message }}
          </p>
        </ECard>

        <ECard class="textarea-card" elevation="md">
          <div class="textarea-card__header">
            <div>
              <p class="section-kicker">Label behavior</p>
              <h2>Inline y floating lado a lado</h2>
            </div>
            <p class="textarea-card__copy">
              Compara el label estatico frente al label flotante usando el mismo
              tipo de contenido y placeholders equivalentes.
            </p>
          </div>

          <div class="textarea-demo-grid">
            <EForm
              class="textarea-demo-form"
              field-color="teal-900"
              label-behavior="inline"
              dense
            >
              <ETextarea
                v-model="form.inlineLabel"
                :cols="12"
                color="secondary"
                label="color-secondary"
                placeholder="El placeholder siempre esta visible cuando el label no flota"
                detail="Ideal para formularios donde el label debe ocupar un lugar fijo."
              />
            </EForm>

            <EForm
              class="textarea-demo-form"
              field-color="cyan-800"
              label-behavior="floating"
              dense
            >
              <ETextarea
                v-model="form.floatingLabel"
                :cols="12"
                counter
                color="warning"
                :limit="180"
                label="Label floating color-warning"
                placeholder="El placeholder aparece cuando el label ya se desplazo"
                detail="Sirve para inputs mas compactos sin perder contexto del campo."
              />
            </EForm>
          </div>
        </ECard>

        <ECard class="textarea-card" elevation="md">
          <div class="textarea-card__header">
            <div>
              <p class="section-kicker">Color tokens</p>
              <h2>Galeria de colores y overrides</h2>
            </div>
            <p class="textarea-card__copy">
              Estos ejemplos muestran herencia por formulario y un override
              puntual en el textarea para comprobar el contraste visual del
              shell.
            </p>
          </div>

          <div class="textarea-color-grid">
            <EForm class="textarea-demo-form" label-behavior="floating" dense>
              <ETextarea
                v-model="form.brandVoice"
                :cols="12"
                color="primary"
                label="Primary tone"
                placeholder="Tono general de la comunicacion"
                detail="Hereda primary desde EForm para todo el field."
              />
            </EForm>

            <EForm
              class="textarea-demo-form"
              field-color="secondary"
              label-behavior="floating"
              dense
            >
              <ETextarea
                v-model="form.releaseNotes"
                :cols="12"
                outlined
                color="warning"
                label="warning outlined"
                placeholder="Notas breves del release"
                detail="Outlined ayuda a comparar como cambian borde y focus por color."
              />
            </EForm>

            <EForm
              class="textarea-demo-form"
              field-color="warning"
              label-behavior="floating"
              dense
            >
              <ETextarea
                v-model="form.escalationPlan"
                :cols="12"
                color="error"
                label="Override a error"
                placeholder="Plan de escalamiento ante bloqueos"
                detail="El form usa warning, pero este textarea fuerza color error."
              />
            </EForm>
          </div>
        </ECard>
      </div>

      <div class="textarea-sidebar">
        <ECard class="textarea-card" elevation="sm">
          <p class="section-kicker">Resumen</p>
          <h2>Estado visible</h2>

          <div class="textarea-summary">
            <div>
              <span>Resumen</span>
              <strong>{{ form.summary || "Sin definir" }}</strong>
            </div>
            <div>
              <span>Retrospectiva</span>
              <strong>{{ form.retrospective.length }} / 240</strong>
            </div>
            <div>
              <span>Inline</span>
              <strong>{{ form.inlineLabel || "Sin texto" }}</strong>
            </div>
            <div>
              <span>Floating</span>
              <strong>{{ form.floatingLabel || "Sin texto" }}</strong>
            </div>
          </div>
        </ECard>

        <ECard class="textarea-card" elevation="sm">
          <p class="section-kicker">Payload</p>
          <h2>Textarea state</h2>
          <pre class="payload-preview">{{ textareaPreview }}</pre>
        </ECard>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";

import EButton from "../../src/components/button/index.vue";
import ECard from "../../src/components/card/index.vue";
import EForm from "../../src/components/form/form.vue";
import ETextarea from "../../src/components/form/textarea/index.vue";

type TextareaFormModel = {
  summary: string;
  retrospective: string;
  inlineLabel: string;
  floatingLabel: string;
  brandVoice: string;
  releaseNotes: string;
  escalationPlan: string;
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
  inlineLabel:
    "El label inline deja el placeholder siempre disponible mientras editas.",
  floatingLabel:
    "Este ejemplo arranca con valor para que el label se vea flotando desde el inicio.",
  brandVoice: "Cercano, directo y con foco en decisiones accionables.",
  releaseNotes:
    "Se corrigio el espaciado del shell y se alinearon los details.",
  escalationPlan:
    "Si el entregable bloquea a otro equipo, se notifica en menos de 30 minutos.",
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
const formValid = ref(false);
const form = reactive<TextareaFormModel>(createInitialForm());
const submitState = reactive<SubmitState>({
  kind: "idle",
  message:
    "Completa los campos y usa validar o submit para revisar el comportamiento del textarea.",
});
const textareaPreview = computed(() => {
  return JSON.stringify(form, null, 2);
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
    submitState.message =
      "Corrige las validaciones antes de simular el submit.";
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

.textarea-layout {
  display: grid;
  gap: 20px;
  grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
}

.textarea-stack,
.textarea-sidebar,
.textarea-playground__hero,
.textarea-card,
.textarea-card__header {
  display: grid;
  gap: 10px;
}

.textarea-card {
  border: 1px solid rgba(23, 32, 51, 0.08);
  border-radius: 20px;
  padding: 24px;
}

.textarea-card__copy,
.feedback,
.hero-copy {
  color: #5f6f86;
  line-height: 1.6;
  margin: 0;
}

.textarea-demo-grid,
.textarea-color-grid {
  display: grid;
  gap: 16px;
}

.textarea-demo-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
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
  .textarea-playground {
    padding: 16px;
  }

  .textarea-layout,
  .textarea-demo-grid {
    grid-template-columns: 1fr;
  }

  .textarea-card {
    padding: 18px;
  }
}
</style>
