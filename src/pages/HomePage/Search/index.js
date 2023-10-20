import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { List as AList, Toast } from 'antd-mobile';
import { AutoSizer, InfiniteLoader, List as VList, WindowScroller } from 'react-virtualized';


import { axiosAPI as axios, BASE_URL, useCity } from '../../../utils';

import SearchBar from '../../../components/SearchBar';
import Sticky from '../../../components/Sticky';
import Filter from './components/Filter';
import HouseItems from '../../../components/HouseItems';
import NoHouse from '../../../components/NoHouse';

import styles from './index.module.css';

const Search = () => {
    // 获取当前城市
    const [cityValue, cityLabel] = useCity();

    // 设置筛选条件state
    const [filters, setFilters] = useState({});

    // 设置房源列表和房源数量state
    const [list, setList] = useState([]);
    const [count, setCount] = useState(0);

    // 设置加载状态state
    const [isLoading, setIsLoading] = useState(true);

    // 每次更新筛选条件和城市时更新房源列表和房源数量
    useEffect(() => {
        const getHouseList = async (filters, id) => {
            // 加载提示
            Toast.show({
                icon: 'loading',
                content: '加载中…',
            });

            // 获取房源信息
            const result = await axios.get(`/houses`, {
                params: {
                    cityId: id,
                    ...filters,
                    start: 1,
                    end: 20
                }
            });

            // 更新房源列表和房源数量
            setList(result.data.body.list);

            setCount(result.data.body.count);

            // 更新加载状态
            setIsLoading(false);

            // 清除加载提示
            Toast.clear();

            // 当房源多于0套时，显示找到房源提示
            if (result.data.body.count > 0) {
                Toast.show({
                    icon: 'success',
                    content: `已找到${result.data.body.count}套房源`,
                });
            }
        };

        getHouseList(filters, cityValue);

        return () => {
            // 卸载组件时重新更新加载状态，防止内存泄漏
            setIsLoading(true);
        };
    }, [cityValue, filters]);

    // 创建Sticky组件ref对象并传递给需要使用的组件
    const placeholder = useRef();
    const content = useRef();

    return (
        <>
            <Header city={cityLabel} />
            <Sticky
                height={41}
                placeholder={placeholder}
                content={content}
            >
                <Filter
                    filters={filters}
                    setFilters={setFilters}
                    placeholder={placeholder}
                    content={content}
                />
            </Sticky>
            <HouseList
                filters={filters}
                city={cityValue}
                list={list}
                setList={setList}
                count={count}
                isLoading={isLoading}
            />
        </>
    );
};

const Header = ({ city }) => {
    const history = useNavigate();

    return (
        <>
            <div className='searchHeader'>
                <i
                    className='iconfont icon-back'
                    onClick={() => history(-1)}
                ></i>
                <SearchBar
                    city={city}
                    styles={styles}
                />
            </div>
        </>
    );
};

// 结合antd-mobile v5的List组件写法，可以修复react-virtualized无法渲染太多数据的问题
const HouseList = ({
    filters,
    city,
    list,
    setList,
    count,
    isLoading
}) => {
    const history = useNavigate();

    // 没有找到房源时显示提示页面
    if (count === 0 && !isLoading) {
        return (
            <NoHouse>没有找到房源，请您换个搜索条件吧</NoHouse>
        );
    }

    // 生成列表主函数
    const rowRenderer = ({
        key,
        index,
        style
    }) => {
        const house = list[index];

        // 当列表尚未获取到时,先显示占位符
        if (!house) {
            return (
                <div
                    key={key}
                    style={style}
                >
                    <p className={styles.loading} />
                </div>
            );
        }

        return (
            <AList.Item
                key={key}
                style={style}
            >
                <HouseItems
                    src={BASE_URL + house.houseImg}
                    title={house.title}
                    desc={house.desc}
                    tags={house.tags}
                    price={house.price}
                    onClick={() => { history(`/detail/${house.houseCode}`) }}
                />
            </AList.Item>
        );
    };

    // InfiniteLoader加载判断函数
    const isRowLoaded = ({ index }) => {
        return !!list[index];
    };

    // InfiniteLoader加载函数
    const loadMoreRows = async ({ startIndex, stopIndex }) => {
        const result = await axios.get(`/houses`, {
            params: {
                ...filters,
                cityId: city,
                start: startIndex,
                end: stopIndex
            }
        });

        // 将新获取到的数据合并到原来的房源列表中
        setList((prevList) => [...prevList, ...result.data.body.list]);
    };

    return (
        <AList className={styles.houseList}>
            <InfiniteLoader
                isRowLoaded={isRowLoaded}
                loadMoreRows={loadMoreRows}
                rowCount={count}
            >
                {({
                    onRowsRendered,
                    registerChild
                }) => (
                    <WindowScroller>
                        {({
                            height,
                            isScrolling,
                            scrollTop
                        }) => (
                            <AutoSizer disableHeight>
                                {({ width }) => (
                                    <VList
                                        autoHeight
                                        ref={registerChild}
                                        width={width}
                                        height={height}
                                        rowHeight={130}
                                        rowCount={count}
                                        rowRenderer={rowRenderer}
                                        onRowsRendered={onRowsRendered}
                                        isScrolling={isScrolling}
                                        scrollTop={scrollTop}
                                    />
                                )}
                            </AutoSizer>
                        )}
                    </WindowScroller>
                )}
            </InfiniteLoader>
        </AList>
    );
};

export default Search;