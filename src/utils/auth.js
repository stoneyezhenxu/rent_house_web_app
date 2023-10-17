const TOKEN_NAME = 'hkzf_token'

// get token
const getToken = () => localStorage.getItem(TOKEN_NAME)

//set token
const setToken = (value) => localStorage.setItem(TOKEN_NAME, value)

// remove token
const removeToken = () => localStorage.removeItem(TOKEN_NAME)

// true: if login ; otherwise false
const isAuth = () => !!getToken()

//In Javascript, ! represents the operator "not". If the variable is not of Boolean type, the variable will be automatically converted to Boolean type.
//Take negation again, then use two!! to convert the variable into the corresponding Boolean value

export { getToken, setToken, removeToken, isAuth }