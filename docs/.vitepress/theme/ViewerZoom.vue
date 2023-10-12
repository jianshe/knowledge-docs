<script setup>
import { withBase } from "vitepress";
defineProps({
  src: String,
});
</script>

<template>
  <div
    class="images"
    v-viewer="{ title: withBase(src), filter: withBase(src) }"
  >
    <img :src="withBase(src)" :key="withBase(src)" />
  </div>
</template>

<style>
.images img {
  cursor: zoom-in;
}
</style>