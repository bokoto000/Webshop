module.exports = sequelize => {
  async function create(userId) {
    const cart = await sequelize.query(
      `INSERT INTO carts (user_id) VALUES ('${userId}')`
    );
    return cart;
  }

  async function findOneByUserId(userId) {
    const cart = (
      await sequelize.query(`SELECT * FROM carts WHERE user_id ='${userId}'`)
    )[0][0];
    return cart;
  }

  async function destroy(userId) {
    const cart = await sequelize.query(
      `DELETE FROM carts WHERE id='${userId}'`
    );
  }

  async function getCartItems(cartId) {
    const items = (
      await sequelize.query(`SELECT "items"."id",
      "items"."cart_id" AS "cartId",
       "items"."product_id" AS "productId",
        "items"."stock",
         "product"."id" AS "product.id",
          "product"."name" AS "product.name",
           "product"."description" AS "product.description",
            "product"."image" AS "product.image",
             "product"."price" AS "orderedPrice",
              "product"."stock" AS "product.stock",
               "product"."stock" AS "leftStock",
                 "product"."price" AS "price"
                 FROM "items" AS "items"
                 LEFT OUTER JOIN "products" AS "product" ON "items"."product_id" = "product"."id"
                  WHERE "items"."cart_id" = ${cartId};`)
    )[0];
    return items;
  }

  return { create, destroy, findOneByUserId, getCartItems };
};
