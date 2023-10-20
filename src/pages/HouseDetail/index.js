import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Toast, Swiper, Grid, Modal } from 'antd-mobile';

import { axiosAPI as axios, BASE_URL, isAuth, useCity } from '../../utils';

import HousePackage from '../../components/HousePackage';
import HouseItems from '../../components/HouseItems';
import Navbar from '../../components/Navbar';

import styles from './index.module.css';

// 设置百度地图全局常量
const BMapGL = window.BMapGL;

const HouseDetail = () => {
    // 获取params
    const { id } = useParams();

    const history = useNavigate();

    // 设置房屋详情和加载状态state
    const [houseData, setHouseData] = useState({});
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        const getHouseDetail = async (houseId) => {
            const result = await axios.get(`/houses/${houseId}`);

            // 更新房屋详情和加载状态
            setHouseData(result.data.body);

            setDataLoaded(true);

            // 获取坐标和小区名称
            const { coord, community } = result.data.body;

            const renderMap = (coord, community) => {
                const { longitude, latitude } = coord;

                // 创建地图实例
                const map = new BMapGL.Map('map');

                // 创建坐标实例
                const point = new BMapGL.Point(longitude, latitude);
                map.centerAndZoom(point, 16);

                // 禁止地图拖动
                map.disableDragging();

                // 添加缩放控件
                const zoomCtrl = new BMapGL.ZoomControl();
                map.addControl(zoomCtrl);

                // 创建覆盖物
                const label = new BMapGL.Label('', {
                    position: point,
                    offset: new BMapGL.Size(0, -35)
                });

                // 设置房源覆盖物内容
                label.setContent(`
                <div class="${styles.rect}">
                    <span class="${styles.housename}">${community}</span>
                    <i class="${styles.arrow}"></i>
                </div>
            `);

                // 设置样式
                label.setStyle({
                    cursor: 'pointer',
                    border: '0px solid rgb(255, 0, 0)',
                    padding: '0px',
                    whiteSpace: 'nowrap',
                    fontSize: '14px',
                    color: 'rgb(255, 255, 255)',
                    textAlign: 'center'
                });

                // 添加覆盖物到地图中
                map.addOverlay(label);
            };

            // 渲染房屋地图
            renderMap(coord, community);
        };

        getHouseDetail(id);

        // 卸载时取消加载状态，防止内存溢出
        return () => {
            setDataLoaded(false);
        };
    }, [id]);

    // 设置是否被收藏的state
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const checkFavorite = async (houseId) => {
            const isLogin = isAuth();

            // 未登录状态直接退出判断
            if (!isLogin) {
                return;
            }

            const result = await axios.get(`/user/favorites/${houseId}`);

            const { status, body } = result.data;

            if (status === 200) {
                setIsFavorite(body.isFavorite);
            }
        };

        checkFavorite(id);
    }, [id]);

    const handleFavorite = async () => {
        const isLogin = isAuth();

        if (isLogin) {
            if (isFavorite) {
                const result = await axios.delete(`/user/favorites/${id}`);

                if (result.data.status === 200) {
                    setIsFavorite(false);

                    Toast.show({ content: '已取消收藏' });
                } else {
                    Toast.show({ content: '登录超时，请重新登录' });
                }
            } else {
                const result = await axios.post(`/user/favorites/${id}`);

                if (result.data.status === 200) {
                    setIsFavorite(true);

                    Toast.show({ content: '已收藏' });
                } else {
                    Toast.show({ content: '登录超时，请重新登录' });
                }
            }
        } else {
            return Modal.confirm({
                title: '提示',
                content: '登录后才能收藏房源，是否去登录？',
                confirmText: '去登录',
                onConfirm: () => { history('/login') }
            });
        }
    };

    // 获取房屋详情中的各数据
    const {
        community,
        description,
        floor,
        houseImg,
        oriented,
        price,
        roomType,
        size,
        supporting,
        tags,
        title
    } = houseData;

    return (
        <div className={styles.root}>
            <Navbar
                styles={styles}
                title={community ? community : '房源详情'}
                right={(
                    <i
                        className="iconfont icon-share"
                        onClick={() => Toast.show({ content: '暂未开通该功能' })}
                    />
                )}
            />
            {/* 获取房屋详情后再显示此部分内容 */}
            {dataLoaded && (
                <>
                    <Swipers
                        className={styles.slides}
                        swipers={houseImg}
                    />
                    <Info
                        floor={floor}
                        oriented={oriented}
                        price={price}
                        roomType={roomType}
                        size={size}
                        tags={tags}
                        title={title}
                        community={community}
                        supporting={supporting}
                        description={description}
                    />
                    <Like />
                </>
            )}
            <Buttons
                isFavorite={isFavorite}
                handleFavorite={handleFavorite}
            />
        </div>
    );
};

const Swipers = ({ swipers }) => {
    const swiperItems = swipers.map((item, index) => (
        // 部分图片重复，防止出现相同key，加入index作为key的一部分
        <Swiper.Item key={item + index}>
            <img
                src={BASE_URL + item}
                // 因为图片大小不同，为防止拉伸，只指定宽度，可能会出现下方留白的情况
                style={{ width: '100%' }}
                alt="房屋图片"
            />
        </Swiper.Item>
    ));

    return (
        <Swiper autoplay loop> {swiperItems}</Swiper>
    );
};

