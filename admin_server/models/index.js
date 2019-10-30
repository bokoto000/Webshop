module.exports = (sequelize)=>{
    const Admin = require('./admin')(sequelize);
    return {
        Admin
    }
}