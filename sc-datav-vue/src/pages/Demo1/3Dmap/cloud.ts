import { Group, Mesh, SphereGeometry, MeshBasicMaterial, Color, Vector3 } from 'three'
import { useConfigStore } from '../stores'
import loadTexture from '../helpers/loadTexture'

import cloudUrl from '@/assets/cloud.png'

const cloudTexture = loadTexture(cloudUrl)

/**
 * 创建云朵对象
 * 简化版本：使用多个半透明球体模拟云朵效果
 */
export async function createClouds(): Promise<Group | null> {
  const group = new Group()
  group.userData.type = 'cloud'
  const cloud = useConfigStore().state.value.cloud
  group.visible = cloud

  try {
    const texture = await cloudTexture
    
    // 创建多个云朵实例
    const cloudCount = 15
    const positions: Vector3[] = []
    
    // 生成随机位置
    for (let i = 0; i < cloudCount; i++) {
      positions.push(new Vector3(
        (Math.random() - 0.5) * 200,
        Math.random() * 50 + 20,
        (Math.random() - 0.5) * 200
      ))
    }

    // 为每个位置创建云朵
    positions.forEach((pos, index) => {
      const cloudGroup = new Group()
      cloudGroup.position.copy(pos)
      
      // 创建多个球体组成一朵云
      const segmentCount = 5 + Math.floor(Math.random() * 5)
      for (let i = 0; i < segmentCount; i++) {
        const size = 3 + Math.random() * 4
        const cloudMesh = new Mesh(
          new SphereGeometry(size, 8, 8),
          new MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 0.3 + Math.random() * 0.2,
            color: new Color(0xffffff),
            depthWrite: false,
          })
        )
        cloudMesh.position.set(
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 8
        )
        cloudGroup.add(cloudMesh)
      }
      
      group.add(cloudGroup)
    })

    // 添加旋转动画
    const animate = () => {
      group.rotation.y += 0.0005
      group.rotation.x = Math.sin(Date.now() * 0.0001) * 0.1
      requestAnimationFrame(animate)
    }
    animate()

    return group
  } catch (error) {
    console.error('创建云朵失败:', error)
    return null
  }
}

