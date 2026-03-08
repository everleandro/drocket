<template>
  <EApp>
    <EBar color="primary" dense>
      <template #default>
        <div class="topbar">
          <strong>Drocket Site</strong>
          <div class="actions">
            <EButton text color="primary" @click="go('/')">Home</EButton>
            <EButton text color="primary" @click="go('/components')">Components</EButton>
            <EButton text color="primary" @click="go('/theming')">Theming</EButton>
          </div>
        </div>
      </template>
    </EBar>

    <EMain>
      <EContainer>
        <router-view />
      </EContainer>
    </EMain>
  </EApp>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const go = (path: string): void => {
  router.push(path);
};
</script>

<style scoped>
.topbar {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
</style>
