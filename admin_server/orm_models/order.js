const Sequelize = require("sequelize");
module.exports = sequelize => {
  const Order = sequelize.define("orders", {
    id: {
      field: "id",
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      field: "user_id",
      type: Sequelize.STRING
    },
    status: {
      field: "status",
      type: Sequelize.STRING
    },
    date: {
      field: "date",
      type: Sequelize.STRING
    }
  });
  return Order;
};
