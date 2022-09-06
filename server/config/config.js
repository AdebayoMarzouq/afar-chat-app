require('dotenv').config()

module.exports = {
  development: {
    username: process.env.DBUSERNAME,
    password: process.env.DBPASS,
    database: 'chat_development',
    host: '127.0.0.1',
    dialect: 'mysql',
    define: {
      freezeTableName: true,
    },
  },
  test: {
    username: process.env.DBUSERNAME,
    password: process.env.DBPASS,
    database: 'chat_development',
    host: '127.0.0.1',
    dialect: 'mysql',
    define: {
      freezeTableName: true,
    },
  },
  production: {
    username: process.env.DBUSERNAME,
    password: process.env.DBPASS,
    database: 'chat_development',
    host: '127.0.0.1',
    dialect: 'mysql',
    define: {
      freezeTableName: true,
    },
  },
}
