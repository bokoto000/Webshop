module.exports = sequelize => {
  async function findOne() {
    const orderedItem = (await sequelize.query(``))[0][0];
    return orderedItem;
  }

  async function findByPk(id) {
    const orderedItem = (await sequelize.query(``))[0][0];
    return orderedItem;
  }

  async function findAllByOrderPk(id) {
    const orderedItem = (
      await sequelize.query(
        `SELECT * FROM ordereditems WHERE order_id='${id}';`
      )
    )[0];
    return orderedItem;
  }

  async function create(orderId, productId, stock, orderedPrice, orderedTotal) {
    const orderedItem = (
      await sequelize.query(`INSERT INTO ordereditems (order_id,product_id,stock,ordered_price,ordered_total)
        VALUES ('${orderId}','${productId}','${stock}','${orderedPrice}','${orderedTotal}')`)
    )[0][0];
    return orderedItem;
  }

  async function destroyByOrderId(orderId) {
    const orderedItems = (
      await sequelize.query(
        `DELETE FROM ordereditems WHERE order_id='${orderId}'`
      )
    )[0][0];
    return orderedItems;
  }

  async function findAllOrderedProductsByOrder(orderId) {
    const orderedItems = (
      await sequelize.query(`SELECT "orders".*,

    "ordereditems"."product_id" AS "productId", 
    "ordereditems"."stock" AS "stock",
     "ordereditems"."ordered_price" AS "orderedPrice",
       "ordereditems->product"."name" AS "productName",
        "ordereditems->product"."description" AS "productDescription",
         "ordereditems->product"."image" AS "productImage",
         "ordereditems->product"."stock" AS "leftStock"
             FROM (SELECT "orders"."id",
               "orders"."status"
                FROM "orders" AS "orders" 
                WHERE "orders"."id" ='${orderId}' LIMIT 1)
                 AS "orders"
                 LEFT OUTER JOIN "ordereditems" AS "ordereditems" ON "orders"."id" = "ordereditems"."order_id" 
                 LEFT OUTER JOIN "products" AS "ordereditems->product"
                  ON "ordereditems"."product_id" = "ordereditems->product"."id";`)
    );
    return orderedItems;
  }

  return { findOne, findByPk, findAllByOrderPk, create, destroyByOrderId, findAllOrderedProductsByOrder };
};
