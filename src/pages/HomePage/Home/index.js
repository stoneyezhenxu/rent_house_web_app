import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Swiper, Grid } from 'antd-mobile'

import { axiosAPI as axios, BASE_URL, useCity } from '../../../utils'

import SearchBar from '../../../components/SearchBar'

import styles from './index.module.css'

import Nav1 from '../../../assets/images/nav-1.png'
import Nav2 from '../../../assets/images/nav-2.png'
import Nav3 from '../../../assets/images/nav-3.png'
import Nav4 from '../../../assets/images/nav-4.png'

const Home = () => {
    // 获取当前城市
    const [cityValue, cityLabel] = useCity()

    return (
        <>
            {/* 轮播图&搜索栏 */}
            <div className={styles.swipers}>
                <Swipers />
                <SearchBar
                    city={cityLabel}
                    styles={styles}
                />
            </div>

            {/* 标签栏  TarBar*/}
            <Nav />

            {/* 租房小租 group */}
            <div className={styles.groups}>
                <h3 className={styles.groupsTitle}>
                    租房小组
                    <span className={styles.more}>更多</span>
                </h3>
                <Groups cityValue={cityValue} />
            </div>

            {/* 最新资讯 news */}
            <div className={styles.news}>
                <h3 className={styles.newsTitle}>
                    最新资讯
                </h3>
                <News cityValue={cityValue} />
            </div>
        </>
    )
}

const Swipers = () => {
    // 设置轮播图数据和加载状态state
    const [swipers, setSwipers] = useState([])
    const [swipersLoaded, setSwipersLoaded] = useState(false)

    // 第一次挂载组件时获取轮播图数据
    useEffect(() => {
        const getSwipers = async () => {
            const swipersRes = await axios.get(`/home/swiper`)

            setSwipers(swipersRes.data.body)
            setSwipersLoaded(true)
        }

        getSwipers()

        // 卸载组件时取消加载状态，防止内存溢出
        return () => {
            setSwipersLoaded(false)
        }
    }, [])

    // 生成轮播图列表
    const swiperItems = swipers.map((item) => (
        <Swiper.Item key={item.id}>
            <div>
                <img
                    src={`${BASE_URL}${item.imgSrc}`}
                    alt=""
                    style={{ width: '100%' }}
                />
            </div>
        </Swiper.Item>
    ))

    return (
        // 判断是否有加载轮播图，如已加载则显示轮播图
        swipersLoaded && <Swiper autoplay loop>{swiperItems}</Swiper>
    )
}

const Nav = () => {
    const navs = [
        {
            id: 1,
            img: Nav1,
            title: '整租',
            path: '/home/search'
        },
        {
            id: 2,
            img: Nav2,
            title: '合租',
            path: '/home/search'
        },
        {
            id: 3,
            img: Nav3,
            title: '地图找房',
            path: '/map'
        },
        {
            id: 4,
            img: Nav4,
            title: '去出租',
            path: '/rent/add'
        },
    ]

    const history = useNavigate()

    return (
        <Grid
            columns={4}
            className={styles.nav}
        >
            {navs.map((item) => (
                <Grid.Item
                    key={item.id}
                    onClick={() => history(item.path)}
                >
                    <div className={styles.navGrid}>
                        <img
                            src={item.img}
                            alt={item.title}
                            className={styles.navImg}
                        />
                        <h2>{item.title}</h2>
                    </div>
                </Grid.Item>))
            }
        </Grid>
    )
}

const Groups = ({ cityValue }) => {
    // 设置租房小组数据和加载状态state
    const [groups, setGroups] = useState([])
    const [groupsLoaded, setGroupsLoaded] = useState(false)

    // 第一次挂载组件时获取当前城市租房小组数据
    useEffect(() => {
        const getGroups = async (id) => {
            const groupsRes = await axios.get(`/home/groups`, {
                params: {
                    area: id
                }
            })

            setGroups(groupsRes.data.body)
            setGroupsLoaded(true)
        }

        getGroups(cityValue)

        // 卸载组件时取消加载状态，防止内存溢出
        return () => {
            setGroupsLoaded(false)
        }
    }, [cityValue])

    // 生成租房小组数据
    const groupItems = groups.map((item) => (
        <Grid.Item key={item.id}>
            <div className={styles.desc}>
                <p className={styles.title}>{item.title}</p>
                <span className={styles.info}>{item.desc}</span>
            </div>
            <img
                src={`${BASE_URL}${item.imgSrc}`}
                alt={item.title}
                className={styles.groupsImg}
            />
        </Grid.Item >
    ))

    return (
        // 判断是否有加载租房小组数据，如已加载则显示租房小组
        groupsLoaded && <Grid columns={2} gap={10}>{groupItems}</Grid>
    )
}

const News = ({ cityValue }) => {
    // 设置最新资讯数据和加载状态state
    const [news, setNews] = useState([])
    const [newsLoaded, setNewsLoaded] = useState(false)

    // 第一次挂载组件时获取当前城市最新资讯数据
    useEffect(() => {
        const getNews = async (id) => {
            const newsRes = await axios.get(`/home/news`, {
                params: {
                    area: id
                }
            })

            setNews(newsRes.data.body)
            setNewsLoaded(true)
        }

        getNews(cityValue)

        // 卸载组件时取消加载状态，防止内存溢出
        return () => {
            setNewsLoaded(false)
        }
    }, [cityValue])

    // 生成最新资讯数据
    const newsItems = news.map((item) => (
        <Grid.Item key={item.id}>
            <img
                src={`${BASE_URL}${item.imgSrc}`}
                alt={item.title}
                className={styles.newsImg}
            />
            <div className={styles.desc}>
                <h2 className={styles.title}>{item.title}</h2>
                <span className={styles.media}>{item.from}</span>
                <span className={styles.date}>{item.date}</span>
            </div>
        </Grid.Item >
    ))

    return (
        // 判断是否有加载最新资讯数据，如已加载则显示最新资讯
        newsLoaded && <Grid columns={1}>{newsItems}</Grid>
    )
}

export default Home