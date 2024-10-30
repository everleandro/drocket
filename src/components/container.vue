<template>
  <div class="e-container" id="app">
    <slot />
  </div>
</template>

<style lang="scss">
@use '~/public/styles/_mixins.scss' as *;
@use '~/public/styles/override/variables/index' as *;
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
