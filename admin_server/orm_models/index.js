module.exports = sequelize => {
  const User = require("./user")(sequelize);
  const Admin = require("./admin")(sequelize);
  const Product = require("./product")(sequelize);
  const Tag = require("./tag")(sequelize);
  const Order = require("./order")(sequelize);
  const OrderedItem = require("./ordered_item")(sequelize);
  const ProductTag = require("./producttags")(sequelize);
  const Permission = require("./permission")(sequelize);
  const PermissionRoles = require("./permissionroles")(sequelize);

  const Role = require("./roles")(sequelize);
  const UserRole = require("./userroles")(sequelize);

  ProductTag.hasMany(Tag, { foreignKey: "tag_id" });
  Tag.hasMany(ProductTag, { foreignKey: "tag_id" });

  Product.hasMany(ProductTag, { foreignKey: "productId" });
  ProductTag.belongsTo(Product, { foreignKey: "productId" });

  return {
    User,
    Admin,
    Product,
    Tag,
    ProductTag,
    Order,
    OrderedItem,
    Role,
    UserRole,
    Permission,
    PermissionRoles
  };
};
