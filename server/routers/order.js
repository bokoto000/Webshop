const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: true
  })
);

module.exports = (passport, ormModels,sequelize) => {
  const Item = ormModels.Item;
  const Cart = ormModels.Cart;
  const Product = ormModels.Product;

  router.post("/create", async (req, res) => {
    const user = req.user;
    if (user && user.id) {
    
      const cart = await Cart.findOne({ where: { userId: user.id } });
      if (!cart) {
        await Cart.create({
          userId: user.id
        });
      }
      cartId = cart.dataValues.id;
      const item = await Item.findOne({ where: { cartId: cartId, productId:itemId } });
      if (!item) {
        if (!stock) stock = 1;
        await Item.create({
          cartId: cartId,
          productId: itemId,
          stock: stock
        });
      } else {
        await Item.update(
          {
            stock: item.dataValues.stock + 1
          },
          {
            where: {
              cartId: cartId,
              productId: itemId
            }
          }
        );
      }
      //console.log(cart);
      res.json(cart);
    } else res.sendStatus(403);
  });

  return router;
};
