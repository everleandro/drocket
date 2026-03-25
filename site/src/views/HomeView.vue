<template>
  <section class="home-view">
    <ERow dense class="hero-section">
      <ECol :cols="12" :lg="7">
        <div class="hero-copy">
          <p class="eyebrow">Drocket documentation</p>
          <h1>Una portada útil para empezar a documentar la librería con ejemplos reales.</h1>
          <p class="hero-text">
            Este primer paso cubre solo la base del sistema: layout, acciones,
            formularios y feedback. La página principal ya funciona como landing,
            resumen del alcance y playground vivo.
          </p>

          <div class="hero-chip-row">
            <EChip v-for="item in heroTags" :key="item" size="small" selected>
              {{ item }}
            </EChip>
          </div>

          <div class="hero-actions">
            <EButton color="primary" :append-icon="iconFactory.arrowRight" @click="scrollTo('live-examples')">
              Ver ejemplos live
            </EButton>
            <EButton text rounded :prepend-icon="iconFactory.gitHub" @click="openRepository">
              Ver repositorio
            </EButton>
          </div>
        </div>
      </ECol>

      <ECol :cols="12" :lg="5">
        <ECard class="hero-preview" elevation="lg">
          <ECardContainer>
            <div class="hero-preview__header">
              <div>
                <p class="eyebrow">Preview</p>
                <h2>Layout + grid + quick actions</h2>
              </div>
              <EChip color="primary" size="small" selected>live</EChip>
            </div>

            <div class="hero-preview__bar">
              <EIcon :icon="iconFactory.logo" color="primary" />
              <span>docs shell</span>
              <EChip size="small">layout</EChip>
            </div>

            <ERow dense class="hero-preview__grid">
              <ECol :cols="8">
                <div class="hero-preview__panel hero-preview__panel--featured">
                  <strong>Hero content</strong>
                  <span>Introducción, CTA y navegación a ejemplos.</span>
                </div>
              </ECol>
              <ECol :cols="4">
                <div class="hero-preview__panel">
                  <EIcon :icon="iconFactory.cog" color="secondary" />
                  <span>layout</span>
                </div>
              </ECol>
              <ECol :cols="4">
                <div class="hero-preview__panel">
                  <EIcon :icon="iconFactory.form" color="warning" />
                  <span>form</span>
                </div>
              </ECol>
              <ECol :cols="4">
                <div class="hero-preview__panel">
                  <EIcon :icon="iconFactory.calendar" color="success" />
                  <span>date</span>
                </div>
              </ECol>
              <ECol :cols="4">
                <div class="hero-preview__panel">
                  <EIcon :icon="iconFactory.alertBox" color="error" />
                  <span>dialog</span>
                </div>
              </ECol>
            </ERow>
          </ECardContainer>
        </ECard>
      </ECol>
    </ERow>

    <section id="scope" class="home-section">
      <div class="section-heading">
        <p class="eyebrow">Scope</p>
        <h2>Qué entra en esta primera documentación</h2>
        <p>
          Por ahora solo documentaremos `button`, `chip`, `date-picker`, `dialog`,
          `expansion`, `grid`, `icon`, `layout`, `form`, `textfield`, `select` y `time-picker`.
        </p>
      </div>

      <ERow dense>
        <ECol v-for="group in scopeGroups" :key="group.title" :cols="12" :md="6" :lg="3">
          <ECard class="scope-card" elevation="sm">
            <ECardContainer>
              <div class="scope-card__header">
                <EIcon :icon="group.icon" color="primary" />
                <h3>{{ group.title }}</h3>
              </div>
              <p>{{ group.description }}</p>
              <div class="scope-card__chips">
                <EChip v-for="item in group.items" :key="item" size="small">
                  {{ item }}
                </EChip>
              </div>
            </ECardContainer>
          </ECard>
        </ECol>
      </ERow>
    </section>

    <section id="live-examples" class="home-section">
      <div class="section-heading">
        <p class="eyebrow">Live examples</p>
        <h2>Los componentes ya se pueden probar en la portada</h2>
        <p>
          La intención es que esta página sirva como referencia rápida antes de abrir
          una documentación individual por componente.
        </p>
      </div>

      <ERow dense class="demo-grid">
        <ECol :cols="12" :lg="6">
          <ECard id="actions-demo" class="demo-card" elevation="sm">
            <ECardContainer>
              <div class="demo-card__header">
                <div>
                  <p class="eyebrow">Actions</p>
                  <h3>Button + icon</h3>
                </div>
                <EIcon :icon="iconFactory.arrowRight" color="primary" />
              </div>

              <p>
                Combinaciones básicas de botones y el set inicial de iconos de la app.
              </p>

              <div class="button-row">
                <EButton color="primary">Primary</EButton>
                <EButton outlined color="secondary">Outlined</EButton>
                <EButton text rounded :prepend-icon="iconFactory.arrowLeft">Back</EButton>
              </div>

              <div class="icon-row">
                <EIcon :icon="iconFactory.logo" />
                <EIcon :icon="iconFactory.arrowRight" color="primary" large />
                <EIcon :icon="iconFactory.cog" color="warning" x-large />
                <EIcon :icon="iconFactory.gitHub" color="secondary" />
              </div>
            </ECardContainer>
          </ECard>
        </ECol>

        <ECol :cols="12" :lg="6">
          <ECard id="feedback-demo" class="demo-card" elevation="sm">
            <ECardContainer>
              <div class="demo-card__header">
                <div>
                  <p class="eyebrow">Feedback</p>
                  <h3>Chip + expansion</h3>
                </div>
                <EChip color="secondary" size="small" selected>{{ chipSummary }}</EChip>
              </div>

              <p>Los chips ayudan a filtrar y los panels permiten explicar patrones rápidos.</p>

              <div class="chip-row">
                <EChip
                  v-for="item in filterChips"
                  :key="item"
                  clickable
                  :selected="activeFilters.includes(item)"
                  :color="activeFilters.includes(item) ? 'primary' : undefined"
                  @click="toggleFilter(item)"
                >
                  {{ item }}
                </EChip>
              </div>

              <EExpansionPanels accordion>
                <EExpansionPanel header-title="Layout shell">
                  `EApp`, `EBar`, `EDrawer` y `EMain` ya están conectados para soportar esta home.
                </EExpansionPanel>
                <EExpansionPanel header-title="Documentación guiada">
                  Esta portada resume alcance, ejemplos live y próximos componentes por aislar.
                </EExpansionPanel>
                <EExpansionPanel header-title="Roadmap inmediato" :toggle-icon="iconFactory.menuDown">
                  El siguiente paso natural es crear páginas individuales por componente usando esta misma base visual.
                </EExpansionPanel>
              </EExpansionPanels>
            </ECardContainer>
          </ECard>
        </ECol>

        <ECol :cols="12" :lg="6">
          <ECard id="forms-demo" class="demo-card" elevation="sm">
            <ECardContainer>
              <div class="demo-card__header">
                <div>
                  <p class="eyebrow">Forms</p>
                  <h3>Form + textfield + select + time picker</h3>
                </div>
                <EChip :color="formIsValid ? 'success' : 'warning'" size="small" selected>
                  {{ formIsValid ? 'valid' : 'draft' }}
                </EChip>
              </div>

              <p>Una demo compacta con validacion, labels flotantes, selects tipados y captura de hora.</p>

              <EForm v-model="formIsValid" outlined label-behavior="floating" field-color="primary" dense>
                <ETextfield
                  v-model.trim="formState.title"
                  :cols="12"
                  :md="6"
                  label="Doc title"
                  placeholder="Quick start"
                  clearable
                  detail="Visible in the hero section"
                  :rules="titleRules"
                />

                <ETextfield
                  v-model.trim="formState.slug"
                  :cols="12"
                  :md="6"
                  label="Slug"
                  placeholder="getting-started"
                  prefix="/"
                  clearable
                  :rules="slugRules"
                />

                <ESelect
                  v-model="formState.component"
                  :cols="12"
                  :md="6"
                  label="Start with"
                  clearable
                  :items="componentOptions"
                  :rules="componentRules"
                />

                <ESelect
                  v-model="formState.tone"
                  :cols="12"
                  :md="6"
                  label="Tone"
                  clearable
                  :items="toneOptions"
                />

                <ETimePicker
                  v-model="reviewTime"
                  :cols="12"
                  :md="6"
                  label="Review time"
                  :minutes-step="5"
                  detail="Segmented input with keyboard navigation and menu steps."
                />
              </EForm>
            </ECardContainer>
          </ECard>
        </ECol>

        <ECol :cols="12" :lg="6">
          <ECard id="calendar-demo" class="demo-card" elevation="sm">
            <ECardContainer>
              <div class="demo-card__header">
                <div>
                  <p class="eyebrow">Calendar</p>
                  <h3>Date picker + dialog</h3>
                </div>
                <EButton text rounded :prepend-icon="iconFactory.calendar" @click="dateDialog = true">
                  Open dialog
                </EButton>
              </div>

              <p>El selector de fecha puede vivir inline o dentro de un diálogo de flujo corto.</p>

              <EDatePicker v-model="selectedDate" color="primary" :highlighted="highlightedDates" />

              <div class="date-summary">
                <EChip color="primary" size="small" selected>{{ formattedSelectedDate }}</EChip>
                <EButton color="secondary" @click="dialogOpen = true">Open announcement</EButton>
              </div>
            </ECardContainer>
          </ECard>
        </ECol>
      </ERow>
    </section>

    <EDialog v-model="dialogOpen" :max-width="520" elevation="xl">
      <div class="dialog-sheet">
        <h3>Documentation milestone</h3>
        <p>
          La portada ya presenta ejemplos vivos de los componentes iniciales y deja listo
          el layout para seguir con páginas individuales.
        </p>
        <div class="dialog-sheet__meta">
          <EChip size="small" selected>{{ formattedSelectedDate }}</EChip>
          <EChip size="small">{{ formState.component || 'choose a component' }}</EChip>
        </div>
        <div class="dialog-sheet__actions">
          <EButton text @click="dialogOpen = false">Close</EButton>
          <EButton color="primary" @click="dialogOpen = false">Continue</EButton>
        </div>
      </div>
    </EDialog>

    <EDialog v-model="dateDialog" elevation="xl">
      <ECard>
        <ECardContainer>
          <EDatePicker v-model="dialogDate" landscape color="secondary" close-on-change />
        </ECardContainer>
      </ECard>
    </EDialog>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";

