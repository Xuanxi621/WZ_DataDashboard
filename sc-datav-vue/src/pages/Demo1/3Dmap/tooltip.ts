import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'

export interface TooltipData {
  city: string
  population: number
  gdp: string
  area: string
}

export interface TooltipProps {
  data: TooltipData
  position: [number, number, number]
  visible?: boolean
  center?: boolean
  distanceFactor?: number
  zIndexRange?: [number, number]
}

/**
 * 创建3D场景中的HTML提示框
 * 使用CSS2DRenderer在Three.js场景中渲染HTML元素
 */
export function createTooltip(props: TooltipProps) {
  const { data, position, visible = false, center = true, distanceFactor = 100 } = props
  let isVisible = visible

  // 创建HTML元素
  const tooltipDiv = document.createElement('div')
  tooltipDiv.className = 'three-tooltip'
  tooltipDiv.style.display = isVisible ? 'block' : 'none'
  tooltipDiv.style.pointerEvents = 'none'
  tooltipDiv.style.background = 'rgba(255, 245, 232, 0.7)'
  tooltipDiv.style.backdropFilter = 'blur(10px)'
  tooltipDiv.style.borderRadius = '8px'
  tooltipDiv.style.padding = '12px 16px'
  tooltipDiv.style.color = '#656565'
  tooltipDiv.style.fontSize = '12px'
  tooltipDiv.style.border = '1px solid rgba(255, 255, 255, 0.2)'
  tooltipDiv.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)'
  tooltipDiv.style.minWidth = '120px'

  // 创建内容
  const cityName = document.createElement('div')
  cityName.className = 'city-name'
  cityName.style.fontWeight = 'bold'
  cityName.style.marginBottom = '8px'
  cityName.style.color = '#ea580c'
  cityName.textContent = data.city

  const createDataItem = (label: string, value: string) => {
    const item = document.createElement('div')
    item.className = 'data-item'
    item.style.display = 'flex'
    item.style.justifyContent = 'space-between'
    item.style.marginBottom = '4px'

    const labelSpan = document.createElement('span')
    labelSpan.textContent = label + ':'

    const valueSpan = document.createElement('span')
    valueSpan.textContent = value

    item.appendChild(labelSpan)
    item.appendChild(valueSpan)
    return item
  }

  tooltipDiv.appendChild(cityName)
  tooltipDiv.appendChild(createDataItem('人口', `${data.population}万`))
  tooltipDiv.appendChild(createDataItem('GDP', data.gdp))
  tooltipDiv.appendChild(createDataItem('面积', data.area))

  // 创建CSS2DObject
  const tooltip = new CSS2DObject(tooltipDiv)
  tooltip.position.set(...position)

  // 控制显示/隐藏的方法
  const open = () => {
    isVisible = true
    tooltipDiv.style.display = 'block'
  }

  const close = () => {
    isVisible = false
    tooltipDiv.style.display = 'none'
  }

  return {
    object: tooltip,
    open,
    close,
  }
}

// 默认导出函数
export default createTooltip

