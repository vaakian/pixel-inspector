import type { Ref } from 'vue'
import { onUnmounted, reactive, ref, watch } from 'vue'
import { fabric } from 'fabric'
import type { Position } from '../types'
export interface RectProps extends fabric.IRectOptions {
  selected?: boolean
}
export interface AddRectReturn {
  shape: RectProps
  rect: fabric.Rect
}
/**
 * ```
 * @param plate the fabric context
 * @param initialOptions the initial options
 * @returns
 */
export function addRect(
  plate: fabric.Canvas,
  initialOptions: RectProps = {},
  syncProps: Array<keyof fabric.IRectOptions> = ['left', 'top', 'width', 'height'],
): AddRectReturn {
  const shape = reactive(initialOptions)

  const rect = new fabric.Rect({
    fill: 'red',
    ...initialOptions,
    strokeUniform: true,
  })

  const updateShape = () => {
    syncProps.forEach((prop) => {
      // if it's a number type, round it
      if (typeof rect[prop] === 'number')
        shape[prop] = Math.round(rect[prop])

      else
        shape[prop] = rect[prop]
    })
  }
  rect.on('moving', updateShape)
  rect.on('resizing', updateShape)
  rect.onSelect = () => {
    shape.selected = true
    return false
  }
  rect.onDeselect = () => {
    shape.selected = false
    return false
  }

  watch(shape, (newShape) => {
    rect.set(newShape)

    rect.setCoords()
    plate.renderAll()
  })

  onUnmounted(() => {
    rect.off('moving', updateShape)
    rect.off('resizing', updateShape)
  })

  // Why the fuck doesn't this rect resizable?
  plate.add(rect)
  plate.setActiveObject(rect)
  plate.requestRenderAll()
  return { shape, rect }
}

export function useRect(plateRef: Ref<fabric.Canvas | null | undefined>) {
  const rectangles = ref<AddRectReturn[]>([])

  const add = (options: fabric.IRectOptions = {}) => {
    const plate = plateRef.value
    if (!plate)
      return
    const ret = addRect(plate, options)
    rectangles.value.push(ret)
  }

  return { add, rectangles }
}

export function getOptionByVertex(topLeft: Position, bottomRight: Position) {
  const width = bottomRight.x - topLeft.x
  const height = bottomRight.y - topLeft.y
  return {
    x: topLeft.x,
    y: topLeft.y,
    width,
    height,
  }
}
