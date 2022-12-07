import { fabric } from 'fabric'
import type { Ref } from 'vue'
import { ref, watch } from 'vue'

export function useFabric(el: Ref<HTMLCanvasElement | null | undefined>) {
  const instance = ref<fabric.Canvas | null>(null)

  watch(el, (el) => {
    if (el) {
      instance.value = new fabric.Canvas(el)
      fabric.Object.prototype.transparentCorners = false
    }
  })

  const getObjectURL = () => {
    const plate = instance.value
    if (!plate)
      return

    const data = plate.toDataURL({ format: 'png', quality: 1 })

    // base64 data url to blob image
    const base64 = data.split(',')[1]
    const byteString = atob(base64)
    const mimeString = data.split(',')[0].split(':')[1].split(';')[0]
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i)
    const blob = new Blob([ab], { type: mimeString })
    const url = URL.createObjectURL(blob)
    return url
  }

  return {
    instance,
    getObjectURL,
  }
}

export * from './useRect'

