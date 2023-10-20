import { Navigate, useLocation } from 'react-router-dom';

import { isAuth } from '../../utils';

const AuthRoute = ({ children }) => {
    const isLogin = isAuth();
    const location = useLocation();

    if (!isLogin) {
        return (
            <Navigate to="/login" state={{ from: location }} />
        );
    }

    return children;
};

export default AuthRoute;