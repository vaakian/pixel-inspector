<script setup lang="ts">
const props = defineProps<{
  modelValue: any
  name: string
}>()
const emit = defineEmits(['update:modelValue'])

const colorProp = [
  // 'fill',
  'stroke'] as const

const updateValue = (event: Event) => {
  const value = (event.target as unknown as any).value
  const type = typeof props.modelValue
  console.log({ type })
  emit('update:modelValue', type === 'number' ? Number(value) : value)
}
</script>

<template>
  <div
    class="flex justify-end prop"
  >
    <span>{{ props.name }}:</span>
    <input
      :value="props.modelValue"
      class="w-20 text-center border-2 mb-1"
      :type="(typeof props.modelValue === 'number') ? 'number' : colorProp.includes(props.name as unknown as any) ? 'color' : 'text'"
      @input="updateValue"
    >
  </div>
</template>

<style lang="postcss" scoped>
</style>
