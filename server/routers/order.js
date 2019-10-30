const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: true
  })
);

module.exports = (passport, ormModels, sequelize) => {
  const Item = ormModels.Item;
  const Cart = ormModels.Cart;
  const OrderedItem = ormModels.OrderedItem;
  const Order = ormModels.Order;
  const Product = ormModels.Product;

  router.post("/create", async (req, res) => {
    const user = req.user;
    let total =0;
    if (user && user.id) {
      const cart = await Cart.findOne({ where: { userId: user.id } });
      if (!cart) {
        return res.sendStatus(422);
      }
      cartId = cart.dataValues.id;
      const items = await sequelize.query(`SELECT "items"."id",
       "items"."cart_id" AS "cartId",
        "items"."product_id" AS "productId",
         "items"."stock",
          "product"."id" AS "product.id",
           "product"."name" AS "product.name",
            "product"."description" AS "product.description",
             "product"."image" AS "product.image",
              "product"."price" AS "orderedPrice",
               "product"."stock" AS "product.stock",
                "product"."stock" AS "leftStock",
                  "product"."price" AS "price"
                  FROM "items" AS "items"
                  LEFT OUTER JOIN "products" AS "product" ON "items"."product_id" = "product"."id"
                   WHERE "items"."cart_id" = ${cartId};`);
      for (let i = 0; i < items[0].length; i++) {
        const stock = items[0][i].stock;
        const price = items[0][i].price;
        const leftStock = items[0][i].leftStock;
        total+=(stock*price);
        if (stock > leftStock) {
          return res.status(422).send({
            error:
              "Някой от продуктите във вашата количка са вече изчерпани, моля проверете количката си!"
          });
        }
      }
      const order = await Order.findOne({
        where: { userId: user.id, status: "New" }
      });
      if (order) {
        await OrderedItem.destroy({ where: { orderId: order.dataValues.id } });
        await Order.destroy({ where: { id: order.dataValues.id } });
        await Order.create({
          userId: user.id,
          status: "New",
          date: Date.now(),
          total
        });
      } else {
        await Order.create({
          userId: user.id,
          status: "New",
          date: Date.now(),
          total
        });
      }
      const newOrder = await Order.findOne({
        where: { userId: user.id, status: "New" }
      });
      if (newOrder) {
        newOrderId = newOrder.dataValues.id;
        for (let i = 0; i < items[0].length; i++) {
          const productId = items[0][i].productId;
          const stock = items[0][i].stock;
          const leftStock = items[0][i].leftStock;
          const orderedPrice = items[0][i].orderedPrice;
          const orderedTotal = stock*orderedPrice;
          const orderedItem = await OrderedItem.create({
            orderId: newOrderId,
            productId,
            stock,
            orderedPrice,
            orderedTotal
          });
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
      const order = await Order.findOne({
        where: { userId: user.id, status: "New" }
      });
      if (!order) {
        return res.sendStatus(403);
      } else {
        let fullOrder = await sequelize.query(`SELECT "orders".*,
           "ordereditems"."product_id" AS "productId", 
           "ordereditems"."stock" AS "stock",
            "ordereditems"."ordered_price" AS "orderedPrice",
              "ordereditems->product"."name" AS "productName",
               "ordereditems->product"."description" AS "productDescription",
                "ordereditems->product"."image" AS "productImage"
                    FROM (SELECT "orders"."id",
                      "orders"."status"
                       FROM "orders" AS "orders" 
                       WHERE "orders"."status" = 'New' AND "orders"."user_id" = ${user.id} LIMIT 1)
                        AS "orders"
                        LEFT OUTER JOIN "ordereditems" AS "ordereditems" ON "orders"."id" = "ordereditems"."order_id" 
                        LEFT OUTER JOIN "products" AS "ordereditems->product"
                         ON "ordereditems"."product_id" = "ordereditems->product"."id";`);
        let itemsCount = fullOrder[0].length;
        let total = 0;
        for (let i = 0; i < itemsCount; i++) {
          let productTotal =
            parseInt(fullOrder[0][i].stock) *
            parseFloat(fullOrder[0][i].orderedPrice);
          total += productTotal;
          fullOrder[0][i].productTotal = productTotal;
        }
        fullOrder[2] = total;
        res.status(200).json(fullOrder);
      }
    } else res.sendStatus(403);
  });
  router.post("/finish", async (req, res) => {
    const user = req.user;
    if (user && user.id) {
      const order = await Order.findOne({
        where: { userId: user.id, status: "New" }
      });
      if (!order) {
        return res.sendStatus(403);
      } else {
        const updatedOrder = await Order.update(
          { status: "Sent" },
          { where: { id: order.dataValues.id } }
        );
        if (updatedOrder) {
          const cart = await Cart.findOne({ where: { userId: user.id } });
          if (cart){
            await Item.destroy({ where: { cartId: cart.dataValues.id } });
            await Cart.destroy({ where: { userId: user.id } });
          }
          const orderedItems = await sequelize.query(`SELECT "ordereditems"."id",
            "ordereditems"."id" AS "id",
             "ordereditems"."product_id" AS "productId",
              "ordereditems"."stock",
               "product"."id" AS "product.id",
                "product"."name" AS "product.name",
                 "product"."description" AS "product.description",
                  "product"."image" AS "product.image",
                   "product"."price" AS "orderedPrice",
                     "product"."stock" AS "leftStock"
                       FROM "ordereditems" AS "ordereditems"
                       LEFT OUTER JOIN "products" AS "product" ON "ordereditems"."product_id" = "product"."id"
                        WHERE "ordereditems"."order_id" = ${order.dataValues.id};`);
          for (let i = 0; i < orderedItems[0].length; i++) {
            if (orderedItems[0][i]) {
              const  item = orderedItems[0][i];
              const leftStock = item.leftStock;
              const stock = item.stock;
              const productId = item.productId;
              const product = await Product.update(
                { stock: leftStock - stock },
                { where: { id: productId } }
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
