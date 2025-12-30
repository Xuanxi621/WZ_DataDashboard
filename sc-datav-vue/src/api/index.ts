// 使用相对路径，通过 Vite 代理转发到后端
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export interface City {
  id: number
  name: string
  population: number
  gdp: string
  area: string
}

export interface TimeSeriesData {
  id: number
  date: string
  current_year_value: number
  last_year_value: number
}

export interface Statistics {
  id: number
  total_revenue: number
  company_count: number
}

export interface LineChartData {
  id: number
  index: number
  value: number
}

export interface PieData {
  id: number
  name: string
  value: number
  order: number
}

export interface BarData {
  id: number
  category: string
  value: number
  order: number
}

export interface TableData {
  id: number
  province: string
  patent_number: string
  penalty_amount: number
  year_over_year_percent: number
}

// API 请求函数
async function fetchAPI<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`)
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`)
  }
  return response.json()
}

export const api = {
  // 图表1: 获取人口前5的城市
  getTopCities: (): Promise<City[]> => {
    return fetchAPI<City[]>('/cities/top_cities/')
  },

  // 图表2: 获取时间序列数据
  getTimeSeriesData: (): Promise<TimeSeriesData[]> => {
    return fetchAPI<TimeSeriesData[]>('/time-series/')
  },

  // 图表3: 获取表格数据
  getTableData: (): Promise<TableData[]> => {
    return fetchAPI<TableData[]>('/table/')
  },

  // 图表4: 获取统计数据
  getStatistics: (): Promise<Statistics> => {
    return fetchAPI<Statistics>('/statistics/latest/')
  },

  // 图表4: 获取折线图数据
  getLineChartData: (): Promise<LineChartData[]> => {
    return fetchAPI<LineChartData[]>('/line-chart/')
  },

  // 图表5: 获取饼图数据
  getPieData: (): Promise<PieData[]> => {
    return fetchAPI<PieData[]>('/pie/')
  },

  // 图表6: 获取柱状图数据
  getBarData: (): Promise<BarData[]> => {
    return fetchAPI<BarData[]>('/bar/')
  },
}

