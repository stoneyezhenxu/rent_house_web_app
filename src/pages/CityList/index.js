import { useState, useEffect, useRef } from "react"
import { Space, Toast, /* IndexBar, List as AList */ } from 'antd-mobile'
import { SearchOutline } from 'antd-mobile-icons'
import { List as VList, AutoSizer } from 'react-virtualized'


import { axiosAPI as axios, getCurrentCity, setCity } from '../../utils'

import Navbar from "../../components/Navbar"

import styles from './index.module.css'
import 'react-virtualized/styles.css'

const CityList = () => {
    // 设置当前城市列表的首字母state
    const [activeIndex, setactiveIndex] = useState(0)

    // 获取当前城市列表的ref
    const cityListComponent = useRef()

    return (
        <div className={styles.cityList}>
            <Navbar
                title={'城市选择'}
                styles={styles}
                right={(
                    <div style={{ fontSize: 18 }}>
                        <Space>
                            <SearchOutline />
                        </Space>
                    </div>
                )}
            />
            <List
                activeIndex={activeIndex}
                setactiveIndex={setactiveIndex}
                cityListComponent={cityListComponent}
            />
            <Index
                activeIndex={activeIndex}
                cityListComponent={cityListComponent}
            />
            {/* <AntdList /> */}
        </div >
    )
}

const List = ({
    activeIndex,
    setactiveIndex,
    cityListComponent
}) => {
    // 获取城市列表
    const { List, Index } = useGetCityList()

    const TITLE_HEIGHT = 36
    const NAME_HEIGHT = 50
    // 计算每个字母索引下区域的行高
    const getRowHeight = ({ index }) => {
        return TITLE_HEIGHT + List[Index[index]].length * NAME_HEIGHT
    }

    // 生成列表主函数
    const rowRenderer = ({
        key,
        index,
        style
    }) => {
        const cityLetter = Index[index]

        const cityArray = List[cityLetter]

        return (
            <div
                key={key}
                style={style}
                className={styles.city}
            >
                <div className={styles.title}>
                    {
                        cityLetter === '#'
                            ? '当前城市'
                            : cityLetter === 'hot'
                                ? '热门城市'
                                : cityLetter.toLocaleUpperCase()
                    }
                </div>
                {cityArray.map((item) => (
                    <div
                        className={styles.name}
                        key={item.value}
                        // 点击更换当前城市
                        onClick={() => changeCity(item)}
                    >
                        {item.label}
                    </div>
                ))}
            </div>
        )
    }

    // 设置当前城市对应索引字母
    const onRowsRendered = ({ startIndex }) => {
        if (activeIndex !== startIndex) {
            setactiveIndex(startIndex)
        }
    }

    return (
        <AutoSizer>
            {({
                width,
                height
            }) => (
                <VList
                    ref={cityListComponent}
                    width={width}
                    height={height}
                    rowCount={Index.length}
                    rowHeight={getRowHeight}
                    rowRenderer={rowRenderer}
                    onRowsRendered={onRowsRendered}
                    scrollToAlignment={'start'}
                />
            )}
        </AutoSizer>
    )
}

const Index = ({
    activeIndex,
    cityListComponent
}) => {
    // 获取城市列表
    const { Index } = useGetCityList()

    const IndexItems = Index.map((item, index) => (
        <li
            className={styles.cityIndexItem}
            key={index}
            // 点击跳转该索引字母对应城市
            onClick={() => cityListComponent.current.scrollToRow(index)}
        >
            <span
                className={activeIndex === index
                    ? styles.indexActive
                    : ''}
            >
                {item === 'hot'
                    ? '热'
                    : item.toLocaleUpperCase()}
            </span>
        </li>
    ))

    return (
        <ul className={styles.cityIndex}>{IndexItems}</ul>
    )
}

export default CityList


// 获取城市列表的自定义hook
const useGetCityList = () => {
    // 设置城市列表及首字母列表的state
    const [List, setList] = useState({})
    const [Index, setIndex] = useState([])

    // 挂载组件时获取城市列表信息
    useEffect(() => {
        // 获取城市列表
        const getCityData = async () => {
            // 加载提示
            Toast.show({
                icon: 'loading',
                content: '加载中…',
            })

            // 获取城市数据
            const result = await axios.get(`/area/city?level=1`)
            // 获取热门城市数据
            const hotResult = await axios.get(`/area/hot`)

            // 获取城市列表和列表索引
            const { cityList, cityIndex } = formatCityData(result.data.body)

            // 获取热门城市，插入到城市列表前面
            cityList['hot'] = hotResult.data.body
            cityIndex.unshift('hot')

            // 获取当前城市，再插入到城市列表最前面
            const currentCity = await getCurrentCity()
            cityList['#'] = [currentCity]
            cityIndex.unshift('#')

            // 更新城市列表和列表索引
            setList(cityList)
            setIndex(cityIndex)

            // 清除加载提示
            Toast.clear()
        }

        getCityData()
    }, [])

    return { List, Index }
}

// 城市列表排序函数
const formatCityData = (list) => {
    const cityList = {}

    list.forEach(item => {
        // 获得输入列表各元素首字母
        const first = item.short.substr(0, 1)

        if (cityList[first]) {
            // 如同样首字母已有其他成员，则将元素添加到该字母列表后面
            cityList[first].push(item)
        } else {
            // 如同样首字母没有其他成员，新建该首字母的列表
            cityList[first] = [item]
        }
    })

    // 排序列表的索引字母
    const cityIndex = Object.keys(cityList).sort()

    return { cityList, cityIndex }
}

// 更改当前城市函数
const changeCity = ({
    label,
    value
}) => {
    const HOUSE_CITY = ['北京', '上海', '广州', '深圳']

    if (HOUSE_CITY.includes(label)) {
        // 将选定城市写入本地储存
        setCity(JSON.stringify({ label, value }))

        // 回到首页
        window.history.go(-1)
    } else {
        // 无房源时提示
        Toast.show({
            content: '该城市暂无房源数据',
            duration: 1000
        })
    }
}

