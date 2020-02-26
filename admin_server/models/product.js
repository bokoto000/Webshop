module.exports = sequelize => {
  async function findOne() {
    const product = (await sequelize.query(``))[0][0];
    return product;
  }

  async function findByPk(id) {
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

  async function create(image, name, description, price, stock) {
    const result = await sequelize.query(
      `INSERT INTO products (image,name,description,price,stock) VALUES ('${image}','${name}','${description}','${price}','${stock}')`
    );
  }

  async function update(id,image, name, description, price) {
    const result = await sequelize.query(
      `UPDATE products SET image='${image}', name='${name}', description='${description}', price='${price}' WHERE id='${id}'`);
    
  }

  async function findAll() {
    const products = (await sequelize.query(`SELECT "products"."id", "products"."name",
     "products"."description",
       "products"."price",
        "products"."stock",
             "producttags->tags"."tag_id" AS "tagId",
              "producttags->tags"."name" AS "tagName"
                FROM "products" AS "products" LEFT OUTER JOIN "producttags" AS "producttags" ON "products"."id" = "producttags"."product_id"
                 LEFT OUTER JOIN "tags" AS "producttags->tags" ON "producttags"."tag_id" = "producttags->tags"."tag_id"`))[0];
    return products;
  }

  return { findOne, findByPk, findAll, create, updateStock, update };
};
