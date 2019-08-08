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
      res.send(200);
    } else {
      res.sendStatus(400);
    }
  });

  router.get("/get-products", async (req, res, next) => {
    const products = await Product.findAll();
    res.json({ products });
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
      try {
        await Product.update({
          image,
          name,
          description,
          price
        }, {where:{id:id}});
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
