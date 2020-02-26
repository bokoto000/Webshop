module.exports =  (sequelize) => {
    const User = require('./user')(sequelize);
    const Product = require('./product')(sequelize);
    const Item = require ('./item')(sequelize);
    const Cart = require('./cart')(sequelize);
    const Order = require('./order')(sequelize);
    const OrderedItem = require('./ordered_item')(sequelize);
    const ResetPasswordToken = require('./resetpassword_token')(sequelize);
    const PendingPayment = require('./pending_payment')(sequelize);
    const VerifyEmailToken = require('./verifyemail_token')(sequelize);
    const ProductImage = require('./product_images')(sequelize);

    return {
        User,
        Product,
        Item,
        Cart,
        ResetPasswordToken,
        Order,
        OrderedItem,
        PendingPayment,
        VerifyEmailToken,
        ProductImage
    }
}