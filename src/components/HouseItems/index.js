import PropTypes from 'prop-types';

import styles from './index.module.css';

const HouseItems = ({
    src,
    title,
    desc,
    tags,
    price,
    onClick
}) => {
    return (
        <div
            className={styles.house}
            onClick={onClick}
        >
            <div className={styles.imgWrap}>
                <img
                    className={styles.img}
                    src={src}
                    alt="房源图"
                />
            </div>
            <div className={styles.content}>
                <h3 className={styles.title}>{title}</h3>
                <div className={styles.desc}>{desc}</div>
                {tags.map((tag, index) => {
                    const tagClass = 'tag' + (index + 1)
                    return (
                        <span
                            className={`${styles.tag} ${styles[tagClass]}`}
                            key={tag}
                        >
                            {tag}
                        </span>
                    )
                })}
                <div className={styles.price}>
                    <span className={styles.priceNum}>{price}</span> 元/月
                </div>
            </div>
        </div>
    );
};

HouseItems.propTypes = {
    src: PropTypes.string,
    title: PropTypes.string,
    desc: PropTypes.string,
    tags: PropTypes.array.isRequired,
    price: PropTypes.number,
    onClick: PropTypes.func
};

export default HouseItems;