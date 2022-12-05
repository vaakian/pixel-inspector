<script setup lang="ts">
import { useMouseInElement } from '@vueuse/core'
import { ref, watch } from 'vue'

import { fabric } from 'fabric'
import { useFabric } from '../composables'

const plateRef = ref<HTMLCanvasElement>()
// const {} = useClipboard()

const { elementX, elementY, elementHeight, elementWidth } = useMouseInElement(plateRef)
const { instance } = useFabric(plateRef)

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
</script>

<template>
  <button @click="handleAddRectangle">
    add
  </button>
  <div class="image-container" @paste="handlePaste">
    <div class="attributes">
      <div style="border: 1px solid green;">
        <p>x: {{ Math.floor(elementX) }}</p>
        <p>y: {{ Math.floor(elementY) }}</p>
      </div>
      <p>图片尺寸：高{{ Math.floor(elementWidth) }} * 宽{{ Math.floor(elementHeight) }}</p>
    </div>
    <canvas id="plate" ref="plateRef" @paste="() => {}" />
  </div>
</template>

<style lang="postcss">
    .image-container {
        overflow: scroll;
        border: 1px solid rosybrown;
    }
    #plate {
      border: 1px solid red;
    }
    .attributes {
      display: flex;
    }
</style>
