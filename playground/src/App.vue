<template>
  <main class="playground" :data-theme="theme">
    <header class="playground-header">
      <h1>Playground</h1>
      <button class="theme-toggle" @click="toggleTheme">
        {{ theme === "light" ? "🌙 Dark" : "☀️ Light" }}
      </button>
    </header>

    <section class="block">
      <h2>Expansion</h2>
      <div class="row  my-4">
        <EExpansionPanels accordion>
          <EExpansionPanel v-for="i in 3" :key="i" :header-title="'accordion: ' + i" color="primary">
            <div class="secondary--text">
              <code> content {{ i }} </code>
            </div>
          </EExpansionPanel>
        </EExpansionPanels>
      </div>
      <div>{{expansionModel}}</div>
      <div class="row  my-4">
        <EExpansionPanels v-model="expansionModel">
          <EExpansionPanel v-for="i in 3" :key="i" :header-title="'accordion: ' + i" color="primary" :value="i">
            <div class="secondary--text">
              <code> content {{ i }} </code>
            </div>
          </EExpansionPanel>
        </EExpansionPanels>
      </div>


    </section>

    <section class="block">
      <h2>Button</h2>
      <div class="row">
        <EButton color="primary" elevation="lg">Primary</EButton>
        <EButton color="secondary" outlined>Outlined</EButton>
        <EButton color="brand" rounded>Custom Brand</EButton>
        <EButton color="secondary" rounded>secondary</EButton>
        <EButton text rounded :prepend-icon="iconFactory.arrowLeft">Text Button</EButton>
        <EButton :prepend-icon="iconFactory.arrowLeft" color="warning">With Icon</EButton>
      </div>
    </section>

    <section class="block">
      <h2>Icon</h2>
      <div class="row">
        <EIcon :icon="iconFactory.arrowLeft" />
        <EIcon :icon="iconFactory.arrowRight" large color="primary" />
        <EIcon :icon="iconFactory.clear" x-large color="error" />
      </div>
    </section>

    <section class="block">
      <h2>Avatar</h2>

      <div class="chip-group">
        <h3>Preset sizes</h3>
        <div class="row">
          <EAvatar size="x-small" />
          <EAvatar size="small" color="primary" />
          <EAvatar size="default" color="secondary" />
          <EAvatar size="large" color="success" />
          <EAvatar size="x-large" color="warning" />
        </div>
      </div>

      <div class="chip-group">
        <h3>Content modes</h3>
        <div class="row">
          <EAvatar />
          <EAvatar :icon="iconFactory.clear" color="error" />
          <EAvatar src="https://i.pravatar.cc/64?img=15" />
          <EAvatar src="https://i.pravatar.cc/64?img=32" elevation="lg" />
          <EAvatar size="44" color="brand" />
        </div>
      </div>
    </section>

    <section class="block">
      <h2>Dialog</h2>
      <div class="row">
        <EButton color="primary" @click="dialogDefault = true">Open Default</EButton>
        <EButton color="secondary" @click="dialogFluid = true">Open Fluid</EButton>
        <EButton color="secondary" outlined @click="dialogPersistent = true">Open Persistent</EButton>
        <EButton color="brand" @click="dialogFullscreen = true">Open Fullscreen</EButton>
        <EButton color="success" @click="dialogParent = true">Open Nested</EButton>
      </div>

      <EDialog v-model="dialogDefault" :max-width="520" elevation="xl">
        <div class="dialog-card">
          <h3>Default Dialog</h3>
          <p>This is a standard dialog. Click outside or press ESC to close.</p>
          <div class="dialog-actions">
            <EButton text @click="dialogDefault = false">Cancel</EButton>
            <EButton color="primary" @click="dialogDefault = false">Confirm</EButton>
          </div>
        </div>
      </EDialog>

      <EDialog v-model="dialogFluid" fluid elevation="xl">
        <div class="dialog-card">
          <h3>Fluid Dialog</h3>
          <p>This dialog keeps full width, unlike the default fit-content behavior.</p>
          <div class="dialog-actions">
            <EButton text @click="dialogFluid = false">Close</EButton>
          </div>
        </div>
      </EDialog>

      <EDialog v-model="dialogPersistent" persistent :max-width="520" elevation="xl">
        <div class="dialog-card">
          <h3>Persistent Dialog</h3>
          <p>
            This dialog ignores outside click and ESC unless you use an action.
          </p>
          <div class="dialog-actions">
            <EButton text @click="dialogPersistent = false">Close</EButton>
            <EButton color="warning" @click="dialogPersistent = false">Understood</EButton>
          </div>
        </div>
      </EDialog>

      <EDialog v-model="dialogFullscreen" fullscreen>
        <div class="dialog-fullscreen-content">
          <h3>Fullscreen Dialog</h3>
          <p>Useful for long forms or mobile-friendly full-screen flows.</p>
          <EButton color="primary" @click="dialogFullscreen = false">Close Fullscreen</EButton>
        </div>
      </EDialog>

      <EDialog v-model="dialogParent" :max-width="600" elevation="xl">
        <div class="dialog-card">
          <h3>Parent Dialog</h3>
          <p>
            Open the child dialog and test: press ESC or click outside. Only the
            child should close first.
          </p>
          <div class="dialog-actions">
            <EButton text @click="dialogParent = false">Close Parent</EButton>
            <EButton color="primary" @click="dialogChild = true">Open Child Dialog</EButton>
          </div>
        </div>

        <EDialog v-model="dialogChild" :max-width="440" elevation="lg">
          <div class="dialog-card dialog-card--child">
            <h3>Child Dialog</h3>
            <p>
              This is the top dialog. ESC and outside click should close only
              this one.
            </p>
            <div class="dialog-actions">
              <EButton text @click="dialogChild = false">Cancel</EButton>
              <EButton color="primary" @click="dialogChild = false">Close Child</EButton>
            </div>
          </div>
        </EDialog>
      </EDialog>
    </section>

    <section class="block">
      <h2>Date Picker</h2>

      <div class="date-picker-grid">
        <div class="date-picker-card">
          <h3>Inline Selection</h3>
          <p class="playground-note">
            Selected date: {{ formatPlaygroundDate(selectedDate) }}
          </p>
          <e-card>
            <EDatePicker v-model="selectedDate" color="primary" :highlighted="highlightedDates"
              :disabled="disabledDates" />
          </e-card>
        </div>

        <div class="date-picker-card">
          <h3>Inside Dialog</h3>
          <p class="playground-note">
            Meeting date: {{ formatPlaygroundDate(dialogDate) }}
          </p>
          <div class="row">
            <EButton color="primary" @click="dateDialog = true">Choose Date</EButton>
          </div>

          <EDialog v-model="dateDialog" elevation="xl">
            <ECard>
              <EDatePicker v-model="dialogDate" landscape color="secondary" close-on-change
                :highlighted="highlightedDates" />
            </ECard>
          </EDialog>
        </div>
      </div>
    </section>

    <section class="block">
      <h2>Chip</h2>

      <div class="chip-group">
        <h3>Sizes</h3>
        <div class="row">
          <EChip size="x-small">x-small</EChip>
          <EChip size="small">small</EChip>
          <EChip size="default">default</EChip>
          <EChip size="large">large</EChip>
          <EChip size="x-large">x-large</EChip>
        </div>
      </div>

      <div class="chip-group">
        <h3>Content</h3>
        <div class="row">
          <EChip color="primary" :prepend-icon="iconFactory.arrowLeft">With prepend</EChip>
          <EChip color="secondary" :append-icon="iconFactory.clear">With append</EChip>
          <EChip color="warning" prepend-avatar="https://i.pravatar.cc/40?img=12">Avatar chip</EChip>
          <EChip text color="success">Text chip</EChip>
          <EChip color="tertiary" closable @click:close="chipMessage = 'Closable chip closed'">Closable</EChip>
        </div>
      </div>

      <div class="chip-group">
        <h3>Interactive</h3>
        <div class="row">
          <EChip v-for="option in filterChips" :key="option.value" clickable ripple
            :selected="selectedFilters.includes(option.value)" color="primary" @click="toggleFilter(option.value)">
            {{ option.label }}
          </EChip>
        </div>
      </div>

      <div class="chip-group">
        <h3>Closable + clickable</h3>
        <div class="row">
          <EChip v-for="tag in tags" :key="tag" clickable closable color="brand" @click="chipMessage = `Clicked ${tag}`"
            @click:close="removeTag(tag)">
            {{ tag }}
          </EChip>
        </div>
      </div>

      <p class="playground-note">{{ chipMessage }}</p>
    </section>

  </main>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import EAvatar from "../../src/components/avatar.vue";
