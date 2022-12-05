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

  return {
    instance,
  }
}

export * from './useRect'

