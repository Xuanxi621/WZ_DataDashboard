<template>
  <AutoFit>
    <Headder ref="topBox.ref" />
    <div class="grid-wrapper">
      <div ref="leftBox.ref" class="card" :style="{ gridArea: '1 / 1 / 3 / 2' }">
        <div class="card-title">
          2025年规模指标分析<span>INDICATOR ANALYSIS</span>
        </div>
        <Chart1 />
      </div>
      <div ref="leftBox1.ref" class="card" :style="{ gridArea: '3 / 1 / 5 / 2' }">
        <div class="card-title">
          企业税收分析<span>TAX ANALYSIS</span>
        </div>
        <Chart2 />
      </div>
      <div ref="leftBox2.ref" class="card" :style="{ gridArea: '5 / 1 / 7 / 2' }">
        <div class="card-title">
          行政处罚信息<span>PENALTY INFORMATION</span>
        </div>
        <Chart3 />
      </div>
      <div ref="rightBox.ref" class="card" :style="{ gridArea: '1 / 4 / 3 / 5' }">
        <div class="card-title">
          企业收益总数统计<span>REVENUE STATISTICS</span>
        </div>
        <Chart4 />
      </div>
      <div ref="rightBox1.ref" class="card" :style="{ gridArea: '3 / 4 / 5 / 5' }">
        <div class="card-title">
          企业能耗分析<span>ENERGY CONSUMPTION ANALYSIS</span>
        </div>
        <Chart5 />
      </div>
      <div ref="rightBox2.ref" class="card" :style="{ gridArea: '5 / 4 / 7 / 5' }">
        <div class="card-title">
          企业税收分析<span>TAX ANALYSIS</span>
        </div>
        <Chart6 />
      </div>
    </div>
    <Footer ref="bottomBox.ref" />
  </AutoFit>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import useMoveTo from './composables/useMoveTo'
import { useConfigStore } from './stores'
import AutoFit from './components/AutoFit.vue'
import Headder from './headder.vue'
import Footer from './footer.vue'
import Chart1 from './chart1.vue'
import Chart2 from './chart2.vue'
import Chart3 from './chart3.vue'
import Chart4 from './chart4.vue'
import Chart5 from './chart5.vue'
import Chart6 from './chart6.vue'

const configStore = useConfigStore()

const topBox = useMoveTo('toBottom', 0.6)
const leftBox = useMoveTo('toRight', 0.8, 0.5)
const leftBox1 = useMoveTo('toRight', 0.8, 0.6)
const leftBox2 = useMoveTo('toRight', 0.8, 0.7)
const rightBox = useMoveTo('toLeft', 0.8, 0.5)
const rightBox1 = useMoveTo('toLeft', 0.8, 0.6)
const rightBox2 = useMoveTo('toLeft', 0.8, 0.7)
const bottomBox = useMoveTo('toTop', 0.8, 0.5)

let unMapPlaySub: (() => void) | null = null
let unModeSub: (() => void) | null = null

onMounted(() => {
  unMapPlaySub = configStore.subscribe(
    (s) => s.mapPlayComplete,
    (v) => {
      if (v) {
        topBox.restart()
        bottomBox.restart()
        leftBox.restart()
        leftBox1.restart()
        leftBox2.restart()
        rightBox.restart()
        rightBox1.restart()
        rightBox2.restart()
      }
    }
  )

  unModeSub = configStore.subscribe(
    (s) => s.mode,
    (v) => {
      if (v) {
        topBox.restart()
        leftBox.restart()
        leftBox1.restart()
        leftBox2.restart()
        rightBox.restart()
        rightBox1.restart()
        rightBox2.restart()
      } else {
        topBox.reverse()
        leftBox.reverse()
        leftBox1.reverse()
        leftBox2.reverse()
        rightBox.reverse()
        rightBox1.reverse()
        rightBox2.reverse()
      }
    }
  )
})

onUnmounted(() => {
  unMapPlaySub?.()
  unModeSub?.()
})
</script>

<style scoped>
.grid-wrapper {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-template-rows: repeat(6, minmax(0, 1fr));
  gap: 20px;
  padding: 20px;
}

.card {
  position: relative;
  background: rgba(255, 245, 232, 0.65);
  border: 1px solid rgba(255, 145, 0, 0.3);
  padding: 15px;
  backdrop-filter: blur(4px);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  pointer-events: auto;
  z-index: 9999;
}

.card::before {
  content: '';
  position: absolute;
  top: -1px;
  left: -1px;
  width: 10px;
  height: 10px;
  border-top: 2px solid #ea580c;
  border-left: 2px solid #ea580c;
  transition: all 0.3s ease;
  pointer-events: none;
}

.card::after {
  content: '';
  position: absolute;
  bottom: -1px;
  right: -1px;
  width: 10px;
  height: 10px;
  border-bottom: 2px solid #ea580c;
  border-right: 2px solid #ea580c;
  transition: all 0.3s ease;
  pointer-events: none;
}

.card:hover::before,
.card:hover::after {
  width: 100%;
  height: 100%;
  opacity: 0.5;
}

.card-title {
  font-size: 18px;
  margin-bottom: 10px;
  padding-left: 10px;
  border-left: 4px solid #fdb961;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #5a4a42;
}

.card-title span {
  font-size: 10px;
  color: rgba(0, 0, 0, 0.4);
  font-weight: normal;
}
</style>

