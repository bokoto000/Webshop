const Sequelize = require("sequelize");
module.exports = sequelize => {
  const Cart = sequelize.define("carts", {
    id: {
      field: "id",
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      field: "user_id",
      type: Sequelize.STRING
    }
  });
  return Cart;
};
