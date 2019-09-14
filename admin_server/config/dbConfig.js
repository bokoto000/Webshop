const Sequelize = require('sequelize');

let credentials;
credentials = {
    dbname: process.env.DBNAME || 'webshop',
    username: process.env.DBUserId || 'admin',
    password: process.env.DBPASS || 'admin',
    hostname: process.env.DBCON || 'localhost',
    port: process.env.DBPORT || '5432'
}
const sequelize = new Sequelize(credentials.dbname, credentials.username, credentials.password, {
  host: credentials.hostname,
  port: credentials.port,
  dialect: 'postgres',
  operatorsAliases: false,
  omitNull:true,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: false
  }

});

module.exports = sequelize;