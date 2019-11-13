module.exports = (sequelize) => {
    const Admin = require('./admin')(sequelize);
    const Order = require('./order')(sequelize);
    const User = require('./user')(sequelize);
    const Product = require('./product')(sequelize);
    const OrderedItem = require('./ordered_item')(sequelize);
    const Permission = require('./permission')(sequelize);
    const ProductTag = require('./producttag')(sequelize);
    const Role = require('./role')(sequelize);
    const UserRole = require('./userroles')(sequelize);
    const PermissionRole = require('./permissionroles')(sequelize);
    return {
        Admin,
        Order,
        User,
        OrderedItem,
        Product,
        Permission,
        ProductTag,
        Role,
        UserRole,
        PermissionRole
    }
}