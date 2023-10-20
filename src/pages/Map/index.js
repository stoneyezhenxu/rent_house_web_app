import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Toast } from 'antd-mobile';

import { axiosAPI as axios, BASE_URL, useCity } from '../../utils';

import Navbar from "../../components/Navbar";
import HouseItems from "../../components/HouseItems";

import styles from './index.module.css';

// 存在的bug：
// 1.因获取百度地图缩放等级不够精确的原因，部分小区会以镇的样式渲染。
// 2.手动缩放地图后，渲染等级可能出现偏差。

// 设置百度地图全局常量
const BMapGL = window.BMapGL;

const Map = () => {
    // 设置小区房源列表和是否显示列表的state
    const [list, setList] = useState([]);
    const [isShowList, setIsShowList] = useState(false);

    // 获取当前城市
    const [cityValue, cityLabel] = useCity();

    // 挂载组件时渲染地图
    useEffect(() => {
        // 创建百度地图实例
        const map = new BMapGL.Map('container');

        // 渲染地图函数
        const mapRender = () => {
            // 允许鼠标滚轮缩放地图
            map.enableScrollWheelZoom(true);

            // 添加比例尺和缩放控件
            const scaleCtrl = new BMapGL.ScaleControl();
            const zoomCtrl = new BMapGL.ZoomControl();

            map.addControl(scaleCtrl);
            map.addControl(zoomCtrl);

            //创建地址解析器实例
            const myGeo = new BMapGL.Geocoder();

            myGeo.getPoint(cityLabel, async (point) => {
                // 地图定位当前城市
                map.centerAndZoom(point, 11);

                // 渲染房源覆盖物
                renderOverlays(cityValue);
            }, cityLabel);

            // 地图移动时隐藏房屋列表
            map.addEventListener('movestart', () => setIsShowList(false));
        };

        // 覆盖物渲染函数：获取房源信息并渲染
        const renderOverlays = async (value) => {
            // 加载提示
            Toast.show({
                icon: 'loading',
                content: '加载中…',
            });

            // 获取各区房源信息和缩放级别
            const result = await axios.get(`/area/map?id=${value}`);
            const { nextZoom, type } = getTypeAndZoom(map);

            // 渲染各区房源信息
            result.data.body.forEach((item) => createOverlays(item, nextZoom, type));

            // 清除加载提示
            Toast.clear();
        };

        // 覆盖物渲染函数：判断渲染级别
        const createOverlays = (item, nextZoom, type) => {
            const {
                count,
                value,
                label: areaName,
                coord: { longitude, latitude }
            } = item;

            // 设置房源信息覆盖物位置
            const areaPoint = new BMapGL.Point(longitude, latitude);

            // 按类型判断渲染区镇还是小区
            if (type === 'circle') {
                createCircle(count, value, areaName, areaPoint, nextZoom);
            } else {
                createRect(count, value, areaName, areaPoint);
            }
        };

        // 覆盖物渲染函数：渲染区、镇房源信息函数
        const createCircle = (count, value, areaName, areaPoint, nextZoom) => {
            // 设置覆盖物位置偏移量
            const opts = {
                position: areaPoint,
                offset: new BMapGL.Size(-35, -35)
            };

            // 创建覆盖物实例
            const label = new BMapGL.Label('', opts);

            // 设置覆盖物内容
            label.setContent(`
                <div class="${styles.bubble}">
                    <p class="${styles.name}">${areaName}</p>
                    <p>${count}套</p>
                </div>
            `);

            // 设置覆盖物样式
            label.setStyle(labelStyle);

            // 设置覆盖物点击事件
            label.addEventListener('click', () => {
                // 放大被点击的位置，并清空原有的覆盖物
                map.centerAndZoom(areaPoint, nextZoom);
                map.clearOverlays();

                // 重新渲染下一级覆盖物
                renderOverlays(value);
            });

            // 渲染覆盖物
            map.addOverlay(label);
        };

        // 覆盖物渲染函数：渲染小区房源信息函数
        const createRect = (count, value, areaName, areaPoint) => {
            // 设置覆盖物位置偏移量
            const opts = {
                position: areaPoint,
                offset: new BMapGL.Size(-50, -30)
            };

            // 创建覆盖物实例
            const label = new BMapGL.Label('', opts);

            // 设置覆盖物内容
            label.setContent(`
                <div class="${styles.rect}">
                    <p class="${styles.housename}"">${areaName}</p>
                    <span class="${styles.housenum}">${count}套</span>
                    <i class="${styles.arrow}"></i>
                </div>
            `);

            // 设置覆盖物样式
            label.setStyle(labelStyle);

            // 设置覆盖物点击事件
            label.addEventListener('click', async (e) => {
                // 加载提示
                Toast.show({
                    icon: 'loading',
                    content: '加载中…',
                });

                // 当点击小区标签时，将该位置移到可视区域中间
                const target = e.domEvent.changedTouches[0];

                map.panBy(
                    window.innerWidth / 2 - target.clientX,
                    (window.innerHeight - 330) / 2 - target.clientY
                );

                // 获取小区房源，设置房源列表显示
                const result = await axios.get(`/houses?cityId=${value}`);

                setList(result.data.body.list);

                setIsShowList(true);

                // 清除加载提示
                Toast.clear();
            });

            // 渲染覆盖物
            map.addOverlay(label);
        };

        // 渲染地图
        mapRender();
    }, [cityValue, cityLabel]);

    return (
        <>
            <Navbar
                title={'地图找房'}
                styles={styles}
            />
            <div id="container" />
            <HouseList
                list={list}
                isShowList={isShowList}
            />
        </>
    );
};

const HouseList = ({
    list,
    isShowList
}) => {
    const history = useNavigate();

    return (
        <div
            className={`${styles.houseList} ${isShowList ? styles.show : ''}`}
        >
            <div className={styles.titleWrap}>
                <h1 className={styles.listTitle}>房屋列表</h1>
                <Link
                    className={styles.titleMore}
                    to="/home/search"
                >
                    更多房源
                </Link>
            </div>
            <div className={styles.houseItems}>
                {list.map((house) => (
                    <HouseItems
                        key={house.houseCode}
                        src={BASE_URL + house.houseImg}
                        title={house.title}
                        desc={house.desc}
                        tags={house.tags}
                        price={house.price}
                        styles={styles}
                        onClick={() => history(`/detail/${house.houseCode}`)}
                    />
                ))}
            </div>
        </div>
    )
};

export default Map;


// 地图覆盖物样式
const labelStyle = {
    cursor: 'pointer',
    border: '0px solid rgb(255, 0, 0)',
    padding: '0px',
    whiteSpace: 'nowrap',
    fontSize: '12px',
    color: 'rgb(255, 255, 255)',
    textAlign: 'center'
};

// 缩放级别设置函数
const getTypeAndZoom = (map) => {
    const zoom = map.getZoom();
    let nextZoom, type;

    if (zoom >= 10 && zoom < 11) {
        nextZoom = 13
        type = 'circle'
    } else if (zoom >= 11 && zoom < 15) {
        nextZoom = 15
        type = 'circle'
    } else if (zoom >= 14 && zoom < 16) {
        type = 'rect'
    }

    return { nextZoom, type };
};