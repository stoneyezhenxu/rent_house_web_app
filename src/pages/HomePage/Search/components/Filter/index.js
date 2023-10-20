import { useEffect, useState } from 'react';
import { Mask } from 'antd-mobile';
import _ from 'lodash'
// import { useSpring, animated } from 'react-spring'

import { axiosAPI as axios, useCity } from '../../../../../utils';

import FilterTitle from './FilterTitle';
import FilterPicker from './FilterPicker';
import FilterMore from './FilterMore';

import styles from './index.module.css';

// 实现功能：
// 1.点击确定提交当前筛选条件；
// 2.点击清除清空当前筛选条件，不影响其他筛选条件；
// 3.点击遮罩层关闭筛选，不影响筛选条件 

const Filter = ({
    filters,
    setFilters,
    placeholder,
    content
}) => {
    // 设置筛选条件数据state
    const [filterData, setFilterData] = useState({});

    // 获取当前城市
    const [cityValue] = useCity();

    // 挂载和城市变化时重新获取房源筛选条件
    useEffect(() => {
        const getFilterData = async (id) => {
            const result = await axios.get(`/houses/condition?id=${id}`);

            // 设置筛选条件数据
            setFilterData(result.data.body);
        };

        getFilterData(cityValue);
    }, [cityValue]);

    // 设置标题选中状态和当前标题state
    const initialStatus = {
        area: false,
        mode: false,
        price: false,
        more: false
    };
    const [titleSelectedStatus, setTitleSelectedStatus] = useState(initialStatus);

    // 设置筛选条件state
    const defaultSelected = {
        area: ['area', 'null', null, null],
        mode: ['null'],
        price: ['null'],
        more: [],
    };
    const [selectedValue, setSelectedValue] = useState(defaultSelected);

    // 设置当前打开筛选项state
    const [openType, setOpenType] = useState('');

    // 获取当前ref对象实例
    const placeholderEl = placeholder.current;
    const contentEl = content.current;

    // 设置点击事件：点击筛选标题
    const onTitleClick = (type) => {
        const newTitleSelectedStatus = { ...titleSelectedStatus };

        /* // 遍历标题选中状态
        Object.keys(titleSelectedStatus).forEach((key) => {
            // 当前选中项
            if (key === type) {
                newTitleSelectedStatus[type] = true;
                return;
            }

            // 各筛选条件非默认值时选中该项
            const selectedVal = selectedValue[key];

            if (key === 'area' &&
                (selectedVal[1] !== 'null'
                    || (selectedVal[0] !== 'area'
                        && selectedVal[1] !== 'null'
                    ))
                // (selectedVal.length !== 2 || selectedVal[0] !== 'area')
            ) {
                newTitleSelectedStatus[key] = true;
            } else if (key === 'mode' && selectedVal[0] !== 'null') {
                newTitleSelectedStatus[key] = true;
            } else if (key === 'price' && selectedVal[0] !== 'null') {
                newTitleSelectedStatus[key] = true;
            } else if (key === 'more' && selectedVal.length > 0) {
                newTitleSelectedStatus[key] = true;
            } else {
                newTitleSelectedStatus[key] = false;
            }
        }); */

        // 使用lodash判断当前状态和默认状态来返回标题选中状态，更加直观
        // 遍历标题选中状态
        Object.keys(titleSelectedStatus).forEach((key) => {
            // 当前选中项直接返回，不用继续判断
            if (key === type) {
                newTitleSelectedStatus[type] = true;
                return;
            }

            // 对比当前状态和默认状态是否相同，不同则选上
            if (key === 'area') {
                selectedValue[key][0] === 'area'
                    ? _.isEqual(selectedValue[key], defaultSelected[key])
                        ? newTitleSelectedStatus[key] = false
                        : newTitleSelectedStatus[key] = true
                    : selectedValue[key][1] === 'null'
                        ? newTitleSelectedStatus[key] = false
                        : newTitleSelectedStatus[key] = true;
            } else {
                _.isEqual(selectedValue[key], defaultSelected[key])
                    ? newTitleSelectedStatus[key] = false
                    : newTitleSelectedStatus[key] = true;
            }
        })

        // 设置选中状态
        setTitleSelectedStatus({ ...newTitleSelectedStatus });

        // 设置选中项
        setOpenType(type);
    };

    // 设置点击事件：点击遮罩层关闭筛选
    const onClear = () => {
        // 更新筛选条件state
        setSelectedValue((prevValue) => {
            // 创建选中状态备份
            const tempState = {
                ...prevValue
            };

            // 判断并更新选中状态state
            setTitleSelectedStatus((prevStatus) => {
                // 点击确认时判断是否继续高亮标题
                let flag;

                if (openType === 'area') {
                    tempState[openType][0] === 'area'
                        ? _.isEqual(tempState[openType], defaultSelected[openType])
                            ? flag = false
                            : flag = true
                        : tempState[openType][1] === 'null'
                            ? flag = false
                            : flag = true;
                } else {
                    _.isEqual(tempState[openType], defaultSelected[openType])
                        ? flag = false
                        : flag = true;
                }

                return {
                    ...prevStatus,
                    [openType]: flag
                };
            });

            return { ...tempState };
        });

        // 关闭筛选器
        setOpenType('');
    };

    // 设置点击事件：点击清除清空筛选
    const onCancel = () => {
        // 创建父组件筛选元素备份
        const tempFilters = { ...filters }

        // 判定展开项并将其筛选信息清除
        if (openType === 'area') {
            tempFilters['subway']
                ? tempFilters['subway'] = null
                : tempFilters[openType] = null;
        } else if (openType === 'mode') {
            tempFilters['rentType'] = null;
        } else {
            tempFilters[openType] = null
        }

        // 将筛选条件更新给父组件
        setFilters(tempFilters);

        // 重新获取选中状态state
        setSelectedValue((prevValue) => {
            const tempState = {
                ...prevValue,
                [openType]: defaultSelected[openType]
            };

            return { ...tempState };
        });

        // 重新获取选中状态state
        setTitleSelectedStatus((prevStatus) => (
            {
                ...prevStatus,
                [openType]: false
            }
        ));

        // 关闭筛选器
        setOpenType('');
    };

    // 设置点击事件：点击确认提交筛选条件
    const onConfirm = (value) => {
        // 更新筛选条件state
        setSelectedValue((prevValue) => {
            // 创建最新选中筛选值状态
            const tempState = {
                ...prevValue,
                [openType]: value
            };

            // 解构最新选中筛选值状态
            const { area, mode, price, more } = tempState;

            const areaKey = area[0];

            let areaValue = null;

            // 判定areaValue的值
            if (area[0] === 'area') {
                area[3] === null
                    ? areaValue = area[1]
                    : area[3] === 'null'
                        ? areaValue = area[2]
                        : areaValue = area[3];
            } else if (area[0] === 'subway') {
                area[2] === null
                    ? areaValue = null
                    : area[2] === 'null'
                        ? areaValue = area[1]
                        : areaValue = area[2];
            }

            // 组装筛选条件
            const newFilters = {
                [areaKey]: areaValue,
                rentType: mode[0],
                price: price[0],
                more: more.join(',')
            };

            // 将筛选条件更新给父组件
            setFilters(newFilters);

            // 判断并更新选中状态state
            setTitleSelectedStatus((prevStatus) => {
                // 点击确认时判断是否继续高亮标题
                let flag;

                if (openType === 'area') {
                    tempState[openType][0] === 'area'
                        ? _.isEqual(tempState[openType], defaultSelected[openType])
                            ? flag = false
                            : flag = true
                        : tempState[openType][1] === 'null'
                            ? flag = false
                            : flag = true;
                } else {
                    _.isEqual(tempState[openType], defaultSelected[openType])
                        ? flag = false
                        : flag = true;
                };

                return {
                    ...prevStatus,
                    [openType]: flag
                }
            });

            return { ...tempState };
        });

        // 关闭筛选器
        setOpenType('');

        // 获取content实例对象的className
        const fixed = contentEl.className;

        // 当筛选栏被固定时，取消固定并回滚至页面顶部
        if (fixed) {
            window.scrollTo(0, 0);

            // 当回滚至页面顶部时,移除fixed类名,并取消占位符高度
            contentEl.classList.remove(fixed);
            placeholderEl.style.height = `0px`;
        }
    };

    // react-spring实现Mask动画
    // const springStyle = useSpring({ to: { opacity: openType ? 1 : 0 }, from: { opacity: 0 } });

    return (
        <div className={styles.root}>
            <div className={styles.content}>
                <FilterTitle
                    titleSelectedStatus={titleSelectedStatus}
                    onTitleClick={onTitleClick}
                    // 设定FilterTitle显示层级
                    visible={openType && openType !== 'more' ? 1001 : ''}
                />
                {/* 因没有视频中遮罩层代码素材，直接使用antd-mobile v5的Mask组件作为遮罩层，自带动画效果 */}
                {/* <animated.div style={springStyle}> */}
                <Mask
                    visible={openType
                        ? true
                        : false
                    }
                    opacity={0.5}
                    onMaskClick={() => { onClear() }}
                >
                    <FilterPicker
                        openType={openType}
                        onCancel={onCancel}
                        onConfirm={onConfirm}
                        selectedValue={selectedValue}
                        data={filterData}
                        contentEl={contentEl}
                    />
                    <FilterMore
                        openType={openType}
                        onCancel={onCancel}
                        onConfirm={onConfirm}
                        selectedValue={selectedValue}
                        setSelectedValue={setSelectedValue}
                        titleSelectedStatus={titleSelectedStatus}
                        setTitleSelectedStatus={setTitleSelectedStatus}
                        data={filterData}
                        defaultValue={selectedValue.more}
                    />
                </Mask>
                {/* </animated.div> */}
            </div>
        </div>
    );
};

export default Filter;