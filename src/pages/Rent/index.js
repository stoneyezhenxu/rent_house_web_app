import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';

import { axiosAPI as axios, BASE_URL } from '../../utils';

import Navbar from '../../components/Navbar';
import HouseItems from '../../components/HouseItems';
import NoHouse from '../../components/NoHouse';

import styles from './index.module.css';

const Rent = () => {
    const location = useLocation();

    // 设置出租房源列表state
    const [rentList, setRentList] = useState([]);

    useEffect(() => {
        const getRentList = async () => {
            const result = await axios.get('/user/houses');

            // 根据获取到的服务器响应代码判断操作，如果登录已失效，跳转登录页
            if (result.status === 200) {
                setRentList(result.data.body);
            } else {
                return <Navigate to="/login" state={{ from: location }} />
            }
        };

        getRentList();
    }, [location]);

    return (
        <>
            <Navbar
                title={'我的出租'}
                styles={styles}
            />
            <RentList rentList={rentList} />
        </>
    )
};

const RentList = ({ rentList }) => {
    const history = useNavigate();

    // 没有找到房源时显示提示页面
    if (!rentList || rentList.length === 0) {
        return (
            <NoHouse>
                您还没有在出租的房源，去
                <Link to="/rent/add">发布房源</Link>
                吧
            </NoHouse>
        )
    };

    return (
        <>
            <div className={styles.root}>
                {rentList.map((house, index) => (
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
                onClick={() => history('/rent/add')}
            >
                发布房源
            </div>
        </>
    );
};

export default Rent;