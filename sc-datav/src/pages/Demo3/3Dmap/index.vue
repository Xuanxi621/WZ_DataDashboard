<template>
  <div ref="canvasWrapper" class="canvas-wrapper">
    <div ref="labelRenderer" class="label-renderer"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { WebGLRenderer, Scene, PerspectiveCamera, Color } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { createLights } from './lights.vue'
import { createScene } from './scene.vue'

const canvasWrapper = ref<HTMLDivElement | null>(null)
const labelRenderer = ref<HTMLDivElement | null>(null)
let renderer: WebGLRenderer | null = null
let labelRenderer2D: CSS2DRenderer | null = null
let scene: Scene | null = null
let camera: PerspectiveCamera | null = null
let controls: OrbitControls | null = null
let animationId: number | null = null

onMounted(() => {
  if (!canvasWrapper.value || !labelRenderer.value) return

  // 创建场景
  scene = new Scene()
  scene.background = new Color('#fff5e8')

  // 创建相机
  camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 2000)
  camera.position.set(-50, 125, 250)

  // 创建WebGL渲染器
  renderer = new WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  canvasWrapper.value.appendChild(renderer.domElement)

  // 创建CSS2D渲染器（用于渲染HTML标签）
  labelRenderer2D = new CSS2DRenderer()
  labelRenderer2D.setSize(window.innerWidth, window.innerHeight)
  labelRenderer2D.domElement.style.position = 'absolute'
  labelRenderer2D.domElement.style.top = '0'
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

  // 添加灯光
  const lights = createLights()
  scene.add(lights.ambientLight)
  scene.add(lights.directionalLight)

  // 创建场景内容（异步）
  createScene(scene, camera, labelRenderer2D).then((sceneGroup) => {
    if (sceneGroup) {
      scene.add(sceneGroup)
    }
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
    if (!camera || !renderer || !labelRenderer2D) return
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    labelRenderer2D.setSize(window.innerWidth, window.innerHeight)
  }
  window.addEventListener('resize', handleResize)

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
    renderer?.dispose()
    labelRenderer2D?.domElement.remove()
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
}

.label-renderer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
