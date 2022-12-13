<script setup lang="ts">
import { computed } from 'vue'
import type { AddRectReturn } from '../composables'
import Prop from './Prop.vue'

const { rectangle } = defineProps<{
  rectangle: AddRectReturn
}>()

const { shape } = rectangle

const BRX = computed({
  get() {
    const x = (shape.left || 0) + (shape.width || 0)
    return x
  },
  set(newValue) {
    shape.width = newValue - (shape.left || 0)
  },
})

const BRY = computed({
  get() {
    return (shape.top || 0) + (shape.height || 0)
  },
  set(newValue) {
    shape.height = newValue - (shape.top || 0)
  },
})

const omittedProp = ['selected'] as const
</script>

<template>
  <div
    class="flex border-2 justify-center flex-col p-2"
    :class="{ 'border-blue-600 bg-slate-200': rectangle.shape.selected }"
  >
    <div class="flex flex-col justify-center">
      <p>左上：{{ shape.left }}, {{ shape.top }}</p>
      <p>右下：{{ BRX }}, {{ BRY }}</p>
    </div>

    <template
      v-for="(_, key) in shape"
      :key="key"
    >
      <Prop
        v-if="!omittedProp.includes(key as unknown as any)"
        v-model="shape[key]"
        :name="key"
        class="flex justify-end"
      />
    </template>

    <Prop v-model="BRX" name="BRX" />
    <Prop v-model="BRY" name="BRY" />
  </div>
</template>
