<template>
  <e-app>
    <e-bar app fixed outlined depressed>
      <e-button
        class="d-block d-lg-none"
        text
        color="primary"
        @click="closeDrawer()"
      />

      <e-spacer />
      <e-button text target="_blank" class="mr-1">
        <span class="d-none d-lg-block">view on GitHub</span>
      </e-button>
    </e-bar>
    <EDrawer v-model="drawerModel" fixed nav>
      <template #prepend>
        <e-list-item color="primary" class="app-logo"> Drocket </e-list-item>
        <!-- <e-divider style="margin-top: -2px;"></e-divider> -->
      </template>
      <e-list v-model:group="listModel" color="primary">
        <template
          v-for="({ text, to, group, items }, index) in mainLinks"
          :key="index"
        >
          <e-list-group v-if="group" :value="index">
            <template #activator="{ attrs }">
              <e-list-item v-bind="attrs">{{ text }}</e-list-item>
            </template>
            <e-list-item v-for="item in items" :to="item.to">
              {{ item.text }}
            </e-list-item>
          </e-list-group>
          <e-list-item v-else :to="to"> {{ text }} </e-list-item>
        </template>
      </e-list>
    </EDrawer>

    <EMain id="doc-main-app">
      <EContainer class="mt-8">
        <NuxtPage />
      </EContainer>
    </EMain>
  </e-app>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue";
import { mainLinks } from "./constants";
const drawerModel = ref(true);
import { useBreakpoint } from "../../src";
import { useRouter } from "vue-router";
const { viewport } = useBreakpoint();
const router = useRouter();
const listModel = ref([]);
watch(
  () => router,
  () => {
    if (drawerModel.value && (viewport.xs || viewport.sm || viewport.md)) {
      drawerModel.value = false;
    } else if (!drawerModel.value && (viewport.xl || viewport.lg)) {
      drawerModel.value = true;
    }
  },
  { deep: true, immediate: true },
);

watch(
  () => viewport,
  ({ lg, xl }) => {
    if (lg || xl) {
      drawerModel.value = true;
    }
  },
  { deep: true, immediate: true },
);
const closeDrawer = () => {
  drawerModel.value = !drawerModel.value;
};
</script>
<style lang="scss" src="./app.style.scss"></style>
