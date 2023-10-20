import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { TabBar } from 'antd-mobile';

import styles from './index.module.css';

const HomePage = () => {
    return (
        <>
            <div className={styles.homepage}>
                {/* 设置Router出口 */}
                <Outlet />
            </div>
            <Bottom />
        </>
    );
};

const Bottom = () => {
    const tabs = [
        {
            key: '/home',
            title: '首页',
            icon: <i className="iconfont icon-ind" />,
        },
        {
            key: '/home/search',
            title: '找房',
            icon: <i className="iconfont icon-findHouse" />,
        },
        {
            key: '/home/news',
            title: '资讯',
            icon: <i className="iconfont icon-infom" />,
        },
        {
            key: '/home/profile',
            title: '我的',
            icon: <i className="iconfont icon-my" />,
        },
    ];

    const history = useNavigate();
    const { pathname } = useLocation();

    return (
        <TabBar
            activeKey={pathname}
            // 设置底栏点击事件
            onChange={(val) => history(val)}
        >
            {tabs.map(item => (
                <TabBar.Item
                    key={item.key}
                    icon={item.icon}
                    title={item.title}
                />
            ))}
        </TabBar>
    );
};

export default HomePage;