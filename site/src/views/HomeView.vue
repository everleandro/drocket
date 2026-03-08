<template>
  <section class="stack">
    <h1>Build Your Drocket Docs</h1>
    <p>
      This site is powered by Vue + TypeScript + Drocket from local source.
      Use it to design and validate your next professional documentation experience.
    </p>

    <div class="grid">
      <ECard>
        <ECardContainer>
          <h3>Fast Iteration</h3>
          <p>Any change in <code>src/</code> is reflected here while developing.</p>
          <EButton color="primary" @click="go('/components')">See Components</EButton>
        </ECardContainer>
      </ECard>

      <ECard>
        <ECardContainer>
          <h3>Theme Preview</h3>
          <p>Switch themes and test CSS variables on real components.</p>
          <EButton outlined color="secondary" @click="go('/theming')">Open Theming</EButton>
        </ECardContainer>
      </ECard>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
const go = (path: string): void => {
  router.push(path);
};
</script>

<style scoped>
.stack {
  display: grid;
  gap: 16px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

h1 {
  margin-bottom: 0;
}

p {
  margin-top: 0;
}
</style>
