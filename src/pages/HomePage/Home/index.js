import { axiosAPI as axios, SITE_URL } from '../../../utils'
import { useState, useEffect } from 'react'
import { Swiper, Grid } from 'antd-mobile'

import styles from './index.module.css'
const Home = () => {
  return <>

    <div className={styles.swipers}>
      <Swipers />
    </div>
  </>
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
          src={`${SITE_URL}${item.imgSrc}`}
          alt=""
          style={{ width: '100%' }}
        />
      </div>
    </Swiper.Item>
  ))

  return (
    // 判断是否有加载轮播图，如已加载则显示轮播图
    swipersLoaded && <Swiper autoplay loop>{swiperItems}</Swiper>)
}


export default Home