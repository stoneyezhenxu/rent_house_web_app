import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Grid, Button, Modal } from "antd-mobile"

import { axiosAPI as axios, BASE_URL, getToken, removeToken, isAuth } from '../../../utils'

import styles from './index.module.css'

const Profile = () => {
    const menus = [
        { id: 1, name: '我的收藏', iconfont: 'icon-coll', to: '/favorite' },
        { id: 2, name: '我的出租', iconfont: 'icon-ind', to: '/rent' },
        { id: 3, name: '看房记录', iconfont: 'icon-record' },
        { id: 4, name: '成为房主', iconfont: 'icon-identity' },
        { id: 5, name: '个人资料', iconfont: 'icon-myinfo' },
        { id: 6, name: '联系我们', iconfont: 'icon-cust' }
    ]

    const history = useNavigate()

    // 游客头像地址
    const DEFAULT_AVATAR = `${BASE_URL}/img/profile/avatar.png`

    // 设置登录状态state
    const [isLogin, setIsLogin] = useState(false)

    // 设置用户信息state
    const [useInfo, setUserInfo] = useState(
        {
            avatar: '',
            nickname: ''
        }
    )

    useEffect(() => {
        const getUserInfo = async (status) => {

            // 未登录状态直接退出判断
            if (!status) {
                return
            }

            const result = await axios.get('/user')

            // 从服务器响应判断是否成功登录，如登录成功，更新用户信息
            if (result.data.status === 200) {
                const { avatar, nickname } = result.data.body

                setUserInfo(
                    {
                        // avatar: BASE_URL + avatar,
                        avatar: DEFAULT_AVATAR,
                        nickname: nickname
                    }
                )
            } else {
                setIsLogin(false)
            }
        }

        setIsLogin(isAuth())

        getUserInfo(isLogin)
    }, [isLogin])



    const logout = () => {
        Modal.confirm({
            title: '是否确定退出？',
            onConfirm: async () => {
                // 服务器端登出
                await axios.post('/user/logout', null, {
                    headers: {
                        authorization: getToken()
                    }
                })

                // 本地删除token并设置登录状态和清空用户信息
                removeToken()

                setIsLogin(false)

                setUserInfo(
                    {
                        avatar: '',
                        nickname: ''
                    }
                )
            },
        })
    }

    return (
        <>
            <div className={styles.root}>
                <div className={styles.title}>
                    <img
                        className={styles.bg}
                        src={`${BASE_URL}/img/profile/bg.png`}
                        alt="背景图"
                    />
                    <div className={styles.info}>
                        <div className={styles.myIcon}>
                            <img
                                className={styles.avatar}
                                src={useInfo.avatar ? useInfo.avatar : DEFAULT_AVATAR}
                                alt="icon"
                            />
                        </div>
                        <div className={styles.user}>
                            <div className={styles.name}>{useInfo.nickname ? useInfo.nickname : "游客"}</div>
                            {isLogin
                                ? (
                                    <>
                                        <div className={styles.auth}>
                                            <span onClick={logout}>退出</span>
                                        </div>
                                        <div className={styles.edit}>
                                            编辑个人资料
                                            <span className={styles.arrow}>
                                                <i className="iconfont icon-arrow" />
                                            </span>
                                        </div>
                                    </>
                                )
                                : (
                                    <>
                                        <div className={styles.edit}>
                                            <Button
                                                color="success"
                                                size="small"
                                                onClick={() => { history(`/login`) }}>
                                                去登录
                                            </Button>
                                        </div>
                                    </>
                                )
                            }
                        </div>
                    </div>
                </div>

                <Grid columns={3}>
                    {menus.map((item) =>
                        item.to
                            ? (
                                <Grid.Item key={item.id}>
                                    <Link to={item.to}>
                                        <div className={styles.menuItem}>
                                            <i className={`iconfont ${item.iconfont}`} />
                                            <span>{item.name}</span>
                                        </div>
                                    </Link>
                                </Grid.Item>
                            )
                            : (
                                <Grid.Item key={item.id}>
                                    <div className={styles.menuItem}>
                                        <i className={`iconfont ${item.iconfont}`} />
                                        <span>{item.name}</span>
                                    </div>
                                </Grid.Item>
                            )
                    )}
                </Grid>

                <div className={styles.ad}>
                    <img
                        src={`${BASE_URL}/img/profile/join.png`}
                        alt="加入我们"
                    />
                </div>
            </div>
        </>
    )
}

export default Profile