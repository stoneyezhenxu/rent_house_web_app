import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Grid, Toast } from 'antd-mobile';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { axiosAPI as axios } from '../../utils';

import Navbar from '../../components/Navbar';

import styles from './index.module.css';

const Login = () => {
    const history = useNavigate();
    const location = useLocation();

    // 表单验证规则
    const LoginSchema = Yup.object().shape({
        username: Yup.string().required('账号为必填项').matches(REG_UNAME, '长度为5到8位，只能出现数字、字母和下划线'),
        password: Yup.string().required('密码为必填项').matches(REG_PWD, '长度为5到12位，只能出现数字、字母和下划线')
    });

    const handleSubmit = async (e) => {
        const result = await axios.post('/user/login', {
            username: e.username,
            password: e.password
        });

        const { status, body, description } = result.data;

        // 根据获取到的服务器响应代码判断操作
        if (status === 200) {
            localStorage.setItem('hkzf_token', body.token);

            location.state
                ? history(location.state.from.pathname, { replace: true })
                : history(-1);
        } else {
            Toast.show({
                icon: 'fail',
                content: description
            });
        }
    };

    return (
        <div className={styles.root}>
            <Navbar
                title={'账号登录'}
                styles={styles}
            />
            <Formik
                initialValues={{ username: '', password: '' }}
                validationSchema={LoginSchema}
                onSubmit={handleSubmit}
            >
                <Form>
                    <div className={styles.formItem}>
                        <Field
                            className={styles.input}
                            name="username"
                            placeholder="请输入账号"
                        />
                    </div>
                    <ErrorMessage
                        className={styles.errors}
                        name="username"
                        component="div"
                    />
                    <div className={styles.formItem}>
                        <Field
                            className={styles.input}
                            name="password"
                            type="password"
                            placeholder="请输入密码"
                        />
                    </div>
                    <ErrorMessage
                        className={styles.errors}
                        name="password"
                        component="div"
                    />
                    <div className={styles.formSubmit}>
                        <button
                            className={styles.submit}
                            type="submit"
                        >
                            登录
                        </button>
                    </div>
                    <Grid
                        columns={1}
                        className={styles.backHome}
                    >
                        <Grid.Item>
                            <Link to="/register">还没有账号，去注册</Link>
                        </Grid.Item>
                    </Grid>
                </Form>
            </Formik>
        </div>
    );
};

export default Login;

// 表单验证的正则表达式
const REG_UNAME = /^\w{5,8}$/i;
const REG_PWD = /^\w{5,15}$/i;