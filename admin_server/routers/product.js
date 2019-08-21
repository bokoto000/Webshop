const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: true
  })
);

function compare(a, b) {
  if (a.id < b.id) {
    return -1;
  }
  if (a.id > b.id) {
    return 1;
  }
  return 0;
}

module.exports = (passport, ormModels, sequelize) => {
  const Product = ormModels.Product;
  const Tag = ormModels.Tag;
  const ProductTag = ormModels.ProductTag;

  router.post("/create", async (req, res, next) => {
    const user = req.user;
    if (user.auth) {
      const image = req.body.image;
      const description = req.body.description;
      const name = req.body.name;
      const price = req.body.price;
      const stock = req.body.stock;
      try {
        await Product.create({
          image,
          name,
          description,
          price,
          stock
        });
      } catch (e) {
        console.log(e);
      }
      res.send(200);
    } else {
      res.sendStatus(400);
    }
  });

  router.get("/get-products", async (req, res, next) => {
    const productsQuery = await sequelize.query(`SELECT "products"."id", "products"."name",
     "products"."description",
      "products"."image",
       "products"."price",
        "products"."stock",
             "producttags->tags"."tag_id" AS "tagId",
              "producttags->tags"."name" AS "tagName"
                FROM "products" AS "products" LEFT OUTER JOIN "producttags" AS "producttags" ON "products"."id" = "producttags"."product_id"
                 LEFT OUTER JOIN "tags" AS "producttags->tags" ON "producttags"."tag_id" = "producttags->tags"."tag_id"`);
    //transforming the query results into good format
    const products = productsQuery[0];
    products.sort(compare);
    productsRes = [];
    product = products[0];
    productsRes.push({
      description: product.description,
      name:product.name,
      id: product.id,
      image: product.image,
      price: product.price,
      tags: []
    });
    if (product.tagId) {
      productsRes[0].tags.push({ id: product.tagId, name: product.tagName });
    }
    lastProduct=0;
    for (i = 1; i < products.length;i++ ) {
      product = products[i];
      if (productsRes[lastProduct].id == product.id) {
        productsRes[lastProduct].tags.push({
          id: product.tagId,
          name: product.tagName
        });
      } else {
        lastProduct++;
        productsRes.push({
          description: product.description,
          name:product.name,
          id: product.id,
          image: product.image,
          price: product.price,
          tags: []
        });
        if (product.tagId) {
          productsRes[lastProduct].tags.push({
            id: product.tagId,
            name: product.tagName
          });
        }
      }
    }
    console.log(productsRes);
    res.json({ products: productsRes });
  });

  router.post("/update-stock", async (req, res, next) => {
    const user = req.user;
    if (user.auth) {
      console.log("updating stonks");
      const id = req.body.id;
      const stock = req.body.stock;
      try {
        await Product.update({ stock: stock }, { where: { id: id } });
      } catch (e) {
        console.error(e);
      }
      res.sendStatus(200);
    }
  });

  router.post("/update-product", async (req, res, next) => {
    const user = req.user;
    if (user.auth) {
      const id = req.body.id;
      const image = req.body.image;
      const description = req.body.description;
      const name = req.body.name;
      const price = req.body.price;
      const tags = req.body.tags;
      try {
        for (i = 0; i < tags.length; i++) {
          const test = await ProductTag.findAll({
            where: {
              productId: id,
              tagId: tags[i].id
            }
          });
          console.log(test);
          if (test.length == 0) {
            console.log("after test");
            await ProductTag.create({
              productId: id,
              tagId: tags[i].id
            });
          }
        }
      } catch (e) {
        console.log(e);
      }
      try {
        await Product.update(
          {
            image,
            name,
            description,
            price
          },
          { where: { id: id } }
        );
      } catch (e) {
        console.log(e);
      }
      res.send(200);
    } else {
      res.sendStatus(400);
    }
  });

  return router;
};
