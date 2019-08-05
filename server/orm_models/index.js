module.exports =  (sequelize) => {
    const User = require('./user')(sequelize);
    const Admin = require('./admin')(sequelize);
    return {
        User,
        Admin
    }
}