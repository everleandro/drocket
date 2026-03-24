<template>
    <section class="form-playground">
        <div class="form-playground__hero">
            <p class="eyebrow">Playground</p>
            <h1>Form Playground</h1>
            <p class="hero-copy">
                Esta vista concentra pruebas de <strong>ETextfield</strong> y
                <strong>ESelect</strong> para iterar validacion, foco, detalles,
                clear y estados visuales sin mezclar otros componentes.
            </p>
        </div>

        <ERow dense>
            <ECol :cols="12" :lg="8">
                <ECard class="form-card secondary--text" elevation="md">
                    <div class="form-card__header">
                        <div>
                            <p class="section-kicker">Demo integrada</p>
                            <h2 class="secondary--text">Suite de textfields</h2>
                        </div>
                        <div class="status-pill" :class="formValid ? 'status-pill--valid' : 'status-pill--invalid'">
                            {{ formValid ? "Formulario valido" : "Pendiente de validacion" }}
                        </div>
                    </div>

                    <EForm ref="formRef" label-behavior="floating" v-model="formValid" class="demo-form"
                        field-color="cyan-800" label-min-width="136" dense @submit="handleSubmit">
                        <ETextfield v-model.trim="form.fullName" label-behavior="floating" :cols="12" :md="6" clearable
                            label="Nombre completo" placeholder="Ada Lovelace"
                            detail="Se usa para personalizar la experiencia." :rules="nameRules" />

                        <ETextfield v-model.trim="form.email" label-behavior="floating" :cols="12" :md="6" clearable
                            label="Email de trabajo" placeholder="ada@analytical.engine" autocomplete="email"
                            detail="Te enviaremos confirmaciones y alertas importantes." :rules="emailRules" />

                        <ETextfield v-model="form.company" :cols="12" :md="6" label="Empresa o equipo"
                            placeholder="Analytical Engines Lab" prepend-icon=""
                            detail="Prueba label, helper message y comportamiento ." :rules="companyRules" />

                        <ETextfield v-model.number="form.hourlyRate" :cols="12" :md="6" label="Tarifa esperada"
                            prefix="$" suffix="USD" placeholder="120" detail="Solo numeros, sin separadores."
                            :rules="rateRules" />

                        <ETextfield v-model="form.username" :cols="12" clearable label="Identificador publico"
                            prefix="@" placeholder="ada-l" detail="Debe ser unico y sin espacios."
                            :rules="usernameRules" @input="pushEvent('input', $event)"
                            @change="pushEvent('change', $event)" @keydown="pushKeyboardEvent('keydown', $event)"
                            @keyup="pushKeyboardEvent('keyup', $event)"
                            @keydown:enter="pushKeyboardEvent('keydown:enter', $event)" />

                        <ETextfield v-model="form.phone" :cols="12" :md="6" clearable label="Telefono"
                            placeholder="+34 600 000 000" detail="Ejemplo de mascara libre con validacion simple."
                            :rules="phoneRules" />

                        <ETextfield v-model="form.website" :cols="12" :md="6" clearable label="Sitio o portfolio"
                            placeholder="https://portfolio.dev" detail="Puedes dejarlo vacio o usar una URL valida."
                            :rules="websiteRules" />

                        <ETextfield v-model="form.notes" :cols="12" clearable counter :limit="160"
                            label-behavior="floating" label="Notas para el equipo"
                            placeholder="Objetivos, contexto, restricciones o ideas clave"
                            detail="Aqui puedes probar contador, mensajes y clear." :rules="notesRules" />

                        <ETextfield v-model="form.inlineLabelValue" :cols="12" label="Codigo interno"
                            placeholder="TF-ALPHA-01" detail="Prueba label inline y ancho minimo de etiqueta."
                            :rules="inlineRules" />
                    </EForm>

                    <div class="action-row">
                        <EButton color="primary" @click="handleValidate">Validar formulario</EButton>
                        <EButton color="secondary" outlined @click="handleSubmit">Simular submit</EButton>
                        <EButton text @click="handleReset">Restablecer</EButton>
                    </div>

                    <div class="select-lab">
                        <div class="select-lab__header">
                            <div>
                                <p class="section-kicker">Select</p>
                                <h2>Casos base para ESelect</h2>
                            </div>
                            <p class="table-lab__copy">
                                Esta seccion agrega un punto de partida para trabajar el
                                componente con seleccion simple, multiple con chips y
                                autocomplete filtrado en vivo.
                            </p>
                        </div>

                        <EForm class="select-demo-form" field-color="teal-900" dense>
                            <ESelect v-model="selectState.role" :cols="12" :md="6" clearable label="Rol principal"
                                placeholder="Selecciona un rol" detail="Seleccion simple usando items con text/value."
                                :items="roleOptions" />

                            <ESelect v-model="selectState.stack" :cols="12" :md="6" multiple chip clearable
                                label="Stack activo" placeholder="Elige una o varias tecnologias"
                                detail="Seleccion multiple con chips y cierre individual." :items="stackOptions" />

                            <ESelect v-model="selectState.location" v-model:search="selectState.locationSearch"
                                :cols="12" autocomplete clearable label="Ubicacion del equipo"
                                placeholder="Escribe para filtrar"
                                detail="Autocomplete con filtro local usando update:search."
                                :items="filteredLocationOptions" />

                            <ESelect v-model="selectState.stack2" :cols="12" :md="6" multiple clearable
                                label="Stack activo" placeholder="Elige una o varias tecnologias"
                                detail="Seleccion multiple sin chips." :items="stackOptions2" />

                        </EForm>

                        <div class="select-lab__summary">
                            <div>
                                <span>Rol</span>
                                <strong>{{ selectedRoleLabel }}</strong>
                            </div>
                            <div>
                                <span>Stack</span>
                                <strong>{{ selectedStackLabel }}</strong>
                            </div>
                            <div>
                                <span>Ubicacion</span>
                                <strong>{{ selectedLocationLabel }}</strong>
                            </div>
                        </div>
                    </div>

                    <div class="table-lab">
                        <div class="table-lab__header">
                            <div>
                                <p class="section-kicker">Modo tabla</p>
                                <h2>Grilla con separadores de 1px</h2>
                            </div>
                            <p class="table-lab__copy">
                                Estos ejemplos usan la nueva prop <strong>table</strong> del
                                formulario. El primer bloque usa el fallback por defecto y el
                                segundo usa <strong>tableLineColor</strong> para las lineas y
                                <strong>tableCellBackgroundColor</strong> para el fondo de las celdas.
                            </p>
                        </div>

                        <div class="table-lab__grid">
                            <div class="table-lab__panel">
                                <p class="table-lab__label">Default table</p>
                                <EForm table class="table-demo-form">
                                    <ETextfield v-model="tableForm.code" :cols="12" :md="4" label="Codigo"
                                        placeholder="TB-001" />
                                    <ETextfield v-model="tableForm.description" :cols="12" :md="8" label="Descripcion"
                                        placeholder="Fila base con lineas por contraste" />
                                    <ETextfield v-model="tableForm.owner" :cols="12" :md="4" label="Owner"
                                        placeholder="Ada" />
                                    <ETextfield v-model="tableForm.status" :cols="12" :md="4" label="Estado"
                                        placeholder="Activo" color="green-700" />
                                    <ETextfield v-model="tableForm.amount" :cols="12" :md="4" label="Monto" prefix="$"
                                        placeholder="1280" />
                                </EForm>
                            </div>

                            <div class="table-lab__panel">
                                <p class="table-lab__label">Tinted table</p>
                                <EForm table table-line-color="teal-900" label-behavior="floating" disabled
                                    class="table-demo-form">
                                    <ETextfield v-model="tintedTableForm.ticket" :cols="12" :md="3" label="Ticket"
                                        placeholder="OPS-42" />
                                    <ETextfield v-model="tintedTableForm.assignee" :cols="12" :md="5"
                                        label="Responsable" placeholder="Equipo plataforma" />
                                    <ETextfield v-model="tintedTableForm.priority" :cols="12" :md="4" label="Prioridad"
                                        placeholder="Alta" retain-color />
                                    <ETextfield v-model="tintedTableForm.window" :cols="12" :md="6" label="Ventana"
                                        placeholder="09:00 - 11:00" />
                                    <ETextfield v-model="tintedTableForm.note" :cols="12" :md="6" label="Nota"
                                        placeholder="Cambiar color de fondo sin tocar la linea" />
                                </EForm>
                            </div>
                        </div>
                    </div>

                    <div class="elevation-lab">
                        <div class="elevation-lab__header">
                            <div>
                                <p class="section-kicker">Elevacion</p>
                                <h2>Sombras para el contenedor del formulario</h2>
                            </div>
                            <p class="table-lab__copy">
                                Esta seccion prueba la nueva prop <strong>elevation</strong> en
                                <strong>EForm</strong> usando la misma escala que ya existe en
                                <strong>EButton</strong> y <strong>ECard</strong>.
                            </p>
                        </div>

                        <div class="elevation-lab__grid">
                            <div v-for="example in elevationExamples" :key="example.level" class="elevation-lab__panel">
                                <div class="elevation-lab__meta">
                                    <p class="table-lab__label">{{ example.title }}</p>
                                    <span>{{ example.copy }}</span>
                                </div>

                                <EForm :elevation="example.level" class="elevation-demo-form" label-behavior="floating"
                                    gap="3">
                                    <ETextfield v-model="elevationPreview[example.level].name" :cols="12" :md="6"
                                        label="Nombre" placeholder="Ada Lovelace" />
                                    <ETextfield v-model="elevationPreview[example.level].context" :cols="12" :md="6"
                                        label="Contexto" placeholder="Shadow preview" />
                                </EForm>
                            </div>
                        </div>
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

                        <div class="feedback" :class="submitState.kind ? `feedback--${submitState.kind}` : ''">
                            {{ submitState.message }}
                        </div>
                    </ECard>

                    <ECard class="form-card" elevation="sm">
                        <p class="section-kicker">Payload</p>
                        <h2>Datos actuales</h2>
                        <pre class="payload-preview">{{ payloadPreview }}</pre>
                    </ECard>

                    <ECard class="form-card" elevation="sm">
                        <p class="section-kicker">Select state</p>
                        <h2>Estado del ejemplo</h2>
                        <pre class="payload-preview">{{ selectPreview }}</pre>
                    </ECard>

                    <ECard class="form-card" elevation="sm">
                        <p class="section-kicker">Eventos</p>
                        <h2>Traza del textfield</h2>
                        <p class="event-note">
                            El campo <strong>Identificador publico</strong> registra `input`,
                            `change`, `keydown`, `keyup` y `keydown:enter`.
                        </p>
                        <div class="event-log">
                            <div v-for="entry in eventLog" :key="entry.id" class="event-log__item">
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
import ESelect from "../../src/components/form/select/index.vue";
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