import { iconFactory } from "../icons";

const heroTags = ["layout shell", "live demos", "phase one scope"];
const filterChips = ["button", "form", "dialog", "grid"];
const activeFilters = ref<string[]>(["button", "form"]);
const dialogOpen = ref(false);
const dateDialog = ref(false);
const selectedDate = ref(new Date());
const dialogDate = ref(new Date());
const formIsValid = ref(false);
const reviewTime = ref(new Date());

const formState = reactive({
  title: "Home page",
  slug: "getting-started",
  component: "button",
  tone: "direct",
});

const highlightedDates = [
  new Date(),
  new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2),
];

const scopeGroups = [
  {
    title: "Actions",
    description: "Base visual actions and compact feedback components.",
    icon: iconFactory.arrowRight,
    items: ["button", "chip", "icon"],
  },
  {
    title: "Feedback",
    description: "Overlays and collapsible content for guided flows.",
    icon: iconFactory.alertBox,
    items: ["dialog", "expansion"],
  },
  {
    title: "Layout",
    description: "Application shell and responsive composition primitives.",
    icon: iconFactory.logo,
    items: ["layout", "grid"],
  },
  {
    title: "Forms",
    description: "Field foundation for input-heavy documentation pages.",
    icon: iconFactory.form,
    items: ["form", "textfield", "select", "time-picker", "date-picker"],
  },
];

