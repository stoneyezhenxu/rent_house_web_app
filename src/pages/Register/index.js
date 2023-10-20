import { useLocation, useNavigate } from 'react-router-dom'
import { Toast } from 'antd-mobile'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

import { axiosAPI as axios } from '../../utils'

import Navbar from '../../components/Navbar'

import styles from './index.module.css'

const Register = () => {
    const history = useNavigate()
    const location = useLocation()

    // 表单验证规则
    const RegisterSchema = Yup.object().shape({
        username: Yup.string().required('账号为必填项').matches(REG_UNAME, '长度为5到8位，只能出现数字、字母和下划线'),
        password: Yup.string().required('密码为必填项').matches(REG_PWD, '长度为5到12位，只能出现数字、字母和下划线'),
        // 用Yup.ref获取第一次输入的密码来验证两次输入是否一致
        // password2: Yup.string().required('请再输一次密码').matches(Yup.ref('password'), '与上面的密码不一致')
    })

    const handleSubmit = async (e) => {
        const result = await axios.post('/user/registered', {
            username: e.username,
            password: e.password
        })

        const { status, body, description } = result.data

        // 根据获取到的服务器响应代码判断操作
        if (status === 200) {
            localStorage.setItem('hkzf_token', body.token)

            Toast.show({
                icon: 'success',
                content: '注册成功'
            })

            location.state
                ? history(location.state.from.pathname, { replace: true })
                : history(-1)
        } else {
            Toast.show({
                icon: 'fail',
                content: description
            })
        }
    }

    return (
        <div className={styles.root}>
            <Navbar
                title={'账号注册'}
                styles={styles}
            />
            <Formik
                initialValues={{ username: '', password: '', password2: '' }}
                validationSchema={RegisterSchema}
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

                    <div className={styles.formItem}>
                        <Field
                            className={styles.input}
                            name="password2"
                            type="password"
                            placeholder="确认密码"
                        />
                    </div>
                    <ErrorMessage
                        className={styles.errors}
                        name="password2"
                        component="div"
                    />

                    <div className={styles.formSubmit}>
                        <button
                            className={styles.submit}
                            type="submit"
                        >
                            注册
                        </button>
                    </div>
                </Form>
            </Formik>
        </div>
    )
}

export default Register

// 表单验证的正则表达式
const REG_UNAME = /^\w{5,8}$/i
const REG_PWD = /^\w{5,15}$/i