<template>
  <div></div>
</template>

<script setup lang="ts">
import { Group, Box2, Vector2, RepeatWrapping } from 'three'
import { geoMercator } from 'd3-geo'
import type { CityGeoJSON } from '@/types/map'
import type { Scene, PerspectiveCamera } from 'three'
import type { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { createCity } from './city.vue'
import { createHeatmap } from './heatmap.vue'
import loadTexture from '../helpers/loadTexture'
import { useConfigStore } from '../stores'
import { gsap } from 'gsap'

import map from '@/assets/sc_map.png'
import normalMap from '@/assets/sc_normal_map.png'

const textures = Promise.all([
  loadTexture(map, (tex) => {
    tex.wrapS = tex.wrapT = RepeatWrapping
  }),
  loadTexture(normalMap, (tex) => {
    tex.wrapS = tex.wrapT = RepeatWrapping
  }),
])

/**
 * 创建地图基础对象
 */
export async function createBaseMap(
  data: CityGeoJSON,
  outlineData: CityGeoJSON,
  depth: number = 6,
  scene: Scene,
  camera: PerspectiveCamera,
  labelRenderer: CSS2DRenderer
): Promise<Group | null> {
  try {
    const [texture1, texture2] = await textures

    const projection = geoMercator()
      .center(data.features[0].properties.centroid)
      .scale(1000)
      .translate([0, 0])

    const regions: Array<{
      city: string
      cityId: [number, number, number]
      points: Vector2[][]
    }> = []
    const bbox = new Box2()

    const toV2 = (coord: number[]) => {
      const [x, y] = projection(coord as [number, number])!
      const projected = new Vector2(x, -y)
      bbox.expandByPoint(projected)
      return projected
    }

    data.features.forEach((feature) => {
      const points = feature.geometry.coordinates.reduce<Vector2[][]>(
        (pre, cur) => [
          ...pre,
          ...cur.map<Vector2[]>((coordinates) => coordinates.map(toV2)),
        ],
        []
      )

      const [x, y] = projection(
        feature.properties.centroid ?? feature.properties.center
      )!

      regions.push({
        city: feature.properties.name,
        cityId: [x, -y, depth + 0.1],
        points,
      })
    })

    const group = new Group()
    group.rotation.set(-Math.PI / 2, 0, 0)
    group.scale.set(1, 1, 0.01)
    group.position.set(20, 0, 0)

    // 创建城市
    regions.forEach((region) => {
      const cityGroup = createCity(
        {
          bbox,
          depth,
          data: region,
          map: texture1,
          normalMap: texture2,
        },
        labelRenderer
      )
      if (cityGroup) {
        group.add(cityGroup)
      }
    })

    // 创建热力图
    const heatmap = createHeatmap({ projection, size: 500 })
    if (heatmap) {
      heatmap.position.z = depth + 1
      heatmap.renderOrder = 11
      group.add(heatmap)
    }

    // 动画
    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        useConfigStore().setState({ mapPlayComplete: true })
      },
    })

    tl.add(
      gsap.to(camera.position, {
        x: 60,
        y: 125,
        z: 160,
        duration: 2,
        ease: 'circ.out',
      })
    )
    tl.add(
      gsap.to(group.scale, { x: 1, y: 1, z: 1, duration: 1, ease: 'circ.out' }, 2)
    )

    tl.play()

    return group
  } catch (error) {
    console.error('创建地图失败:', error)
    return null
  }
}
</script>