import EButton from "../../src/components/button/index.vue";
import EChip from "../../src/components/chip/index.vue";
import EDatePicker from "../../src/components/date-picker/index.vue";
import EIcon from "../../src/components/icon/index.vue";
import EDialog from "../../src/components/dialog/index.vue";
import ECard from "../../src/components/card/index.vue";
import EDivider from "../../src/components/layout/divider.vue";
import EExpansionPanel from "../../src/components/expansion/panel.vue";
import EExpansionPanels from "../../src/components/expansion/panels.vue";
import iconFactory from "../../src/utils/icons";

const theme = ref("light");
const expansionModel = ref([]);
const dialogDefault = ref(false);
const dialogFluid = ref(false);
const dialogPersistent = ref(false);
const dialogFullscreen = ref(false);
const dialogParent = ref(false);
const dialogChild = ref(false);
const dateDialog = ref(false);
const selectedDate = ref(new Date(2026, 2, 14));
const dialogDate = ref(new Date(2026, 2, 21));
const selectedFilters = ref(["vue", "scss"]);
const tags = ref(["Vue 3", "TypeScript", "SCSS", "Autocomplete"]);
const chipMessage = ref("Try the chip interactions below.");

const highlightedDates = {
  from: new Date(2026, 2, 18),
  to: new Date(2026, 2, 22),
};

