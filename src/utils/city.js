import { useState, useEffect } from 'react'
import { axiosAPI as axios } from './axios'

const TOKEN_NAME = 'hkzf_city'
const a = undefined
const getCurrentCity = () => {
    // 获取本地储存中的城市
    const localCity = JSON.parse(localStorage.getItem(TOKEN_NAME))

    if (!localCity) {
        return new Promise((resolve, reject) => {
            // 本地储存中不存在城市信息时通过定位获取

            // 设置百度地图全局常量
            const currentCity = new window.BMapGL.LocalCity()

            currentCity.get(async (res) => {
                try {

                    //res.name = undefined => api default response: "body": {"label": "上海","value": "AREA|dbf46d32-7e76-1196"
                    const result = await axios.get(`/area/info?name=${res.name}`)

                    localStorage.setItem('hkzf_city', JSON.stringify(result.data.body))

                    resolve(result.data.body)
                } catch (e) {
                    reject(e)
                }
            })
        })
    } else {
        return Promise.resolve(localCity)
    }
}

// 获取当前城市的自定义hook
const useCity = () => {
    // 设置当前城市名称和id的state
    const [value, setValue] = useState('')
    const [label, setLabel] = useState('')

    // 挂载时获取当前城市
    useEffect(() => {
        const getCity = async () => {
            const result = await getCurrentCity()

            setValue(result.value)

            setLabel(result.label)
        }

        getCity()
        console.log('再次渲染了useCity!')
    }, [])

    return [value, label]
}

// 如果当前页面调用getCity但是token丢失，会直接报错，不建议使用
const getCity = () => JSON.parse(localStorage.getItem(TOKEN_NAME))

const setCity = (value) => localStorage.setItem(TOKEN_NAME, value)

export { getCurrentCity, useCity, getCity, setCity }