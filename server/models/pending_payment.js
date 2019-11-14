module.exports = sequelize => {
  async function create(orderId, paymentId, total) {
    const results = await sequelize.query(
      `INSERT INTO pendingpayments (order_id,payment_id,total)
       VALUES ('${orderId}','${paymentId}','${total}')`
    );
    return results;
  }

  async function findOneByPaymentId(paymentId) {
    const results = await sequelize.query(
      `SELECT * FROM pendingpayments WHERE payment_id='${paymentId}'`
    );
    return results;
  }

  async function destroy(paymentId) {
    const results = await sequelize.query(
      `DELETE FROM pendingpayments WHERE payment_id='${paymentId}'`
    );
    return results;
  }

  return { create, findOneByPaymentId, destroy };
};
