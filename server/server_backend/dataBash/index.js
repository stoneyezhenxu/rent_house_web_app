const Sequelize = require('sequelize')
const db_config = require('../config/mysql')
const Models = require('./models/index')

// 创建数据库实例
let sequelize = new Sequelize(
    db_config.database,
    db_config.user,
    db_config.pass, {
    host: db_config.host,
    dialect: db_config.dialect,
    pool: db_config.pool,
    port: db_config.port,
    logging: sql => {
    }
})

// 数据库 实例 方法挂载
const models = Models(sequelize)

// 开启数据库
sequelize
    .authenticate()
    .then(async () => {
        console.log('Database connection successful！')
        models.init.sync()
    })
    .catch(err => {
        console.log("Database connection exception,please check the config of '/server_backend/config/mysql.js'")

    })

// 将所有的方法暴露出去
module.exports = new Proxy({}, {
    get: (_, val) => new models[val],
    set: () => {
        throw new TypeError('装饰器类型 不可以修改')
    }
})
