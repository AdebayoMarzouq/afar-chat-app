require('dotenv').config()

module.exports = {
  development: {
    // logging: false,
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
    logging: false,
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
    logging: false,
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
