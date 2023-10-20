import { useState, useEffect } from 'react'
import { Grid } from 'antd-mobile'

import { axiosAPI as axios, BASE_URL, useCity } from '../../../utils'

import styles from './index.module.css'

const News = () => {
    // 设置资讯数据和加载状态state
    const [news, setNews] = useState([])
    const [newsLoaded, setNewsLoaded] = useState(false)

    // 获取当前城市
    const [cityValue] = useCity()

    // 获取当前城市资讯数据，如果切换城市则重新获取
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

        //  卸载组件时取消加载状态，防止内存溢出
        return () => {
            setNewsLoaded(false)
        }
    }, [cityValue])

    // 生成资讯数据
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


    // 判断是否有加载最新资讯数据，如已加载则显示最新资讯
    return (
        <div className={styles.news}>
            {newsLoaded && <Grid columns={1}>{newsItems}</Grid>}
        </div>
    )
}

export default News