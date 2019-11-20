const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const checkPermission = require("../helpers/checkPermission");
router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: true
  })
);

router.use(checkPermission());

module.exports = (passport, models, sequelize) => {
  const Item = models.Item;
  const Cart = models.Cart;

  router.get("/get-cart", async (req, res) => {
    const user = req.user;
    if (user && user.id) {
      const cart = await Cart.findOneByUserId(user.id);
      if (!cart) {
        await Cart.create(user.id);
      }
      const cartId = cart.id;
      const items = await Item.findItemProductsByCart(cartId);
      return res.json(items);
    } else res.sendStatus(403);
  });

  router.post("/update-item", async (req, res) => {
    const user = req.user;
    const itemId = req.body.id;
    let stock = req.body.stock;
    if (user && user.id) {
      const cart = await Cart.findOneByUserId(user.id);
      if (!cart) {
        await Cart.create(user.id);
      }
      cartId = cart.id;
      const item = await Item.findOne(cartId, itemId);
      if (!item) {
        if (!stock) stock = 1;
        await Item.create(cartId, itemId, stock);
      } else {
        await Item.updateStock(cartId, itemId, stock);
      }
      const updatedItem = await Item.findItemProductsByItem(cartId, itemId);
      return res.status(200).send({ product: updatedItem });
    } else return res.sendStatus(403);
  });

  router.post("/buy-item", async (req, res) => {
    const user = req.user;
    const itemId = req.body.id;
    stock = req.body.stock;
    if (user && user.id) {
      let cart = await Cart.findOneByUserId(user.id);
      if (!cart) {
        cart = await Cart.create(user.id);
      }
      cartId = cart.id;
      const item = await Item.findOne(cartId, itemId);
      if (!item) {
        if (!stock) stock = 1;
        await Item.create(cartId, itemId, stock);
      } else {
        await Item.updateStock(cartId, itemId, item.stock + 1);
      }
      res.json(cart);
    } else res.sendStatus(403);
  });

  router.post("/delete-item", async (req, res) => {
    const user = req.user;
    const itemId = req.body.id;
    if (user && user.id) {
      const cart = await Cart.findOneByUserId(user.id);
      if (!cart) {
        await Cart.create(user.id);
      }
      cartId = cart.id;
      const item = await Item.findOne(cartId, itemId);
      if (!item) {
        return 422;
      } else {
        await Item.destroyItem(cartId, itemId);
      }
      res.status(200).send({ product: [null] });
    } else res.sendStatus(403);
  });

  return router;
};
