const Sequelize = require("sequelize");
module.exports = sequelize => {
  const PendingPayment = sequelize.define("pendingpayments", {
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
    paymentId: {
      field: "payment_id",
      type: Sequelize.STRING
    },
    total:{
      field:"total",
      type:Sequelize.STRING
    }
  });
  return PendingPayment;
};
