import { Group, Shape, ShapeGeometry, ExtrudeGeometry, Mesh, LineSegments, EdgesGeometry, MeshStandardMaterial, LineBasicMaterial, DoubleSide, Vector3 } from 'three'
import type { Box2, Vector2, Texture } from 'three'
import type { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { createShape } from './shape'
import { createBar } from './bar'
import { createLabel } from './label'
import { createTooltip } from './tooltip'
import cityData from '../cityData'

export interface CityProps {
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
    }, async (barHeight: number, barGroup) => {
      if (!barGroup) return
      
      // 标记bar对象（必须在添加到场景前标记）
      barGroup.userData.type = 'bar'
      barGroup.traverse((obj) => {
        obj.userData.type = 'bar'
        obj.userData.isBar = true
      })
      
      // 将barGroup添加到group
      group.add(barGroup)
      
      // 创建标签 - 标签应该添加到barGroup中，使用相对于barGroup的局部坐标
      // 这样标签就会正确地显示在每个柱状图的上方，不会重叠
      const label = createLabel({
        text: data.city,
        // 使用相对于barGroup的局部坐标
        position: [0, 0, barHeight + 0.2],
        center: true,
        distanceFactor: 100,
      })
      barGroup.add(label)

      // 创建提示框 - 同样添加到barGroup中
      const tooltip = createTooltip({
        data: {
          city: data.city,
          ...cityData[data.city as keyof typeof cityData],
        },
        position: [0, 0, barHeight + 7],
        visible: false,
      })
      barGroup.add(tooltip.object)

      // 绑定交互
      group.userData.onPointerOver = () => {
        onPointerOver()
        tooltip.open()
      }
      group.userData.onPointerOut = () => {
        onPointerOut()
        tooltip.close()
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