const componentOptions = [
  { text: "Button", value: "button" },
  { text: "Dialog", value: "dialog" },
  { text: "Grid", value: "grid" },
  { text: "Textfield", value: "textfield" },
  { text: "Select", value: "select" },
];

const toneOptions = [
  { text: "Direct", value: "direct" },
  { text: "Technical", value: "technical" },
  { text: "Concise", value: "concise" },
];

const titleRules = [
  (value: string | number | null) =>
    typeof value === "string" && value.trim().length >= 3 ? true : "Use at least 3 characters",
];

const slugRules = [
  (value: string | number | null) =>
    typeof value === "string" && /^[a-z0-9-]+$/.test(value)
      ? true
      : "Use lowercase letters, numbers and hyphens",
];

const componentRules = [
  (value: string | number | null) => (value ? true : "Select a component"),
];

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const chipSummary = computed(() => `${activeFilters.value.length} filters active`);
const formattedSelectedDate = computed(() => dateFormatter.format(selectedDate.value));

const toggleFilter = (value: string): void => {
  if (activeFilters.value.includes(value)) {
    activeFilters.value = activeFilters.value.filter((item) => item !== value);
    return;
  }

  activeFilters.value = [...activeFilters.value, value];
};

const scrollTo = (id: string): void => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const openRepository = (): void => {
  window.open("https://github.com/everleandro/drocket", "_blank", "noopener,noreferrer");
};
</script>

