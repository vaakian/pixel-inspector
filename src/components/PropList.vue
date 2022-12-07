<script setup lang="ts">
import { computed } from 'vue'
import type { AddRectReturn } from '../composables'

const { rectangle } = defineProps<{
  rectangle: AddRectReturn
}>()

const { shape } = rectangle

const pointBR = computed(() => {
  const x = (shape.left || 0) + (shape.width || 0)
  const y = (shape.top || 0) + (shape.height || 0)
  return { x, y }
})

const colorProp = ['fill', 'stroke'] as const
</script>

<template>
  <div
    class="flex border-2 justify-center flex-col p-2"
    :class="{ 'border-blue-600 bg-slate-200': rectangle.shape.selected }"
  >
    <div class="flex flex-col justify-center">
      <p>左上：{{ shape.left }}, {{ shape.top }}</p>
      <p>右下：{{ pointBR.x }}, {{ pointBR.y }}</p>
    </div>

    <div
      v-for="(value, key) in shape"
      :key="key"
      class="flex justify-end"
    >
      <span>{{ key }}:</span>
      <input
        v-model="shape[key]"
        class="w-20 text-center border-2 mb-1"
        :type="(typeof value === 'number') ? 'number' : colorProp.includes(key as any) ? 'color' : 'text'"
        rgba
        :placeholder="key"
      >
    </div>
  </div>
</template>
