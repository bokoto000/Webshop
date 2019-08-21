const Sequelize = require("sequelize");
module.exports = sequelize => {
  const Item = sequelize.define("items", {
    id: {
      field: "id",
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    cartId: {
      field: "cart_id",
      type: Sequelize.STRING
    },
    productId: {
      field: "product_id",
      type: Sequelize.STRING
    },
    stock: {
      field: "stock",
      type: Sequelize.STRING
    }
  });
  return Item;
};
