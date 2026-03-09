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
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import EButton from "../../src/components/button/index.vue";
import EIcon from "../../src/components/icon/index.vue";
import iconFactory from "../../src/utils/icons";

const theme = ref("light");

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

:global(:root) {
  --e-color-brand: #1e88e5;
  --e-contrast-brand: #ffffff;
}

</style>
