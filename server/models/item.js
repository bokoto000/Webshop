module.exports = sequelize => {
  async function findAllByCartId(cartId) {
    const results = (
      await sequelize.query(`SELECT "items"."id",
      "items"."stock",
       "product"."id" AS "id",
        "product"."name" AS "name",
         "product"."description" AS "description",
          "product"."image" AS "image",
           "product"."price" AS "price",
           "product"."stock" AS "leftStock"
             FROM "items" AS "items" LEFT OUTER JOIN "products" AS "product"
              ON "items"."product_id" = "product"."id" WHERE "items"."cart_id" = ${cartId}`)
    )[0];
    return results;
  }

  async function findOne(cartId, productId) {
    const results = (
      await sequelize.query(
        `SELECT * FROM items WHERE cart_id='${cartId}' AND product_id='${productId}'`
      )
    )[0][0];
    return results;
  }

  async function create(cartId, productId, stock) {
    const results = (
      await sequelize.query(`INSERT INTO items (cart_id,product_id,stock)
      VALUES ('${cartId}','${productId}','${stock}')`)
    )[0];
    return results;
  }

  async function updateStock(cartId, productId, stock) {
    const results = (
      await sequelize.query(
        `UPDATE items SET stock='${stock}' WHERE cart_id='${cartId}' AND product_id='${productId}'`
      )
    )[0];
    return results;
  }

  async function destroy(cartId, productId) {
    const results = await sequelize.query(
      `DELETE FROM items WHERE cart_id='${cartId}' AND productId='${productId}'`
    );
    return results;
  }

  async function destroyAllByCartId(cartId){
    const results = (await sequelize.query(`DELETE FROM items WHERE cart_id='${cartId}'`));
  }

  return { create, findAllByCartId, findOne, updateStock, destroy,destroyAllByCartId };
};