const disabledDates = {
  days: [0, 6],
  dates: [new Date(2026, 2, 17)],
};

const filterChips = [
  { label: "Vue", value: "vue" },
  { label: "TypeScript", value: "typescript" },
  { label: "SCSS", value: "scss" },
  { label: "A11y", value: "a11y" },
];

watch(dialogParent, (value) => {
  if (!value) {
    dialogChild.value = false;
  }
});

const toggleFilter = (value) => {
  selectedFilters.value = selectedFilters.value.includes(value)
    ? selectedFilters.value.filter((current) => current !== value)
    : [...selectedFilters.value, value];

  chipMessage.value = `Selected filters: ${selectedFilters.value.join(", ") || "none"}`;
};

const removeTag = (tag) => {
  tags.value = tags.value.filter((current) => current !== tag);
  chipMessage.value = `Removed ${tag}`;
};

const formatPlaygroundDate = (value) => {
  if (!value) {
    return "No date selected";
  }

  const date = value instanceof Date ? value : new Date(value);

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const toggleTheme = () => {
  theme.value = theme.value === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", theme.value);
  localStorage.setItem("playground-theme", theme.value);
};

onMounted(() => {
  // Restore saved theme or use system preference
  const saved = localStorage.getItem("playground-theme");
  if (saved) {
    theme.value = saved;
  } else {
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    theme.value = systemDark ? "dark" : "light";
  }
  document.documentElement.setAttribute("data-theme", theme.value);
});
</script>

<style scoped>
.playground {
  min-height: 100vh;
  padding: 24px;
  background: linear-gradient(135deg, #f7f9fb, #eef4ff);
  transition: background 0.3s ease;
}

.playground[data-theme="dark"] {
  background: linear-gradient(135deg, #121212, #1e1e1e);
}

.playground-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.playground-header h1 {
  margin: 0;
  color: #333;
}

.playground[data-theme="dark"] .playground-header h1 {
  color: #fafafa;
}

.theme-toggle {
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  color: #333;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.playground[data-theme="dark"] .theme-toggle {
  background: #2a2a2a;
  border-color: #444;
  color: #fafafa;
}

.theme-toggle:hover {
  opacity: 0.8;
}

.block {
  margin-bottom: 24px;
  padding: 16px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  transition:
    background,
    box-shadow 0.3s ease;
}

.playground[data-theme="dark"] .block {
  background: #2a2a2a;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

.block h2 {
  color: #333;
  margin-top: 0;
}

.block h3 {
  margin: 0 0 12px;
  color: #4a5568;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.playground[data-theme="dark"] .block h2 {
  color: #fafafa;
}

.playground[data-theme="dark"] .block h3 {
  color: #cbd5e0;
}

.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.chip-group+.chip-group {
  margin-top: 20px;
}

.playground-note {
  margin: 20px 0 0;
  color: #4a5568;
  font-size: 14px;
}

.playground[data-theme="dark"] .playground-note {
  color: #e2e8f0;
}

.dialog-card {
  background: var(--e-color-surface-1, #fff);
  color: var(--e-contrast-surface-1, #222);
  border-radius: 14px;
  padding: 20px;
  min-width: 320px;
}

.dialog-card h3 {
  margin: 0 0 8px;
}

.dialog-card p {
  margin: 0 0 16px;
  line-height: 1.45;
}

.dialog-card--child {
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.dialog-card--datepicker {
  min-width: 0;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.date-picker-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.date-picker-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.playground[data-theme="dark"] .date-picker-card {
  background: rgba(17, 24, 39, 0.55);
  border-color: rgba(148, 163, 184, 0.16);
}

.dialog-fullscreen-content {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
  background: var(--e-color-surface-1, #fff);
  color: var(--e-contrast-surface-1, #222);
}

:global(:root) {
  --e-color-brand: #1e88e5;
  --e-contrast-brand: #ffffff;
}
</style>
