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

module.exports = (passport, models, sequelize) => {
  const Product = models.Product;

  router.get("/get-products", async (req, res, next) => {
    const productsQuery = await Product.findAll();
    //transforming the query results into good format
    const products = productsQuery[0];
    products.sort(compare);
    productsRes = [];
    product = products[0];
    productsRes.push({
      description: product.description,
      name: product.name,
      id: product.id,
      image: product.image,
      price: product.price,
      tags: []
    });
    if (product.tagId) {
      productsRes[0].tags.push({ id: product.tagId, name: product.tagName });
    }
    lastProduct = 0;
    for (i = 1; i < products.length; i++) {
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
          name: product.name,
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
    res.json({ products: productsRes });
  });

  router.get("/get-product/:id", async (req, res) => {
    const id = req.params.id;
    const product = await Product.findOneByPk(id);
    if (product) {
      return res.status(200).json({ product });
    } else {
      return res.sendStatus(403);
    }
  });

  return router;
};
