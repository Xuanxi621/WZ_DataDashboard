<template>
  <div></div>
</template>

<script setup lang="ts">
import { Group, Mesh, PlaneGeometry, MeshBasicMaterial, NormalBlending, RepeatWrapping, SRGBColorSpace } from 'three'
import { useConfigStore } from '../stores'
import loadTexture from '../helpers/loadTexture'

import rotationBorder1 from '@/assets/rotationBorder1.png'
import rotationBorder2 from '@/assets/rotationBorder2.png'
import gaoguang1 from '@/assets/gaoguang1.png'
import gridBlack from '@/assets/gridBlack.png'
import grid from '@/assets/grid.png'

const textures = Promise.all([
  loadTexture(gaoguang1, (tex) => {
    tex.colorSpace = SRGBColorSpace
    tex.wrapS = tex.wrapT = RepeatWrapping
    tex.repeat.set(1, 1)
  }),
  loadTexture(grid, (tex) => {
    tex.wrapS = tex.wrapT = RepeatWrapping
    tex.repeat.set(80, 80)
  }),
  loadTexture(gridBlack, (tex) => {
    tex.wrapS = tex.wrapT = RepeatWrapping
    tex.repeat.set(80, 80)
  }),
  loadTexture(rotationBorder1),
  loadTexture(rotationBorder2),
])

/**
 * 创建底部网格对象
 */
export async function createBottom(): Promise<Group | null> {
  try {
    const rotation = useConfigStore().state.value.rotation
    if (!rotation) {
      return null
    }

    const [
      gaoGuang1Tex,
      gridTex,
      gridBlackTex,
      rotationBorder1Tex,
      rotationBorder2Tex,
    ] = await textures

    const group = new Group()
    group.rotation.x = -Math.PI / 2
    group.position.y = -0.1

    // 背景光
    const bgMesh = new Mesh(
      new PlaneGeometry(300, 300),
      new MeshBasicMaterial({
        transparent: true,
        blending: NormalBlending,
        map: gaoGuang1Tex,
        color: '#fbdf88',
      })
    )
    group.add(bgMesh)

    // 旋转边框1
    const border1Mesh = new Mesh(
      new PlaneGeometry(240, 240),
      new MeshBasicMaterial({
        transparent: true,
        map: rotationBorder1Tex,
        color: '#fbdf88',
        opacity: 0.2,
        depthWrite: false,
        blending: NormalBlending,
      })
    )
    border1Mesh.position.z = 0.1
    group.add(border1Mesh)

    // 旋转边框2
    const border2Mesh = new Mesh(
      new PlaneGeometry(225, 225),
      new MeshBasicMaterial({
        transparent: true,
        map: rotationBorder2Tex,
        color: '#fbdf88',
        opacity: 0.4,
        depthWrite: false,
        blending: NormalBlending,
      })
    )
    border2Mesh.position.z = 0.1
    group.add(border2Mesh)

    // 网格
    const gridMesh = new Mesh(
      new PlaneGeometry(1000, 1000),
      new MeshBasicMaterial({
        transparent: true,
        map: gridTex,
        alphaMap: gridBlackTex,
        color: '#fbdf88',
        opacity: 0.1,
        depthWrite: false,
        blending: NormalBlending,
      })
    )
    gridMesh.position.z = 0.05
    group.add(gridMesh)

    // 动画旋转
    const animate = () => {
      border1Mesh.rotation.z += 0.001
      border2Mesh.rotation.z -= 0.004
      requestAnimationFrame(animate)
    }
    animate()

    return group
  } catch (error) {
    console.error('创建底部网格失败:', error)
    return null
  }
}
</script>
