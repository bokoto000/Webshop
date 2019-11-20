const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: true
  })
);

module.exports = (passport, models, sequelize) => {
  const Item = models.Item;
  const Cart = models.Cart;
  const OrderedItem = models.OrderedItem;
  const Order = models.Order;
  const Product = models.Product;

  router.post("/create", async (req, res) => {
    const user = req.user;
    let total = 0;
    if (user && user.id) {
      const cart = await Cart.findOneByUserId(user.id);
      if (!cart) {
        return res.sendStatus(422);
      }
      cartId = cart.id;
      const items = await Cart.getCartItems(cartId);
      for (let i = 0; i < items.length; i++) {
        const curr = items[i];
        const stock = curr.stock;
        const price = curr.price;
        const leftStock = curr.leftStock;
        total += stock * price;
        if (stock > leftStock) {
          return res.status(422).send({
            error:
              "Някой от продуктите във вашата количка са вече изчерпани, моля проверете количката си!"
          });
        }
      }
      const order = await Order.findNewOrderByUserId(user.id);
      if (order) {
        await OrderedItem.destroyByOrderId(order.id);
        await Order.destroy(order.id);
        await Order.create(user.id, "New", Date.now(), total);
      } else {
        await Order.create(user.id, "New", Date.now(), total);
      }
      const newOrder = await Order.findNewOrderByUserId(user.id);
      if (newOrder) {
        newOrderId = newOrder.id;
        for (let i = 0; i < items.length; i++) {
          const curr = items[i];
          const productId = curr.productId;
          const stock = curr.stock;
          const orderedPrice = curr.orderedPrice;
          const orderedTotal = stock * orderedPrice;
          const orderedItem = await OrderedItem.create(
            newOrderId,
            productId,
            stock,
            orderedPrice,
            orderedTotal
          );
        }
      }
      return res.sendStatus(200).json(items[0]);
    } else
      res
        .status(403)
        .send({ error: "Имаше проблем със създаването на вашата поръчка." });
  });

  router.get("/get", async (req, res) => {
    const user = req.user;
    if (user && user.id) {
      const order = await Order.findNewOrderByUserId(user.id);
      if (!order) {
        return res.sendStatus(403);
      } else {
        let fullOrder = await OrderedItem.findAllOrderedProductsByOrder(
          order.id
        );
        let itemsCount = fullOrder[0].length;
        let total = 0;
        for (let i = 0; i < itemsCount; i++) {
          const curr = fullOrder[0][i];
          let productTotal =
            parseInt(curr.stock) * parseFloat(curr.orderedPrice);
          total += productTotal;
          fullOrder[0][i].productTotal = productTotal;
        }
        fullOrder[2] = total;
        return res.status(200).json(fullOrder);
      }
    } else return res.sendStatus(403);
  });

  router.post("/finish", async (req, res) => {
    const user = req.user;
    if (user && user.id) {
      const order = await Order.findNewOrderByUserId(user.id);
      if (!order) {
        return res.sendStatus(403);
      } else {
        const updatedOrder = await Order.updateStatus(order.id, "Sent");
        if (updatedOrder) {
          const cart = await Cart.findOneByUserId(user.id);
          if (cart) {
            await Item.destroyByCart(cart.id);
            await Cart.destroy(user.id);
          }
          const orderedItems = (
            await OrderedItem.findAllOrderedProductsByOrder(order.id)
          )[0];
          for (let i = 0; i < orderedItems.length; i++) {
            const item = orderedItems[i];
            if (item) {
              const leftStock = item.leftStock;
              const stock = item.stock;
              const productId = item.productId;
              const product = await Product.updateStock(
                productId,
                leftStock - stock
              );
            }
          }
          return res.sendStatus(200);
        } else return res.send(403);
      }
    } else return res.sendStatus(403);
  });

  return router;
};
