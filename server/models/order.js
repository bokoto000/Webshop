module.exports = sequelize => {
  async function findByPk(id) {
    const order = (
      await sequelize.query(`SELECT * FROM orders WHERE id=$id`, {
        bind: { id }
      })
    )[0][0];
    return order;
  }

  async function findNewOrderByUserId(userId) {
    const orders = (
      await sequelize.query(
        `SELECT * FROM orders 
        WHERE user_id=$userId AND status='New'`,
        {
          bind: { userId }
        }
      )
    )[0][0];
    return orders;
  }

  async function findAllBetweenDates(startDate, endDate) {
    const orders = (
      await sequelize.query(
        `SELECT * FROM orders WHERE date>=$startDate
         AND date<=$endDate`,
        {
          bind: {startDate, endDate}
        }
      )
    )[0][0];
    return orders;
  }

  async function findAllByStatus(status) {
    const orders = (
      await sequelize.query(`SELECT * FROM orders WHERE status=$status`, {
        bind: {status}
      })
    )[0];
    return orders;
  }

  async function findFullOrderByPk(id) {
    const orders = (
      await sequelize.query(
        `SELECT "orders".*,
        "ordereditems"."product_id" AS "productId", 
        "ordereditems"."stock" AS "stock",
        "ordereditems"."ordered_total" AS "total",
         "ordereditems"."ordered_price" AS "orderedPrice",
           "ordereditems->product"."name" AS "productName",
            "ordereditems->product"."description" AS "productDescription",
             "ordereditems->product"."image" AS "productImage"
                 FROM (SELECT "orders"."id",
                 "orders"."status"
                    FROM "orders" AS "orders" 
                    WHERE "orders"."id" = $id)
                     AS "orders"
                     LEFT OUTER JOIN "ordereditems" AS "ordereditems" ON "orders"."id" = "ordereditems"."order_id" 
                     LEFT OUTER JOIN "products" AS "ordereditems->product"
                      ON "ordereditems"."product_id" = "ordereditems->product"."id";`,
        {
          bind: {id}
        }
      )
    )[0];
    return orders;
  }

  async function updateStatus(id, status) {
    const updatedOrder = (
      await sequelize.query(
        `UPDATE orders SET status=$status 
        WHERE id=$id`,
        {
          bind: {id, status}
        }
      )
    )[0];
    return updatedOrder;
  }

  async function create(userId, status, date, total) {
    const order = (
      await sequelize.query(
        `INSERT INTO orders (user_id,status,date,total)
        VALUES ($userId,$status,$date,$total)`,
        {
          bind: {userId, status, date, total}
        }
      )
    )[0];
    return order;
  }

  async function destroy(orderId) {
    const order = (
      await sequelize.query(`DELETE FROM orders WHERE id=$orderId`, {
        bind: {orderId}
      })
    )[0];
    return order;
  }

  async function findNewOrderByOrderId(orderId) {
    const order = (
      await sequelize.query(
        `SELECT * FROM orders WHERE id=$orderId 
        AND status='New'`,
        {
          bind: {orderId}
        }
      )
    )[0][0];
    return order;
  }

  return {
    findByPk,
    findNewOrderByUserId,
    findNewOrderByOrderId,
    findAllBetweenDates,
    findAllByStatus,
    findFullOrderByPk,
    updateStatus,
    create,
    destroy
  };
};
