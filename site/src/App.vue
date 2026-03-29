<template>
  <EApp class="docs-shell">
    <EBar app fixed outlined class="docs-bar">
      <EButton
        text
        rounded
        :icon="iconFactory.menu"
        aria-label="Toggle navigation"
        @click="drawerOpen = !drawerOpen"
      />

      <button class="docs-brand" type="button" @click="router.push('/')">
        <EIcon :icon="iconFactory.logo" color="primary" large />
        <span class="docs-brand__copy">
          <strong>Drocket</strong>
          <span>UI docs in progress</span>
        </span>
      </button>

      <ESpacer />

      <div class="docs-bar__context">
        <span class="docs-bar__eyebrow">Phase 1</span>
        <strong>{{ currentTitle }}</strong>
      </div>

      <EButton
        text
        rounded
        :append-icon="iconFactory.externalLink"
        @click="openLink('https://github.com/everleandro/drocket')"
      >
        GitHub
      </EButton>
    </EBar>

    <EDrawer v-model="drawerOpen" fixed nav width="18" width-unit="rem" class="docs-drawer">
      <div class="docs-drawer__header">
        <span class="docs-drawer__eyebrow">Current page</span>
        <h2>{{ currentTitle }}</h2>
        <p>{{ currentDescription }}</p>
      </div>

      <div class="docs-nav">
        <section v-for="group in navigationGroups" :key="group.text" class="docs-nav__section">
          <div class="docs-nav__title">{{ group.text }}</div>

          <EList>
            <EListItem
              v-for="item in group.items"
              :key="item.to"
              :title="item.text"
              :subtitle="itemSubtitle(item.to)"
              :prepend-icon="itemPrependIcon(item.to)"
              :append-icon="isItemActive(item.to) ? iconFactory.arrowRightThin : undefined"
              :is-active="isItemActive(item.to)"
              @click="handleNavigation(item.to)"
            />
          </EList>
        </section>
      </div>

      <template #append>
        <div class="docs-drawer__append">
          <div class="docs-nav__title">Documenting now</div>

          <div class="docs-scope">
            <span v-for="item in phaseOneScope" :key="item" class="docs-scope__item">
              {{ item }}
            </span>
          </div>
        </div>
      </template>
    </EDrawer>

    <EMain class="docs-main">
      <EContainer class="docs-main__container">
        <RouterView />
      </EContainer>
    </EMain>
  </EApp>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref } from "vue";
import { RouterView, useRoute, useRouter } from "vue-router";

import { mainLinks } from "./constants";
import { iconFactory } from "./icons";

type NavigationItem = {
  text: string;
  to: string;
};

type NavigationGroup = {
  text: string;
  items: NavigationItem[];
};

const route = useRoute();
const router = useRouter();
const drawerOpen = ref(true);

const navigationGroups = computed(() => mainLinks as NavigationGroup[]);
const currentTitle = computed(() => {
  const title = route.meta.title;
  return typeof title === "string" ? title : "Documentation";
});
const currentDescription = computed(() => {
  const description = route.meta.description;
  return typeof description === "string"
    ? description
    : "Explore the first documentation pass for the Drocket component library.";
});

const phaseOneScope = [
  "button",
  "chip",
  "date-picker",
  "dialog",
  "expansion",
  "grid",
  "icon",
  "layout",
  "checkbox",
  "form",
  "radio",
  "switch",
  "textfield",
  "select",
  "time-picker",
];

const isExternalLink = (to: string): boolean => /^https?:\/\//.test(to);

const isHashLink = (to: string): boolean => !isExternalLink(to) && to.includes("#");

const isItemActive = (to: string): boolean => {
  if (isExternalLink(to)) return false;
  if (isHashLink(to)) return `${route.path}${route.hash}` === to;
  return route.path === to;
};

const itemSubtitle = (to: string): string =>
  isExternalLink(to)
    ? "External resource"
    : isHashLink(to)
      ? "Jump to section"
      : "Open documentation page";

const itemPrependIcon = (to: string) =>
  isExternalLink(to) ? iconFactory.externalLink : iconFactory.arrowRight;

const openLink = (to: string): void => {
  window.open(to, "_blank", "noopener,noreferrer");
};

const handleNavigation = (to: string): void => {
  if (isExternalLink(to)) {
    openLink(to);
    return;
  }

  router.push(to).then(() => {
    if (!isHashLink(to)) return;

    const [, hash] = to.split("#");
    if (!hash) return;

    nextTick(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
};
</script>

<style lang="scss" src="./app.style.scss"></style>
