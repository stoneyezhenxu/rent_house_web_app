import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';

import { axiosAPI as axios, BASE_URL } from '../../utils';

import Navbar from '../../components/Navbar';
import HouseItems from '../../components/HouseItems';
import NoHouse from '../../components/NoHouse';

import styles from './index.module.css';

const Favorite = () => {
    const location = useLocation();

    // 设置收藏列表state
    const [favList, setFavList] = useState([]);

    useEffect(() => {
        const getFavList = async () => {
            const result = await axios.get('/user/favorites');

            // 如果响应代码不是200，则跳转登录页
            if (result.status === 200) {
                setFavList(result.data.body);
            } else {
                return (
                    <Navigate to="/login" state={{ from: location }} />
                );
            }
        };

        getFavList();
    }, [location]);

    return (
        <>
            <Navbar
                title={'我的收藏'}
                styles={styles}
            />
            <FavoriteList favList={favList} />
        </>
    )
};

const FavoriteList = ({ favList }) => {
    const history = useNavigate();

    // 没有找到房源时显示提示页面
    if (!favList || favList.length === 0) {
        return (
            <div className={styles.root}>
                <NoHouse>
                    您还没有收藏房源，快去
                    <Link to="/home/search">收藏房源</Link>
                    吧
                </NoHouse>
            </div>
        )
    };
    return (
        <>
            <div className={styles.root}>
                {favList.map((house, index) => (
                    <div
                        className={styles.house}
                        key={index}
                    >
                        <HouseItems
                            src={BASE_URL + house.houseImg}
                            title={house.title}
                            desc={house.desc}
                            tags={house.tags}
                            price={house.price}
                            onClick={() => history(`/detail/${house.houseCode}`)}
                        />
                    </div>
                ))}
            </div>
            <div
                className={styles.bottom}
                onClick={() => { history('/home/search') }}
            >
                去收藏
            </div>
        </>
    );
};

export default Favorite;