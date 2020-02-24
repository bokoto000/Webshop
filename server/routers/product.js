const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const matcher = require("../helpers/match");

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

module.exports = models => {
  const Product = models.Product;
  router.get("/get-products", async (req, res, next) => {
    query = req.query;
    console.log(query);
    match=matcher.getMatchJson(query);
    const productsQuery = await Product.findAll(match);
    const productCount = (await Product.countAll(match));
    const products = productsQuery[0];
    const pagesCount = Math.ceil(productCount/match.perPage);
    res.json({ products,pagesCount });
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
