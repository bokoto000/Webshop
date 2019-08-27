module.exports =  (sequelize) => {
    const User = require('./user')(sequelize);
    const Admin = require('./admin')(sequelize);
    const Product = require('./product')(sequelize);
    const Item = require ('./item')(sequelize);
    const Cart = require('./cart')(sequelize);
    const ResetPasswordToken = require('./resetpassword')(sequelize);

    Item.hasOne(Product,{foreignKey:'id'})
    Product.belongsTo(Item, {foreignKey:'id'})


    return {
        User,
        Admin,
        Product,
        Item,
        Cart,
        ResetPasswordToken
    }
}