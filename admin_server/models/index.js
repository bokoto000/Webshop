module.exports = (sequelize) => {
    const Admin = require('./admin')(sequelize);
    const Order = require('./order')(sequelize);
    const User = require('./user')(sequelize);
    const Product = require('./product')(sequelize);
    const OrderedItem = require('./ordered_item')(sequelize);
    return {
        Admin,
        Order,
        User,
        OrderedItem,
        Product
    }
}