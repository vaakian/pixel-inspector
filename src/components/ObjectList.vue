<!-- show property of rectangles -->
<script setup lang="ts">
import { useAttrs } from 'vue'
import type { AddRectReturn } from '../composables'
import PropList from './PropList.vue'
const { rectangles } = defineProps<{
  rectangles: AddRectReturn[]
}>()
</script>

<template>
  <div class="object-list m-2 flex flex-col gap-2 max-h-full overflow-y-scroll">
    <PropList
      v-for="(rectangle, index) in rectangles"
      :key="index"
      :rectangle="rectangle"
    />
  </div>
</template>

<style lang="postcss" scoped>
    .object-list {
        width: 190px;
    }
</style>