const Info = ({
    floor,
    oriented,
    price,
    roomType,
    size,
    tags,
    title,
    community,
    supporting,
    description
}) => {
    return (
        <>
            <div className={styles.info}>
                <h3 className={styles.infoTitle}>
                    {title}
                </h3>
                <Grid columns={1}>
                    <Grid.Item>
                        {tags.map((item, index) => (
                            <span
                                key={item}
                                className={`${styles.tag} ${styles.tags} ${styles['tag' + (index % 4 + 1)]}`}
                            >
                                {item}
                            </span>
                        ))}
                    </Grid.Item>
                </Grid>
                <Grid
                    columns={3}
                    className={styles.infoPrice}
                >
                    <Grid.Item className={styles.infoPriceItem}>
                        <div>
                            {price}
                            <span className={styles.month}>/月</span>
                        </div>
                        <div>租金</div>
                    </Grid.Item>
                    <Grid.Item className={styles.infoPriceItem}>
                        <div>{roomType}</div>
                        <div>房型</div>
                    </Grid.Item>
                    <Grid.Item className={styles.infoPriceItem}>
                        <div>{size}平方</div>
                        <div>面积</div>
                    </Grid.Item>
                </Grid>
                <Grid
                    columns={1}
                    className={styles.infoBasic}
                >
                    <Grid.Item>
                        <div>
                            <span className={styles.title}>装修：</span>
                            精装
                        </div>
                        <div>
                            <span className={styles.title}>楼层：</span>
                            {floor}
                        </div>
                    </Grid.Item>
                    <Grid.Item>
                        <div>
                            <span className={styles.title}>朝向：</span>
                            {oriented.join('、')}
                        </div>
                        <div>
                            <span className={styles.title}>类型：</span>
                            普通住宅
                        </div>
                    </Grid.Item>
                </Grid>
            </div>
            <div className={styles.map}>
                <div className={styles.mapTitle}>
                    小区：
                    <span>{community}</span>
                </div>
                <div className={styles.mapContainer} id="map">
                    地图
                </div>
            </div>
            <div className={styles.set}>
                <div className={styles.houseTitle}>房屋配套</div>
                {
                    supporting.length === 0
                        ? <div className={styles.titleEmpty}>暂无数据</div>
                        : <HousePackage list={supporting} />
                }
            </div>
            <div className={styles.about}>
                <div className={styles.houseTitle}>房屋概况</div>
                <div className={styles.contact}>
                    <div className={styles.user}>
                        <img
                            src={BASE_URL + '/img/avatar.png'}
                            alt="头像"
                        />
                        <div className={styles.userInfo}>
                            <div>张女士</div>
                            <div className={styles.userAuth}>
                                <i className="iconfont icon-auth" />
                                已认证房主
                            </div>
                        </div>
                    </div>
                    <span className={styles.userMsg}>发消息</span>
                </div>
                <div className={styles.descText}>
                    {description || '暂无房屋数据'}
                </div>
            </div>
        </>
    );
};

// 猜你喜欢模块，获取一个随机数，然后随机推荐3套房源
const Like = () => {
    // 获取当前城市id
    const { cityValue } = useCity();

    // 设置房源列表和房源数量state
    const [list, setList] = useState([]);

    useEffect(() => {
        // 随机获取3套房源
        const getHouseList = async (id, start) => {
            const result = await axios.get(`/houses`, {
                params: {
                    cityId: id,
                    start: start,
                    end: start + 2,
                }
            });

            // 更新房源列表和房源数量
            setList(result.data.body.list);
        };

        // 随机生成一个1000以内整数
        const start = Math.floor(Math.random() * (1000 - 1)) + 1;

        getHouseList(cityValue, start);

        // 卸载时清空获取的房源，防止内存泄漏
        return () => {
            setList([]);
        }
    }, [cityValue]);

    return (
        <div className={styles.like}>
            <div className={styles.likeTitle}>猜你喜欢</div>
            {list.map((house) => (
                <div
                    key={house.houseCode}
                    className={styles.house}
                >
                    <HouseItems
                        src={BASE_URL + house.houseImg}
                        title={house.title}
                        desc={house.desc}
                        tags={house.tags}
                        price={house.price}
                    />
                </div>
            ))}
        </div>
    );
};

const Buttons = ({
    isFavorite,
    handleFavorite
}) => {
    return (
        <div className={styles.buttons}>
            <span className={styles.favorite}
                onClick={() => handleFavorite(!isFavorite)}
            >
                <img
                    src={isFavorite ? `${BASE_URL}/img/star.png` : `${BASE_URL}/img/unstar.png`}
                    alt="收藏"
                />
                {isFavorite ? '已收藏' : '收藏'}
            </span>
            <span
                className={styles.consult}
                onClick={
                    () => Toast.show({
                        content: '暂未开通该功能'
                    })
                }
            >在线咨询</span>
            <span className={styles.reserve}>
                <a href="tel: ">电话预约</a>
            </span>
        </div>
    );
};

export default HouseDetail;