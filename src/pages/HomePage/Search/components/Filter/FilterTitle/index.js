import { Grid } from 'antd-mobile';

import styles from './index.module.css';

const FilterTitle = ({
    titleSelectedStatus,
    onTitleClick,
    visible
}) => {
    const titleList = [
        { title: '区域', type: 'area' },
        { title: '方式', type: 'mode' },
        { title: '租金', type: 'price' },
        { title: '筛选', type: 'more' }
    ];

    return (
        // 设定FilterTitle显示层级
        <div
            className={styles.root}
            style={{ zIndex: visible }}
        >
            <Grid columns={titleList.length} >
                {titleList.map((item) => {
                    // 设置是否选中状态
                    const isSelected = titleSelectedStatus;

                    return (
                        <Grid.Item
                            key={item.type}
                            onClick={() => { onTitleClick(item.type) }}
                        >
                            <span className={`
                        ${styles.dropdown}
                        // 判断该标题是否被选中
                        ${isSelected[item.type] ? styles.selected : ''}
                        `}>
                                <span >{item.title}</span>
                                <i className="iconfont icon-arrow" />
                            </span>
                        </Grid.Item>
                    );
                })}
            </Grid>
        </div>
    );
};

export default FilterTitle;