<template>
  <div
    class="wrapper"
    @mouseenter="hoverHandler(false)"
    @mouseleave="hoverHandler(true)">
    <div class="header-wrapper" :style="styles?.header">
      <div
        v-for="(el, idx) in column"
        :key="idx"
        class="header-item"
        :style="{ textAlign: el.align ?? 'left', flex: el.flex ?? 1 }">
        {{ el?.title }}
      </div>
    </div>

    <div ref="warper" class="table">
      <div
        ref="contentRef"
        class="table-content"
        :style="styles?.body"
        @transitionend="onTransitionEnd">
        <div
          v-for="(item, idx) in renderList"
          :key="idx + activeIndex"
          class="body-row-wrapper"
          :style="{ height: `${rowHeight}px` }">
          <div
            v-for="(el, colIdx) in column"
            :key="colIdx"
            class="body-row-item"
            :style="{ textAlign: el.align ?? 'left', flex: el.flex ?? 1 }">
            <template v-if="el.noScroll">
              <template v-if="el.render">
                {{ el.render(idx + activeIndex) }}
              </template>
              <template v-else>
                <span v-if="typeof item[el.dataIndex ?? ''] === 'object' && item[el.dataIndex ?? ''].type === 'html'" v-html="item[el.dataIndex ?? ''].content"></span>
                <span v-else>{{ item[el.dataIndex ?? ''] }}</span>
              </template>
            </template>
            <span v-else class="scroll-item">
              <template v-if="el.render">
                {{ el.render(idx + activeIndex) }}
              </template>
              <template v-else>
                <span v-if="typeof item[el.dataIndex ?? ''] === 'object' && item[el.dataIndex ?? ''].type === 'html'" v-html="item[el.dataIndex ?? ''].content"></span>
                <span v-else>{{ item[el.dataIndex ?? ''] }}</span>
              </template>
            </span>
          </div>
        </div>
        <div v-if="!(renderList.length > 0)" class="empty">暂无数据</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import useAnimationFrame from '../composables/useAnimationFrame'
import useSize from '../composables/useSize'

interface Column {
  title?: string
  dataIndex?: string
  align?: 'center' | 'left' | 'right'
  flex?: number
  noScroll?: boolean
  render?: (index: number) => any
}

interface Props {
  speed?: number
  rowHeight?: number
  column?: Column[]
  data?: Record<string, any>[]
  styles?: {
    header?: Record<string, any>
    body?: Record<string, any>
  }
}

const props = withDefaults(defineProps<Props>(), {
  speed: 3000,
  rowHeight: 48,
  column: () => [],
  data: () => [],
  styles: () => ({}),
})

const lastTime = ref<number>(0)
const warper = ref<HTMLDivElement | null>(null)
const contentRef = ref<HTMLDivElement | null>(null)
const size = useSize(warper)
const warperHeight = computed(() => size.value?.height ?? 0)
const isScroll = ref(true)
const activeIndex = ref(0)

const scrollData = computed(() => {
  const rowH = props.rowHeight + 2
  const height = warperHeight.value
  const _isScroll = props.data.length * rowH > height && height > 0
  const _len = Math.ceil(height / rowH)

  let list = props.data
  if (_isScroll) {
    list = list.concat(props.data.slice(0, _len))
  }
  return {
    isScrollHeight: _isScroll,
    len: _len,
    data: list,
  }
})

const renderList = computed(() => {
  if (contentRef.value) {
    contentRef.value.style.setProperty('transform', 'translate3d(0, 0, 0)')
    contentRef.value.style.setProperty('transition', 'none')
  }
  return scrollData.value.data.slice(activeIndex.value, activeIndex.value + scrollData.value.len)
})

const shouldAnimate = computed(() => isScroll.value && scrollData.value.isScrollHeight)

useAnimationFrame((timestamp: number) => {
  if (timestamp - lastTime.value >= props.speed) {
    if (contentRef.value) {
      contentRef.value.style.setProperty(
        'transform',
        `translate3d(0, ${-(props.rowHeight + 2)}px, 0)`
      )
      contentRef.value.style.setProperty(
        'transition',
        `transform 300ms ease-in 0s`
      )
    }
    lastTime.value = timestamp
  }
}, shouldAnimate)

const onTransitionEnd = () => {
  activeIndex.value = (activeIndex.value + 1) % props.data.length
}

const hoverHandler = (flag: boolean) => {
  isScroll.value = flag
}
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  transform: translate3d(0px, 0px, 0px);
  mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
}

.table {
  flex: 1 1 0;
  position: relative;
  height: 100%;
  overflow: hidden;
}

.table-content {
  color: #ffffff;
}

.header-wrapper {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  height: 40px;
  color: #ffffff;
  overflow-wrap: break-word;
}

.header-item {
  flex: 1;
}

.body-row-wrapper {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  padding-inline: 0.5rem;
  margin: 2px;
  border-width: 1px 0;
  border-style: solid;
}

.body-row-wrapper:nth-child(odd) {
  border-color: rgba(255, 255, 255, 0.1);
}

.body-row-wrapper:nth-child(even) {
  border-color: transparent;
}

.body-row-item {
  flex: 1;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  container-type: inline-size;
}

.scroll-item {
  display: flex;
  width: max-content;
  animation: marquee 3s linear infinite both alternate;
}

@keyframes marquee {
  from {
    transform: translateX(0px);
  }
  to {
    transform: translateX(min(100cqw - 100%, 0px));
  }
}

.empty {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
}
</style>