type SelectDemoModel = {
    role: string;
    stack: Array<string>;
    stack2: Array<string>;
    location: string;
    locationSearch: string;
};

type SubmitState = {
    kind: "success" | "warning" | "idle";
    message: string;
};

type TableFormModel = {
    code: string;
    description: string;
    owner: string;
    status: string;
    amount: string;
};

type TintedTableFormModel = {
    ticket: string;
    assignee: string;
    priority: string;
    window: string;
    note: string;
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

const roleOptions = [
    { text: "Frontend Engineer", value: "frontend" },
    { text: "Design Systems", value: "design-systems" },
    { text: "Platform", value: "platform" },
    { text: "Product", value: "product" },
];

const stackOptions = [
    { text: "Vue", value: "vue" },
    { text: "TypeScript", value: "typescript" },
    { text: "SCSS", value: "scss" },
    { text: "Vitest", value: "vitest" },
    { text: "Storybook", value: "storybook" },
];
const stackOptions2 = [
    { text: "Vue", value: "vue" },
    { text: "TypeScript", value: "typescript" },
    { text: "SCSS", value: "scss" },
    { text: "Vitest", value: "vitest" },
    { text: "Storybook", value: "storybook" },
    { text: "React", value: "react" },
    { text: "Angular", value: "angular" },
    { text: "Svelte", value: "svelte" },
];

const locationOptions = [
    { text: "Madrid", value: "madrid" },
    { text: "Ciudad de Mexico", value: "cdmx" },
    { text: "Bogota", value: "bogota" },
    { text: "Buenos Aires", value: "buenos-aires" },
    { text: "Remoto", value: "remote" },
];

const formRef = ref<FormInstance | null>(null);
const formValid = ref(false);
const form = reactive<DemoFormModel>(createInitialForm());
const selectState = reactive<SelectDemoModel>({
    role: "frontend",
    stack: ["vue", "typescript"],
    location: "remote",
    locationSearch: "",
});
const tableForm = reactive<TableFormModel>({
    code: "TB-001",
    description: "Separadores construidos con gap y color del contenedor.",
    owner: "Ada Lovelace",
    status: "Activo",
    amount: "1280",
});
const tintedTableForm = reactive<TintedTableFormModel>({
    ticket: "OPS-42",
    assignee: "Equipo plataforma",
    priority: "Alta",
    window: "09:00 - 11:00",
    note: "La linea usa cyan y la celda neutral-50.",
});
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

const elevationExamples = [
    {
        level: "xs",
        title: "Elevation xs",
        copy: "Separacion sutil para bloques livianos.",
    },
    {
        level: "sm",
        title: "Elevation sm",
        copy: "Buena opcion por defecto para agrupar campos.",
    },
    {
        level: "md",
        title: "Elevation md",
        copy: "Aumenta la jerarquia visual sin verse pesada.",
    },
    {
        level: "lg",
        title: "Elevation lg",
        copy: "Util para formularios protagonistas o modales.",
    },
] as const;

const elevationPreview = reactive({
    xs: {
        name: "Ada Lovelace",
        context: "Sombra minima",
    },
    sm: {
        name: "Grace Hopper",
        context: "Agrupacion estandar",
    },
    md: {
        name: "Katherine Johnson",
        context: "Jerarquia intermedia",
    },
    lg: {
        name: "Radia Perlman",
        context: "Contenedor destacado",
    },
});

const filteredLocationOptions = computed(() => {
    const query = selectState.locationSearch.trim().toLowerCase();

    if (!query) {
        return locationOptions;
    }

    return locationOptions.filter((item) =>
        item.text.toLowerCase().includes(query),
    );
});

const selectedRoleLabel = computed(() => {
    return (
        roleOptions.find((item) => item.value === selectState.role)?.text ||
        "Sin definir"
    );
});

const selectedStackLabel = computed(() => {
    return selectState.stack.length
        ? stackOptions
            .filter((item) => selectState.stack.includes(item.value))
            .map((item) => item.text)
            .join(", ")
        : "Sin definir";
});

const selectedLocationLabel = computed(() => {
    return (
        locationOptions.find((item) => item.value === selectState.location)?.text ||
        "Sin definir"
    );
});

const payloadPreview = computed(() => {
    return JSON.stringify(form, null, 2);
});

const selectPreview = computed(() => {
    return JSON.stringify(
        {
            ...selectState,
            visibleLocationOptions: filteredLocationOptions.value.map((item) => item.text),
        },
        null,
        2,
    );
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
    flex-direction: column;
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

.action-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 24px;
}

.select-lab,
.table-lab,
.elevation-lab {
    border-top: 1px solid rgba(23, 32, 51, 0.08);
    display: grid;
    gap: 18px;
    margin-top: 28px;
    padding-top: 24px;
}

.select-lab__header,
.table-lab__header,
.elevation-lab__header,
.elevation-lab__meta {
    display: grid;
    gap: 10px;
}

.select-demo-form {
    background: linear-gradient(180deg, #ffffff, #f3f8f8);
    border: 1px solid rgba(23, 32, 51, 0.08);
    border-radius: 18px;
    padding: 16px;
}

.select-lab__summary {
    display: grid;
    gap: 14px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
}

.select-lab__summary div,
.table-lab__panel {
    border: 1px solid rgba(23, 32, 51, 0.08);
    border-radius: 18px;
    padding: 16px;
}

.select-lab__summary span,
.table-lab__label,
.summary-grid span {
    color: #51617d;
    display: block;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    margin: 0 0 4px;
    text-transform: uppercase;
}

.select-lab__summary strong,
.summary-grid strong {
    color: #172033;
    font-size: 14px;
}

.table-lab__copy,
.elevation-lab__meta span,
.event-note {
    color: #5f6f86;
    line-height: 1.6;
    margin: 0;
}

.elevation-lab__grid {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.elevation-lab__panel {
    display: grid;
    gap: 12px;
}

.elevation-demo-form {
    background: linear-gradient(180deg, #ffffff, #f7f9fc);
    border-radius: 18px;
    padding: 16px;
}

.table-lab__grid {
    display: grid;
    gap: 16px;
}

.table-lab__panel {
    display: grid;
    gap: 12px;
}

.table-demo-form {
    width: 100%;
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

    .summary-grid,
    .select-lab__summary {
        grid-template-columns: 1fr;
    }

    .table-lab__panel,
    .select-lab__summary div {
        padding: 14px;
    }
}
</style>
