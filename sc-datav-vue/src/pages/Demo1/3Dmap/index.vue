<template>
  <div ref="canvasWrapper" class="canvas-wrapper">
    <div ref="labelRenderer" class="label-renderer"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { WebGLRenderer, Scene, PerspectiveCamera, Color, Group } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { createLights } from './lights'
import { createScene } from './scene'
import { useConfigStore } from '../stores'

const canvasWrapper = ref<HTMLDivElement | null>(null)
const labelRenderer = ref<HTMLDivElement | null>(null)
let renderer: WebGLRenderer | null = null
let labelRenderer2D: CSS2DRenderer | null = null
let scene: Scene | null = null
let camera: PerspectiveCamera | null = null
let controls: OrbitControls | null = null
let animationId: number | null = null
let sceneGroup: Group | null = null
const configStore = useConfigStore()
let unsubCloud: (() => void) | null = null
let unsubBar: (() => void) | null = null
let unsubRotation: (() => void) | null = null
let unsubHeat: (() => void) | null = null

onMounted(() => {
  if (!canvasWrapper.value || !labelRenderer.value) return

  // 创建场景
  scene = new Scene()
  scene.background = new Color('#fff5e8')

  // 获取容器尺寸
  const width = canvasWrapper.value.clientWidth || window.innerWidth
  const height = canvasWrapper.value.clientHeight || window.innerHeight

  // 创建相机
  camera = new PerspectiveCamera(50, width / height, 1, 2000)
  // 初始相机位置（动画会移动到 60, 125, 160）
  camera.position.set(-50, 125, 250)
  camera.lookAt(0, 0, 0)

  // 创建WebGL渲染器
  renderer = new WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  // 确保canvas样式正确
  renderer.domElement.style.position = 'absolute'
  renderer.domElement.style.top = '0'
  renderer.domElement.style.left = '0'
  renderer.domElement.style.width = '100%'
  renderer.domElement.style.height = '100%'
  renderer.domElement.style.outline = 'none'
  renderer.domElement.style.pointerEvents = 'auto'
  canvasWrapper.value.appendChild(renderer.domElement)

  // 创建CSS2D渲染器（用于渲染HTML标签）
  labelRenderer2D = new CSS2DRenderer()
  labelRenderer2D.setSize(width, height)
  labelRenderer2D.domElement.style.position = 'absolute'
  labelRenderer2D.domElement.style.top = '0'
  labelRenderer2D.domElement.style.left = '0'
  labelRenderer2D.domElement.style.width = '100%'
  labelRenderer2D.domElement.style.height = '100%'
  labelRenderer2D.domElement.style.pointerEvents = 'none'
  labelRenderer.value.appendChild(labelRenderer2D.domElement)

  // 创建控制器
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enablePan = true
  controls.enableZoom = true
  controls.enableRotate = true
  controls.zoomSpeed = 0.3
  controls.minDistance = 100
  controls.maxDistance = 300
  controls.maxPolarAngle = 1.5
  // 设置控制器的目标点（场景中心）
  controls.target.set(0, 0, 0)
  controls.update()

  // 添加灯光
  const lights = createLights()
  scene.add(lights.ambientLight)
  scene.add(lights.directionalLight)

  // 创建场景内容（异步）
  createScene(scene, camera, labelRenderer2D).then((group) => {
    if (group) {
      sceneGroup = group
      if (scene) {
        scene.add(sceneGroup)
      }
      // 确保相机看向场景中心
      if (camera) {
        camera.lookAt(0, 0, 0)
      }
      controls?.update()
      
      // 订阅状态变化，更新3D对象可见性
      const updateVisibility = () => {
        if (!sceneGroup) return
        const state = configStore.state.value
        
        // 遍历场景组，根据名称更新可见性
        sceneGroup.traverse((obj) => {
          if (obj.userData.type === 'cloud') {
            obj.visible = state.cloud
          } else if (obj.userData.type === 'bar' || obj.userData.isBar) {
            obj.visible = state.bar
          } else if (obj.userData.type === 'rotation') {
            obj.visible = state.rotation
          } else if (obj.userData.type === 'heat') {
            obj.visible = state.heat
          }
        })
      }
      
      // 订阅各个状态变化
      unsubCloud = configStore.subscribe(
        (s) => s.cloud,
        () => updateVisibility()
      )
      unsubBar = configStore.subscribe(
        (s) => s.bar,
        () => updateVisibility()
      )
      unsubRotation = configStore.subscribe(
        (s) => s.rotation,
        () => updateVisibility()
      )
      unsubHeat = configStore.subscribe(
        (s) => s.heat,
        () => updateVisibility()
      )
      
      // 初始更新
      updateVisibility()
    }
  }).catch((error) => {
    console.error('创建场景失败:', error)
  })

  // 动画循环
  const animate = () => {
    animationId = requestAnimationFrame(animate)
    controls?.update()
    if (renderer && scene && camera) {
      renderer.render(scene, camera)
    }
    if (labelRenderer2D && scene && camera) {
      labelRenderer2D.render(scene, camera)
    }
  }
  animate()

  // 窗口大小调整
  const handleResize = () => {
    if (!camera || !renderer || !labelRenderer2D || !canvasWrapper.value) return
    const width = canvasWrapper.value.clientWidth
    const height = canvasWrapper.value.clientHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
    labelRenderer2D.setSize(width, height)
  }
  window.addEventListener('resize', handleResize)

  // 初始调整大小
  handleResize()

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
    // 取消订阅
    unsubCloud?.()
    unsubBar?.()
    unsubRotation?.()
    unsubHeat?.()
    if (renderer) {
      renderer.dispose()
      renderer.domElement.remove()
    }
    if (labelRenderer2D) {
      labelRenderer2D.domElement.remove()
    }
    controls?.dispose()
  })
})
</script>

<style scoped>
.canvas-wrapper {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
}

.label-renderer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
  overflow: hidden;
}
</style>
