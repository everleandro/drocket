<template>
  <section class="form-playground">
    <div class="form-playground__hero">
      <p class="eyebrow">Playground</p>
      <h1>Textfield Playground</h1>
      <p class="hero-copy">
        Esta vista queda dedicada solo a <strong>ETextfield</strong> para iterar
        validacion, foco, detalles, clear y estados visuales sin ruido de otros
        componentes.
      </p>
    </div>

    <ERow dense>
      <ECol :cols="12" :lg="8">
        <ECard class="form-card form-card--main" elevation="md">
          <div class="form-card__header">
            <div>
              <p class="section-kicker">Demo integrada</p>
              <h2 class="secondary--text">Suite de textfields</h2>
            </div>
            <div
              class="status-pill"
              :class="formValid ? 'status-pill--valid' : 'status-pill--invalid'"
            >
              {{ formValid ? "Formulario valido" : "Pendiente de validacion" }}
            </div>
          </div>

          <EForm
            ref="formRef"
            label-behavior="floating"
            v-model="formValid"
            class="demo-form"
            color="secondary"
            label-min-width="136"
            dense
            @submit="handleSubmit"
          >
            <ETextfield
              v-model.trim="form.fullName"
              label-behavior="floating"
              :cols="12"
              :md="6"
              clearable
              label="Nombre completo"
              placeholder="Ada Lovelace"
              detail="Se usa para personalizar la experiencia."
              :rules="nameRules"
            />

            <ETextfield
              v-model.trim="form.email"
              label-behavior="floating"
              :cols="12"
              :md="6"
              clearable
              label="Email de trabajo"
              placeholder="ada@analytical.engine"
              autocomplete="email"
              detail="Te enviaremos confirmaciones y alertas importantes."
              :rules="emailRules"
            />

            <ETextfield
              v-model="form.company"
              :cols="12"
              :md="6"
              label="Empresa o equipo"
              placeholder="Analytical Engines Lab"
              prepend-icon=""
              detail="Prueba label, helper message y comportamiento ."
              :rules="companyRules"
            />

            <ETextfield
              v-model.number="form.hourlyRate"
              :cols="12"
              :md="6"
              label="Tarifa esperada"
              prefix="$"
              suffix="USD"
              placeholder="120"
              detail="Solo numeros, sin separadores."
              :rules="rateRules"
            />

            <ETextfield
              v-model="form.username"
              :cols="12"
              clearable
              label="Identificador publico"
              prefix="@"
              placeholder="ada-l"
              detail="Debe ser unico y sin espacios."
              :rules="usernameRules"
              @input="pushEvent('input', $event)"
              @change="pushEvent('change', $event)"
              @keydown="pushKeyboardEvent('keydown', $event)"
              @keyup="pushKeyboardEvent('keyup', $event)"
              @keydown:enter="pushKeyboardEvent('keydown:enter', $event)"
            />

            <ETextfield
              v-model="form.phone"
              :cols="12"
              :md="6"
              clearable
              label="Telefono"
              placeholder="+34 600 000 000"
              detail="Ejemplo de mascara libre con validacion simple."
              :rules="phoneRules"
            />

            <ETextfield
              v-model="form.website"
              :cols="12"
              :md="6"
              clearable
              label="Sitio o portfolio"
              placeholder="https://portfolio.dev"
              detail="Puedes dejarlo vacio o usar una URL valida."
              :rules="websiteRules"
            />

            <ETextfield
              v-model="form.notes"
              :cols="12"
              clearable
              counter
              :limit="160"
              label-behavior="floating"
              label="Notas para el equipo"
              placeholder="Objetivos, contexto, restricciones o ideas clave"
              detail="Aqui puedes probar contador, mensajes y clear."
              :rules="notesRules"
            />

            <ETextfield
              v-model="form.inlineLabelValue"
              :cols="12"
              label="Codigo interno"
              placeholder="TF-ALPHA-01"
              detail="Prueba label inline y ancho minimo de etiqueta."
              :rules="inlineRules"
            />
          </EForm>

          <div class="action-row">
            <EButton color="primary" @click="handleValidate"
              >Validar formulario</EButton
            >
            <EButton color="secondary" outlined @click="handleSubmit"
              >Simular submit</EButton
            >
            <EButton text @click="handleReset">Restablecer</EButton>
          </div>
        </ECard>
      </ECol>

      <ECol :cols="12" :lg="4">
        <div class="sidebar-stack">
          <ECard class="form-card" elevation="sm">
            <p class="section-kicker">Estado</p>
            <h2>Resumen vivo</h2>

            <div class="summary-grid">
              <div>
                <span>Validez</span>
                <strong>{{
                  formValid ? "Valido" : "Con errores o incompleto"
                }}</strong>
              </div>
              <div>
                <span>Nombre</span>
                <strong>{{ form.fullName || "Sin definir" }}</strong>
              </div>
              <div>
                <span>Email</span>
                <strong>{{ form.email || "Sin definir" }}</strong>
              </div>
              <div>
                <span>Longitud notas</span>
                <strong>{{ form.notes.length }} / 160</strong>
              </div>
            </div>

            <div
              class="feedback"
              :class="submitState.kind ? `feedback--${submitState.kind}` : ''"
            >
              {{ submitState.message }}
            </div>
          </ECard>

          <ECard class="form-card" elevation="sm">
            <p class="section-kicker">Payload</p>
            <h2>Datos actuales</h2>
            <pre class="payload-preview">{{ payloadPreview }}</pre>
          </ECard>

          <ECard class="form-card" elevation="sm">
            <p class="section-kicker">Eventos</p>
            <h2>Traza del textfield</h2>
            <p class="event-note">
              El campo <strong>Identificador publico</strong> registra `input`,
              `change`, `keydown`, `keyup` y `keydown:enter`.
            </p>
            <div class="event-log">
              <div
                v-for="entry in eventLog"
                :key="entry.id"
                class="event-log__item"
              >
                <strong>{{ entry.name }}</strong>
                <span>{{ entry.summary }}</span>
              </div>
            </div>
          </ECard>
        </div>
      </ECol>
    </ERow>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";

