module.exports =  (sequelize) => {
    const User = require('./user')(sequelize);
    const Admin = require('./admin')(sequelize);
    const Product = require('./product')(sequelize);
    return {
        User,
        Admin,
        Product
    }
}