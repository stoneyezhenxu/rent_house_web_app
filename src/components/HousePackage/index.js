import { useState } from 'react';

import styles from './index.module.css';

const HousePackage = ({
    onSelect,
    select,
    list
}) => {
    const HOUSE_PACKAGE = [
        {
            id: 1,
            name: '衣柜',
            icon: 'icon-wardrobe'
        },
        {
            id: 2,
            name: '洗衣机',
            icon: 'icon-wash'
        },
        {
            id: 3,
            name: '空调',
            icon: 'icon-air'
        },
        {
            id: 4,
            name: '天然气',
            icon: 'icon-gas'
        },
        {
            id: 5,
            name: '冰箱',
            icon: 'icon-ref'
        },
        {
            id: 6,
            name: '暖气',
            icon: 'icon-Heat'
        },
        {
            id: 7,
            name: '电视',
            icon: 'icon-vid'
        },
        {
            id: 8,
            name: '热水器',
            icon: 'icon-heater'
        },
        {
            id: 9,
            name: '宽带',
            icon: 'icon-broadband'
        },
        {
            id: 10,
            name: '沙发',
            icon: 'icon-sofa'
        }
    ];

    // 设置房屋配置列表state
    const [selectedPackages, setSelectedPackages] = useState([]);

    // 根据id判断选中状态
    const toggleSelect = (name) => {
        let newSelectedPackages = [];

        if (selectedPackages.includes(name)) {
            newSelectedPackages = [...selectedPackages];

            let index = selectedPackages.indexOf(name);

            newSelectedPackages.splice(index, 1);
        } else {
            newSelectedPackages = [...selectedPackages, name];
        }

        // 将数据传递给父组件
        onSelect(newSelectedPackages);

        setSelectedPackages([...newSelectedPackages]);
    };

    // 详情页面渲染选中项
    const renderItems = () => {
        if (list) {
            const values = HOUSE_PACKAGE.filter((item) => list.includes(item.name));

            return values.map((item) => {
                return (
                    <div
                        key={item.id}
                        className={styles.item}
                    >
                        <i className={`iconfont ${styles.icon} ${item.icon}`} />
                        {item.name}
                    </div>
                );
            });
        } else if (select) {
            return HOUSE_PACKAGE.map(item => {
                const isActive = selectedPackages.includes(item.name);

                return (
                    <div
                        key={item.id}
                        className={`${styles.item} ${isActive ? styles.active : ''}`}
                        onClick={() => toggleSelect(item.name)}
                    >
                        <i className={`iconfont ${styles.icon} ${item.icon}`} />
                        {item.name}
                    </div>
                );
            });
        } else {
            return 'none selected';
        }
    };

    return (
        <div className={styles.root}>
            {renderItems()}
        </div>
    );
};

HousePackage.defaultProps = {
    onSelect: () => { }
};

export default HousePackage;