module.exports = sequelize => {
  async function findOne() {
    const product = (await sequelize.query(``))[0][0];
    return product;
  }

  async function findOneByPk(id) {
    const product = (await sequelize.query(
      `SELECT * FROM products WHERE id='${id}'`
    ))[0][0];
    return product;
  }

  async function updateStock(id, stock) {
    const update = await sequelize.query(
      `UPDATE products SET stock='${stock}' WHERE id='${id}'`
    );
    return update;
  }

  async function findAll() {
    const products = await sequelize.query(`SELECT "products"."id", "products"."name",
    "products"."description",
     "products"."image",
      "products"."price",
       "products"."stock",
       "products"."name" AS "title",
            "producttags->tags"."tag_id" AS "tagId",
             "producttags->tags"."name" AS "tagName"
               FROM "products" AS "products" LEFT OUTER JOIN "producttags" AS "producttags" ON "products"."id" = "producttags"."product_id"
                LEFT OUTER JOIN "tags" AS "producttags->tags" ON "producttags"."tag_id" = "producttags->tags"."tag_id" WHERE "products"."price">0 `);

    return products;
  }

  async function find() {
    const products = await sequelize.query(`SELECT "products"."id", "products"."name",
    "products"."description",
     "products"."image",
      "products"."price",
       "products"."stock",
       "products"."name" AS "title",
            "producttags->tags"."tag_id" AS "tagId",
             "producttags->tags"."name" AS "tagName"
               FROM "products" AS "products" LEFT OUTER JOIN "producttags" AS "producttags" ON "products"."id" = "producttags"."product_id"
                LEFT OUTER JOIN "tags" AS "producttags->tags" ON "producttags"."tag_id" = "producttags->tags"."tag_id" WHERE "products"."price">0 LIMIT 100`);

    return products;
  }

  return { findOne, findAll, updateStock, findOneByPk,find };
};
