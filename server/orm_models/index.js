module.exports =  (sequelize) => {
    const User = require('./user')(sequelize);
    const Product = require('./product')(sequelize);
    const Item = require ('./item')(sequelize);
    const Cart = require('./cart')(sequelize);
    const Order = require('./order')(sequelize);
    const OrderedItem = require('./ordered_item')(sequelize);
    const ResetPasswordToken = require('./resetpassword')(sequelize);
    const PendingPayment = require('./pending_payment')(sequelize);

    Item.hasOne(Product,{foreignKey:'id'})
    Product.belongsTo(Item, {foreignKey:'id'})

    Order.hasMany(OrderedItem,{foreignKey:'id'});
    OrderedItem.belongsTo(Order,{foreignKey:'id'});

    return {
        User,
        Product,
        Item,
        Cart,
        ResetPasswordToken,
        Order,
        OrderedItem,
        PendingPayment
    }
}