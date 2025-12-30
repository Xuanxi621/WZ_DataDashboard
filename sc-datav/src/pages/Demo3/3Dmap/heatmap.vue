<template>
  <div></div>
</template>

<script setup lang="ts">
import { Group, Mesh, PlaneGeometry, ShaderMaterial, CanvasTexture, Color, DoubleSide } from 'three'
import type { GeoProjection } from 'd3-geo'
import { useConfigStore } from '../stores'
// @ts-ignore
import heatmapJs from 'keli-heatmap.js'

import data from '@/assets/heatmapData.json'

interface HeatmapProps {
  projection: GeoProjection
  size?: number
}

/**
 * 创建热力图对象
 */
export function createHeatmap(props: HeatmapProps): Group | null {
  try {
    const { projection, size = 500 } = props
    const heat = useConfigStore().state.value.heat

    if (!heat) {
      return null
    }

    const group = new Group()
    group.visible = heat

    // 创建热力图容器
    const heatmapContainer = document.createElement('div')
    heatmapContainer.style.cssText = 'position:absolute;top:-9999px;left:-9999px;'
    document.body.appendChild(heatmapContainer)

    const heatmap = heatmapJs.create({
      container: heatmapContainer,
      gradient: {
        0.5: '#1fc2e1',
        0.6: '#24d560',
        0.7: '#9cd522',
        0.8: '#f1e12a',
        0.9: '#ffbf3a',
        1.0: '#ff0000',
      },
      blur: 1,
      radius: 10,
      maxOpacity: 1,
      width: size,
      height: size,
    })

    const greymap = heatmapJs.create({
      container: heatmapContainer,
      gradient: {
        0.0: 'black',
        1.0: 'white',
      },
      radius: 10,
      maxOpacity: 1,
      width: size,
      height: size,
    })

    const points = data.features.map((el: any) => {
      const [x = 0, y = 0] = projection(el.geometry.coordinates as [number, number]) ?? []
      return {
        x: Math.floor(x + size / 2),
        y: Math.floor(y + size / 2),
        value: el.properties.value,
      }
    })

    const max = 1000
    const min = 2000

    heatmap.setData({ max, min, data: points })
    greymap.setData({ max, min, data: points })

    const texture = new CanvasTexture(heatmap._renderer.canvas)
    texture.needsUpdate = true
    const texture2 = new CanvasTexture(greymap._renderer.canvas)
    texture2.needsUpdate = true

    const mesh = new Mesh(
      new PlaneGeometry(size, size, 300, 300),
      new ShaderMaterial({
        transparent: true,
        side: DoubleSide,
        vertexShader: `
          varying vec2 vUv;
          uniform float z_scale;
          uniform sampler2D greyMap;
          void main() {
              vUv = uv;
              vec4 frgColor = texture2D(greyMap, uv);
              float height = z_scale * frgColor.a;
              vec3 transformed = vec3( position.x, position.y, height);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
          }
        `,
        fragmentShader: `
          #ifdef GL_ES
          precision highp float;
          #endif
          varying vec2 vUv;
          uniform sampler2D heatMap;
          uniform vec3 u_color;
          uniform float u_opacity;
          void main() {
              gl_FragColor = vec4(u_color, u_opacity) * texture2D(heatMap, vUv);
          }
        `,
        uniforms: {
          heatMap: { value: texture },
          greyMap: { value: texture2 },
          z_scale: { value: 4.0 },
          u_color: { value: new Color('#ffffff') },
          u_opacity: { value: 1.0 },
        },
      })
    )

    group.add(mesh)

    // 清理函数
    group.userData.cleanup = () => {
      document.body.removeChild(heatmapContainer)
    }

    return group
  } catch (error) {
    console.error('创建热力图失败:', error)
    return null
  }
}
</script>
