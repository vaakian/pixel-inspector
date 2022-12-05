<script setup lang="ts">
import { useMouseInElement } from '@vueuse/core'
import { onMounted, onUnmounted, ref, watch } from 'vue'

import { fabric } from 'fabric'
import { useFabric } from '../composables'

const plateRef = ref<HTMLCanvasElement>()

const { elementX, elementY, elementHeight, elementWidth } = useMouseInElement(plateRef)
const { instance } = useFabric(plateRef)

/**
 * read the image from the clipboard
 * then add it to the fabric canvas plate
 * @param e
 */
const handlePaste = (e: ClipboardEvent) => {
  // read image from clipboard
  const items = e.clipboardData?.items
  if (!items)
    return

  const item = items[0]
  // add to fabric plate and adjust the size of the plate
  if (item.type.includes('image')) {
    const blob = item.getAsFile()
    const reader = new FileReader()
    if (!blob || !reader)
      return
    reader.readAsArrayBuffer(blob)
    console.log(blob)

    reader.onload = (e) => {
      const data = e.target?.result

      // ObjectURL
      const url = URL.createObjectURL(blob)

      if (data) {
        fabric.Image.fromURL(url, (img) => {
          const f = instance.value
          if (!f)
            return

          f.add(img)
          // set img un-draggable
          img.set({
            selectable: false,
            evented: false,
          })
          f.setWidth(img.width || 350)
          f.setHeight(img.height || 100)
          f.renderAll()
        })
      }
    }
  }
}

function handleAddRectangle() {
  const plate = instance.value
  if (!plate)
    return

  console.log('add rect')
  const rect = new fabric.Rect({
    left: 20,
    top: 20,
    width: 100,
    height: 100,
    // TODO: var
    fill: '',
    // TODO: var
    stroke: 'red',
    // TODO: var
    strokeWidth: 2,
  })
  plate.add(rect)
  plate.renderAll()
  rect.bringToFront()
}

onMounted(() => {
  document.addEventListener('paste', handlePaste)
})
onUnmounted(() => {
  document.removeEventListener('paste', handlePaste)
})
</script>

<template>
  <button class="rounded-md bg-green-500 text-white pb-2 px-5" @click="handleAddRectangle">
    add
  </button>
  <div class="image-container p-5 mx-2 border-2 border-gray-400 ">
    <div class="flex items-center justify-start gap-1">
      <div class="border-2 flex">
        <span class="align-middle text-center leading-none">
          鼠标位置
        </span>
        <div class="align-middle">
          <p>x: {{ Math.floor(elementX) }}</p>
          <p>y: {{ Math.floor(elementY) }}</p>
        </div>
      </div>
      <div class="border-2">
        图片尺寸：高{{ Math.floor(elementWidth) }} * 宽{{ Math.floor(elementHeight) }}
      </div>
    </div>
    <div style="max-width: 70vw; max-height: 70vh; overflow: scroll;">
      <canvas id="plate" ref="plateRef" @paste="() => {}" />
    </div>
  </div>
</template>

<style lang="postcss">
    .image-container {
      overflow: scroll;
    }
    #plate {
      border: 1px solid red;
    }
</style>
