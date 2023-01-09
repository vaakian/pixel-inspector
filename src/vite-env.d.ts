/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare interface Point {
  type: 'Point'
  coordinates: [number, number]
}

declare interface LineString {
  type: 'LineString'
  coordinates: number[][]
}

declare interface Polygon {
  type: 'Polygon'
  coordinates: number[][][]
}

declare interface MultiPoint {
  type: 'MultiPoint'
  coordinates: number[][]
}

declare interface MultiLineString {
  type: 'MultiLineString'
  coordinates: number[][][]
}

declare interface MultiPolygon {
  type: 'MultiPolygon'
  coordinates: number[][][][]
}

declare interface GeometryCollection {
  type: 'GeometryCollection'
  geometries: GeoJSON[]
}

declare interface Feature<T extends Record<string, any> = Record<string, any>> {
  type: 'Feature'
  properties?: T
  geometry: GeoJSON
}

declare interface FeatureCollection<T extends Record<string, any> = Record<string, any>> {
  type: 'FeatureCollection'
  features: Feature<T>[]
}

declare type GeoJSON<T extends Record<string, any> = Record<string, any>> = Point | LineString | Polygon | MultiPoint | MultiLineString | MultiPolygon | GeometryCollection | Feature<T> | FeatureCollection<T>



// declare interface GeoJSON<T extends Record<string, any> = Record<string, any>> {
//   type: 'Point' | 'LineString' | 'Polygon' | 'MultiPoint' | 'MultiLineString' | 'MultiPolygon' | 'GeometryCollection' | 'Feature' | 'FeatureCollection'
//   coordinates: number[] | number[][] | number[][][] | number[][][][]
//   // properties?: T
//   // geometry?: GeoJSON
//   // features?: GeoJSON[]
// }

declare module 'wellknown'{
  export default function parse(wkt: string): GeoJSON
}