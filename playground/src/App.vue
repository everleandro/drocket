<template>
  <main class="playground" :data-theme="theme">
    <header class="playground-header">
      <h1>Playground</h1>
      <button class="theme-toggle" @click="toggleTheme">
        {{ theme === 'light' ? '🌙 Dark' : '☀️ Light' }}
      </button>
    </header>

    <section class="block">
      <h2>Button</h2>
      <div class="row">
        <EButton color="primary" elevation="lg">Primary</EButton>
        <EButton color="secondary" outlined>Outlined</EButton>
        <EButton color="brand" rounded>Custom Brand</EButton>
        <EButton color="secondary" rounded>secondary</EButton>
        <EButton text rounded :prepend-icon="iconFactory.arrowLeft">Text Button</EButton>
        <EButton :prepend-icon="iconFactory.arrowLeft" color="warning"
          >With Icon</EButton
        >
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
      <h2>Dialog</h2>
      <div class="row">
        <EButton color="primary" @click="dialogDefault = true">Open Default</EButton>
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

      <EDialog v-model="dialogPersistent" persistent :max-width="520" elevation="xl">
        <div class="dialog-card">
          <h3>Persistent Dialog</h3>
          <p>This dialog ignores outside click and ESC unless you use an action.</p>
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
            Open the child dialog and test: press ESC or click outside. Only the child should close first.
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
              This is the top dialog. ESC and outside click should close only this one.
            </p>
            <div class="dialog-actions">
              <EButton text @click="dialogChild = false">Cancel</EButton>
              <EButton color="primary" @click="dialogChild = false">Close Child</EButton>
            </div>
          </div>
        </EDialog>
      </EDialog>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import EButton from "../../src/components/button/index.vue";
import EIcon from "../../src/components/icon/index.vue";
import EDialog from "../../src/components/dialog/index.vue";
import iconFactory from "../../src/utils/icons";

const theme = ref("light");
const dialogDefault = ref(false);
const dialogPersistent = ref(false);
const dialogFullscreen = ref(false);
const dialogParent = ref(false);
const dialogChild = ref(false);

watch(dialogParent, (value) => {
  if (!value) {
    dialogChild.value = false;
  }
});

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
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
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
  transition: background, box-shadow 0.3s ease;
}

.playground[data-theme="dark"] .block {
  background: #2a2a2a;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

.block h2 {
  color: #333;
  margin-top: 0;
}

.playground[data-theme="dark"] .block h2 {
  color: #fafafa;
}

.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.dialog-card {
  background: var(--e-color-surface, #fff);
  color: var(--e-color-on-surface, #222);
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

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.dialog-fullscreen-content {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
  background: var(--e-color-surface, #fff);
  color: var(--e-color-on-surface, #222);
}

:global(:root) {
  --e-color-brand: #1e88e5;
  --e-contrast-brand: #ffffff;
}

</style>