import EButton from "../../src/components/button/index.vue";
import ECard from "../../src/components/card/index.vue";
import EForm from "../../src/components/form/form.vue";
import ETextfield from "../../src/components/form/textfield/index.vue";
import ECol from "../../src/components/grid/col.vue";
import ERow from "../../src/components/grid/row.vue";

type DemoFormModel = {
  fullName: string;
  email: string;
  company: string;
  hourlyRate: string | number;
  username: string;
  phone: string;
  website: string;
  notes: string;
  inlineLabelValue: string;
};

type SubmitState = {
  kind: "success" | "warning" | "idle";
  message: string;
};

type TextFieldValue = string | number | null;

type TextFieldValueEventPayload<EventType extends Event = Event> = {
  rawValue: string;
  value: TextFieldValue;
  event: EventType;
};

type TextFieldKeyEventPayload = {
  rawValue: string;
  value: TextFieldValue;
  event: KeyboardEvent;
};

type EventLogEntry = {
  id: number;
  name: string;
  summary: string;
};

type FormInstance = {
  validate?: () => Promise<boolean>;
  reset?: () => void;
};

const createInitialForm = (): DemoFormModel => ({
  fullName: "",
  email: "",
  company: "",
  hourlyRate: "",
  username: "",
  phone: "",
  website: "",
  notes: "",
  inlineLabelValue: "",
});

const formRef = ref<FormInstance | null>(null);
const formValid = ref(false);
const form = reactive<DemoFormModel>(createInitialForm());
const eventSequence = ref(0);
const eventLog = ref<Array<EventLogEntry>>([]);
const submitState = reactive<SubmitState>({
  kind: "idle",
  message:
    "Completa el formulario y usa validar o submit para probar el flujo.",
});

const pushEvent = (name: string, payload: TextFieldValueEventPayload): void => {
  eventSequence.value += 1;
  eventLog.value = [
    {
      id: eventSequence.value,
      name,
      summary: `raw="${payload.rawValue}" value="${payload.value ?? ""}"`,
    },
    ...eventLog.value,
  ].slice(0, 8);
};

const pushKeyboardEvent = (
  name: string,
  payload: TextFieldKeyEventPayload,
): void => {
  eventSequence.value += 1;
  eventLog.value = [
    {
      id: eventSequence.value,
      name,
      summary: `key="${payload.event.key}" raw="${payload.rawValue}" value="${payload.value ?? ""}"`,
    },
    ...eventLog.value,
  ].slice(0, 8);
};

const requiredText = (value: unknown) => {
  return `${value ?? ""}`.trim().length > 0 || "Este campo es obligatorio.";
};

const validEmail = (value: unknown) => {
  return (
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(`${value ?? ""}`) ||
    "Ingresa un email valido."
  );
};

const minNameLength = (value: unknown) => {
  return `${value ?? ""}`.trim().length >= 3 || "Usa al menos 3 caracteres.";
};

const validRate = (value: unknown) => {
  return (
    /^\d{2,4}$/.test(`${value ?? ""}`) ||
    "Ingresa un numero entre 2 y 4 digitos."
  );
};

const validUsername = (value: unknown) => {
  return (
    /^@[a-z0-9-_.]*$/.test(`@${`${value ?? ""}`.replace(/^@/, "")}`) ||
    "Usa solo letras, numeros, guiones o puntos."
  );
};

const validPhone = (value: unknown) => {
  return (
    /^[+\d\s()-]{8,20}$/.test(`${value ?? ""}`) || "Ingresa un telefono valido."
  );
};

