import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const SearchBar = ({
    styles,
    city
}) => {
    const history = useNavigate();

    return (
        <div className={styles.searchBar}>
            <div className={styles.search}>
                <span onClick={() => history('/citylist')}>{city}</span>
                <i className="iconfont icon-arrow" />
                <div
                    className={styles.form}
                    onClick={() => history('/home/search')}
                >
                    <i className="iconfont icon-seach" />
                    <span className={styles.span}>请输入小区或地址</span>
                </div>
            </div>
            <i
                className="iconfont icon-map"
                onClick={() => history('/map')}
            />
        </div >
    );
};

SearchBar.propTypes = {
    styles: PropTypes.object,
    city: PropTypes.string.isRequired
};

export default SearchBar;