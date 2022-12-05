<!-- show property of rectangles -->
<script setup lang="ts">
import { useAttrs } from 'vue'
import type { AddRectReturn } from '../composables'
const { rectangles } = defineProps<{
  rectangles: AddRectReturn[]
}>()
</script>

<template>
  <div class="object-list m-2 flex justify-center flex-col gap-2">
    <div
      v-for="({ shape }, index) in rectangles" :key="index"
      class="flex border-2 justify-center flex-col"
    >
      <div
        v-for="(value, key) in shape"
        :key="key"
        class="flex justify-end"
      >
        <span>{{ key }}:</span>
        <input
          v-model="shape[key]"
          class="w-20 text-center"
          :type="(typeof value === 'number') ? 'number' : 'text'"
          :placeholder="key"
        >
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
    .object-list {
        width: 190px;
    }
</style>
