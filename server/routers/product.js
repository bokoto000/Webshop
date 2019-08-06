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
    } else {
      res.sendStatus(400);
    }
  });

  router.get("/get-products", async (req, res, next) => {
    const products = await Product.findAll();
    res.json({ products });
  });

  return router;
};
