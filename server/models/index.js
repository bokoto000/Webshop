module.exports = (sequelize)=>{
    const User = require('./user')(sequelize);
    const Cart = require('./cart')(sequelize);
    const Item = require('./item')(sequelize);
    const Order = require('./order')(sequelize);
    const OrderedItem = require('./ordered_item')(sequelize);
    const PendingPayment = require('./pending_payment')(sequelize);
    const Product = require('./product')(sequelize);
    const ResetPasswordToken = require('./resetpasswordtoken')(sequelize);
    return {
        User,
        Cart,
        Item,
        Order,
        OrderedItem,
        PendingPayment,
        Product,
        ResetPasswordToken
    }
}