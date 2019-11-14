module.exports = sequelize => {
  async function findNewOrderByUserId(id) {
    const results = (
      await sequelize.query(
        `SELECT * FROM orders WHERE user_id='${id}' AND status='New'`
      )
    )[0][0];
    return results;
  }

  async function findNewOrder(id) {
    const results = await sequelize.query(
      `SELECT * from orders WHERE id='${id} and status='New'`
    )[0][0];
    return results;
  }

  async function destroyById(id) {
    const results = (
      await sequelize.query(`DELETE FROM orders WHERE id='${id}'`)
    )[0];
    return results;
  }
  async function create(userId, total) {
    const results = (
      await sequelize.query(`INSERT INTO orders (user_id, status, date, total) 
        VALUES ('${userId}','New', '${Date.now()}','${total}')`)
    )[0];
    return results;
  }

  async function updateStatus(status, orderId) {
    const results = (
      await sequelize.query(
        `UPDATE orders SET status='${status}' WHERE id='${orderId}'`
      )
    )[0];
    return results;
  }
  return {
    findNewOrderByUserId,
    destroyById,
    create,
    updateStatus,
    findNewOrder
  };
};
