<template>
  <SeamVirtualScroll
    :row-height="50"
    :styles="{
      header: { color: 'rgba(0, 0, 0, 0.6)' },
      body: { color: '#000000' },
    }"
    :column="columns"
    :data="tableData" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import SeamVirtualScroll from './components/SeamVirtualScroll.vue'
import { api } from '../../api'

const tableDataRaw = ref<Array<{
  value1: string
  value2: string
  value3: string
  value4: { type: string; content: string }
}>>([])

const columns = [
  { title: '省份', dataIndex: 'value1', noScroll: true },
  {
    title: '专利编号',
    dataIndex: 'value2',
    align: 'center',
    noScroll: true,
  },
  {
    title: '处罚金额',
    dataIndex: 'value3',
    align: 'right',
    noScroll: true,
  },
  {
    title: '同比百分比',
    dataIndex: 'value4',
    align: 'right',
    noScroll: true,
  },
]

onMounted(async () => {
  try {
    const data = await api.getTableData()
    tableDataRaw.value = data.map(item => {
      const percent = item.year_over_year_percent
      return {
        value1: item.province,
        value2: item.patent_number,
        value3: item.penalty_amount.toLocaleString('zh-CN', {
          maximumFractionDigits: 2,
        }),
        value4: {
          type: 'html',
          content: `<span style="color: ${
            percent > 90 ? '#fbdf88' : percent > 60 ? '#ffa800' : '#ea580c'
          }">${percent
            .toLocaleString('zh-CN', {
              maximumFractionDigits: 2,
            })
            .concat('%')}</span>`,
        },
      }
    })
  } catch (error) {
    console.error('Failed to load chart3 data:', error)
  }
})

const tableData = computed(() => tableDataRaw.value)
</script>

