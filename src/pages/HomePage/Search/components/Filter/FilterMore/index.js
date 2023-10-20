import { useState } from 'react';

import FilterFooter from '../../../../../../components/FilterFooter';

import styles from './index.module.css';

const FilterMore = ({
    openType,
    onCancel,
    onConfirm,
    setSelectedValue,
    setTitleSelectedStatus,
    defaultValue,
    data: { roomType, oriented, floor, characteristic }
}) => {
    // 设置被点击的筛选tag的state
    const [moreSelectedValues, setMoreSelectedValues] = useState(defaultValue);

    // 判断是否显示组件
    if (openType !== 'more') {
        return null;
    }

    // 点击tag事件函数
    const onTagClick = (value) => {
        // 创建被点击筛选tag的备份
        let newSelectedValues = [...moreSelectedValues];

        // 判断tag是否已被点击，如没有，则加入被点击条件state数组最后；如已有，则移出被点击条件state
        if (moreSelectedValues.indexOf(value) === -1) {
            newSelectedValues.push(value);
        } else {
            const index = moreSelectedValues.indexOf(value)
            newSelectedValues.splice(index, 1);
        }

        // 更新被点击筛选tag的state
        setMoreSelectedValues([...newSelectedValues]);
    };

    // 清除按钮点击事件函数
    const onTagCancel = () => {
        // 清空选中tag
        setMoreSelectedValues(() => []);

        // 清除选中值
        setSelectedValue((prevValue) => (
            {
                ...prevValue,
                [openType]: []
            }
        ));

        // 取消筛选标签选中
        setTitleSelectedStatus((prevStatus) => (
            {
                ...prevStatus,
                [openType]: false
            }
        ));
    };

    // 筛选tag列表渲染函数
    const renderFilters = (data) => {
        return data.map((item) => {
            // 判断当前tag是否被选中
            let isSelected = moreSelectedValues.indexOf(item.value);

            return (
                <span
                    key={item.value}
                    onClick={() => onTagClick(item.value)}
                    className={`
                    ${styles.tag}
                    // 判断tag是否被选中
                    ${isSelected === -1
                            ? ''
                            : styles.tagActive}
                    `}
                >
                    {item.label}
                </span>
            );
        });
    };

    return (
        <div className={styles.root}>
            <div className={styles.tags}>
                <dl className={styles.dl}>
                    <dt className={styles.dt}>户型</dt>
                    <dd className={styles.dd}>{renderFilters(roomType)}</dd>
                    <dt className={styles.dt}>朝向</dt>
                    <dd className={styles.dd}>{renderFilters(oriented)}</dd>
                    <dt className={styles.dt}>楼层</dt>
                    <dd className={styles.dd}>{renderFilters(floor)}</dd>
                    <dt className={styles.dt}>房屋亮点</dt>
                    <dd className={styles.dd}>{renderFilters(characteristic)}</dd>
                </dl>
            </div>
            <div className={styles.footer}>
                <FilterFooter
                    onCancel={() => {
                        onCancel();
                        onTagCancel();
                    }}
                    onConfirm={() => onConfirm(moreSelectedValues)}
                />
            </div>
        </div>
    );
};

export default FilterMore;