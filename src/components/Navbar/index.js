import { useNavigate } from 'react-router-dom';
import { NavBar } from 'antd-mobile';
import PropTypes from 'prop-types';

const Navbar = ({
    title,
    right,
    styles
}) => {
    const history = useNavigate();

    return (
        <NavBar
            className={styles ? styles.navHeader : ''}
            onBack={() => history(-1)}
            right={right}
        >
            {title}
        </NavBar>
    );
};

Navbar.propTypes = {
    title: PropTypes.string.isRequired,
    right: PropTypes.element,
    styles: PropTypes.object
};

export default Navbar;

