const Sequelize = require("sequelize");
module.exports = sequelize => {
  const OrderedItem = sequelize.define("ordereditems", {
    id: {
      field: "id",
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    orderId: {
      field: "order_id",
      type: Sequelize.STRING
    },
    productId: {
      field: "product_id",
      type: Sequelize.STRING
    },
    stock: {
      field: "stock",
      type: Sequelize.STRING
    },
    orderedPrice: {
      field: "ordered_price",
      type: Sequelize.DECIMAL
    }
  });
  return OrderedItem;
};