const validWebsite = (value: unknown) => {
  const normalized = `${value ?? ""}`.trim();
  if (!normalized) return true;

  try {
    new URL(normalized);
    return true;
  } catch {
    return "Ingresa una URL valida incluyendo http:// o https://.";
  }
};

const maxNotesLength = (value: unknown) => {
  return (
    `${value ?? ""}`.length <= 160 ||
    "El mensaje no puede superar 160 caracteres."
  );
};

const alphaDashCode = (value: unknown) => {
  return (
    /^[A-Z0-9-]{4,24}$/.test(`${value ?? ""}`) ||
    "Usa mayusculas, numeros y guiones."
  );
};

const nameRules = [requiredText, minNameLength];
const emailRules = [requiredText, validEmail];
const companyRules = [requiredText];
const rateRules = [requiredText, validRate];
const usernameRules = [requiredText, validUsername];
const phoneRules = [requiredText, validPhone];
const websiteRules = [validWebsite];
const notesRules = [maxNotesLength];
const inlineRules = [requiredText, alphaDashCode];

const payloadPreview = computed(() => {
  return JSON.stringify(form, null, 2);
});

const handleValidate = async (): Promise<void> => {
  const valid = (await formRef.value?.validate?.()) ?? false;

  submitState.kind = valid ? "success" : "warning";
  submitState.message = valid
    ? "Todo esta listo. El formulario paso la validacion interna."
    : "Todavia hay campos pendientes o con errores. Revisa los mensajes debajo de cada control.";
};

const handleSubmit = async (): Promise<void> => {
  const valid = (await formRef.value?.validate?.()) ?? false;

  submitState.kind = valid ? "success" : "warning";
  submitState.message = valid
    ? `Submit simulado correctamente para ${form.fullName || "el usuario actual"}.`
    : "No se puede enviar hasta que el formulario sea valido.";
};

const handleReset = (): void => {
  Object.assign(form, createInitialForm());
  formRef.value?.reset?.();
  formValid.value = false;
  submitState.kind = "idle";
  submitState.message =
    "Formulario restablecido. Ya puedes probar de nuevo el flujo completo.";
};
</script>

<style scoped>
.form-playground {
  display: grid;
  gap: 24px;
  padding: 24px;
}

.form-playground__hero {
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

.form-playground__hero h1,
.form-card h2 {
  color: #172033;
  margin: 0;
}

.hero-copy {
  color: #596579;
  line-height: 1.6;
  margin: 0;
}

.form-card {
  border: 1px solid rgba(23, 32, 51, 0.08);
  border-radius: 20px;
  padding: 24px;
}

.form-card__header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.status-pill {
  background: rgba(91, 107, 138, 0.12);
  border-radius: 999px;
  color: #40506f;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 14px;
  white-space: nowrap;
}

.status-pill--valid {
  background: rgba(42, 138, 90, 0.14);
  color: #1f7a4d;
}

.status-pill--invalid {
  background: rgba(196, 116, 37, 0.14);
  color: #a55b1b;
}

.demo-form {
  display: grid;
  gap: 12px;
}

.action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}

.sidebar-stack {
  display: grid;
  gap: 16px;
}

.summary-grid {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 18px;
}

.summary-grid span {
  color: #69758b;
  display: block;
  font-size: 12px;
  margin-bottom: 4px;
  text-transform: uppercase;
}

.summary-grid strong {
  color: #172033;
  font-size: 14px;
}

.feedback {
  background: #f3f5f8;
  border-radius: 14px;
  color: #526075;
  line-height: 1.5;
  margin-top: 20px;
  padding: 14px 16px;
}

.feedback--success {
  background: rgba(42, 138, 90, 0.1);
  color: #1f7a4d;
}

.feedback--warning {
  background: rgba(196, 116, 37, 0.12);
  color: #9b5317;
}

.payload-preview {
  background: #111827;
  border-radius: 16px;
  color: #d9e2f1;
  font-size: 12px;
  line-height: 1.55;
  margin: 18px 0 0;
  overflow: auto;
  padding: 16px;
}

.event-note {
  color: #5f6f86;
  line-height: 1.5;
  margin: 16px 0 12px;
}

.event-log {
  display: grid;
  gap: 10px;
}

.event-log__item {
  background: #f6f8fb;
  border-radius: 12px;
  color: #40506f;
  display: grid;
  gap: 4px;
  padding: 12px 14px;
}

.event-log__item strong {
  color: #172033;
  font-size: 13px;
}

.event-log__item span {
  font-family: Consolas, "Courier New", monospace;
  font-size: 12px;
}

@media (max-width: 960px) {
  .form-playground {
    padding: 16px;
  }

  .form-card {
    padding: 18px;
  }

  .form-card__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
