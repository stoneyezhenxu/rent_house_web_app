const TOKEN_NAME = 'hkzf_token'

// 获取token
const getToken = () => localStorage.getItem(TOKEN_NAME)

//设置token
const setToken = (value) => localStorage.setItem(TOKEN_NAME, value)

// 删除token
const removeToken = () => localStorage.removeItem(TOKEN_NAME)

// 是否登录（有权限）
const isAuth = () => !!getToken()
//Javascript中，!表示运算符“非”，如果变量不是布尔类型，会将变量自动转化为布尔类型，
//再取非，那么用两个!!就可以将变量转化为对应布尔值

export { getToken, setToken, removeToken, isAuth }