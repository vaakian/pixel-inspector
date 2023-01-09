<script setup lang="ts">
import { useFileDialog, useMagicKeys, useMouseInElement } from '@vueuse/core'
import { onMounted, onUnmounted, ref, watch } from 'vue'

import { fabric } from 'fabric'
import { useFabric, useRect } from '../composables'
import { drawMultiLineString } from '../utils'
import ObjectList from './ObjectList.vue'

const plateRef = ref<HTMLCanvasElement>()
const isPlateEmpty = ref(true)

const { elementX, elementY, elementHeight, elementWidth } = useMouseInElement(plateRef)
const { instance, getObjectURL } = useFabric(plateRef)
const { rectangles, add } = useRect(instance)

const d = useFileDialog()

const paintFile = (blob: File | null) => {
  isPlateEmpty.value = true
  const reader = new FileReader()
  if (!blob || !reader)
    return
  reader.readAsArrayBuffer(blob)

  reader.onload = (e) => {
    const data = e.target?.result

    // ObjectURL
    const url = URL.createObjectURL(blob)

    if (data) {
      isPlateEmpty.value = false
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
        img.sendBackwards()
        f.setWidth(img.width || 350)
        f.setHeight(img.height || 100)
        f.requestRenderAll()
      })
    }
  }
}

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
    if (blob)
      paintFile(blob)
  }
}

/**
 * open a file dialog
 */
const handleOpenImage = () => {
  d.open({
    multiple: false,
    accept: 'image/*',
  })
}

/**
 * watch the file changes
 */
watch(d.files, (files) => {
  const image = files?.[0]
  if (image)
    paintFile(image)
})

const keys = useMagicKeys()
const shiftL = keys['shift+l']
// bind shortcut `SHIFT + L`
watch(shiftL, (state) => {
  if (state)
    handleOpenImage()
})

function handleAddRectangle() {
  const plate = instance.value
  if (!plate)
    return

  add({
    left: 20,
    top: 20,
    width: 100,
    height: 100,
    // fill: 'rgba(255,0,0,0.5)',
    fill: '',
    stroke: 'red',
    strokeWidth: 2,
  })
}

function handleGetCanvasImage() {
  const url = getObjectURL()
  if (url)
    window.open(url, '_blank')
}

onMounted(() => {
  document.addEventListener('paste', handlePaste)
})
onUnmounted(() => {
  document.removeEventListener('paste', handlePaste)
})
</script>

<template>
  <div class="image-container p-2 mx-2 border-2 border-gray-400 flex h-screen">
    <div class="flex flex-col justify-start gap-1 w-[120px] sticky">
      <div class="border-2 flex flex-col">
        <span class="align-middle leading-none">
          鼠标位置
        </span>
        <div class="align-middle">
          <p>x: {{ Math.floor(elementX) }}</p>
          <p>y: {{ Math.floor(elementY) }}</p>
        </div>
      </div>
      <div class="border-2">
        <span>图片尺寸</span>
        <p>高{{ Math.floor(elementWidth) }}</p>
        <P>宽{{ Math.floor(elementHeight) }}</P>
      </div>
      <button class="rounded-md bg-green-500 text-white pb-2 px-5" @click="handleAddRectangle">
        ADD
      </button>
      <button class="rounded-md bg-green-500 text-white pb-2 px-5" @click="handleGetCanvasImage">
        OPEN
      </button>
    </div>
    <div style="overflow: scroll; flex: 1;" class="border-dashed border-2 border-indigo-400">
      <canvas id="plate" ref="plateRef" @paste="() => {}" />
      <!-- tip -->
      <h1 v-if="isPlateEmpty" class="text-center text-2xl text-gray-600">
        将图片粘贴到这里，或<span class="text-ellipsis underline cursor-pointer" @click="handleOpenImage">选择文件</span>。
      </h1>
    </div>
    <ObjectList :rectangles="rectangles" />
  </div>
</template>

<style lang="postcss">
    .image-container {
      overflow: scroll;
    }
</style>
