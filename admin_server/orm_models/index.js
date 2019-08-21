module.exports =  (sequelize) => {
    const User = require('./user')(sequelize);
    const Admin = require('./admin')(sequelize);
    const Product = require('./product')(sequelize);
    const Tag = require ('./tag')(sequelize);
    const ProductTag = require ('./producttags')(sequelize);

    ProductTag.hasMany(Tag,{foreignKey:'tag_id'})
    Tag.hasMany(ProductTag,{foreignKey:'tag_id'})

    Product.hasMany(ProductTag,{foreignKey:'productId'})
    ProductTag.belongsTo(Product, {foreignKey:'productId'})


    return {
        User,
        Admin,
        Product,
        Tag,
        ProductTag
    }
}