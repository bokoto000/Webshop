const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: true
  })
);

module.exports = (passport, ormModels) => {
  const Product = ormModels.Product;


  router.get("/get-products", async (req, res, next) => {
    const products = await Product.findAll();
    res.json({ products });
  });

  return router;
};