<style scoped>
.home-view {
  display: grid;
  gap: 32px;
  padding: 12px 0 48px;
}

.hero-section {
  align-items: stretch;
}

.hero-copy,
.hero-preview,
.scope-card,
.demo-card {
  height: 100%;
}

.hero-copy {
  display: grid;
  gap: 18px;
  padding: 32px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 28px;
  background:
    radial-gradient(circle at top left, rgba(255, 191, 105, 0.24), transparent 40%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(248, 250, 252, 0.92));
}

.eyebrow {
  margin: 0;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #a44a15;
}

h1,
h2,
h3,
p {
  margin: 0;
}

h1,
h2,
h3 {
  font-family: "Avenir Next", "IBM Plex Sans", "Segoe UI", sans-serif;
}

h1 {
  font-size: clamp(2.4rem, 4vw, 4.4rem);
  line-height: 0.96;
  max-width: 11ch;
}

.hero-text,
.section-heading p,
.scope-card p,
.demo-card p,
.dialog-sheet p {
  color: rgba(15, 23, 42, 0.72);
  line-height: 1.6;
}

.hero-chip-row,
.hero-actions,
.button-row,
.icon-row,
.chip-row,
.date-summary,
.dialog-sheet__meta,
.dialog-sheet__actions,
.scope-card__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.hero-preview :deep(.e-card),
.scope-card :deep(.e-card),
.demo-card :deep(.e-card) {
  height: 100%;
}

.hero-preview :deep(.e-card__container),
.scope-card :deep(.e-card__container),
.demo-card :deep(.e-card__container) {
  display: grid;
  gap: 18px;
}

.hero-preview {
  border-radius: 28px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(245, 247, 250, 0.94)),
    linear-gradient(135deg, rgba(12, 74, 110, 0.12), rgba(59, 130, 246, 0.06));
}

.hero-preview__header,
.demo-card__header,
.scope-card__header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
}

.hero-preview__bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.04);
}

.hero-preview__grid {
  margin: 0;
}

.hero-preview__panel {
  display: grid;
  gap: 8px;
  min-height: 96px;
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(15, 23, 42, 0.06);
}

.hero-preview__panel--featured {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.16), rgba(255, 255, 255, 0.9));
}

.home-section {
  display: grid;
  gap: 20px;
}

.section-heading {
  display: grid;
  gap: 10px;
  max-width: 64ch;
}

.section-heading h2 {
  font-size: clamp(1.8rem, 2.6vw, 2.8rem);
}

.scope-card__header h3 {
  font-size: 1.1rem;
}

.demo-grid,
.demo-grid :deep(.e-col) {
  align-items: stretch;
}

.demo-card {
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.95);
}

.icon-row {
  align-items: center;
}

.dialog-sheet {
  display: grid;
  gap: 18px;
  padding: 24px;
  min-width: min(520px, 88vw);
}

.date-summary {
  justify-content: space-between;
  align-items: center;
}

@media (max-width: 960px) {
  .hero-copy {
    padding: 24px;
  }

  h1 {
    max-width: none;
  }
}

@media (max-width: 640px) {
  .home-view {
    gap: 24px;
  }

  .hero-copy {
    padding: 20px;
    border-radius: 22px;
  }

  .hero-actions,
  .date-summary,
  .dialog-sheet__actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
