import axios from 'axios'
import { getToken, removeToken } from './auth'

export const axiosAPI = axios.create({
    //server=> ip:port 
    baseURL: process.env.REACT_APP_SITE
})

// 请求拦截器 request interceptor
axiosAPI.interceptors.request.use((config) => {
    const { url } = config
    // console.warn(`request interceptor config:${config}`)
    if (
        url.startsWith('/user')
        && !url.startsWith('/user/login')
        && !url.startsWith('/user/registered')
    ) {
        config.headers.Authorization = getToken()
    }

    return config
})

// 响应拦截器 response interceptor
axiosAPI.interceptors.response.use((response) => {
    const { status } = response.data
    // console.warn(`response interceptor response:${response}`)
    if (status === 400) {
        removeToken()
    }

    return response
})