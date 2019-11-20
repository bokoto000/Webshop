module.exports = sequelize => {
  async function create(cartId, productId, stock) {
    const item = (await sequelize.query(`INSERT INTO items (cart_id,product_id,stock) VALUES ('${cartId}','${productId}','${stock}')`))[0][0];
    return item;
  }

  async function findOne(cartId, productId) {
    const item = (await sequelize.query(`SELECT * FROM items WHERE id='${cartId}' AND product_id='${productId}'`))[0][0];
    return item;
  }

  async function findItemProductsByCart(cartId) {
    const items = (await sequelize.query(`SELECT "items"."id",
      "items"."stock",
       "product"."id" AS "id",
        "product"."name" AS "name",
         "product"."description" AS "description",
          "product"."image" AS "image",
           "product"."price" AS "price",
           "product"."stock" AS "leftStock"
             FROM "items" AS "items" LEFT OUTER JOIN "products" AS "product"
              ON "items"."product_id" = "product"."id" WHERE "items"."cart_id" = ${cartId}`))[0];
    return items;
  }

  async function findItemProductsByItem(cartId, productId) {
    const updatedItem = await sequelize.query(`SELECT "items"."id",
         "items"."stock",
          "product"."id" AS "id",
           "product"."name" AS "name",
            "product"."description" AS "description",
             "product"."image" AS "image",
              "product"."price" AS "price",
              "product"."stock" AS "leftStock"
                FROM "items" AS "items" LEFT OUTER JOIN "products" AS "product" ON "items"."product_id" = "product"."id"
                 WHERE "items"."cart_id" = ${cartId} AND  "product"."id"=${productId}`);
    return updatedItem;
  }

  async function update(cartId, productId, stock) {
    const item = (await sequelize.query(`UPDATE items SET stock='${stock}' WHERE cart_id='${cartId}' AND product_id='${productId}`))[0][0];
    return item;
  }

  async function destroyByCart(cartId){
    const items = (await sequelize.query(`DELETE FROM items WHERE cart_id='${cartId}'`))[0];
    return items;
  }


  return { create, findOne, update, findItemProductsByItem, findItemProductsByCart };
};
