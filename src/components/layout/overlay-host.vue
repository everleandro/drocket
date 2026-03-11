<template>
  <Teleport to="body">
    <div
      v-if="overlayMounted"
      :class="['e-overlay', overlayClassName]"
      @click="handleOverlayClick"
    ></div>
  </Teleport>
</template>

<script lang="ts" setup>
import { useOverlayService } from "@/composables";

const { overlayMounted, overlayClassName, handleOverlayClick } =
  useOverlayService();
</script>
