import { useState } from 'react';
import { CascadePickerView } from 'antd-mobile';

import FilterFooter from '../../../../../../components/FilterFooter';

import styles from './index.module.css';

const FilterPicker = ({
    openType,
    onCancel,
    onConfirm,
    data,
    selectedValue,
    contentEl
}) => {
    // 设置筛选条件state
    const [filterValue, setFilterValue] = useState('');

    // 判断是否显示组件
    if (openType !== 'area' && openType !== 'mode' && openType !== 'price') {
        return null;
    }

    // 接收并判断选择器数据源
    let options = [];

    switch (openType) {
        case 'area':
            options = [data.area, data.subway];
            break;
        case 'mode':
            options = data.rentType;
            break;
        case 'price':
            options = data.price;
            break;
        default:
            break;
    }

    // 因使用了antd-mobile v5的Mask组件作为遮罩层，所以FilterTitle和FilterPicker不在同一级信息流，故需要判断FilterTitle是否被固定，决定顶部margin值达到视觉上FilterPicker紧跟FIlterTitle的效果
    let marginTop;
    contentEl.className ? marginTop = 0 : marginTop = 86;

    return (
        <div
            className={styles.root}
            style={{ marginTop: marginTop }}
        >
            <CascadePickerView
                key={openType}
                options={options}
                defaultValue={selectedValue[openType]}
                // 保存当前筛选条件
                onChange={(val) => setFilterValue(val)}
            />
            <FilterFooter
                onCancel={onCancel}
                onConfirm={() => onConfirm(filterValue)}
            />
        </div>
    );
};

export default FilterPicker;