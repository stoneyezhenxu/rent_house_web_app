import { useEffect } from 'react';
import PropTypes from 'prop-types';

import styles from './index.module.css';

const Sticky = ({
    height,
    children,
    placeholder,
    content
}) => {
    useEffect(() => {
        // 获取当前ref对象实例
        const placeholderEl = placeholder.current;
        const contentEl = content.current;

        // 页面滚动处理函数
        const handleScroll = () => {
            // 获取占位符的top属性
            const { top } = placeholderEl.getBoundingClientRect();

            if (top < 0) {
                // 当占位符移出视口时,增加fixed类名,并设置占位符高度
                contentEl.classList.add(styles.fixed);

                placeholderEl.style.height = `${height}px`;
            } else {
                // 当占位符移入视口时,移除fixed类名,并取消占位符高度
                contentEl.classList.remove(styles.fixed);

                placeholderEl.style.height = `0px`;
            }
        };

        // 添加滚动事件监听
        window.addEventListener('scroll', handleScroll);

        // 卸载组件时取消事件监听
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [placeholder, content, height]);

    return (
        <>
            <div ref={placeholder} />
            <div ref={content} >{children}</div>
        </>
    );
};

Sticky.propTypes = {
    height: PropTypes.number.isRequired
};

export default Sticky;