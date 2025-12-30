import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'

export interface LabelProps {
  text: string
  position: [number, number, number]
  center?: boolean
  distanceFactor?: number
  zIndexRange?: [number, number]
}

/**
 * 创建3D场景中的HTML标签
 * 使用CSS2DRenderer在Three.js场景中渲染HTML元素
 */
export function createLabel(props: LabelProps): CSS2DObject {
  const { text, position, center = false, distanceFactor = 100 } = props

  // 创建HTML元素
  const labelDiv = document.createElement('div')
  labelDiv.className = 'three-label'
  labelDiv.textContent = text
  labelDiv.style.pointerEvents = 'none'
  labelDiv.style.width = 'max-content'
  labelDiv.style.display = 'flex'
  labelDiv.style.background = '#ffffff'
  labelDiv.style.border = '1px solid #fdb961'
  labelDiv.style.color = '#fdb961'
  labelDiv.style.fontSize = '14px'
  labelDiv.style.paddingInline = '4px'
  labelDiv.style.borderRadius = '4px'
  labelDiv.style.whiteSpace = 'nowrap'

  // 创建CSS2DObject
  const label = new CSS2DObject(labelDiv)
  label.position.set(...position)
  
  if (center) {
    // 如果需要居中，调整元素样式
    labelDiv.style.textAlign = 'center'
  }

  return label
}

// 默认导出函数
export default createLabel

