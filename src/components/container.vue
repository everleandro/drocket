<template>
  <div class="e-container" id="app">
    <slot />
  </div>
</template>

<style lang="scss">
.e-container {
  margin-right: auto;
  margin-left: auto;
  width: 100%;
  padding: $space-base;
  box-sizing: border-box;
  max-width: 1185px;

  &--fluid {
    max-width: 100%;
  }
}
</style>
