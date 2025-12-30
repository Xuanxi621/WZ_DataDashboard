import { Group, Mesh, PlaneGeometry, BoxGeometry, MeshBasicMaterial, AdditiveBlending, Color, RepeatWrapping, SRGBColorSpace } from 'three'
import { useConfigStore } from '../stores'
import loadTexture from '../helpers/loadTexture'

import guangquan01 from '@/assets/guangquan01.png'
import huiguang from '@/assets/huiguang.png'

const textures = Promise.all([
  loadTexture(guangquan01),
  loadTexture(huiguang, (tex) => {
    tex.colorSpace = SRGBColorSpace
    tex.wrapS = tex.wrapT = RepeatWrapping
  }),
])

export interface CityBarProps {
  position?: [number, number, number]
  value?: number
  uColor1?: Color
  uColor2?: Color
  dir?: 'x' | 'y' | 'z'
  factor?: number
  max?: number
}

/**
 * 创建柱状图对象
 */
export async function createBar(
  props: CityBarProps,
  callback?: (barHeight: number, barGroup: Group) => void
): Promise<Group | null> {
  try {
    const {
      position = [0, 0, 0],
      value = Math.floor(Math.random() * 1000) + 100,
      uColor1 = new Color(0xfbdf88),
      uColor2 = new Color(0xea580c),
      factor = 5,
      max = 1000,
    } = props

    const bar = useConfigStore().state.value.bar

    const [texture1, texture2] = await textures
    const barHeight = 4.0 * factor * (value / max)

    const group = new Group()
    group.userData.type = 'bar'
    group.position.set(...position)
    group.visible = bar

    // 创建柱体
    const barMesh = new Mesh(
      new BoxGeometry(0.1 * factor, 0.1 * factor, barHeight),
      new MeshBasicMaterial({
        transparent: true,
        color: '#ffffff',
        opacity: 1,
        depthTest: false,
        fog: false,
      })
    )
    barMesh.position.z = barHeight / 2
    barMesh.renderOrder = 5
    group.add(barMesh)

    // 创建光晕
    const quanMesh = new Mesh(
      new PlaneGeometry(5, 5),
      new MeshBasicMaterial({
        transparent: true,
        color: 0xffffff,
        map: texture1,
        alphaMap: texture1,
        opacity: 1,
        depthTest: false,
        fog: false,
        blending: AdditiveBlending,
      })
    )
    quanMesh.renderOrder = 6
    quanMesh.raycast = () => null
    
    // 旋转动画
    const animate = () => {
      quanMesh.rotation.z += 0.02
      requestAnimationFrame(animate)
    }
    animate()
    
    group.add(quanMesh)

    // 调用回调
    if (callback) {
      callback(barHeight, group)
    }

    return group
  } catch (error) {
    console.error('创建柱状图失败:', error)
    return null
  }
}

