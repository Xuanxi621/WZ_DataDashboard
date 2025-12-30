import axios from "axios"

// 创建axios实例
const httpInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    timeout: 5000
})

// 请求拦截器
httpInstance.interceptors.request.use(config => {
    // 在发送请求前可以做一些处理，如添加token等
    return config
}, error => {
    return Promise.reject(error)
})

// 响应拦截器
httpInstance.interceptors.response.use(response => {
    return response.data
}, error => {
    return Promise.reject(error)
})

export default httpInstance
