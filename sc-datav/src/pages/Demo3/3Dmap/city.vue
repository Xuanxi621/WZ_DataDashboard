<template>
  <div></div>
</template>

<script setup lang="ts">
import { Group, Shape, ShapeGeometry, ExtrudeGeometry, Mesh, LineSegments, EdgesGeometry, MeshStandardMaterial, LineBasicMaterial, DoubleSide, Vector3 } from 'three'
import type { Box2, Vector2 } from 'three'
import type { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { createShape } from './shape.vue'
import { createBar } from './bar.vue'
import type { Texture } from 'three'
import { createLabel } from './label.vue'
import { createTooltip } from './tooltip.vue'
import cityData from '../cityData'

interface CityProps {
  bbox: Box2
  depth: number
  data: {
    city: string
    cityId: [number, number, number]
    points: Vector2[][]
  }
  map?: Texture
  normalMap?: Texture
}

/**
 * 创建城市对象
 */
export function createCity(
  props: CityProps,
  labelRenderer: CSS2DRenderer
): Group | null {
  try {
    const { data, bbox, depth, map, normalMap } = props
    const group = new Group()
    const vector3 = new Vector3(1, 1, 1)

    // 创建形状
    const shapes = data.points.map((e) => new Shape(e))
    const shapeGeometry = new ShapeGeometry(shapes)

    // 创建顶部表面
    const topMesh = createShape({ bbox, shapes })
    if (topMesh) {
      topMesh.position.z = depth + 0.1
      const material = new MeshStandardMaterial({ map, normalMap })
      topMesh.material = material
      group.add(topMesh)
    }

    // 创建侧面
    const sideMesh = new Mesh(
      new ExtrudeGeometry(shapes, { depth, steps: 1, bevelEnabled: false }),
      new MeshStandardMaterial({
        transparent: true,
        opacity: 0,
        metalness: 0.2,
        roughness: 0.5,
        side: DoubleSide,
        color: '#f9f3e7',
      })
    )
    sideMesh.castShadow = true
    sideMesh.receiveShadow = true
    group.add(sideMesh)

    // 创建边框
    const edgesMesh = new LineSegments(
      new EdgesGeometry(shapeGeometry),
      new LineBasicMaterial({ transparent: true, opacity: 0, color: '#ffffff' })
    )
    edgesMesh.position.z = depth + 0.2
    edgesMesh.raycast = () => null
    group.add(edgesMesh)

    // 鼠标交互
    const onPointerOver = () => {
      vector3.setZ(1.5)
      document.body.style.cursor = 'pointer'
    }

    const onPointerOut = () => {
      vector3.setZ(1)
      document.body.style.cursor = 'auto'
    }

    // 创建柱状图（异步）
    const population = cityData[data.city as keyof typeof cityData]?.population ?? 0
    createBar({
      position: data.cityId,
      value: population,
    }, async (barHeight: number) => {
      // 创建标签
      const label = createLabel({
        text: data.city,
        position: [0, 0, barHeight + 0.2],
        center: true,
        distanceFactor: 100,
      })
      group.add(label)

      // 创建提示框
      const tooltip = createTooltip({
        data: {
          city: data.city,
          ...cityData[data.city as keyof typeof cityData],
        },
        position: [0, 0, barHeight + 7],
        visible: false,
      })
      group.add(tooltip.object)

      // 绑定交互
      group.userData.onPointerOver = () => {
        onPointerOver()
        tooltip.open()
      }
      group.userData.onPointerOut = () => {
        onPointerOut()
        tooltip.close()
      }
    }).then((barGroup) => {
      if (barGroup) {
        group.add(barGroup)
      }
    })

    // 动画缩放
    const animate = () => {
      group.scale.lerp(vector3, 0.1)
      requestAnimationFrame(animate)
    }
    animate()

    return group
  } catch (error) {
    console.error('创建城市失败:', error)
    return null
  }
}
</script>
