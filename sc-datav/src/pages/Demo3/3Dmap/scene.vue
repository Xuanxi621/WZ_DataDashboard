<template>
  <div></div>
</template>

<script setup lang="ts">
import { Group } from 'three'
import type { Scene, PerspectiveCamera } from 'three'
import type { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { createBaseMap } from './base.vue'
import { createClouds } from './cloud.vue'
import { createBottom } from './bottom.vue'
import type { CityGeoJSON } from '@/types/map'

import scMapData from '@/assets/sc.json'
import scOutlineData from '@/assets/sc_outline.json'

const mapData = scMapData as CityGeoJSON
const outlineData = scOutlineData as CityGeoJSON

/**
 * 创建3D场景
 * @param scene Three.js场景对象
 * @param camera 相机对象
 * @param labelRenderer CSS2D渲染器（用于渲染HTML标签）
 * @returns Promise<场景组对象>
 */
export async function createScene(
  scene: Scene,
  camera: PerspectiveCamera,
  labelRenderer: CSS2DRenderer
): Promise<Group | null> {
  const group = new Group()

  try {
    // 创建云朵
    const clouds = createClouds()
    if (clouds) {
      group.add(clouds)
    }

    // 创建地图（异步）
    const baseMap = await createBaseMap(mapData, outlineData, 6, scene, camera, labelRenderer)
    if (baseMap) {
      group.add(baseMap)
    }

    // 创建底部网格（异步）
    const bottom = await createBottom()
    if (bottom) {
      group.add(bottom)
    }
  } catch (error) {
    console.error('创建场景失败:', error)
    return null
  }

  return group
}
</script>
