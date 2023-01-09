// import { parseFromWK } from 'wkt-parser-helper'
import parse from 'wellknown'
import { fabric } from 'fabric'
import type { ICircleOptions } from 'fabric/fabric-impl'

export function drawPoint(
  wkt: string,
  plate: fabric.Canvas,
  options: ICircleOptions = {
    fill: 'red',
    radius: 5,
  }) {
  const point = parse(wkt)
  if (point.type !== 'Point')
    return
  const [x, y] = point.coordinates
  const p = new fabric.Point(x, y)

  plate.add(new fabric.Circle({
    ...options,
    left: p.x,
    top: p.y,
  }))
}

export function drawMultiPoint(
  wkt: string,
  plate: fabric.Canvas,
  options: ICircleOptions = {
    fill: 'red',
    radius: 5,
  }) {
  const point = parse(wkt)
  if (point.type !== 'MultiPoint')
    return
  point.coordinates.forEach(([x, y]) => {
    const p = new fabric.Point(x, y)
    plate.add(new fabric.Circle({
      ...options,
      left: p.x,
      top: p.y,
    }))
  })
}

export function drawLineString(
  wkt: string,
  plate: fabric.Canvas,
  options: fabric.ILineOptions = {
    fill: 'red',
    stroke: 'red',
    strokeWidth: 1,
  }) {
  const line = parse(wkt)
  if (line.type !== 'LineString')
    return
  plate.add(new fabric.Line(line.coordinates.flat(), options))
}

export function drawMultiLineString(
  wkt: string,
  plate: fabric.Canvas,
  options: fabric.ILineOptions = {
    fill: 'red',
    stroke: 'red',
    strokeWidth: 11,
  }) {
  const lines = parse(wkt)
  if (lines.type !== 'MultiLineString')
    return

  lines.coordinates.forEach(lineSegments => drawMultiLineSegments(lineSegments, plate, options))
  plate.requestRenderAll()
}

function drawMultiLineSegments(
  segments: number[][],
  plate: fabric.Canvas,
  options: fabric.ILineOptions = {
    fill: 'red',
    stroke: 'red',
    strokeWidth: 2,
  }) {
  for (let i = 0; i < segments.length - 1; i++) {
    const point = segments[i]
    const nextPoint = segments[i + 1]

    plate.add(new fabric.Line([...point, ...nextPoint], options))
  }
  plate.requestRenderAll()
}
