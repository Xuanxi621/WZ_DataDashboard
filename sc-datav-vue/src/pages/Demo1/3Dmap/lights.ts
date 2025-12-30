import { DirectionalLight, AmbientLight } from 'three'

/**
 * 创建3D场景中的灯光
 * @returns 包含环境光和方向光的对象
 */
export function createLights() {
  const ambientLight = new AmbientLight('#fff5e8', 2)
  
  const directionalLight = new DirectionalLight('#fff5e8', 12)
  directionalLight.position.set(0, 200, 20)
  directionalLight.castShadow = true
  
  return {
    ambientLight,
    directionalLight,
  }
}

