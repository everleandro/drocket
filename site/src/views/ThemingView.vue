<template>
  <section class="stack">
    <h1>Theming</h1>
    <p>Use runtime CSS variables to validate your visual system.</p>

    <div class="row">
      <EButton color="primary" @click="setTheme('light')">Light</EButton>
      <EButton color="secondary" @click="setTheme('dark')">Dark</EButton>
      <EButton outlined color="primary" @click="applyOcean"
        >Ocean Accent</EButton
      >
    </div>

    <ECard>
      <ECardContainer class="stack">
        <h3>Live sample</h3>
        <div class="row">
          <EButton color="primary">Primary Action</EButton>
          <EButton color="secondary" outlined>Secondary Action</EButton>
          <EChip color="success">Ready</EChip>
        </div>
      </ECardContainer>
    </ECard>
  </section>
</template>

<script setup lang="ts">
const setTheme = (theme: "light" | "dark"): void => {
  document.documentElement.setAttribute("data-theme", theme);
};

const applyOcean = (): void => {
  const root = document.documentElement;
  root.style.setProperty("--e-color-primary", "#0ea5e9");
  root.style.setProperty("--e-contrast-primary", "#ffffff");
};
</script>

<style scoped>
.stack {
  display: grid;
  gap: 16px;
}

.row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
</style>
