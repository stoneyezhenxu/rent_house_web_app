import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from 'antd-mobile';

import { axiosAPI as axios, useCity } from '../../../utils';

import NoHouse from '../../../components/NoHouse';

import styles from './index.module.css';

const RentSearch = () => {
    const history = useNavigate();

    // 设置小区列表state
    const [tipsList, setTipsList] = useState([]);

    const [cityValue] = useCity();

    let timerId = null;

    const handleSearch = (value, id) => {

        if (!value) {
            return setTipsList([]);
        }

        // 清空上一个计时器，防止过多的请求对服务器造成过大压力
        clearTimeout(timerId);

        timerId = setTimeout(async () => {
            const result = await axios.get(`/area/community`, {
                params: {
                    name: value,
                    id: id
                }
            });

            setTipsList(result.data.body);
        }, 500);
    };

    const renderTips = () => {
        if (tipsList.length === 0) {
            return <NoHouse>这里空空如也，换个词试试吧~</NoHouse>;
        }

        const onTipClick = (item) => history('/rent/add', {
            state: {
                name: item.communityName,
                id: item.community
            },
            replace: true
        });

        return (
            <div className={styles.tips}>
                {tipsList.map((item) => (
                    <div
                        key={item.community}
                        className={styles.tip}
                        onClick={() => onTipClick(item)}
                    >
                        {item.communityName}
                    </div>
                ))}
            </div>
        )
    };

    return (
        <>
            <SearchBar
                placeholder='请输入小区或地址'
                showCancelButton={() => true}
                onChange={val => handleSearch(val, cityValue)}
                onCancel={() => history(-1)}
            />
            <div className={styles.tips}>
                {renderTips()}
            </div>
        </>
    )
};

export default RentSearch;
