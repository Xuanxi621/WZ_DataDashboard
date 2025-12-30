<template>
  <div></div>
</template>

<script setup lang="ts">
import { Mesh, ShapeGeometry, Float32BufferAttribute } from 'three'
import type { Box2 } from 'three'

interface ShapeProps {
  bbox: Box2
  shapes: any[]
}

/**
 * 创建形状网格
 */
export function createShape(props: ShapeProps): Mesh | null {
  try {
    const { bbox, shapes } = props
    const geometry = new ShapeGeometry(shapes)
    const pos = geometry.attributes.position
    const width = bbox.max.x - bbox.min.x
    const height = bbox.max.y - bbox.min.y

    const uv: number[] = []
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const u = (x - bbox.min.x) / width
      const v = (y - bbox.min.y) / height
      uv.push(u, v)
    }
    geometry.setAttribute('uv', new Float32BufferAttribute(uv, 2))

    const mesh = new Mesh(geometry)
    return mesh
  } catch (error) {
    console.error('创建形状失败:', error)
    return null
  }
}
</script>
