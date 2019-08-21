const Sequelize = require("sequelize");
module.exports = sequelize => {
  const ProductTags = sequelize.define("producttags", {
    id: {
      field: "id",
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    productId: {
      field: "product_id",
      type: Sequelize.INTEGER,
      references: {
        model: 'products',
        key: 'id'
      }
    },
    tagId: {
      field: "tag_id",
      type: Sequelize.INTEGER,
      references:'tags',
      referencesKey:'tag_id'
    }
  });
  return ProductTags;
};
