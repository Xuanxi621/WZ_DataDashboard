import { Group, Box2, Vector2, RepeatWrapping } from 'three'
import { geoMercator } from 'd3-geo'
import type { CityGeoJSON } from '@/types/map'
import type { Scene, PerspectiveCamera } from 'three'
import type { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { createCity } from './city'
import { createHeatmap } from './heatmap'
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
        const store = useConfigStore()
        store.setState({ mapPlayComplete: true })
      },
    })

    // 相机动画
    tl.add(
      gsap.to(camera.position, {
        x: 60,
        y: 125,
        z: 160,
        duration: 2,
        ease: 'circ.out',
      })
    )
    
    // 缩放动画（在时间点2开始）
    tl.add(
      gsap.to(group.scale, { 
        x: 1, 
        y: 1, 
        z: 1, 
        duration: 1, 
        ease: 'circ.out' 
      }, 2)
    )

    // 材质透明度动画（遍历所有mesh和line）
    group.traverse((obj) => {
      if ((obj as any).isMesh || (obj as any).isLineSegments) {
        const material = (obj as any).material
        if (material && material.opacity !== undefined) {
          // 设置初始透明度
          material.opacity = 0
          material.transparent = true
          // 在时间点3开始动画透明度到1（在缩放动画之后）
          tl.to(material, { 
            opacity: 1, 
            duration: 1, 
            ease: 'circ.out' 
          }, 3)
        }
      }
    })

    tl.play()

    return group
  } catch (error) {
    console.error('创建地图失败:', error)
    return null
  }
}

